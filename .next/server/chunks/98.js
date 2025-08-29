"use strict";exports.id=98,exports.ids=[98],exports.modules={38098:(a,b,c)=>{c.r(b),c.d(b,{UiScreensNode:()=>h,default:()=>i});var d=c(36930);let e=a=>a.replace(/\r\n/g,"\n"),f=d.Ik({id:d.Yj().default("app"),entities:d.YO(d.Ik({name:d.Yj().min(1)})).default([])}),g=d.Ik({profile:f.optional()}),h={id:"ui.screens",phase:"codeGeneration",estimate:()=>({tokens:700,usd:.003}),async run(a,b){let c=g.safeParse(a),d=c.success?c.data.profile??{id:"app",entities:[]}:{id:"app",entities:[]},f=`artifacts/${b.orchestrationId}/repo`,h=[],i=e(`// path: app/(protected)/flows/page.tsx
"use client";
import * as React from "react";
import Link from "next/link";

export default function FlowsLanding() {
  const items = ${JSON.stringify(d.entities.map(a=>({name:a.name,href:`/app/(protected)/${a.name}`})))};
  return (
    <div className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Flows</h1>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-600">No complex flows defined yet.</p>
      ) : (
        <ul className="list-disc pl-5 text-sm">
          {items.map((it) => (
            <li key={it.href}><Link className="underline" href={it.href}>{it.name}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
`);for(let a of(h.push({path:`${f}/app/(protected)/flows/page.tsx`,content:i}),d.entities)){let b=e(`// path: app/(protected)/${a.name}/page.tsx
"use client";
import * as React from "react";
import { api } from "../../lib/trpc";
import { DataTable } from "../../components/data-table";

export default function ${a.name.charAt(0).toUpperCase()+a.name.slice(1)}Flow() {
  // Expected to exist after CRUD routers are generated:
  // const { data = [] } = api.${a.name}.list.useQuery();
  const data: any[] = [];
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">${a.name} flow</h1>
      <DataTable data={data} />
    </div>
  );
}
`);h.push({path:`${f}/app/(protected)/${a.name}/page.tsx`,content:b})}for(let a of h)await b.storage.saveArtifact(a.path,a.content);return b.logger.info({msg:"ui.screens:written",files:h.map(a=>a.path),entities:d.entities.length,correlationId:b.correlationId}),{files:h.map(a=>a.path)}}},i=h}};