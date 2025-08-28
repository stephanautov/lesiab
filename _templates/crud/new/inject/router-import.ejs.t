---
inject: true
into: server/trpc/router.ts
after: // hygen:routers-import
---
import { <%= entity %>Router } from './<%= entity %>.router';
