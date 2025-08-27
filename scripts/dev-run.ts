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
    await DbSchemaNode.run({ profile: { id: "app", version: "1.0.0", entities: [] } }, ctx);
    await AuthSetupNode.run({}, ctx);
    await StorageBucketsNode.run({}, ctx);

    // --- Batch 5: sa.rls, realtime.channels, cron.queue.setup, edge.functions ---
    await SaRlsNode.run({ profile: { entities: [] } }, ctx);
    await RealtimeChannelsNode.run({}, ctx);
    await CronQueueSetupNode.run({}, ctx);
    await EdgeFunctionsNode.run({}, ctx);

    console.log(
        `\n✔ Completed Batches 0–3.\nArtifacts are in artifacts/${orchestrationId}/repo.\nNext: run materializer to copy them into your working tree (optional).`
    );
}

run().catch((err) => {
    console.error("Dev runner failed:", err);
    process.exit(1);
});
