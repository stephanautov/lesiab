// path: nodes/profile.normalize.ts
import { z } from "zod";

/**
 * NODE: profile.normalize
 * Phase: processResponses
 *
 * Purpose:
 *  - Accept free-text or partial JSON describing an app.
 *  - Produce a canonical, validated `profile.json` artifact that all generators can consume.
 *  - Be deterministic and idempotent: same input → same output.
 *
 * Contract expectations from the OrchestrationEngine:
 *  - ctx.storage.saveArtifact(path, content) persists artifacts in a content-addressable store.
 *  - ctx.logger.{info,warn,error} for structured logs.
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
 * Canonical profile schema (single source of truth)
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

/** ─────────────────────────────────────────────────────────────────────────────
 * Input schema (free text, {description}, or arbitrary record)
 * ────────────────────────────────────────────────────────────────────────────*/

const InputSchema = z.union([
  z.string().min(1),
  z.object({ description: z.string().min(1) }).strict(),
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

/** Given loose/partial profile-like object, normalize into canonical Profile */
function normalizeProfileLoose(loose: any): Profile {
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

  // Normalize entities
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
    const fields = fieldsArray.map((f) => ({
      name: String(f?.name ?? "").trim() || "field",
      dbType: ["text", "int", "uuid", "json", "timestamp", "vector"].includes(
        f?.dbType,
      )
        ? f.dbType
        : "text",
      required: Boolean(f?.required ?? false),
      pk: f?.pk === true ? true : undefined,
      fk: typeof f?.fk === "string" && f.fk.trim().length ? f.fk : undefined,
    }));

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

  // Normalize routes
  const routes: Profile["routes"] = routesLoose.map((r, idx) => {
    const path =
      typeof r?.path === "string" && r.path.trim().length > 0
        ? r.path
        : `/route-${idx + 1}`;
    const entity =
      typeof r?.entity === "string" && r.entity.trim().length > 0
        ? r.entity
        : (entities[0]?.name ?? "Entity1");
    const type: "list" | "detail" | "custom" =
      r?.type === "detail" || r?.type === "custom" ? r.type : "list";
    return { path, entity, type };
  });

  const llm = {
    providerPreference:
      loose?.llm?.providerPreference === "anthropic" ? "anthropic" : "openai",
    useLangGraph: loose?.llm?.useLangGraph === false ? false : true,
  };

  // Construct and validate via schema (fills defaults)
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

/** If the input is free text, infer a minimal profile */
function inferProfileFromText(text: string): Profile {
  const firstLine = text.split(/\n|\./)[0] ?? "app";
  const name = slugify(firstLine) || "app";

  return ProfileSchema.parse({
    id: name,
    version: "1.0.0",
    entities: [],
    routes: [],
    llm: { providerPreference: "openai", useLangGraph: true },
  });
}

/** Filter or warn on routes that reference non-existent entities */
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
  return ProfileSchema.parse(p); // revalidate
}

/** ─────────────────────────────────────────────────────────────────────────────
 * The node implementation
 * ────────────────────────────────────────────────────────────────────────────*/

export const ProfileNormalizeNode: NodeSpec<
  unknown,
  { artifactPath: string; profile: Profile }
> = {
  id: "profile.normalize",
  phase: "processResponses",
  estimate: () => ({ tokens: 250, usd: 0.001 }),
  async run(input, ctx) {
    ctx.logger.info({
      msg: "profile.normalize:start",
      correlationId: ctx.correlationId,
    });

    const parsed = InputSchema.parse(input);

    let loose: any;
    if (typeof parsed === "string") {
      // Try JSON parse first for convenience; otherwise treat as free text.
      const trimmed = parsed.trim();
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
      // Free-text description
      const text = String((parsed as any).description);
      const inferred = inferProfileFromText(text);
      const artifactPath = `artifacts/${ctx.orchestrationId}/profile.json`;
      await ctx.storage.saveArtifact(
        artifactPath,
        JSON.stringify(inferred, null, 2),
      );
      ctx.logger.info({
        msg: "profile.normalize:written",
        artifactPath,
        correlationId: ctx.correlationId,
      });
      return { artifactPath, profile: inferred };
    } else {
      // Already an object (loose profile-like)
      loose = parsed;
    }

    let profile: Profile;
    if (typeof loose === "string") {
      profile = inferProfileFromText(loose);
    } else {
      profile = normalizeProfileLoose(loose);
    }

    // Reconcile routes vs entities (warn & drop any invalid references)
    profile = reconcileRoutes(profile, ctx.logger, ctx.correlationId);

    // Ensure all entities have tables and fields arrays normalized (already handled, but double-safe)
    profile = ProfileSchema.parse(profile);

    const artifactPath = `artifacts/${ctx.orchestrationId}/profile.json`;
    await ctx.storage.saveArtifact(
      artifactPath,
      JSON.stringify(profile, null, 2),
    );
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
