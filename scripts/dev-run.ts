// path: scripts/dev-run.ts
/* eslint-disable no-console */
import { createFsStorage } from "../engine/fsStorage";

// Import the nodes you've added so far:
import ProfileNormalizeNode from "../nodes/profile.normalize";
import RepoScaffoldNode from "../nodes/repo.scaffold";
import EnvSchemaNode from "../nodes/env.schema";
import UiShadcnInitNode from "../nodes/ui.shadcn.init";
import ClientStateInstallNode from "../nodes/client.state.install";
import FormsRHFSetupNode from "../nodes/forms.rhf.setup";
import UiDataTableNode from "../nodes/ui.datatable";
import SaInitNode from "../nodes/sa.init";
import DbSchemaNode from "../nodes/db.schema";
import AuthSetupNode from "../nodes/auth.setup";
import StorageBucketsNode from "../nodes/storage.buckets";
import SaRlsNode from "../nodes/sa.rls";
import RealtimeChannelsNode from "../nodes/realtime.channels";
import CronQueueSetupNode from "../nodes/cron.queue.setup";
import EdgeFunctionsNode from "../nodes/edge.functions";
import TrpcServer from "../nodes/trpc.server";
import RestPublic from "../nodes/rest.public";
import TrpcClientNode from "../nodes/trpc.client";
import NextAppRouterNode from "../nodes/next.app.router";
import UploadDirectNode from "../nodes/upload.direct";
import AiOpenaiSetupNode from "../nodes/ai.openai.setup";
import AiAnthropicSetupNode from "../nodes/ai.anthropic.setup";
import AiLanggraphFlowNode from "../nodes/ai.langgraph.flow";
import AiEmbedderNode from "../nodes/ai.embedder";
import RealtimeClientNode from "../nodes/realtime.client";
import UiScreensNode from "../nodes/ui.screens";
import VercelConfigNode from "../nodes/vercel.config";
import MonitoringBasicsNode from "../nodes/monitoring.basics";
import GithubSetup from "../nodes/github.setup";
import DeployDocs from "../nodes/deploy.docs";

// Minimal ExecutionContext
const storage = createFsStorage();
const logger = {
  info: (m: any) => console.log("[info]", m),
  warn: (m: any) => console.warn("[warn]", m),
  error: (m: any) => console.error("[error]", m),
};

const orchestrationId = process.env.ORC_ID ?? "dev-orc-0001";
const correlationId = "dev-run-0001";

async function run() {
  const ctx = { orchestrationId, correlationId, logger, storage };

  // --- Batch 0: profile.normalize ---
  // If your input is unintelligible, the node defaults to an "app" profile.
  const profileInput =
    process.env.PROFILE_JSON ??
    `{"id":"app","version":"1.0.0","entities":[],"routes":[],"llm":{"providerPreference":"openai","useLangGraph":true}}`;
  await ProfileNormalizeNode.run(profileInput, ctx);

  // --- Batch 1: repo.scaffold ---
  await RepoScaffoldNode.run({ profile: { id: "app", version: "1.0.0" } }, ctx);

  // --- Batch 2: env.schema, ui.shadcn.init, client.state.install, forms.rhf.setup, ui.datatable ---
  await EnvSchemaNode.run({}, ctx);
  await UiShadcnInitNode.run({}, ctx);
  await ClientStateInstallNode.run({}, ctx);
  await FormsRHFSetupNode.run({}, ctx);
  await UiDataTableNode.run({}, ctx);

  // --- Batch 3: sa.init ---
  await SaInitNode.run({}, ctx);

  // --- Batch 4: db.schema, auth.setup, storage.buckets ---
  await DbSchemaNode.run(
    { profile: { id: "app", version: "1.0.0", entities: [] } },
    ctx,
  );
  await AuthSetupNode.run({}, ctx);
  await StorageBucketsNode.run({}, ctx);

  // --- Batch 5: sa.rls, realtime.channels, cron.queue.setup, edge.functions ---
  await SaRlsNode.run({ profile: { entities: [] } }, ctx);
  await RealtimeChannelsNode.run({}, ctx);
  await CronQueueSetupNode.run({}, ctx);
  await EdgeFunctionsNode.run({}, ctx);

  // --- Batch 6: trpc.server, rest.public ---
  await TrpcServer.run({}, ctx);
  await RestPublic.run({}, ctx);

  // --- Batch 7: trpc.client, next.app.router, upload.direct, ai.openai.setup, ai.anthropic.setup ---
  await TrpcClientNode.run({}, ctx);
  await NextAppRouterNode.run({}, ctx);
  await UploadDirectNode.run({}, ctx);
  await AiOpenaiSetupNode.run({}, ctx);
  await AiAnthropicSetupNode.run({}, ctx);

  // --- Batch 8: ai.langgraph.flow, ai.embedder, realtime.client, ui.screens ---
  await AiLanggraphFlowNode.run({}, ctx);
  await AiEmbedderNode.run({}, ctx);
  await RealtimeClientNode.run({}, ctx);
  await UiScreensNode.run({ profile: { id: "app", entities: [] } }, ctx);

  // --- Batch 9: vercel.config, monitoring.basics ---
  await VercelConfigNode.run({}, ctx);
  await MonitoringBasicsNode.run({}, ctx);

  // --- Batch 10: github.setup, deploy.docs ---
  await GithubSetup.run({}, ctx);
  await DeployDocs.run({}, ctx);
}

run().catch((err) => {
  console.error("Dev runner failed:", err);
  process.exit(1);
});
