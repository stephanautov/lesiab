---
inject: true
into: server/trpc/router.ts
after: // hygen:routers-merge
---
  <%= entity %>: <%= entity %>Router,
