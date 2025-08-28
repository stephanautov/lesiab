# LESiAB Project Structure

## Project Overview
LESiAB is a comprehensive code generation and orchestration framework that creates full-stack applications with Next.js, Supabase, tRPC, and AI integrations.

## Root Directory Structure

```
C:\Users\seggu\LESiAB\
├── DEPLOY.md                           # Deployment documentation
├── README.md                           # Project documentation
├── package.json                        # Node.js dependencies and scripts
├── pnpm-lock.yaml                     # PNPM lock file
├── pnpm-workspace.yaml                # PNPM workspace configuration
├── tsconfig.json                       # TypeScript configuration
├── tsconfig.tsbuildinfo               # TypeScript build cache
├── next-env.d.ts                      # Next.js type declarations
├── vercel.json                        # Vercel deployment configuration
├── env.mjs                            # Environment variable schema
├── env.mjs.d.ts                       # TypeScript declarations for env.mjs
├── middleware.ts                       # Next.js middleware
│
├── _patches/                          # Code patches and diffs
│   ├── app_providers_trpc_injection.diff
│   └── readme_monitoring_append.md
│
├── app/                               # Next.js App Router pages
│   ├── (protected)/                   # Protected route group
│   │   ├── flows/
│   │   │   └── page.tsx              # Flows landing page
│   │   ├── home/
│   │   │   └── page.tsx              # Home page
│   │   └── uploads/
│   │       └── page.tsx              # File upload page
│   ├── api/                          # API routes
│   │   ├── public/
│   │   │   └── health/
│   │   │       └── route.ts          # Health check endpoint
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts          # tRPC API handler
│   ├── analytics.tsx                 # Analytics component
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout component
│   └── providers.tsx                 # React providers wrapper
│
├── components/                        # Reusable React components
│   ├── data-table.tsx                # Data table component
│   ├── form/                         # Form components
│   │   ├── Select.tsx               # Select input
│   │   ├── TextArea.tsx             # Textarea input
│   │   └── TextField.tsx            # Text field input
│   └── ui/                          # UI components (shadcn/ui)
│       ├── button.tsx               # Button component
│       ├── dialog.tsx               # Dialog component
│       ├── input.tsx                # Input component
│       ├── label.tsx                # Label component
│       └── toast.tsx                # Toast notification
│
├── lib/                              # Utility libraries
│   ├── ai/                          # AI integrations
│   │   ├── flows/
│   │   │   └── codegenFlow.ts       # LangGraph code generation flow
│   │   ├── anthropic.ts             # Claude AI client
│   │   └── openai.ts                # OpenAI client
│   ├── realtime/                    # Supabase realtime
│   │   ├── client.ts               # Client-side realtime
│   │   ├── index.ts                # Realtime exports
│   │   └── server.ts               # Server-side realtime
│   ├── auth.ts                      # Authentication utilities
│   ├── cache.ts                     # LRU cache implementation
│   ├── queue.ts                     # Queue management
│   ├── storage.ts                   # File storage utilities
│   ├── trpc.tsx                     # tRPC client configuration
│   └── upload.ts                    # File upload utilities
│
├── server/                           # Server-side code
│   └── trpc/                        # tRPC server setup
│       ├── _trpc.ts                 # tRPC base configuration
│       ├── context.ts               # Request context
│       ├── router.ts                # Main router
│       ├── embeddings.router.ts     # Embeddings API routes
│       └── uploads.router.ts        # File upload routes
│
├── supabase/                         # Supabase configuration
│   ├── config.toml                  # Supabase CLI configuration
│   ├── functions/                   # Supabase Edge Functions
│   │   ├── cron/
│   │   │   └── index.ts            # Scheduled tasks
│   │   ├── embeddings/
│   │   │   └── index.ts            # Vector embeddings processing
│   │   ├── file-processor/
│   │   │   └── index.ts            # File processing function
│   │   └── queue/
│   │       └── index.ts            # Queue worker function
│   └── migrations/                  # Database migrations
│       ├── 0001_init.sql           # Initial schema
│       ├── 0002_storage.sql        # Storage buckets and policies
│       └── 0003_rls.sql            # Row Level Security policies
│
├── engine/                           # Orchestration engine
│   ├── OrchestrationEngine.ts       # Main orchestration logic
│   └── fsStorage.ts                 # File system storage adapter
│
├── nodes/                            # Code generation nodes
│   ├── ai.anthropic.setup.ts       # Claude AI setup
│   ├── ai.embedder.ts               # Vector embeddings setup
│   ├── ai.langgraph.flow.ts         # LangGraph flow generation
│   ├── ai.openai.setup.ts           # OpenAI setup
│   ├── auth.setup.ts                # Authentication setup
│   ├── client.state.install.ts     # Client state management
│   ├── cron.queue.setup.ts          # Cron and queue setup
│   ├── db.schema.ts                 # Database schema generation
│   ├── deploy.docs.ts               # Deployment documentation
│   ├── edge.functions.ts            # Edge functions generation
│   ├── env.schema.ts                # Environment schema
│   ├── forms.rhf.setup.ts           # React Hook Form setup
│   ├── github.setup.ts              # GitHub integration
│   ├── monitoring.basics.ts         # Basic monitoring setup
│   ├── next.app.router.ts           # Next.js App Router setup
│   ├── profile.normalize.ts         # Profile normalization
│   ├── realtime.channels.ts         # Realtime channels setup
│   ├── realtime.client.ts           # Realtime client setup
│   ├── repo.scaffold.ts             # Repository scaffolding
│   ├── rest.public.ts               # Public REST API setup
│   ├── sa.init.ts                   # Supabase initialization
│   ├── sa.rls.ts                    # Row Level Security setup
│   ├── storage.buckets.ts           # Storage buckets setup
│   ├── trpc.client.ts               # tRPC client setup
│   ├── trpc.server.ts               # tRPC server setup
│   ├── ui.datatable.ts              # Data table UI generation
│   ├── ui.screens.ts                # Screen UI generation
│   ├── ui.shadcn.init.ts            # shadcn/ui initialization
│   ├── upload.direct.ts             # Direct upload setup
│   └── vercel.config.ts             # Vercel configuration
│
├── scripts/                          # Build and utility scripts
│   ├── dev-run.ts                   # Development orchestration runner
│   ├── materialize-artifacts.ts     # Artifact materialization script
│   ├── postinstall.sh               # Post-installation script
│   └── sa-init.ts                   # Supabase initialization script
│
├── blueprint/                        # Orchestration blueprints
│   └── blueprint.example.json       # Example orchestration blueprint
│
└── artifacts/                        # Generated artifacts
    └── dev-orc-0001/                # Development orchestration output
        ├── profile.json             # Normalized profile configuration
        └── repo/                    # Generated repository structure
            └── [Generated files mirror the main structure]
```

