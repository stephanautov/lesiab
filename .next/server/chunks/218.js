"use strict";exports.id=218,exports.ids=[218],exports.modules={24218:(a,b,c)=>{c.r(b),c.d(b,{RestPublicNode:()=>d,default:()=>e});let d={id:"rest.public",phase:"execute",estimate:()=>({tokens:180,usd:.001}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo/app/api/public/health/route.ts`,d=`// path: app/api/public/health/route.ts
export const runtime = "edge";
export const revalidate = 60;

export async function GET() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" }
  });
}
`.replace(/\r\n/g,"\n");return await b.storage.saveArtifact(c,d),b.logger.info({msg:"rest.public:written",files:[c],correlationId:b.correlationId}),{files:[c]}}},e=d}};