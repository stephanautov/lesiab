// path: nodes/profile.normalize.ts
import { z } from "zod";

/**
 * NODE: profile.normalize
 * Phase: processResponses
 *
 * Enhancements (non-breaking to external shape):
 *  - Optional LLM extraction (deterministic) with fallback heuristics.
 *  - Default entities/routes for vague text.
 *  - Accepts richer field hints (type/boolean, relation{target,on}, unique) in loose input,
 *    but maps back to original schema (dbType, fk:string) before saving.
 *  - Sorted-key JSON (deep) for reproducible artifacts.
 */

export type NodeId = string;
export type OrchestrationId = string;

export interface ExecutionContext {
  orchestrationId: OrchestrationId;
  correlationId: string;
  logger: { info(m: any): void; warn(m: any): void; error(m: any): void };
  storage: {
    saveArtifact: (path: string, content: string | Uint8Array) => Promise<void>;
  };
}

export interface NodeSpec<I = unknown, O = unknown> {
  id: NodeId;
  phase:
    | "processResponses"
    | "analyze"
    | "validate"
    | "plan"
    | "execute"
    | "codeGeneration"
    | "integrate"
    | "finalize";
  estimate?: (input: I) => { tokens?: number; usd?: number };
  run: (input: I, ctx: ExecutionContext) => Promise<O>;
}

/** ─────────────────────────────────────────────────────────────────────────────
 * Canonical profile schema (unchanged external shape)
 * ────────────────────────────────────────────────────────────────────────────*/

const FieldSchema = z.object({
  name: z.string().min(1),
  dbType: z
    .enum(["text", "int", "uuid", "json", "timestamp", "vector"])
    .default("text"),
  required: z.boolean().default(false),
  pk: z.boolean().optional(),
  fk: z.string().optional(), // "auth.users.id" or "table.column"
});

const EntitySchema = z.object({
  name: z.string().min(1),
  table: z.string().min(1),
  fields: z.array(FieldSchema).default([]),
  realtime: z.boolean().default(false),
  storageBuckets: z.array(z.string()).default([]),
  vectorSearch: z.boolean().default(false),
});

const RouteSchema = z.object({
  path: z.string().min(1),
  entity: z.string().min(1),
  type: z.enum(["list", "detail", "custom"]).default("list"),
});

const LlmSchema = z.object({
  providerPreference: z.enum(["openai", "anthropic"]).default("openai"),
  useLangGraph: z.boolean().default(true),
});

const QuestionnaireSchema = z
  .object({
    targets: z.enum(["mobile", "desktop", "both"]).default("both"),
    uploads: z
      .object({
        enabled: z.boolean().default(false),
        types: z
          .array(z.enum(["audio", "code", "image", "text", "pdf", "video"]))
          .default([]),
      })
      .default({ enabled: false, types: [] }),
    downloads: z
      .object({
        enabled: z.boolean().default(false),
        types: z
          .array(z.enum(["audio", "code", "image", "text", "pdf", "video"]))
          .default([]),
      })
      .default({ enabled: false, types: [] }),
    business: z
      .object({
        isBusiness: z.boolean().default(false),
        model: z.enum(["subscription", "services", "products"]).optional(),
      })
      .default({ isBusiness: false }),
    audience: z.string().default(""),
  })
  .strict();

export const ProfileSchema = z.object({
  id: z.string().min(1),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .default("1.0.0"),
  entities: z.array(EntitySchema).default([]),
  routes: z.array(RouteSchema).default([]),
  llm: LlmSchema.default({ providerPreference: "openai", useLangGraph: true }),
});
export type Profile = z.infer<typeof ProfileSchema>;

/** Input schema */
const InputSchema = z.union([
  z.string().min(1),
  z
    .object({
      description: z.string().min(1),
      answers: QuestionnaireSchema.optional(),
    })
    .strict(),
  z.record(z.string(), z.any()),
]);

