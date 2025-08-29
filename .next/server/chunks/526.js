"use strict";exports.id=526,exports.ids=[526],exports.modules={50526:(a,b,c)=>{c.r(b),c.d(b,{VercelConfigNode:()=>d,default:()=>e});let d={id:"vercel.config",phase:"integrate",estimate:()=>({tokens:160,usd:.001}),async run(a,b){let c=`artifacts/${b.orchestrationId}/repo/vercel.json`,d=`{
  "analytics": { "enabled": true },
  "regions": ["iad1"],
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/api/public/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, s-maxage=60, stale-while-revalidate=600" }
      ]
    }
  ]
}
`.replace(/\r\n/g,"\n");return await b.storage.saveArtifact(c,d),b.logger.info({msg:"vercel.config:written",files:[c],correlationId:b.correlationId}),{files:[c]}}},e=d}};