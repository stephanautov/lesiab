// path: env.mjs.d.ts
declare module "*.mjs" {
  export const env: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_APP_NAME: string;
    OPENAI_API_KEY?: string;
    ANTHROPIC_API_KEY?: string;
    // Add other keys your env.mjs validates if you’d like
  };
}