## Key Features

### 1. Orchestration Engine
- **OrchestrationEngine.ts**: Production-ready orchestration with dependency resolution, retry logic, checkpointing, and budget controls
- **Node-based architecture**: Modular code generation nodes for different aspects of the application

### 2. Full-Stack Application Generation
- **Next.js App Router**: Modern React application structure
- **Supabase Integration**: Database, authentication, storage, and edge functions
- **tRPC**: Type-safe API layer between frontend and backend
- **AI Integration**: OpenAI and Anthropic Claude for code generation and embeddings

### 3. Development Tools
- **TypeScript**: Full type safety across the entire stack
- **ESLint & Prettier**: Code quality and formatting
- **pnpm**: Fast, efficient package management
- **Vercel**: Deployment configuration

### 4. Generated Features
- Authentication and authorization
- File upload and storage
- Real-time functionality
- Vector embeddings and search
- CRUD operations with type safety
- UI components (shadcn/ui)
- Database migrations and RLS policies

## Architecture Highlights

- **Dependency Resolution**: Uses Tarjan's algorithm for cycle detection and Kahn's algorithm for topological sorting
- **Concurrent Execution**: Task pools with configurable concurrency limits
- **Resumable Operations**: Checkpoint-based execution for reliability
- **Budget Controls**: Token, cost, and time-based limits
- **Type Safety**: Branded types and comprehensive TypeScript coverage
- **Modular Design**: Each node handles a specific aspect of code generation