/** ─────────────────────────────────────────────────────────────────────────────
 * Utilities (deterministic)
 * ────────────────────────────────────────────────────────────────────────────*/

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toSnakePlural(name: string): string {
  // naive snake + plural "s"
  const snake = name
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
  return snake.endsWith("s") ? snake : `${snake}s`;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/** Deep sorted-key JSON for stable diffs across runs */
function stableStringify(obj: unknown): string {
  const seen = new WeakSet();
  const sort = (value: any): any => {
    if (value === null || typeof value !== "object") return value;
    if (seen.has(value)) return value;
    seen.add(value);
    if (Array.isArray(value)) return value.map(sort);
    const out: Record<string, any> = {};
    for (const k of Object.keys(value).sort()) {
      out[k] = sort(value[k]);
    }
    return out;
  };
  return JSON.stringify(sort(obj), null, 2) + "\n";
}

/** ─────────────────────────────────────────────────────────────────────────────
 * LLM extraction (optional) — deterministic config via helper if present
 * ────────────────────────────────────────────────────────────────────────────*/
type PartialProfile = {
  id?: string;
  version?: string;
  entities?: Array<{
    name?: string;
    table?: string;
    fields?: Array<
      | {
          name: string;
          dbType?: string;
          required?: boolean;
          pk?: boolean;
          fk?: string;
        } // original-like
      | {
          name: string;
          type?: string;
          required?: boolean;
          unique?: boolean;
          relation?: { target: string; on?: string };
        } // richer
    >;
    realtime?: boolean;
    storageBuckets?: string[];
    vectorSearch?: boolean;
  }>;
  routes?: Array<
    | { path: string; entity: string; type?: "list" | "detail" | "custom" } // original-like
    | {
        path: string;
        entity: string;
        kind?: "list" | "detail" | "create" | "edit";
      } // richer
  >;
  llm?: { providerPreference?: "openai" | "anthropic"; useLangGraph?: boolean };
};

async function llmExtractDeterministic(
  text: string,
  logger: ExecutionContext["logger"],
): Promise<PartialProfile | null> {
  try {
    // Try both likely relative locations to avoid bundling path alias issues
    const mod = await import(/* @vite-ignore */ "../lib/ai/openai").catch(
      () => null,
    );
    if (!mod || !("jsonResponse" in mod)) return null;
    const { jsonResponse } = mod as any;

    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        id: { type: "string" },
        version: { type: "string" },
        entities: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              table: { type: "string" },
              fields: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    // richer hints (will be mapped)
                    name: { type: "string" },
                    type: {
                      enum: [
                        "uuid",
                        "text",
                        "number",
                        "boolean",
                        "timestamp",
                        "json",
                        "vector",
                      ],
                    },
                    required: { type: "boolean" },
                    unique: { type: "boolean" },
                    relation: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        target: { type: "string" },
                        on: { type: "string" },
                      },
                    },
                    // original-style fallback
                    dbType: {
                      enum: [
                        "text",
                        "int",
                        "uuid",
                        "json",
                        "timestamp",
                        "vector",
                      ],
                    },
                    pk: { type: "boolean" },
                    fk: { type: "string" },
                  },
                  required: ["name"],
                },
              },
            },
          },
        },
        routes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              path: { type: "string" },
              entity: { type: "string" },
              kind: { enum: ["list", "detail", "create", "edit"] },
              type: { enum: ["list", "detail", "custom"] },
            },
            required: ["path", "entity"],
          },
        },
        llm: {
          type: "object",
          additionalProperties: false,
          properties: {
            providerPreference: { enum: ["openai", "anthropic"] },
            useLangGraph: { type: "boolean" },
          },
        },
      },
    } as const;

    const prompt = [
      "Extract a minimal, canonical application profile from the user's description.",
      "Keep names concise; infer common fields like id(uuid) and created_at(timestamp).",
      "Use only the enumerated types; prefer relation {target,on} for foreign keys.",
      "Return strictly valid JSON conforming to the provided schema.",
      "Avoid timestamps or any content that changes across runs.",
    ].join("\n");

    // The helper should enforce temperature:0 & JSON mode; if not, it's okay—fallback heuristics cover us.
    const json = await jsonResponse(
      `${prompt}\n\nDESCRIPTION:\n${text}\n`,
      schema as any,
    );
    return json as PartialProfile;
  } catch (e) {
    logger?.warn?.({ msg: "profile.normalize:llm_extract_failed" });
    return null;
  }
}

/** Heuristic defaults (deterministic) for vague text */
function heuristicsFromText(text: string): PartialProfile {
  const t = text.toLowerCase();
  const wantsComments = /\bcomment(s)?\b/.test(t);
  const baseEntities: PartialProfile["entities"] = [
    {
      name: "posts",
      table: "posts",
      fields: [
        { name: "id", dbType: "uuid", required: true, pk: true },
        { name: "title", dbType: "text", required: true },
        { name: "content", dbType: "text", required: false },
        { name: "created_at", dbType: "timestamp", required: true },
      ],
      realtime: false,
      storageBuckets: [],
      vectorSearch: false,
    },
  ];
  if (wantsComments) {
    baseEntities!.push({
      name: "comments",
      table: "comments",
      fields: [
        { name: "id", dbType: "uuid", required: true, pk: true },
        // richer relation hint (will be mapped to fk)
        {
          name: "post_id",
          type: "uuid",
          required: true,
          relation: { target: "posts", on: "id" } as any,
        },
        { name: "body", dbType: "text", required: true },
        { name: "created_at", dbType: "timestamp", required: true },
      ],
      realtime: false,
      storageBuckets: [],
      vectorSearch: false,
    });
  }

  const routes: PartialProfile["routes"] = [
    { path: "/posts", entity: "posts", type: "list" as const },
    { path: "/posts/:id", entity: "posts", type: "detail" as const },
    ...(wantsComments
      ? [{ path: "/comments", entity: "comments", type: "list" as const }]
      : []),
  ];

  return {
    id: "app",
    version: "1.0.0",
    entities: baseEntities,
    routes,
    llm: { providerPreference: "openai", useLangGraph: true },
  };
}

