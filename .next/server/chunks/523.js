"use strict";exports.id=523,exports.ids=[523],exports.modules={64523:(a,b,c)=>{c.r(b),c.d(b,{DeployDocsNode:()=>d,default:()=>e});let d={id:"deploy.docs",phase:"finalize",estimate:()=>({tokens:520,usd:.002}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo/DEPLOY.md`,d=`# Deploy Guide — LESiAB MVP

This guide describes how to deploy the generated MVP to **Vercel** with **Supabase**.

---

## 1) Prepare the repository
- Ensure artifacts are materialized to the repo root (optional):
  \`\`\`bash
  npx ts-node scripts/dev-run.ts
  npx ts-node scripts/materialize-artifacts.ts
  \`\`\`
- Commit files and push to GitHub.

## 2) Import repository to Vercel
- In Vercel dashboard, **Import Git Repository** and select this repo.
- Keep the default framework detection (Next.js).
- The repo includes \`vercel.json\` with:
  - Analytics enabled
  - Default region(s)
  - Cache headers for \`/api/public/*\`

## 3) Configure environment variables
Copy values from \`.env.example\` into the Vercel **Project → Settings → Environment Variables**:

**Server**
- \`OPENAI_API_KEY\`
- \`ANTHROPIC_API_KEY\`
- \`SUPABASE_URL\`
- \`SUPABASE_SERVICE_ROLE\`

**Client**
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- \`NEXT_PUBLIC_APP_NAME\` (e.g., \`App\`)

> Keep Preview and Production environments in sync where appropriate.

## 4) Supabase: link project and run migrations
- Create a Supabase project (if you don't already have one).
- Install & login to Supabase CLI locally.
- Link your local repo to the remote project:
  \`\`\`bash
  supabase link --project-ref <YOUR_PROJECT_REF>
  \`\`\`
- Apply migrations:
  \`\`\`bash
  supabase db push
  \`\`\`
  This applies \`supabase/migrations/*.sql\` to the remote DB.

> If you plan to use embeddings, ensure the target table exists:
\`\`\`sql
-- example table for ai.embedder (adjust as needed)
create table if not exists public.embeddings_index (
  id uuid primary key,
  content text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
\`\`\`

## 5) Deploy Edge Functions
From your repo root:
\`\`\`bash
supabase functions deploy cron
supabase functions deploy queue
supabase functions deploy embeddings
supabase functions deploy file-processor
\`\`\`
- In the Supabase dashboard, confirm schedules (for \`cron\`) and access policies as needed.

## 6) First deploy on Vercel
- Trigger a deploy by pushing to \`main\` or using **Deploy** in the Vercel UI.
- After deploy, visit your Production URL.

## 7) Verify functionality
- **Health endpoint**: \`/api/public/health\` → should return \`{ "ok": true }\`.
- **Protected page**: \`/app/(protected)/home\` → redirects to \`/login\` if not authenticated.
- **Uploads**:
  - Visit \`/app/(protected)/uploads\`.
  - Upload a file and confirm it appears in the \`user-uploads\` bucket.
- **Realtime (optional)**:
  - If applicable, subscribe via the client helper and trigger a server broadcast.

## 8) Analytics
- Ensure \`vercel.json\` analytics are enabled.
- Optionally render \`<AppAnalytics />\` from \`app/analytics.tsx\` inside the root layout to capture client events.

## 9) Rollback
- Use Vercel’s **Revert** to roll back to a previous successful deployment.
- For DB rollbacks, maintain migration discipline; create a down migration or restore from a snapshot if required.

## 10) Operations tips
- Keep \`.env\` and \`.env.example\` synchronized.
- Avoid editing generated files owned by other nodes; use the provided patch snippets under \`_patches/\`.
- CI (GitHub Actions) runs type and formatting checks on PRs and pushes to \`main\`.

---

**Done.** Your MVP is ready to iterate. For feature generation, run the orchestration flow and apply artifacts safely using the materializer script.
`.replace(/\r\n/g,"\n");return await b.storage.saveArtifact(c,d),b.logger.info({msg:"deploy.docs:written",files:[c],correlationId:b.correlationId}),{files:[c]}}},e=d}};