/** Map richer field hints → original-compatible fields */
function downconvertFieldsToOriginal(
  fields: any[],
  logger: ExecutionContext["logger"],
) {
  return (fields ?? []).map((f) => {
    const out: any = {
      name: String(f?.name ?? "").trim() || "field",
      required: !!f?.required,
    };
    // prefer original 'dbType' if supplied
    if (
      f?.dbType &&
      ["text", "int", "uuid", "json", "timestamp", "vector"].includes(f.dbType)
    ) {
      out.dbType = f.dbType;
    } else if (f?.type) {
      // map richer 'type' into original dbType space
      const t = String(f.type);
      out.dbType =
        t === "number"
          ? "int"
          : t === "boolean"
            ? "int" // degrade (0/1). Log once:
            : t === "uuid"
              ? "uuid"
              : t === "timestamp"
                ? "timestamp"
                : t === "json"
                  ? "json"
                  : t === "vector"
                    ? "vector"
                    : "text";
      if (t === "boolean") {
        logger?.warn?.({ msg: "profile.normalize:boolean_degraded_to_int" });
      }
    } else {
      out.dbType = "text";
    }

    if (f?.pk === true) out.pk = true;

    // relation { target, on } → fk "target.on"
    if (f?.relation && typeof f.relation?.target === "string") {
      const on = f.relation?.on || "id";
      out.fk = `${f.relation.target}.${on}`;
    } else if (typeof f?.fk === "string" && f.fk.trim()) {
      out.fk = f.fk.trim();
    }

    // unique can't be represented in original schema; drop but warn once
    if (f?.unique) {
      logger?.warn?.({ msg: "profile.normalize:unique_ignored_in_output" });
    }

    return out;
  });
}

/** Normalize a loose profile-like object into the original schema */
function normalizeProfileLoose(
  loose: any,
  logger: ExecutionContext["logger"],
): Profile {
  const baseId =
    typeof loose?.id === "string" && loose.id.trim().length > 0
      ? slugify(loose.id)
      : slugify(
          typeof loose?.name === "string" && loose.name.trim()
            ? loose.name
            : typeof loose?.title === "string" && loose.title.trim()
              ? loose.title
              : "app",
        );

  const entitiesLoose: any[] = Array.isArray(loose?.entities)
    ? loose.entities
    : [];
  const routesLoose: any[] = Array.isArray(loose?.routes) ? loose.routes : [];

  const entities: Profile["entities"] = entitiesLoose.map((e, idx) => {
    const name: string =
      typeof e?.name === "string" && e.name.trim().length > 0
        ? e.name
        : `Entity${idx + 1}`;
    const table: string =
      typeof e?.table === "string" && e.table.trim().length > 0
        ? e.table
        : toSnakePlural(name);

    const fieldsArray: any[] = Array.isArray(e?.fields) ? e.fields : [];
    const fields = downconvertFieldsToOriginal(fieldsArray, logger);

    return {
      name,
      table,
      fields,
      realtime: Boolean(e?.realtime ?? false),
      storageBuckets: Array.isArray(e?.storageBuckets)
        ? e.storageBuckets.filter(
            (b: any) => typeof b === "string" && b.trim().length > 0,
          )
        : [],
      vectorSearch: Boolean(e?.vectorSearch ?? false),
    };
  });

  const routes: Profile["routes"] = routesLoose.map((r, idx) => {
    const path =
      typeof r?.path === "string" && r.path.trim().length > 0
        ? r.path
        : `/route-${idx + 1}`;
    const entity =
      typeof r?.entity === "string" && r.entity.trim().length > 0
        ? r.entity
        : (entities[0]?.name ?? "Entity1");

    // Accept both 'type' and 'kind', map 'kind' create/edit → custom in original
    let type: "list" | "detail" | "custom" = "list";
    if (r?.type === "detail" || r?.type === "custom") type = r.type;
    if (r?.kind === "detail") type = "detail";
    if (r?.kind === "create" || r?.kind === "edit") type = "custom";

    return { path, entity, type };
  });

  const llm = {
    providerPreference:
      loose?.llm?.providerPreference === "anthropic" ? "anthropic" : "openai",
    useLangGraph: loose?.llm?.useLangGraph === false ? false : true,
  };

  const candidate = {
    id: baseId || "app",
    version:
      typeof loose?.version === "string" &&
      /^\d+\.\d+\.\d+$/.test(loose.version)
        ? loose.version
        : "1.0.0",
    entities,
    routes,
    llm,
  };

  return ProfileSchema.parse(candidate);
}

/** Drop routes that reference non-existent entities (warn) */
function reconcileRoutes(
  profile: Profile,
  logger: ExecutionContext["logger"],
  correlationId: string,
): Profile {
  const p = deepClone(profile);
  const entityNames = new Set(p.entities.map((e) => e.name));
  const kept: typeof p.routes = [];
  for (const r of p.routes) {
    if (!entityNames.has(r.entity)) {
      logger.warn({
        msg: "route references unknown entity; dropping",
        route: r.path,
        entity: r.entity,
        correlationId,
      });
      continue;
    }
    kept.push(r);
  }
  p.routes = kept;
  return ProfileSchema.parse(p);
}

/** Infer from free text (LLM → heuristics → minimal) */
async function inferFromText(
  text: string,
  logger: ExecutionContext["logger"],
): Promise<Profile> {
  // 1) Try LLM if available & API key likely present
  const llm = await llmExtractDeterministic(text, logger);
  if (llm) {
    return normalizeProfileLoose(llm, logger);
  }

  // 2) Deterministic heuristics
  const heur = heuristicsFromText(text);
  return normalizeProfileLoose(heur, logger);
}

/** ─────────────────────────────────────────────────────────────────────────────
 * Node implementation (compatible)
 * ────────────────────────────────────────────────────────────────────────────*/

export const ProfileNormalizeNode: NodeSpec<
  unknown,
  { artifactPath: string; profile: Profile }
> = {
  id: "profile.normalize",
  phase: "processResponses",
  estimate: () => ({ tokens: 450, usd: 0.002 }),
  async run(input, ctx) {
    ctx.logger.info({
      msg: "profile.normalize:start",
      correlationId: ctx.correlationId,
    });

    const parsed = InputSchema.parse(input);

    let answers: z.infer<typeof QuestionnaireSchema> | undefined = undefined;
    if (typeof parsed === "object") {
      // If caller passed { description, answers } OR { ...loose, answers }
      const maybe = (parsed as any).answers;
      if (maybe) {
        answers = QuestionnaireSchema.parse(maybe);
      }
    }

    let loose: any;

    if (typeof parsed === "string") {
      const trimmed = parsed.trim();
      // Try JSON first; else treat as free text
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          loose = JSON.parse(trimmed);
        } catch {
          loose = { description: trimmed };
        }
      } else {
        loose = { description: trimmed };
      }
    } else if ("description" in (parsed as any)) {
      // Free text: LLM → heuristics → minimal
      const text = String((parsed as any).description);
      const inferred = await inferFromText(text, ctx.logger);
      const reconciled = reconcileRoutes(
        inferred,
        ctx.logger,
        ctx.correlationId,
      );
      const artifactPath = `artifacts/${ctx.orchestrationId}/profile.json`;
      await ctx.storage.saveArtifact(artifactPath, stableStringify(reconciled));

      if (answers) {
        const reqPath = `artifacts/${ctx.orchestrationId}/requirements.json`;
        await ctx.storage.saveArtifact(reqPath, stableStringify(answers));
        ctx.logger.info({
          msg: "profile.normalize:requirements_written",
          path: reqPath,
        });
      }

      ctx.logger.info({
        msg: "profile.normalize:written",
        artifactPath,
        correlationId: ctx.correlationId,
        entities: reconciled.entities.length,
        routes: reconciled.routes.length,
      });
      return { artifactPath, profile: reconciled };
    } else {
      // Already an object (loose profile-like)
      loose = parsed;
    }

    // Normalize loose → original schema
    let profile = normalizeProfileLoose(loose, ctx.logger);

    // Reconcile routes vs. entities
    profile = reconcileRoutes(profile, ctx.logger, ctx.correlationId);

    const artifactPath = `artifacts/${ctx.orchestrationId}/profile.json`;
    await ctx.storage.saveArtifact(artifactPath, stableStringify(profile));
    ctx.logger.info({
      msg: "profile.normalize:written",
      artifactPath,
      correlationId: ctx.correlationId,
      entities: profile.entities.length,
      routes: profile.routes.length,
    });

    return { artifactPath, profile };
  },
};

export default ProfileNormalizeNode;
