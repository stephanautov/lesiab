(() => {
  var a = {};
  ((a.id = 201),
    (a.ids = [201]),
    (a.modules = {
      261: (a) => {
        "use strict";
        a.exports = require("next/dist/shared/lib/router/utils/app-paths");
      },
      3295: (a) => {
        "use strict";
        a.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");
      },
      7889: (a, b, c) => {
        "use strict";
        (c.r(b), c.d(b, { default: () => d }));
        let d = (0, c(78088).registerClientReference)(
          function () {
            throw Error(
              "Attempted to call the default export of \"C:\\\\Users\\\\seggu\\\\LESiAB\\\\app\\\\(protected)\\\\uploads\\\\page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
            );
          },
          "C:\\Users\\seggu\\LESiAB\\app\\(protected)\\uploads\\page.tsx",
          "default",
        );
      },
      10067: (a, b, c) => {
        Promise.resolve().then(c.bind(c, 7889));
      },
      10846: (a) => {
        "use strict";
        a.exports = require("next/dist/compiled/next-server/app-page.runtime.prod.js");
      },
      19121: (a) => {
        "use strict";
        a.exports = require("next/dist/server/app-render/action-async-storage.external.js");
      },
      20843: (a, b, c) => {
        Promise.resolve().then(c.bind(c, 96482));
      },
      24916: (a, b, c) => {
        "use strict";
        (c.r(b), c.d(b, { default: () => e }));
        var d = c(26173);
        let e = async (a) => [
          {
            type: "image/svg+xml",
            sizes: "any",
            url:
              (0, d.fillMetadataSegment)(".", await a.params, "icon.svg") +
              "?5a099fbc5c20e681",
          },
        ];
      },
      26713: (a) => {
        "use strict";
        a.exports = require("next/dist/shared/lib/router/utils/is-bot");
      },
      28354: (a) => {
        "use strict";
        a.exports = require("util");
      },
      29294: (a) => {
        "use strict";
        a.exports = require("next/dist/server/app-render/work-async-storage.external.js");
      },
      30520: (a, b, c) => {
        "use strict";
        c.d(b, { F: () => i, x: () => j });
        var d = c(80742),
          e = c(30311),
          f = c(9177),
          g = c(64196),
          h = c(99101);
        let i = (0, f.pY)();
        function j({ children: a }) {
          let b = (0, h.jE)(),
            [c] = e.useState(() =>
              i.createClient({
                links: [
                  (0, f.fu)({
                    url: `${(function () {
                      let a = process.env.NEXT_PUBLIC_VERCEL_URL;
                      return a ? `https://${a}` : "http://localhost:3000";
                    })()}/api/trpc`,
                    transformer: g.Ay,
                  }),
                ],
              }),
            );
          return (0, d.jsx)(i.Provider, {
            client: c,
            queryClient: b,
            children: a,
          });
        }
      },
      31568: (a, b, c) => {
        (Promise.resolve().then(c.t.bind(c, 16504, 23)),
          Promise.resolve().then(c.t.bind(c, 72851, 23)),
          Promise.resolve().then(c.t.bind(c, 56191, 23)),
          Promise.resolve().then(c.t.bind(c, 87186, 23)),
          Promise.resolve().then(c.t.bind(c, 76086, 23)),
          Promise.resolve().then(c.t.bind(c, 32186, 23)),
          Promise.resolve().then(c.t.bind(c, 72130, 23)),
          Promise.resolve().then(c.t.bind(c, 66407, 23)),
          Promise.resolve().then(c.t.bind(c, 40546, 23)));
      },
      33873: (a) => {
        "use strict";
        a.exports = require("path");
      },
      34741: (a, b, c) => {
        (Promise.resolve().then(c.bind(c, 96057)),
          Promise.resolve().then(c.bind(c, 83699)),
          Promise.resolve().then(c.bind(c, 60817)));
      },
      41025: (a) => {
        "use strict";
        a.exports = require("next/dist/server/app-render/dynamic-access-async-storage.external.js");
      },
      41296: (a, b, c) => {
        (Promise.resolve().then(c.t.bind(c, 72326, 23)),
          Promise.resolve().then(c.t.bind(c, 42649, 23)),
          Promise.resolve().then(c.t.bind(c, 78689, 23)),
          Promise.resolve().then(c.t.bind(c, 94296, 23)),
          Promise.resolve().then(c.t.bind(c, 24840, 23)),
          Promise.resolve().then(c.t.bind(c, 96396, 23)),
          Promise.resolve().then(c.t.bind(c, 56156, 23)),
          Promise.resolve().then(c.t.bind(c, 36333, 23)),
          Promise.resolve().then(c.bind(c, 43948)));
      },
      42187: (a, b, c) => {
        "use strict";
        c.d(b, { AppAnalytics: () => d });
        let d = (0, c(78088).registerClientReference)(
          function () {
            throw Error(
              "Attempted to call AppAnalytics() from the server but AppAnalytics is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
            );
          },
          "C:\\Users\\seggu\\LESiAB\\app\\analytics.tsx",
          "AppAnalytics",
        );
      },
      47158: (a, b, c) => {
        "use strict";
        var d = c(61617);
        function e() {}
        function f() {}
        ((f.resetWarningCache = e),
          (a.exports = function () {
            function a(a, b, c, e, f, g) {
              if (g !== d) {
                var h = Error(
                  "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
                );
                throw ((h.name = "Invariant Violation"), h);
              }
            }
            function b() {
              return a;
            }
            a.isRequired = a;
            var c = {
              array: a,
              bigint: a,
              bool: a,
              func: a,
              number: a,
              object: a,
              string: a,
              symbol: a,
              any: a,
              arrayOf: b,
              element: a,
              elementType: a,
              instanceOf: b,
              node: a,
              objectOf: b,
              oneOf: b,
              oneOfType: b,
              shape: b,
              exact: b,
              checkPropTypes: f,
              resetWarningCache: e,
            };
            return ((c.PropTypes = c), c);
          }));
      },
      53809: (a, b, c) => {
        "use strict";
        (c.r(b), c.d(b, { default: () => i, metadata: () => h }));
        var d = c(48836);
        (c(75352), c(51709));
        var e = c(87965),
          f = c(76251),
          g = c(42187);
        let h = { title: "LESiAB", description: "MVP" };
        function i({ children: a }) {
          return (0, d.jsx)("html", {
            lang: "en",
            children: (0, d.jsxs)("body", {
              children: [
                (0, d.jsx)(f.Header, {}),
                (0, d.jsx)(e.Providers, { children: a }),
                (0, d.jsx)(g.AppAnalytics, {}),
              ],
            }),
          });
        }
      },
      60817: (a, b, c) => {
        "use strict";
        c.d(b, { Header: () => g });
        var d = c(80742),
          e = c(61405),
          f = c.n(e);
        function g() {
          return (0, d.jsx)("header", {
            className: "border-b",
            children: (0, d.jsxs)("div", {
              className:
                "mx-auto flex max-w-5xl items-center justify-between px-4 py-3",
              children: [
                (0, d.jsx)(f(), {
                  href: "/home",
                  className: "font-semibold",
                  children: "LESiAB",
                }),
                (0, d.jsxs)("nav", {
                  className: "flex items-center gap-4 text-sm",
                  children: [
                    (0, d.jsx)(f(), {
                      href: "/home",
                      className: "underline-offset-4 hover:underline",
                      children: "Home",
                    }),
                    (0, d.jsx)(f(), {
                      href: "/uploads",
                      className: "underline-offset-4 hover:underline",
                      children: "Uploads",
                    }),
                    (0, d.jsx)(f(), {
                      href: "/flows",
                      className: "underline-offset-4 hover:underline",
                      children: "Flows",
                    }),
                  ],
                }),
              ],
            }),
          });
        }
      },
      61617: (a) => {
        "use strict";
        a.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
      },
      63033: (a) => {
        "use strict";
        a.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");
      },
      75352: () => {},
      76251: (a, b, c) => {
        "use strict";
        c.d(b, { Header: () => d });
        let d = (0, c(78088).registerClientReference)(
          function () {
            throw Error(
              "Attempted to call Header() from the server but Header is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
            );
          },
          "C:\\Users\\seggu\\LESiAB\\components\\Header.tsx",
          "Header",
        );
      },
      83699: (a, b, c) => {
        "use strict";
        c.d(b, { Providers: () => i });
        var d = c(80742);
        c(30311);
        var e = c(68432),
          f = c(99101),
          g = c(30520);
        let h = new e.E();
        function i({ children: a }) {
          return (0, d.jsx)(f.Ht, {
            client: h,
            children: (0, d.jsx)(g.x, { children: a }),
          });
        }
      },
      86337: (a, b) => {
        "use strict";
        ((b.__esModule = !0),
          (b.default = function (a, b) {
            if (a && b) {
              var c = Array.isArray(b) ? b : b.split(",");
              if (0 === c.length) return !0;
              var d = a.name || "",
                e = (a.type || "").toLowerCase(),
                f = e.replace(/\/.*$/, "");
              return c.some(function (a) {
                var b = a.trim().toLowerCase();
                return "." === b.charAt(0)
                  ? d.toLowerCase().endsWith(b)
                  : b.endsWith("/*")
                    ? f === b.replace(/\/.*$/, "")
                    : e === b;
              });
            }
            return !0;
          }));
      },
      86439: (a) => {
        "use strict";
        a.exports = require("next/dist/shared/lib/no-fallback-error.external");
      },
      87965: (a, b, c) => {
        "use strict";
        c.d(b, { Providers: () => d });
        let d = (0, c(78088).registerClientReference)(
          function () {
            throw Error(
              "Attempted to call Providers() from the server but Providers is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
            );
          },
          "C:\\Users\\seggu\\LESiAB\\app\\providers.tsx",
          "Providers",
        );
      },
      92015: (a, b, c) => {
        "use strict";
        (c.r(b),
          c.d(b, {
            GlobalError: () => D.a,
            __next_app__: () => J,
            handler: () => L,
            pages: () => I,
            routeModule: () => K,
            tree: () => H,
          }));
        var d = c(48356),
          e = c(6971),
          f = c(59301),
          g = c(63138),
          h = c(92348),
          i = c(41590),
          j = c(9325),
          k = c(96686),
          l = c(21652),
          m = c(41718),
          n = c(62104),
          o = c(24207),
          p = c(77883),
          q = c(6664),
          r = c(261),
          s = c(13119),
          t = c(17060),
          u = c(26713),
          v = c(61862),
          w = c(93483),
          x = c(12335),
          y = c(4280),
          z = c(96304),
          A = c(3816),
          B = c(86439),
          C = c(16504),
          D = c.n(C),
          E = c(67468),
          F = c(2693),
          G = {};
        for (let a in E)
          0 >
            [
              "default",
              "tree",
              "pages",
              "GlobalError",
              "__next_app__",
              "routeModule",
              "handler",
            ].indexOf(a) && (G[a] = () => E[a]);
        c.d(b, G);
        let H = {
            children: [
              "",
              {
                children: [
                  "(protected)",
                  {
                    children: [
                      "uploads",
                      {
                        children: [
                          "__PAGE__",
                          {},
                          {
                            page: [
                              () => Promise.resolve().then(c.bind(c, 7889)),
                              "C:\\Users\\seggu\\LESiAB\\app\\(protected)\\uploads\\page.tsx",
                            ],
                          },
                        ],
                      },
                      {},
                    ],
                  },
                  {
                    "not-found": [
                      () => Promise.resolve().then(c.t.bind(c, 56894, 23)),
                      "next/dist/client/components/builtin/not-found.js",
                    ],
                    forbidden: [
                      () => Promise.resolve().then(c.t.bind(c, 21687, 23)),
                      "next/dist/client/components/builtin/forbidden.js",
                    ],
                    unauthorized: [
                      () => Promise.resolve().then(c.t.bind(c, 42058, 23)),
                      "next/dist/client/components/builtin/unauthorized.js",
                    ],
                    metadata: {
                      icon: [
                        async (a) =>
                          (
                            await Promise.resolve().then(c.bind(c, 24916))
                          ).default(a),
                      ],
                      apple: [],
                      openGraph: [],
                      twitter: [],
                      manifest: void 0,
                    },
                  },
                ],
              },
              {
                layout: [
                  () => Promise.resolve().then(c.bind(c, 53809)),
                  "C:\\Users\\seggu\\LESiAB\\app\\layout.tsx",
                ],
                "global-error": [
                  () => Promise.resolve().then(c.t.bind(c, 16504, 23)),
                  "next/dist/client/components/builtin/global-error.js",
                ],
                "not-found": [
                  () => Promise.resolve().then(c.t.bind(c, 56894, 23)),
                  "next/dist/client/components/builtin/not-found.js",
                ],
                forbidden: [
                  () => Promise.resolve().then(c.t.bind(c, 21687, 23)),
                  "next/dist/client/components/builtin/forbidden.js",
                ],
                unauthorized: [
                  () => Promise.resolve().then(c.t.bind(c, 42058, 23)),
                  "next/dist/client/components/builtin/unauthorized.js",
                ],
                metadata: {
                  icon: [
                    async (a) =>
                      (await Promise.resolve().then(c.bind(c, 24916))).default(
                        a,
                      ),
                  ],
                  apple: [],
                  openGraph: [],
                  twitter: [],
                  manifest: void 0,
                },
              },
            ],
          }.children,
          I = ["C:\\Users\\seggu\\LESiAB\\app\\(protected)\\uploads\\page.tsx"],
          J = { require: c, loadChunk: () => Promise.resolve() },
          K = new d.AppPageRouteModule({
            definition: {
              kind: e.RouteKind.APP_PAGE,
              page: "/(protected)/uploads/page",
              pathname: "/uploads",
              bundlePath: "",
              filename: "",
              appPaths: [],
            },
            userland: { loaderTree: H },
            distDir: ".next",
            relativeProjectDir: "",
          });
        async function L(a, b, d) {
          var C;
          let G = "/(protected)/uploads/page";
          "/index" === G && (G = "/");
          let M = (0, h.getRequestMeta)(a, "postponed"),
            N = (0, h.getRequestMeta)(a, "minimalMode"),
            O = await K.prepare(a, b, { srcPage: G, multiZoneDraftMode: !1 });
          if (!O)
            return (
              (b.statusCode = 400),
              b.end("Bad Request"),
              null == d.waitUntil || d.waitUntil.call(d, Promise.resolve()),
              null
            );
          let {
              buildId: P,
              query: Q,
              params: R,
              parsedUrl: S,
              pageIsDynamic: T,
              buildManifest: U,
              nextFontManifest: V,
              reactLoadableManifest: W,
              serverActionsManifest: X,
              clientReferenceManifest: Y,
              subresourceIntegrityManifest: Z,
              prerenderManifest: $,
              isDraftMode: _,
              resolvedPathname: aa,
              revalidateOnlyGenerated: ab,
              routerServerContext: ac,
              nextConfig: ad,
              interceptionRoutePatterns: ae,
            } = O,
            af = S.pathname || "/",
            ag = (0, r.normalizeAppPath)(G),
            { isOnDemandRevalidate: ah } = O,
            ai = K.match(af, $),
            aj = !!$.routes[aa],
            ak = !!(ai || aj || $.routes[ag]),
            al = a.headers["user-agent"] || "",
            am = (0, u.getBotType)(al),
            an = (0, p.isHtmlBotRequest)(a),
            ao =
              (0, h.getRequestMeta)(a, "isPrefetchRSCRequest") ??
              "1" === a.headers[t.NEXT_ROUTER_PREFETCH_HEADER],
            ap =
              (0, h.getRequestMeta)(a, "isRSCRequest") ??
              !!a.headers[t.RSC_HEADER],
            aq = (0, s.getIsPossibleServerAction)(a),
            ar =
              (0, m.checkIsAppPPREnabled)(ad.experimental.ppr) &&
              (null == (C = $.routes[ag] ?? $.dynamicRoutes[ag])
                ? void 0
                : C.renderingMode) === "PARTIALLY_STATIC",
            as = !1,
            at = !1,
            au = ar ? M : void 0,
            av = ar && ap && !ao,
            aw = (0, h.getRequestMeta)(a, "segmentPrefetchRSCRequest"),
            ax =
              !al ||
              (0, p.shouldServeStreamingMetadata)(al, ad.htmlLimitedBots);
          an && ar && ((ak = !1), (ax = !1));
          let ay = !0 === K.isDev || !ak || "string" == typeof M || av,
            az = an && ar,
            aA = null;
          _ || !ak || ay || aq || au || av || (aA = aa);
          let aB = aA;
          (!aB && K.isDev && (aB = aa),
            K.isDev || _ || !ak || !ap || av || (0, k.d)(a.headers));
          let aC = {
            ...E,
            tree: H,
            pages: I,
            GlobalError: D(),
            handler: L,
            routeModule: K,
            __next_app__: J,
          };
          X &&
            Y &&
            (0, o.setReferenceManifestsSingleton)({
              page: G,
              clientReferenceManifest: Y,
              serverActionsManifest: X,
              serverModuleMap: (0, q.createServerModuleMap)({
                serverActionsManifest: X,
              }),
            });
          let aD = a.method || "GET",
            aE = (0, g.getTracer)(),
            aF = aE.getActiveScopeSpan();
          try {
            let f = K.getVaryHeader(aa, ae);
            b.setHeader("Vary", f);
            let k = async (c, d) => {
                let e = new l.NodeNextRequest(a),
                  f = new l.NodeNextResponse(b);
                return K.render(e, f, d).finally(() => {
                  if (!c) return;
                  c.setAttributes({
                    "http.status_code": b.statusCode,
                    "next.rsc": !1,
                  });
                  let d = aE.getRootSpanAttributes();
                  if (!d) return;
                  if (
                    d.get("next.span_type") !== i.BaseServerSpan.handleRequest
                  )
                    return void console.warn(
                      `Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`,
                    );
                  let e = d.get("next.route");
                  if (e) {
                    let a = `${aD} ${e}`;
                    (c.setAttributes({
                      "next.route": e,
                      "http.route": e,
                      "next.span_name": a,
                    }),
                      c.updateName(a));
                  } else c.updateName(`${aD} ${a.url}`);
                });
              },
              m = async ({ span: e, postponed: f, fallbackRouteParams: g }) => {
                let i = {
                    query: Q,
                    params: R,
                    page: ag,
                    sharedContext: { buildId: P },
                    serverComponentsHmrCache: (0, h.getRequestMeta)(
                      a,
                      "serverComponentsHmrCache",
                    ),
                    fallbackRouteParams: g,
                    renderOpts: {
                      App: () => null,
                      Document: () => null,
                      pageConfig: {},
                      ComponentMod: aC,
                      Component: (0, j.T)(aC),
                      params: R,
                      routeModule: K,
                      page: G,
                      postponed: f,
                      shouldWaitOnAllReady: az,
                      serveStreamingMetadata: ax,
                      supportsDynamicResponse: "string" == typeof f || ay,
                      buildManifest: U,
                      nextFontManifest: V,
                      reactLoadableManifest: W,
                      subresourceIntegrityManifest: Z,
                      serverActionsManifest: X,
                      clientReferenceManifest: Y,
                      setIsrStatus: null == ac ? void 0 : ac.setIsrStatus,
                      dir: c(33873).join(process.cwd(), K.relativeProjectDir),
                      isDraftMode: _,
                      isRevalidate: ak && !f && !av,
                      botType: am,
                      isOnDemandRevalidate: ah,
                      isPossibleServerAction: aq,
                      assetPrefix: ad.assetPrefix,
                      nextConfigOutput: ad.output,
                      crossOrigin: ad.crossOrigin,
                      trailingSlash: ad.trailingSlash,
                      previewProps: $.preview,
                      deploymentId: ad.deploymentId,
                      enableTainting: ad.experimental.taint,
                      htmlLimitedBots: ad.htmlLimitedBots,
                      devtoolSegmentExplorer:
                        ad.experimental.devtoolSegmentExplorer,
                      reactMaxHeadersLength: ad.reactMaxHeadersLength,
                      multiZoneDraftMode: !1,
                      incrementalCache: (0, h.getRequestMeta)(
                        a,
                        "incrementalCache",
                      ),
                      cacheLifeProfiles: ad.experimental.cacheLife,
                      basePath: ad.basePath,
                      serverActions: ad.experimental.serverActions,
                      ...(as
                        ? {
                            nextExport: !0,
                            supportsDynamicResponse: !1,
                            isStaticGeneration: !0,
                            isRevalidate: !0,
                            isDebugDynamicAccesses: as,
                          }
                        : {}),
                      experimental: {
                        isRoutePPREnabled: ar,
                        expireTime: ad.expireTime,
                        staleTimes: ad.experimental.staleTimes,
                        cacheComponents: !!ad.experimental.cacheComponents,
                        clientSegmentCache:
                          !!ad.experimental.clientSegmentCache,
                        clientParamParsing:
                          !!ad.experimental.clientParamParsing,
                        dynamicOnHover: !!ad.experimental.dynamicOnHover,
                        inlineCss: !!ad.experimental.inlineCss,
                        authInterrupts: !!ad.experimental.authInterrupts,
                        clientTraceMetadata:
                          ad.experimental.clientTraceMetadata || [],
                      },
                      waitUntil: d.waitUntil,
                      onClose: (a) => {
                        b.on("close", a);
                      },
                      onAfterTaskError: () => {},
                      onInstrumentationRequestError: (b, c, d) =>
                        K.onRequestError(a, b, d, ac),
                      err: (0, h.getRequestMeta)(a, "invokeError"),
                      dev: K.isDev,
                    },
                  },
                  l = await k(e, i),
                  { metadata: m } = l,
                  { cacheControl: n, headers: o = {}, fetchTags: p } = m;
                if (
                  (p && (o[y.NEXT_CACHE_TAGS_HEADER] = p),
                  (a.fetchMetrics = m.fetchMetrics),
                  ak &&
                    (null == n ? void 0 : n.revalidate) === 0 &&
                    !K.isDev &&
                    !ar)
                ) {
                  let a = m.staticBailoutInfo,
                    b = Object.defineProperty(
                      Error(`Page changed from static to dynamic at runtime ${aa}${(null == a ? void 0 : a.description) ? `, reason: ${a.description}` : ""}
see more here https://nextjs.org/docs/messages/app-static-to-dynamic-error`),
                      "__NEXT_ERROR_CODE",
                      { value: "E132", enumerable: !1, configurable: !0 },
                    );
                  if (null == a ? void 0 : a.stack) {
                    let c = a.stack;
                    b.stack = b.message + c.substring(c.indexOf("\n"));
                  }
                  throw b;
                }
                return {
                  value: {
                    kind: v.CachedRouteKind.APP_PAGE,
                    html: l,
                    headers: o,
                    rscData: m.flightData,
                    postponed: m.postponed,
                    status: m.statusCode,
                    segmentData: m.segmentData,
                  },
                  cacheControl: n,
                };
              },
              o = async ({
                hasResolved: c,
                previousCacheEntry: f,
                isRevalidating: g,
                span: i,
              }) => {
                let j,
                  k = !1 === K.isDev,
                  l = c || b.writableEnded;
                if (ah && ab && !f && !N)
                  return (
                    (null == ac ? void 0 : ac.render404)
                      ? await ac.render404(a, b)
                      : ((b.statusCode = 404),
                        b.end("This page could not be found")),
                    null
                  );
                if (
                  (ai && (j = (0, w.parseFallbackField)(ai.fallback)),
                  j === w.FallbackMode.PRERENDER &&
                    (0, u.isBot)(al) &&
                    (!ar || an) &&
                    (j = w.FallbackMode.BLOCKING_STATIC_RENDER),
                  (null == f ? void 0 : f.isStale) === -1 && (ah = !0),
                  ah &&
                    (j !== w.FallbackMode.NOT_FOUND || f) &&
                    (j = w.FallbackMode.BLOCKING_STATIC_RENDER),
                  !N &&
                    j !== w.FallbackMode.BLOCKING_STATIC_RENDER &&
                    aB &&
                    !l &&
                    !_ &&
                    T &&
                    (k || !aj))
                ) {
                  let b;
                  if ((k || ai) && j === w.FallbackMode.NOT_FOUND)
                    throw new B.NoFallbackError();
                  if (ar && !ap) {
                    let c =
                      "string" == typeof (null == ai ? void 0 : ai.fallback)
                        ? ai.fallback
                        : k
                          ? ag
                          : null;
                    if (
                      ((b = await K.handleResponse({
                        cacheKey: c,
                        req: a,
                        nextConfig: ad,
                        routeKind: e.RouteKind.APP_PAGE,
                        isFallback: !0,
                        prerenderManifest: $,
                        isRoutePPREnabled: ar,
                        responseGenerator: async () =>
                          m({
                            span: i,
                            postponed: void 0,
                            fallbackRouteParams: k || at ? (0, n.u)(ag) : null,
                          }),
                        waitUntil: d.waitUntil,
                      })),
                      null === b)
                    )
                      return null;
                    if (b) return (delete b.cacheControl, b);
                  }
                }
                let o = ah || g || !au ? void 0 : au;
                if (as && void 0 !== o)
                  return {
                    cacheControl: { revalidate: 1, expire: void 0 },
                    value: {
                      kind: v.CachedRouteKind.PAGES,
                      html: x.default.EMPTY,
                      pageData: {},
                      headers: void 0,
                      status: void 0,
                    },
                  };
                let p =
                  T &&
                  ar &&
                  ((0, h.getRequestMeta)(a, "renderFallbackShell") || at)
                    ? (0, n.u)(af)
                    : null;
                return m({ span: i, postponed: o, fallbackRouteParams: p });
              },
              p = async (c) => {
                var f, g, i, j, k;
                let l,
                  n = await K.handleResponse({
                    cacheKey: aA,
                    responseGenerator: (a) => o({ span: c, ...a }),
                    routeKind: e.RouteKind.APP_PAGE,
                    isOnDemandRevalidate: ah,
                    isRoutePPREnabled: ar,
                    req: a,
                    nextConfig: ad,
                    prerenderManifest: $,
                    waitUntil: d.waitUntil,
                  });
                if (
                  (_ &&
                    b.setHeader(
                      "Cache-Control",
                      "private, no-cache, no-store, max-age=0, must-revalidate",
                    ),
                  K.isDev &&
                    b.setHeader("Cache-Control", "no-store, must-revalidate"),
                  !n)
                ) {
                  if (aA)
                    throw Object.defineProperty(
                      Error(
                        "invariant: cache entry required but not generated",
                      ),
                      "__NEXT_ERROR_CODE",
                      { value: "E62", enumerable: !1, configurable: !0 },
                    );
                  return null;
                }
                if (
                  (null == (f = n.value) ? void 0 : f.kind) !==
                  v.CachedRouteKind.APP_PAGE
                )
                  throw Object.defineProperty(
                    Error(
                      `Invariant app-page handler received invalid cache entry ${null == (i = n.value) ? void 0 : i.kind}`,
                    ),
                    "__NEXT_ERROR_CODE",
                    { value: "E707", enumerable: !1, configurable: !0 },
                  );
                let p = "string" == typeof n.value.postponed;
                ak &&
                  !av &&
                  (!p || ao) &&
                  (N ||
                    b.setHeader(
                      "x-nextjs-cache",
                      ah
                        ? "REVALIDATED"
                        : n.isMiss
                          ? "MISS"
                          : n.isStale
                            ? "STALE"
                            : "HIT",
                    ),
                  b.setHeader(t.NEXT_IS_PRERENDER_HEADER, "1"));
                let { value: q } = n;
                if (au) l = { revalidate: 0, expire: void 0 };
                else if (N && ap && !ao && ar)
                  l = { revalidate: 0, expire: void 0 };
                else if (!K.isDev)
                  if (_) l = { revalidate: 0, expire: void 0 };
                  else if (ak) {
                    if (n.cacheControl)
                      if ("number" == typeof n.cacheControl.revalidate) {
                        if (n.cacheControl.revalidate < 1)
                          throw Object.defineProperty(
                            Error(
                              `Invalid revalidate configuration provided: ${n.cacheControl.revalidate} < 1`,
                            ),
                            "__NEXT_ERROR_CODE",
                            { value: "E22", enumerable: !1, configurable: !0 },
                          );
                        l = {
                          revalidate: n.cacheControl.revalidate,
                          expire:
                            (null == (j = n.cacheControl)
                              ? void 0
                              : j.expire) ?? ad.expireTime,
                        };
                      } else
                        l = { revalidate: y.CACHE_ONE_YEAR, expire: void 0 };
                  } else
                    b.getHeader("Cache-Control") ||
                      (l = { revalidate: 0, expire: void 0 });
                if (
                  ((n.cacheControl = l),
                  "string" == typeof aw &&
                    (null == q ? void 0 : q.kind) ===
                      v.CachedRouteKind.APP_PAGE &&
                    q.segmentData)
                ) {
                  b.setHeader(t.NEXT_DID_POSTPONE_HEADER, "2");
                  let c =
                    null == (k = q.headers)
                      ? void 0
                      : k[y.NEXT_CACHE_TAGS_HEADER];
                  N &&
                    ak &&
                    c &&
                    "string" == typeof c &&
                    b.setHeader(y.NEXT_CACHE_TAGS_HEADER, c);
                  let d = q.segmentData.get(aw);
                  return void 0 !== d
                    ? (0, A.sendRenderResult)({
                        req: a,
                        res: b,
                        generateEtags: ad.generateEtags,
                        poweredByHeader: ad.poweredByHeader,
                        result: x.default.fromStatic(
                          d,
                          t.RSC_CONTENT_TYPE_HEADER,
                        ),
                        cacheControl: n.cacheControl,
                      })
                    : ((b.statusCode = 204),
                      (0, A.sendRenderResult)({
                        req: a,
                        res: b,
                        generateEtags: ad.generateEtags,
                        poweredByHeader: ad.poweredByHeader,
                        result: x.default.EMPTY,
                        cacheControl: n.cacheControl,
                      }));
                }
                let r = (0, h.getRequestMeta)(a, "onCacheEntry");
                if (
                  r &&
                  (await r(
                    { ...n, value: { ...n.value, kind: "PAGE" } },
                    { url: (0, h.getRequestMeta)(a, "initURL") },
                  ))
                )
                  return null;
                if (p && au)
                  throw Object.defineProperty(
                    Error(
                      "Invariant: postponed state should not be present on a resume request",
                    ),
                    "__NEXT_ERROR_CODE",
                    { value: "E396", enumerable: !1, configurable: !0 },
                  );
                if (q.headers) {
                  let a = { ...q.headers };
                  for (let [c, d] of ((N && ak) ||
                    delete a[y.NEXT_CACHE_TAGS_HEADER],
                  Object.entries(a)))
                    if (void 0 !== d)
                      if (Array.isArray(d))
                        for (let a of d) b.appendHeader(c, a);
                      else
                        ("number" == typeof d && (d = d.toString()),
                          b.appendHeader(c, d));
                }
                let s =
                  null == (g = q.headers)
                    ? void 0
                    : g[y.NEXT_CACHE_TAGS_HEADER];
                if (
                  (N &&
                    ak &&
                    s &&
                    "string" == typeof s &&
                    b.setHeader(y.NEXT_CACHE_TAGS_HEADER, s),
                  !q.status || (ap && ar) || (b.statusCode = q.status),
                  !N &&
                    q.status &&
                    F.RedirectStatusCode[q.status] &&
                    ap &&
                    (b.statusCode = 200),
                  p && b.setHeader(t.NEXT_DID_POSTPONE_HEADER, "1"),
                  ap && !_)
                ) {
                  if (void 0 === q.rscData) {
                    if (q.postponed)
                      throw Object.defineProperty(
                        Error("Invariant: Expected postponed to be undefined"),
                        "__NEXT_ERROR_CODE",
                        { value: "E372", enumerable: !1, configurable: !0 },
                      );
                    return (0, A.sendRenderResult)({
                      req: a,
                      res: b,
                      generateEtags: ad.generateEtags,
                      poweredByHeader: ad.poweredByHeader,
                      result: q.html,
                      cacheControl: av
                        ? { revalidate: 0, expire: void 0 }
                        : n.cacheControl,
                    });
                  }
                  return (0, A.sendRenderResult)({
                    req: a,
                    res: b,
                    generateEtags: ad.generateEtags,
                    poweredByHeader: ad.poweredByHeader,
                    result: x.default.fromStatic(
                      q.rscData,
                      t.RSC_CONTENT_TYPE_HEADER,
                    ),
                    cacheControl: n.cacheControl,
                  });
                }
                let u = q.html;
                if (!p || N || ap)
                  return (0, A.sendRenderResult)({
                    req: a,
                    res: b,
                    generateEtags: ad.generateEtags,
                    poweredByHeader: ad.poweredByHeader,
                    result: u,
                    cacheControl: n.cacheControl,
                  });
                if (as)
                  return (
                    u.push(
                      new ReadableStream({
                        start(a) {
                          (a.enqueue(z.ENCODED_TAGS.CLOSED.BODY_AND_HTML),
                            a.close());
                        },
                      }),
                    ),
                    (0, A.sendRenderResult)({
                      req: a,
                      res: b,
                      generateEtags: ad.generateEtags,
                      poweredByHeader: ad.poweredByHeader,
                      result: u,
                      cacheControl: { revalidate: 0, expire: void 0 },
                    })
                  );
                let w = new TransformStream();
                return (
                  u.push(w.readable),
                  m({
                    span: c,
                    postponed: q.postponed,
                    fallbackRouteParams: null,
                  })
                    .then(async (a) => {
                      var b, c;
                      if (!a)
                        throw Object.defineProperty(
                          Error("Invariant: expected a result to be returned"),
                          "__NEXT_ERROR_CODE",
                          { value: "E463", enumerable: !1, configurable: !0 },
                        );
                      if (
                        (null == (b = a.value) ? void 0 : b.kind) !==
                        v.CachedRouteKind.APP_PAGE
                      )
                        throw Object.defineProperty(
                          Error(
                            `Invariant: expected a page response, got ${null == (c = a.value) ? void 0 : c.kind}`,
                          ),
                          "__NEXT_ERROR_CODE",
                          { value: "E305", enumerable: !1, configurable: !0 },
                        );
                      await a.value.html.pipeTo(w.writable);
                    })
                    .catch((a) => {
                      w.writable.abort(a).catch((a) => {
                        console.error("couldn't abort transformer", a);
                      });
                    }),
                  (0, A.sendRenderResult)({
                    req: a,
                    res: b,
                    generateEtags: ad.generateEtags,
                    poweredByHeader: ad.poweredByHeader,
                    result: u,
                    cacheControl: { revalidate: 0, expire: void 0 },
                  })
                );
              };
            if (!aF)
              return await aE.withPropagatedContext(a.headers, () =>
                aE.trace(
                  i.BaseServerSpan.handleRequest,
                  {
                    spanName: `${aD} ${a.url}`,
                    kind: g.SpanKind.SERVER,
                    attributes: { "http.method": aD, "http.target": a.url },
                  },
                  p,
                ),
              );
            await p(aF);
          } catch (b) {
            throw (
              aF ||
                b instanceof B.NoFallbackError ||
                (await K.onRequestError(
                  a,
                  b,
                  {
                    routerKind: "App Router",
                    routePath: G,
                    routeType: "render",
                    revalidateReason: (0, f.c)({
                      isRevalidate: ak,
                      isOnDemandRevalidate: ah,
                    }),
                  },
                  ac,
                )),
              b
            );
          }
        }
      },
      92885: (a, b, c) => {
        (Promise.resolve().then(c.bind(c, 42187)),
          Promise.resolve().then(c.bind(c, 87965)),
          Promise.resolve().then(c.bind(c, 76251)));
      },
      96057: (a, b, c) => {
        "use strict";
        c.d(b, { AppAnalytics: () => f });
        var d = c(80742);
        c(30311);
        var e = c(65935);
        function f() {
          return (0, d.jsx)(e.j, {});
        }
      },
      96482: (a, b, c) => {
        "use strict";
        (c.r(b), c.d(b, { default: () => ag }));
        var d = c(80742),
          e = c(30311),
          f = c(97728);
        function g(a, b, c, d) {
          return new (c || (c = Promise))(function (e, f) {
            function g(a) {
              try {
                i(d.next(a));
              } catch (a) {
                f(a);
              }
            }
            function h(a) {
              try {
                i(d.throw(a));
              } catch (a) {
                f(a);
              }
            }
            function i(a) {
              var b;
              a.done
                ? e(a.value)
                : ((b = a.value) instanceof c
                    ? b
                    : new c(function (a) {
                        a(b);
                      })
                  ).then(g, h);
            }
            i((d = d.apply(a, b || [])).next());
          });
        }
        Object.create;
        (Object.create,
          "function" == typeof SuppressedError && SuppressedError);
        let h = new Map([
          ["1km", "application/vnd.1000minds.decision-model+xml"],
          ["3dml", "text/vnd.in3d.3dml"],
          ["3ds", "image/x-3ds"],
          ["3g2", "video/3gpp2"],
          ["3gp", "video/3gp"],
          ["3gpp", "video/3gpp"],
          ["3mf", "model/3mf"],
          ["7z", "application/x-7z-compressed"],
          ["7zip", "application/x-7z-compressed"],
          ["123", "application/vnd.lotus-1-2-3"],
          ["aab", "application/x-authorware-bin"],
          ["aac", "audio/x-acc"],
          ["aam", "application/x-authorware-map"],
          ["aas", "application/x-authorware-seg"],
          ["abw", "application/x-abiword"],
          ["ac", "application/vnd.nokia.n-gage.ac+xml"],
          ["ac3", "audio/ac3"],
          ["acc", "application/vnd.americandynamics.acc"],
          ["ace", "application/x-ace-compressed"],
          ["acu", "application/vnd.acucobol"],
          ["acutc", "application/vnd.acucorp"],
          ["adp", "audio/adpcm"],
          ["aep", "application/vnd.audiograph"],
          ["afm", "application/x-font-type1"],
          ["afp", "application/vnd.ibm.modcap"],
          ["ahead", "application/vnd.ahead.space"],
          ["ai", "application/pdf"],
          ["aif", "audio/x-aiff"],
          ["aifc", "audio/x-aiff"],
          ["aiff", "audio/x-aiff"],
          [
            "air",
            "application/vnd.adobe.air-application-installer-package+zip",
          ],
          ["ait", "application/vnd.dvb.ait"],
          ["ami", "application/vnd.amiga.ami"],
          ["amr", "audio/amr"],
          ["apk", "application/vnd.android.package-archive"],
          ["apng", "image/apng"],
          ["appcache", "text/cache-manifest"],
          ["application", "application/x-ms-application"],
          ["apr", "application/vnd.lotus-approach"],
          ["arc", "application/x-freearc"],
          ["arj", "application/x-arj"],
          ["asc", "application/pgp-signature"],
          ["asf", "video/x-ms-asf"],
          ["asm", "text/x-asm"],
          ["aso", "application/vnd.accpac.simply.aso"],
          ["asx", "video/x-ms-asf"],
          ["atc", "application/vnd.acucorp"],
          ["atom", "application/atom+xml"],
          ["atomcat", "application/atomcat+xml"],
          ["atomdeleted", "application/atomdeleted+xml"],
          ["atomsvc", "application/atomsvc+xml"],
          ["atx", "application/vnd.antix.game-component"],
          ["au", "audio/x-au"],
          ["avi", "video/x-msvideo"],
          ["avif", "image/avif"],
          ["aw", "application/applixware"],
          ["azf", "application/vnd.airzip.filesecure.azf"],
          ["azs", "application/vnd.airzip.filesecure.azs"],
          ["azv", "image/vnd.airzip.accelerator.azv"],
          ["azw", "application/vnd.amazon.ebook"],
          ["b16", "image/vnd.pco.b16"],
          ["bat", "application/x-msdownload"],
          ["bcpio", "application/x-bcpio"],
          ["bdf", "application/x-font-bdf"],
          ["bdm", "application/vnd.syncml.dm+wbxml"],
          ["bdoc", "application/x-bdoc"],
          ["bed", "application/vnd.realvnc.bed"],
          ["bh2", "application/vnd.fujitsu.oasysprs"],
          ["bin", "application/octet-stream"],
          ["blb", "application/x-blorb"],
          ["blorb", "application/x-blorb"],
          ["bmi", "application/vnd.bmi"],
          ["bmml", "application/vnd.balsamiq.bmml+xml"],
          ["bmp", "image/bmp"],
          ["book", "application/vnd.framemaker"],
          ["box", "application/vnd.previewsystems.box"],
          ["boz", "application/x-bzip2"],
          ["bpk", "application/octet-stream"],
          ["bpmn", "application/octet-stream"],
          ["bsp", "model/vnd.valve.source.compiled-map"],
          ["btif", "image/prs.btif"],
          ["buffer", "application/octet-stream"],
          ["bz", "application/x-bzip"],
          ["bz2", "application/x-bzip2"],
          ["c", "text/x-c"],
          ["c4d", "application/vnd.clonk.c4group"],
          ["c4f", "application/vnd.clonk.c4group"],
          ["c4g", "application/vnd.clonk.c4group"],
          ["c4p", "application/vnd.clonk.c4group"],
          ["c4u", "application/vnd.clonk.c4group"],
          ["c11amc", "application/vnd.cluetrust.cartomobile-config"],
          ["c11amz", "application/vnd.cluetrust.cartomobile-config-pkg"],
          ["cab", "application/vnd.ms-cab-compressed"],
          ["caf", "audio/x-caf"],
          ["cap", "application/vnd.tcpdump.pcap"],
          ["car", "application/vnd.curl.car"],
          ["cat", "application/vnd.ms-pki.seccat"],
          ["cb7", "application/x-cbr"],
          ["cba", "application/x-cbr"],
          ["cbr", "application/x-cbr"],
          ["cbt", "application/x-cbr"],
          ["cbz", "application/x-cbr"],
          ["cc", "text/x-c"],
          ["cco", "application/x-cocoa"],
          ["cct", "application/x-director"],
          ["ccxml", "application/ccxml+xml"],
          ["cdbcmsg", "application/vnd.contact.cmsg"],
          ["cda", "application/x-cdf"],
          ["cdf", "application/x-netcdf"],
          ["cdfx", "application/cdfx+xml"],
          ["cdkey", "application/vnd.mediastation.cdkey"],
          ["cdmia", "application/cdmi-capability"],
          ["cdmic", "application/cdmi-container"],
          ["cdmid", "application/cdmi-domain"],
          ["cdmio", "application/cdmi-object"],
          ["cdmiq", "application/cdmi-queue"],
          ["cdr", "application/cdr"],
          ["cdx", "chemical/x-cdx"],
          ["cdxml", "application/vnd.chemdraw+xml"],
          ["cdy", "application/vnd.cinderella"],
          ["cer", "application/pkix-cert"],
          ["cfs", "application/x-cfs-compressed"],
          ["cgm", "image/cgm"],
          ["chat", "application/x-chat"],
          ["chm", "application/vnd.ms-htmlhelp"],
          ["chrt", "application/vnd.kde.kchart"],
          ["cif", "chemical/x-cif"],
          ["cii", "application/vnd.anser-web-certificate-issue-initiation"],
          ["cil", "application/vnd.ms-artgalry"],
          ["cjs", "application/node"],
          ["cla", "application/vnd.claymore"],
          ["class", "application/octet-stream"],
          ["clkk", "application/vnd.crick.clicker.keyboard"],
          ["clkp", "application/vnd.crick.clicker.palette"],
          ["clkt", "application/vnd.crick.clicker.template"],
          ["clkw", "application/vnd.crick.clicker.wordbank"],
          ["clkx", "application/vnd.crick.clicker"],
          ["clp", "application/x-msclip"],
          ["cmc", "application/vnd.cosmocaller"],
          ["cmdf", "chemical/x-cmdf"],
          ["cml", "chemical/x-cml"],
          ["cmp", "application/vnd.yellowriver-custom-menu"],
          ["cmx", "image/x-cmx"],
          ["cod", "application/vnd.rim.cod"],
          ["coffee", "text/coffeescript"],
          ["com", "application/x-msdownload"],
          ["conf", "text/plain"],
          ["cpio", "application/x-cpio"],
          ["cpp", "text/x-c"],
          ["cpt", "application/mac-compactpro"],
          ["crd", "application/x-mscardfile"],
          ["crl", "application/pkix-crl"],
          ["crt", "application/x-x509-ca-cert"],
          ["crx", "application/x-chrome-extension"],
          ["cryptonote", "application/vnd.rig.cryptonote"],
          ["csh", "application/x-csh"],
          ["csl", "application/vnd.citationstyles.style+xml"],
          ["csml", "chemical/x-csml"],
          ["csp", "application/vnd.commonspace"],
          ["csr", "application/octet-stream"],
          ["css", "text/css"],
          ["cst", "application/x-director"],
          ["csv", "text/csv"],
          ["cu", "application/cu-seeme"],
          ["curl", "text/vnd.curl"],
          ["cww", "application/prs.cww"],
          ["cxt", "application/x-director"],
          ["cxx", "text/x-c"],
          ["dae", "model/vnd.collada+xml"],
          ["daf", "application/vnd.mobius.daf"],
          ["dart", "application/vnd.dart"],
          ["dataless", "application/vnd.fdsn.seed"],
          ["davmount", "application/davmount+xml"],
          ["dbf", "application/vnd.dbf"],
          ["dbk", "application/docbook+xml"],
          ["dcr", "application/x-director"],
          ["dcurl", "text/vnd.curl.dcurl"],
          ["dd2", "application/vnd.oma.dd2+xml"],
          ["ddd", "application/vnd.fujixerox.ddd"],
          ["ddf", "application/vnd.syncml.dmddf+xml"],
          ["dds", "image/vnd.ms-dds"],
          ["deb", "application/x-debian-package"],
          ["def", "text/plain"],
          ["deploy", "application/octet-stream"],
          ["der", "application/x-x509-ca-cert"],
          ["dfac", "application/vnd.dreamfactory"],
          ["dgc", "application/x-dgc-compressed"],
          ["dic", "text/x-c"],
          ["dir", "application/x-director"],
          ["dis", "application/vnd.mobius.dis"],
          ["disposition-notification", "message/disposition-notification"],
          ["dist", "application/octet-stream"],
          ["distz", "application/octet-stream"],
          ["djv", "image/vnd.djvu"],
          ["djvu", "image/vnd.djvu"],
          ["dll", "application/octet-stream"],
          ["dmg", "application/x-apple-diskimage"],
          ["dmn", "application/octet-stream"],
          ["dmp", "application/vnd.tcpdump.pcap"],
          ["dms", "application/octet-stream"],
          ["dna", "application/vnd.dna"],
          ["doc", "application/msword"],
          ["docm", "application/vnd.ms-word.template.macroEnabled.12"],
          [
            "docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          ["dot", "application/msword"],
          ["dotm", "application/vnd.ms-word.template.macroEnabled.12"],
          [
            "dotx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
          ],
          ["dp", "application/vnd.osgi.dp"],
          ["dpg", "application/vnd.dpgraph"],
          ["dra", "audio/vnd.dra"],
          ["drle", "image/dicom-rle"],
          ["dsc", "text/prs.lines.tag"],
          ["dssc", "application/dssc+der"],
          ["dtb", "application/x-dtbook+xml"],
          ["dtd", "application/xml-dtd"],
          ["dts", "audio/vnd.dts"],
          ["dtshd", "audio/vnd.dts.hd"],
          ["dump", "application/octet-stream"],
          ["dvb", "video/vnd.dvb.file"],
          ["dvi", "application/x-dvi"],
          ["dwd", "application/atsc-dwd+xml"],
          ["dwf", "model/vnd.dwf"],
          ["dwg", "image/vnd.dwg"],
          ["dxf", "image/vnd.dxf"],
          ["dxp", "application/vnd.spotfire.dxp"],
          ["dxr", "application/x-director"],
          ["ear", "application/java-archive"],
          ["ecelp4800", "audio/vnd.nuera.ecelp4800"],
          ["ecelp7470", "audio/vnd.nuera.ecelp7470"],
          ["ecelp9600", "audio/vnd.nuera.ecelp9600"],
          ["ecma", "application/ecmascript"],
          ["edm", "application/vnd.novadigm.edm"],
          ["edx", "application/vnd.novadigm.edx"],
          ["efif", "application/vnd.picsel"],
          ["ei6", "application/vnd.pg.osasli"],
          ["elc", "application/octet-stream"],
          ["emf", "image/emf"],
          ["eml", "message/rfc822"],
          ["emma", "application/emma+xml"],
          ["emotionml", "application/emotionml+xml"],
          ["emz", "application/x-msmetafile"],
          ["eol", "audio/vnd.digital-winds"],
          ["eot", "application/vnd.ms-fontobject"],
          ["eps", "application/postscript"],
          ["epub", "application/epub+zip"],
          ["es", "application/ecmascript"],
          ["es3", "application/vnd.eszigno3+xml"],
          ["esa", "application/vnd.osgi.subsystem"],
          ["esf", "application/vnd.epson.esf"],
          ["et3", "application/vnd.eszigno3+xml"],
          ["etx", "text/x-setext"],
          ["eva", "application/x-eva"],
          ["evy", "application/x-envoy"],
          ["exe", "application/octet-stream"],
          ["exi", "application/exi"],
          ["exp", "application/express"],
          ["exr", "image/aces"],
          ["ext", "application/vnd.novadigm.ext"],
          ["ez", "application/andrew-inset"],
          ["ez2", "application/vnd.ezpix-album"],
          ["ez3", "application/vnd.ezpix-package"],
          ["f", "text/x-fortran"],
          ["f4v", "video/mp4"],
          ["f77", "text/x-fortran"],
          ["f90", "text/x-fortran"],
          ["fbs", "image/vnd.fastbidsheet"],
          ["fcdt", "application/vnd.adobe.formscentral.fcdt"],
          ["fcs", "application/vnd.isac.fcs"],
          ["fdf", "application/vnd.fdf"],
          ["fdt", "application/fdt+xml"],
          ["fe_launch", "application/vnd.denovo.fcselayout-link"],
          ["fg5", "application/vnd.fujitsu.oasysgp"],
          ["fgd", "application/x-director"],
          ["fh", "image/x-freehand"],
          ["fh4", "image/x-freehand"],
          ["fh5", "image/x-freehand"],
          ["fh7", "image/x-freehand"],
          ["fhc", "image/x-freehand"],
          ["fig", "application/x-xfig"],
          ["fits", "image/fits"],
          ["flac", "audio/x-flac"],
          ["fli", "video/x-fli"],
          ["flo", "application/vnd.micrografx.flo"],
          ["flv", "video/x-flv"],
          ["flw", "application/vnd.kde.kivio"],
          ["flx", "text/vnd.fmi.flexstor"],
          ["fly", "text/vnd.fly"],
          ["fm", "application/vnd.framemaker"],
          ["fnc", "application/vnd.frogans.fnc"],
          ["fo", "application/vnd.software602.filler.form+xml"],
          ["for", "text/x-fortran"],
          ["fpx", "image/vnd.fpx"],
          ["frame", "application/vnd.framemaker"],
          ["fsc", "application/vnd.fsc.weblaunch"],
          ["fst", "image/vnd.fst"],
          ["ftc", "application/vnd.fluxtime.clip"],
          ["fti", "application/vnd.anser-web-funds-transfer-initiation"],
          ["fvt", "video/vnd.fvt"],
          ["fxp", "application/vnd.adobe.fxp"],
          ["fxpl", "application/vnd.adobe.fxp"],
          ["fzs", "application/vnd.fuzzysheet"],
          ["g2w", "application/vnd.geoplan"],
          ["g3", "image/g3fax"],
          ["g3w", "application/vnd.geospace"],
          ["gac", "application/vnd.groove-account"],
          ["gam", "application/x-tads"],
          ["gbr", "application/rpki-ghostbusters"],
          ["gca", "application/x-gca-compressed"],
          ["gdl", "model/vnd.gdl"],
          ["gdoc", "application/vnd.google-apps.document"],
          ["geo", "application/vnd.dynageo"],
          ["geojson", "application/geo+json"],
          ["gex", "application/vnd.geometry-explorer"],
          ["ggb", "application/vnd.geogebra.file"],
          ["ggt", "application/vnd.geogebra.tool"],
          ["ghf", "application/vnd.groove-help"],
          ["gif", "image/gif"],
          ["gim", "application/vnd.groove-identity-message"],
          ["glb", "model/gltf-binary"],
          ["gltf", "model/gltf+json"],
          ["gml", "application/gml+xml"],
          ["gmx", "application/vnd.gmx"],
          ["gnumeric", "application/x-gnumeric"],
          ["gpg", "application/gpg-keys"],
          ["gph", "application/vnd.flographit"],
          ["gpx", "application/gpx+xml"],
          ["gqf", "application/vnd.grafeq"],
          ["gqs", "application/vnd.grafeq"],
          ["gram", "application/srgs"],
          ["gramps", "application/x-gramps-xml"],
          ["gre", "application/vnd.geometry-explorer"],
          ["grv", "application/vnd.groove-injector"],
          ["grxml", "application/srgs+xml"],
          ["gsf", "application/x-font-ghostscript"],
          ["gsheet", "application/vnd.google-apps.spreadsheet"],
          ["gslides", "application/vnd.google-apps.presentation"],
          ["gtar", "application/x-gtar"],
          ["gtm", "application/vnd.groove-tool-message"],
          ["gtw", "model/vnd.gtw"],
          ["gv", "text/vnd.graphviz"],
          ["gxf", "application/gxf"],
          ["gxt", "application/vnd.geonext"],
          ["gz", "application/gzip"],
          ["gzip", "application/gzip"],
          ["h", "text/x-c"],
          ["h261", "video/h261"],
          ["h263", "video/h263"],
          ["h264", "video/h264"],
          ["hal", "application/vnd.hal+xml"],
          ["hbci", "application/vnd.hbci"],
          ["hbs", "text/x-handlebars-template"],
          ["hdd", "application/x-virtualbox-hdd"],
          ["hdf", "application/x-hdf"],
          ["heic", "image/heic"],
          ["heics", "image/heic-sequence"],
          ["heif", "image/heif"],
          ["heifs", "image/heif-sequence"],
          ["hej2", "image/hej2k"],
          ["held", "application/atsc-held+xml"],
          ["hh", "text/x-c"],
          ["hjson", "application/hjson"],
          ["hlp", "application/winhlp"],
          ["hpgl", "application/vnd.hp-hpgl"],
          ["hpid", "application/vnd.hp-hpid"],
          ["hps", "application/vnd.hp-hps"],
          ["hqx", "application/mac-binhex40"],
          ["hsj2", "image/hsj2"],
          ["htc", "text/x-component"],
          ["htke", "application/vnd.kenameaapp"],
          ["htm", "text/html"],
          ["html", "text/html"],
          ["hvd", "application/vnd.yamaha.hv-dic"],
          ["hvp", "application/vnd.yamaha.hv-voice"],
          ["hvs", "application/vnd.yamaha.hv-script"],
          ["i2g", "application/vnd.intergeo"],
          ["icc", "application/vnd.iccprofile"],
          ["ice", "x-conference/x-cooltalk"],
          ["icm", "application/vnd.iccprofile"],
          ["ico", "image/x-icon"],
          ["ics", "text/calendar"],
          ["ief", "image/ief"],
          ["ifb", "text/calendar"],
          ["ifm", "application/vnd.shana.informed.formdata"],
          ["iges", "model/iges"],
          ["igl", "application/vnd.igloader"],
          ["igm", "application/vnd.insors.igm"],
          ["igs", "model/iges"],
          ["igx", "application/vnd.micrografx.igx"],
          ["iif", "application/vnd.shana.informed.interchange"],
          ["img", "application/octet-stream"],
          ["imp", "application/vnd.accpac.simply.imp"],
          ["ims", "application/vnd.ms-ims"],
          ["in", "text/plain"],
          ["ini", "text/plain"],
          ["ink", "application/inkml+xml"],
          ["inkml", "application/inkml+xml"],
          ["install", "application/x-install-instructions"],
          ["iota", "application/vnd.astraea-software.iota"],
          ["ipfix", "application/ipfix"],
          ["ipk", "application/vnd.shana.informed.package"],
          ["irm", "application/vnd.ibm.rights-management"],
          ["irp", "application/vnd.irepository.package+xml"],
          ["iso", "application/x-iso9660-image"],
          ["itp", "application/vnd.shana.informed.formtemplate"],
          ["its", "application/its+xml"],
          ["ivp", "application/vnd.immervision-ivp"],
          ["ivu", "application/vnd.immervision-ivu"],
          ["jad", "text/vnd.sun.j2me.app-descriptor"],
          ["jade", "text/jade"],
          ["jam", "application/vnd.jam"],
          ["jar", "application/java-archive"],
          ["jardiff", "application/x-java-archive-diff"],
          ["java", "text/x-java-source"],
          ["jhc", "image/jphc"],
          ["jisp", "application/vnd.jisp"],
          ["jls", "image/jls"],
          ["jlt", "application/vnd.hp-jlyt"],
          ["jng", "image/x-jng"],
          ["jnlp", "application/x-java-jnlp-file"],
          ["joda", "application/vnd.joost.joda-archive"],
          ["jp2", "image/jp2"],
          ["jpe", "image/jpeg"],
          ["jpeg", "image/jpeg"],
          ["jpf", "image/jpx"],
          ["jpg", "image/jpeg"],
          ["jpg2", "image/jp2"],
          ["jpgm", "video/jpm"],
          ["jpgv", "video/jpeg"],
          ["jph", "image/jph"],
          ["jpm", "video/jpm"],
          ["jpx", "image/jpx"],
          ["js", "application/javascript"],
          ["json", "application/json"],
          ["json5", "application/json5"],
          ["jsonld", "application/ld+json"],
          ["jsonl", "application/jsonl"],
          ["jsonml", "application/jsonml+json"],
          ["jsx", "text/jsx"],
          ["jxr", "image/jxr"],
          ["jxra", "image/jxra"],
          ["jxrs", "image/jxrs"],
          ["jxs", "image/jxs"],
          ["jxsc", "image/jxsc"],
          ["jxsi", "image/jxsi"],
          ["jxss", "image/jxss"],
          ["kar", "audio/midi"],
          ["karbon", "application/vnd.kde.karbon"],
          ["kdb", "application/octet-stream"],
          ["kdbx", "application/x-keepass2"],
          ["key", "application/x-iwork-keynote-sffkey"],
          ["kfo", "application/vnd.kde.kformula"],
          ["kia", "application/vnd.kidspiration"],
          ["kml", "application/vnd.google-earth.kml+xml"],
          ["kmz", "application/vnd.google-earth.kmz"],
          ["kne", "application/vnd.kinar"],
          ["knp", "application/vnd.kinar"],
          ["kon", "application/vnd.kde.kontour"],
          ["kpr", "application/vnd.kde.kpresenter"],
          ["kpt", "application/vnd.kde.kpresenter"],
          ["kpxx", "application/vnd.ds-keypoint"],
          ["ksp", "application/vnd.kde.kspread"],
          ["ktr", "application/vnd.kahootz"],
          ["ktx", "image/ktx"],
          ["ktx2", "image/ktx2"],
          ["ktz", "application/vnd.kahootz"],
          ["kwd", "application/vnd.kde.kword"],
          ["kwt", "application/vnd.kde.kword"],
          ["lasxml", "application/vnd.las.las+xml"],
          ["latex", "application/x-latex"],
          ["lbd", "application/vnd.llamagraphics.life-balance.desktop"],
          ["lbe", "application/vnd.llamagraphics.life-balance.exchange+xml"],
          ["les", "application/vnd.hhe.lesson-player"],
          ["less", "text/less"],
          ["lgr", "application/lgr+xml"],
          ["lha", "application/octet-stream"],
          ["link66", "application/vnd.route66.link66+xml"],
          ["list", "text/plain"],
          ["list3820", "application/vnd.ibm.modcap"],
          ["listafp", "application/vnd.ibm.modcap"],
          ["litcoffee", "text/coffeescript"],
          ["lnk", "application/x-ms-shortcut"],
          ["log", "text/plain"],
          ["lostxml", "application/lost+xml"],
          ["lrf", "application/octet-stream"],
          ["lrm", "application/vnd.ms-lrm"],
          ["ltf", "application/vnd.frogans.ltf"],
          ["lua", "text/x-lua"],
          ["luac", "application/x-lua-bytecode"],
          ["lvp", "audio/vnd.lucent.voice"],
          ["lwp", "application/vnd.lotus-wordpro"],
          ["lzh", "application/octet-stream"],
          ["m1v", "video/mpeg"],
          ["m2a", "audio/mpeg"],
          ["m2v", "video/mpeg"],
          ["m3a", "audio/mpeg"],
          ["m3u", "text/plain"],
          ["m3u8", "application/vnd.apple.mpegurl"],
          ["m4a", "audio/x-m4a"],
          ["m4p", "application/mp4"],
          ["m4s", "video/iso.segment"],
          ["m4u", "application/vnd.mpegurl"],
          ["m4v", "video/x-m4v"],
          ["m13", "application/x-msmediaview"],
          ["m14", "application/x-msmediaview"],
          ["m21", "application/mp21"],
          ["ma", "application/mathematica"],
          ["mads", "application/mads+xml"],
          ["maei", "application/mmt-aei+xml"],
          ["mag", "application/vnd.ecowin.chart"],
          ["maker", "application/vnd.framemaker"],
          ["man", "text/troff"],
          ["manifest", "text/cache-manifest"],
          ["map", "application/json"],
          ["mar", "application/octet-stream"],
          ["markdown", "text/markdown"],
          ["mathml", "application/mathml+xml"],
          ["mb", "application/mathematica"],
          ["mbk", "application/vnd.mobius.mbk"],
          ["mbox", "application/mbox"],
          ["mc1", "application/vnd.medcalcdata"],
          ["mcd", "application/vnd.mcd"],
          ["mcurl", "text/vnd.curl.mcurl"],
          ["md", "text/markdown"],
          ["mdb", "application/x-msaccess"],
          ["mdi", "image/vnd.ms-modi"],
          ["mdx", "text/mdx"],
          ["me", "text/troff"],
          ["mesh", "model/mesh"],
          ["meta4", "application/metalink4+xml"],
          ["metalink", "application/metalink+xml"],
          ["mets", "application/mets+xml"],
          ["mfm", "application/vnd.mfmp"],
          ["mft", "application/rpki-manifest"],
          ["mgp", "application/vnd.osgeo.mapguide.package"],
          ["mgz", "application/vnd.proteus.magazine"],
          ["mid", "audio/midi"],
          ["midi", "audio/midi"],
          ["mie", "application/x-mie"],
          ["mif", "application/vnd.mif"],
          ["mime", "message/rfc822"],
          ["mj2", "video/mj2"],
          ["mjp2", "video/mj2"],
          ["mjs", "application/javascript"],
          ["mk3d", "video/x-matroska"],
          ["mka", "audio/x-matroska"],
          ["mkd", "text/x-markdown"],
          ["mks", "video/x-matroska"],
          ["mkv", "video/x-matroska"],
          ["mlp", "application/vnd.dolby.mlp"],
          ["mmd", "application/vnd.chipnuts.karaoke-mmd"],
          ["mmf", "application/vnd.smaf"],
          ["mml", "text/mathml"],
          ["mmr", "image/vnd.fujixerox.edmics-mmr"],
          ["mng", "video/x-mng"],
          ["mny", "application/x-msmoney"],
          ["mobi", "application/x-mobipocket-ebook"],
          ["mods", "application/mods+xml"],
          ["mov", "video/quicktime"],
          ["movie", "video/x-sgi-movie"],
          ["mp2", "audio/mpeg"],
          ["mp2a", "audio/mpeg"],
          ["mp3", "audio/mpeg"],
          ["mp4", "video/mp4"],
          ["mp4a", "audio/mp4"],
          ["mp4s", "application/mp4"],
          ["mp4v", "video/mp4"],
          ["mp21", "application/mp21"],
          ["mpc", "application/vnd.mophun.certificate"],
          ["mpd", "application/dash+xml"],
          ["mpe", "video/mpeg"],
          ["mpeg", "video/mpeg"],
          ["mpg", "video/mpeg"],
          ["mpg4", "video/mp4"],
          ["mpga", "audio/mpeg"],
          ["mpkg", "application/vnd.apple.installer+xml"],
          ["mpm", "application/vnd.blueice.multipass"],
          ["mpn", "application/vnd.mophun.application"],
          ["mpp", "application/vnd.ms-project"],
          ["mpt", "application/vnd.ms-project"],
          ["mpy", "application/vnd.ibm.minipay"],
          ["mqy", "application/vnd.mobius.mqy"],
          ["mrc", "application/marc"],
          ["mrcx", "application/marcxml+xml"],
          ["ms", "text/troff"],
          ["mscml", "application/mediaservercontrol+xml"],
          ["mseed", "application/vnd.fdsn.mseed"],
          ["mseq", "application/vnd.mseq"],
          ["msf", "application/vnd.epson.msf"],
          ["msg", "application/vnd.ms-outlook"],
          ["msh", "model/mesh"],
          ["msi", "application/x-msdownload"],
          ["msl", "application/vnd.mobius.msl"],
          ["msm", "application/octet-stream"],
          ["msp", "application/octet-stream"],
          ["msty", "application/vnd.muvee.style"],
          ["mtl", "model/mtl"],
          ["mts", "model/vnd.mts"],
          ["mus", "application/vnd.musician"],
          ["musd", "application/mmt-usd+xml"],
          ["musicxml", "application/vnd.recordare.musicxml+xml"],
          ["mvb", "application/x-msmediaview"],
          ["mvt", "application/vnd.mapbox-vector-tile"],
          ["mwf", "application/vnd.mfer"],
          ["mxf", "application/mxf"],
          ["mxl", "application/vnd.recordare.musicxml"],
          ["mxmf", "audio/mobile-xmf"],
          ["mxml", "application/xv+xml"],
          ["mxs", "application/vnd.triscape.mxs"],
          ["mxu", "video/vnd.mpegurl"],
          ["n-gage", "application/vnd.nokia.n-gage.symbian.install"],
          ["n3", "text/n3"],
          ["nb", "application/mathematica"],
          ["nbp", "application/vnd.wolfram.player"],
          ["nc", "application/x-netcdf"],
          ["ncx", "application/x-dtbncx+xml"],
          ["nfo", "text/x-nfo"],
          ["ngdat", "application/vnd.nokia.n-gage.data"],
          ["nitf", "application/vnd.nitf"],
          ["nlu", "application/vnd.neurolanguage.nlu"],
          ["nml", "application/vnd.enliven"],
          ["nnd", "application/vnd.noblenet-directory"],
          ["nns", "application/vnd.noblenet-sealer"],
          ["nnw", "application/vnd.noblenet-web"],
          ["npx", "image/vnd.net-fpx"],
          ["nq", "application/n-quads"],
          ["nsc", "application/x-conference"],
          ["nsf", "application/vnd.lotus-notes"],
          ["nt", "application/n-triples"],
          ["ntf", "application/vnd.nitf"],
          ["numbers", "application/x-iwork-numbers-sffnumbers"],
          ["nzb", "application/x-nzb"],
          ["oa2", "application/vnd.fujitsu.oasys2"],
          ["oa3", "application/vnd.fujitsu.oasys3"],
          ["oas", "application/vnd.fujitsu.oasys"],
          ["obd", "application/x-msbinder"],
          ["obgx", "application/vnd.openblox.game+xml"],
          ["obj", "model/obj"],
          ["oda", "application/oda"],
          ["odb", "application/vnd.oasis.opendocument.database"],
          ["odc", "application/vnd.oasis.opendocument.chart"],
          ["odf", "application/vnd.oasis.opendocument.formula"],
          ["odft", "application/vnd.oasis.opendocument.formula-template"],
          ["odg", "application/vnd.oasis.opendocument.graphics"],
          ["odi", "application/vnd.oasis.opendocument.image"],
          ["odm", "application/vnd.oasis.opendocument.text-master"],
          ["odp", "application/vnd.oasis.opendocument.presentation"],
          ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
          ["odt", "application/vnd.oasis.opendocument.text"],
          ["oga", "audio/ogg"],
          ["ogex", "model/vnd.opengex"],
          ["ogg", "audio/ogg"],
          ["ogv", "video/ogg"],
          ["ogx", "application/ogg"],
          ["omdoc", "application/omdoc+xml"],
          ["onepkg", "application/onenote"],
          ["onetmp", "application/onenote"],
          ["onetoc", "application/onenote"],
          ["onetoc2", "application/onenote"],
          ["opf", "application/oebps-package+xml"],
          ["opml", "text/x-opml"],
          ["oprc", "application/vnd.palm"],
          ["opus", "audio/ogg"],
          ["org", "text/x-org"],
          ["osf", "application/vnd.yamaha.openscoreformat"],
          ["osfpvg", "application/vnd.yamaha.openscoreformat.osfpvg+xml"],
          ["osm", "application/vnd.openstreetmap.data+xml"],
          ["otc", "application/vnd.oasis.opendocument.chart-template"],
          ["otf", "font/otf"],
          ["otg", "application/vnd.oasis.opendocument.graphics-template"],
          ["oth", "application/vnd.oasis.opendocument.text-web"],
          ["oti", "application/vnd.oasis.opendocument.image-template"],
          ["otp", "application/vnd.oasis.opendocument.presentation-template"],
          ["ots", "application/vnd.oasis.opendocument.spreadsheet-template"],
          ["ott", "application/vnd.oasis.opendocument.text-template"],
          ["ova", "application/x-virtualbox-ova"],
          ["ovf", "application/x-virtualbox-ovf"],
          ["owl", "application/rdf+xml"],
          ["oxps", "application/oxps"],
          ["oxt", "application/vnd.openofficeorg.extension"],
          ["p", "text/x-pascal"],
          ["p7a", "application/x-pkcs7-signature"],
          ["p7b", "application/x-pkcs7-certificates"],
          ["p7c", "application/pkcs7-mime"],
          ["p7m", "application/pkcs7-mime"],
          ["p7r", "application/x-pkcs7-certreqresp"],
          ["p7s", "application/pkcs7-signature"],
          ["p8", "application/pkcs8"],
          ["p10", "application/x-pkcs10"],
          ["p12", "application/x-pkcs12"],
          ["pac", "application/x-ns-proxy-autoconfig"],
          ["pages", "application/x-iwork-pages-sffpages"],
          ["pas", "text/x-pascal"],
          ["paw", "application/vnd.pawaafile"],
          ["pbd", "application/vnd.powerbuilder6"],
          ["pbm", "image/x-portable-bitmap"],
          ["pcap", "application/vnd.tcpdump.pcap"],
          ["pcf", "application/x-font-pcf"],
          ["pcl", "application/vnd.hp-pcl"],
          ["pclxl", "application/vnd.hp-pclxl"],
          ["pct", "image/x-pict"],
          ["pcurl", "application/vnd.curl.pcurl"],
          ["pcx", "image/x-pcx"],
          ["pdb", "application/x-pilot"],
          ["pde", "text/x-processing"],
          ["pdf", "application/pdf"],
          ["pem", "application/x-x509-user-cert"],
          ["pfa", "application/x-font-type1"],
          ["pfb", "application/x-font-type1"],
          ["pfm", "application/x-font-type1"],
          ["pfr", "application/font-tdpfr"],
          ["pfx", "application/x-pkcs12"],
          ["pgm", "image/x-portable-graymap"],
          ["pgn", "application/x-chess-pgn"],
          ["pgp", "application/pgp"],
          ["php", "application/x-httpd-php"],
          ["php3", "application/x-httpd-php"],
          ["php4", "application/x-httpd-php"],
          ["phps", "application/x-httpd-php-source"],
          ["phtml", "application/x-httpd-php"],
          ["pic", "image/x-pict"],
          ["pkg", "application/octet-stream"],
          ["pki", "application/pkixcmp"],
          ["pkipath", "application/pkix-pkipath"],
          ["pkpass", "application/vnd.apple.pkpass"],
          ["pl", "application/x-perl"],
          ["plb", "application/vnd.3gpp.pic-bw-large"],
          ["plc", "application/vnd.mobius.plc"],
          ["plf", "application/vnd.pocketlearn"],
          ["pls", "application/pls+xml"],
          ["pm", "application/x-perl"],
          ["pml", "application/vnd.ctc-posml"],
          ["png", "image/png"],
          ["pnm", "image/x-portable-anymap"],
          ["portpkg", "application/vnd.macports.portpkg"],
          ["pot", "application/vnd.ms-powerpoint"],
          [
            "potm",
            "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
          ],
          [
            "potx",
            "application/vnd.openxmlformats-officedocument.presentationml.template",
          ],
          ["ppa", "application/vnd.ms-powerpoint"],
          ["ppam", "application/vnd.ms-powerpoint.addin.macroEnabled.12"],
          ["ppd", "application/vnd.cups-ppd"],
          ["ppm", "image/x-portable-pixmap"],
          ["pps", "application/vnd.ms-powerpoint"],
          ["ppsm", "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"],
          [
            "ppsx",
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
          ],
          ["ppt", "application/powerpoint"],
          [
            "pptm",
            "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
          ],
          [
            "pptx",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          ],
          ["pqa", "application/vnd.palm"],
          ["prc", "application/x-pilot"],
          ["pre", "application/vnd.lotus-freelance"],
          ["prf", "application/pics-rules"],
          ["provx", "application/provenance+xml"],
          ["ps", "application/postscript"],
          ["psb", "application/vnd.3gpp.pic-bw-small"],
          ["psd", "application/x-photoshop"],
          ["psf", "application/x-font-linux-psf"],
          ["pskcxml", "application/pskc+xml"],
          ["pti", "image/prs.pti"],
          ["ptid", "application/vnd.pvi.ptid1"],
          ["pub", "application/x-mspublisher"],
          ["pvb", "application/vnd.3gpp.pic-bw-var"],
          ["pwn", "application/vnd.3m.post-it-notes"],
          ["pya", "audio/vnd.ms-playready.media.pya"],
          ["pyv", "video/vnd.ms-playready.media.pyv"],
          ["qam", "application/vnd.epson.quickanime"],
          ["qbo", "application/vnd.intu.qbo"],
          ["qfx", "application/vnd.intu.qfx"],
          ["qps", "application/vnd.publishare-delta-tree"],
          ["qt", "video/quicktime"],
          ["qwd", "application/vnd.quark.quarkxpress"],
          ["qwt", "application/vnd.quark.quarkxpress"],
          ["qxb", "application/vnd.quark.quarkxpress"],
          ["qxd", "application/vnd.quark.quarkxpress"],
          ["qxl", "application/vnd.quark.quarkxpress"],
          ["qxt", "application/vnd.quark.quarkxpress"],
          ["ra", "audio/x-realaudio"],
          ["ram", "audio/x-pn-realaudio"],
          ["raml", "application/raml+yaml"],
          ["rapd", "application/route-apd+xml"],
          ["rar", "application/x-rar"],
          ["ras", "image/x-cmu-raster"],
          ["rcprofile", "application/vnd.ipunplugged.rcprofile"],
          ["rdf", "application/rdf+xml"],
          ["rdz", "application/vnd.data-vision.rdz"],
          ["relo", "application/p2p-overlay+xml"],
          ["rep", "application/vnd.businessobjects"],
          ["res", "application/x-dtbresource+xml"],
          ["rgb", "image/x-rgb"],
          ["rif", "application/reginfo+xml"],
          ["rip", "audio/vnd.rip"],
          ["ris", "application/x-research-info-systems"],
          ["rl", "application/resource-lists+xml"],
          ["rlc", "image/vnd.fujixerox.edmics-rlc"],
          ["rld", "application/resource-lists-diff+xml"],
          ["rm", "audio/x-pn-realaudio"],
          ["rmi", "audio/midi"],
          ["rmp", "audio/x-pn-realaudio-plugin"],
          ["rms", "application/vnd.jcp.javame.midlet-rms"],
          ["rmvb", "application/vnd.rn-realmedia-vbr"],
          ["rnc", "application/relax-ng-compact-syntax"],
          ["rng", "application/xml"],
          ["roa", "application/rpki-roa"],
          ["roff", "text/troff"],
          ["rp9", "application/vnd.cloanto.rp9"],
          ["rpm", "audio/x-pn-realaudio-plugin"],
          ["rpss", "application/vnd.nokia.radio-presets"],
          ["rpst", "application/vnd.nokia.radio-preset"],
          ["rq", "application/sparql-query"],
          ["rs", "application/rls-services+xml"],
          ["rsa", "application/x-pkcs7"],
          ["rsat", "application/atsc-rsat+xml"],
          ["rsd", "application/rsd+xml"],
          ["rsheet", "application/urc-ressheet+xml"],
          ["rss", "application/rss+xml"],
          ["rtf", "text/rtf"],
          ["rtx", "text/richtext"],
          ["run", "application/x-makeself"],
          ["rusd", "application/route-usd+xml"],
          ["rv", "video/vnd.rn-realvideo"],
          ["s", "text/x-asm"],
          ["s3m", "audio/s3m"],
          ["saf", "application/vnd.yamaha.smaf-audio"],
          ["sass", "text/x-sass"],
          ["sbml", "application/sbml+xml"],
          ["sc", "application/vnd.ibm.secure-container"],
          ["scd", "application/x-msschedule"],
          ["scm", "application/vnd.lotus-screencam"],
          ["scq", "application/scvp-cv-request"],
          ["scs", "application/scvp-cv-response"],
          ["scss", "text/x-scss"],
          ["scurl", "text/vnd.curl.scurl"],
          ["sda", "application/vnd.stardivision.draw"],
          ["sdc", "application/vnd.stardivision.calc"],
          ["sdd", "application/vnd.stardivision.impress"],
          ["sdkd", "application/vnd.solent.sdkm+xml"],
          ["sdkm", "application/vnd.solent.sdkm+xml"],
          ["sdp", "application/sdp"],
          ["sdw", "application/vnd.stardivision.writer"],
          ["sea", "application/octet-stream"],
          ["see", "application/vnd.seemail"],
          ["seed", "application/vnd.fdsn.seed"],
          ["sema", "application/vnd.sema"],
          ["semd", "application/vnd.semd"],
          ["semf", "application/vnd.semf"],
          ["senmlx", "application/senml+xml"],
          ["sensmlx", "application/sensml+xml"],
          ["ser", "application/java-serialized-object"],
          ["setpay", "application/set-payment-initiation"],
          ["setreg", "application/set-registration-initiation"],
          ["sfd-hdstx", "application/vnd.hydrostatix.sof-data"],
          ["sfs", "application/vnd.spotfire.sfs"],
          ["sfv", "text/x-sfv"],
          ["sgi", "image/sgi"],
          ["sgl", "application/vnd.stardivision.writer-global"],
          ["sgm", "text/sgml"],
          ["sgml", "text/sgml"],
          ["sh", "application/x-sh"],
          ["shar", "application/x-shar"],
          ["shex", "text/shex"],
          ["shf", "application/shf+xml"],
          ["shtml", "text/html"],
          ["sid", "image/x-mrsid-image"],
          ["sieve", "application/sieve"],
          ["sig", "application/pgp-signature"],
          ["sil", "audio/silk"],
          ["silo", "model/mesh"],
          ["sis", "application/vnd.symbian.install"],
          ["sisx", "application/vnd.symbian.install"],
          ["sit", "application/x-stuffit"],
          ["sitx", "application/x-stuffitx"],
          ["siv", "application/sieve"],
          ["skd", "application/vnd.koan"],
          ["skm", "application/vnd.koan"],
          ["skp", "application/vnd.koan"],
          ["skt", "application/vnd.koan"],
          ["sldm", "application/vnd.ms-powerpoint.slide.macroenabled.12"],
          [
            "sldx",
            "application/vnd.openxmlformats-officedocument.presentationml.slide",
          ],
          ["slim", "text/slim"],
          ["slm", "text/slim"],
          ["sls", "application/route-s-tsid+xml"],
          ["slt", "application/vnd.epson.salt"],
          ["sm", "application/vnd.stepmania.stepchart"],
          ["smf", "application/vnd.stardivision.math"],
          ["smi", "application/smil"],
          ["smil", "application/smil"],
          ["smv", "video/x-smv"],
          ["smzip", "application/vnd.stepmania.package"],
          ["snd", "audio/basic"],
          ["snf", "application/x-font-snf"],
          ["so", "application/octet-stream"],
          ["spc", "application/x-pkcs7-certificates"],
          ["spdx", "text/spdx"],
          ["spf", "application/vnd.yamaha.smaf-phrase"],
          ["spl", "application/x-futuresplash"],
          ["spot", "text/vnd.in3d.spot"],
          ["spp", "application/scvp-vp-response"],
          ["spq", "application/scvp-vp-request"],
          ["spx", "audio/ogg"],
          ["sql", "application/x-sql"],
          ["src", "application/x-wais-source"],
          ["srt", "application/x-subrip"],
          ["sru", "application/sru+xml"],
          ["srx", "application/sparql-results+xml"],
          ["ssdl", "application/ssdl+xml"],
          ["sse", "application/vnd.kodak-descriptor"],
          ["ssf", "application/vnd.epson.ssf"],
          ["ssml", "application/ssml+xml"],
          ["sst", "application/octet-stream"],
          ["st", "application/vnd.sailingtracker.track"],
          ["stc", "application/vnd.sun.xml.calc.template"],
          ["std", "application/vnd.sun.xml.draw.template"],
          ["stf", "application/vnd.wt.stf"],
          ["sti", "application/vnd.sun.xml.impress.template"],
          ["stk", "application/hyperstudio"],
          ["stl", "model/stl"],
          ["stpx", "model/step+xml"],
          ["stpxz", "model/step-xml+zip"],
          ["stpz", "model/step+zip"],
          ["str", "application/vnd.pg.format"],
          ["stw", "application/vnd.sun.xml.writer.template"],
          ["styl", "text/stylus"],
          ["stylus", "text/stylus"],
          ["sub", "text/vnd.dvb.subtitle"],
          ["sus", "application/vnd.sus-calendar"],
          ["susp", "application/vnd.sus-calendar"],
          ["sv4cpio", "application/x-sv4cpio"],
          ["sv4crc", "application/x-sv4crc"],
          ["svc", "application/vnd.dvb.service"],
          ["svd", "application/vnd.svd"],
          ["svg", "image/svg+xml"],
          ["svgz", "image/svg+xml"],
          ["swa", "application/x-director"],
          ["swf", "application/x-shockwave-flash"],
          ["swi", "application/vnd.aristanetworks.swi"],
          ["swidtag", "application/swid+xml"],
          ["sxc", "application/vnd.sun.xml.calc"],
          ["sxd", "application/vnd.sun.xml.draw"],
          ["sxg", "application/vnd.sun.xml.writer.global"],
          ["sxi", "application/vnd.sun.xml.impress"],
          ["sxm", "application/vnd.sun.xml.math"],
          ["sxw", "application/vnd.sun.xml.writer"],
          ["t", "text/troff"],
          ["t3", "application/x-t3vm-image"],
          ["t38", "image/t38"],
          ["taglet", "application/vnd.mynfc"],
          ["tao", "application/vnd.tao.intent-module-archive"],
          ["tap", "image/vnd.tencent.tap"],
          ["tar", "application/x-tar"],
          ["tcap", "application/vnd.3gpp2.tcap"],
          ["tcl", "application/x-tcl"],
          ["td", "application/urc-targetdesc+xml"],
          ["teacher", "application/vnd.smart.teacher"],
          ["tei", "application/tei+xml"],
          ["teicorpus", "application/tei+xml"],
          ["tex", "application/x-tex"],
          ["texi", "application/x-texinfo"],
          ["texinfo", "application/x-texinfo"],
          ["text", "text/plain"],
          ["tfi", "application/thraud+xml"],
          ["tfm", "application/x-tex-tfm"],
          ["tfx", "image/tiff-fx"],
          ["tga", "image/x-tga"],
          ["tgz", "application/x-tar"],
          ["thmx", "application/vnd.ms-officetheme"],
          ["tif", "image/tiff"],
          ["tiff", "image/tiff"],
          ["tk", "application/x-tcl"],
          ["tmo", "application/vnd.tmobile-livetv"],
          ["toml", "application/toml"],
          ["torrent", "application/x-bittorrent"],
          ["tpl", "application/vnd.groove-tool-template"],
          ["tpt", "application/vnd.trid.tpt"],
          ["tr", "text/troff"],
          ["tra", "application/vnd.trueapp"],
          ["trig", "application/trig"],
          ["trm", "application/x-msterminal"],
          ["ts", "video/mp2t"],
          ["tsd", "application/timestamped-data"],
          ["tsv", "text/tab-separated-values"],
          ["ttc", "font/collection"],
          ["ttf", "font/ttf"],
          ["ttl", "text/turtle"],
          ["ttml", "application/ttml+xml"],
          ["twd", "application/vnd.simtech-mindmapper"],
          ["twds", "application/vnd.simtech-mindmapper"],
          ["txd", "application/vnd.genomatix.tuxedo"],
          ["txf", "application/vnd.mobius.txf"],
          ["txt", "text/plain"],
          ["u8dsn", "message/global-delivery-status"],
          ["u8hdr", "message/global-headers"],
          ["u8mdn", "message/global-disposition-notification"],
          ["u8msg", "message/global"],
          ["u32", "application/x-authorware-bin"],
          ["ubj", "application/ubjson"],
          ["udeb", "application/x-debian-package"],
          ["ufd", "application/vnd.ufdl"],
          ["ufdl", "application/vnd.ufdl"],
          ["ulx", "application/x-glulx"],
          ["umj", "application/vnd.umajin"],
          ["unityweb", "application/vnd.unity"],
          ["uoml", "application/vnd.uoml+xml"],
          ["uri", "text/uri-list"],
          ["uris", "text/uri-list"],
          ["urls", "text/uri-list"],
          ["usdz", "model/vnd.usdz+zip"],
          ["ustar", "application/x-ustar"],
          ["utz", "application/vnd.uiq.theme"],
          ["uu", "text/x-uuencode"],
          ["uva", "audio/vnd.dece.audio"],
          ["uvd", "application/vnd.dece.data"],
          ["uvf", "application/vnd.dece.data"],
          ["uvg", "image/vnd.dece.graphic"],
          ["uvh", "video/vnd.dece.hd"],
          ["uvi", "image/vnd.dece.graphic"],
          ["uvm", "video/vnd.dece.mobile"],
          ["uvp", "video/vnd.dece.pd"],
          ["uvs", "video/vnd.dece.sd"],
          ["uvt", "application/vnd.dece.ttml+xml"],
          ["uvu", "video/vnd.uvvu.mp4"],
          ["uvv", "video/vnd.dece.video"],
          ["uvva", "audio/vnd.dece.audio"],
          ["uvvd", "application/vnd.dece.data"],
          ["uvvf", "application/vnd.dece.data"],
          ["uvvg", "image/vnd.dece.graphic"],
          ["uvvh", "video/vnd.dece.hd"],
          ["uvvi", "image/vnd.dece.graphic"],
          ["uvvm", "video/vnd.dece.mobile"],
          ["uvvp", "video/vnd.dece.pd"],
          ["uvvs", "video/vnd.dece.sd"],
          ["uvvt", "application/vnd.dece.ttml+xml"],
          ["uvvu", "video/vnd.uvvu.mp4"],
          ["uvvv", "video/vnd.dece.video"],
          ["uvvx", "application/vnd.dece.unspecified"],
          ["uvvz", "application/vnd.dece.zip"],
          ["uvx", "application/vnd.dece.unspecified"],
          ["uvz", "application/vnd.dece.zip"],
          ["vbox", "application/x-virtualbox-vbox"],
          ["vbox-extpack", "application/x-virtualbox-vbox-extpack"],
          ["vcard", "text/vcard"],
          ["vcd", "application/x-cdlink"],
          ["vcf", "text/x-vcard"],
          ["vcg", "application/vnd.groove-vcard"],
          ["vcs", "text/x-vcalendar"],
          ["vcx", "application/vnd.vcx"],
          ["vdi", "application/x-virtualbox-vdi"],
          ["vds", "model/vnd.sap.vds"],
          ["vhd", "application/x-virtualbox-vhd"],
          ["vis", "application/vnd.visionary"],
          ["viv", "video/vnd.vivo"],
          ["vlc", "application/videolan"],
          ["vmdk", "application/x-virtualbox-vmdk"],
          ["vob", "video/x-ms-vob"],
          ["vor", "application/vnd.stardivision.writer"],
          ["vox", "application/x-authorware-bin"],
          ["vrml", "model/vrml"],
          ["vsd", "application/vnd.visio"],
          ["vsf", "application/vnd.vsf"],
          ["vss", "application/vnd.visio"],
          ["vst", "application/vnd.visio"],
          ["vsw", "application/vnd.visio"],
          ["vtf", "image/vnd.valve.source.texture"],
          ["vtt", "text/vtt"],
          ["vtu", "model/vnd.vtu"],
          ["vxml", "application/voicexml+xml"],
          ["w3d", "application/x-director"],
          ["wad", "application/x-doom"],
          ["wadl", "application/vnd.sun.wadl+xml"],
          ["war", "application/java-archive"],
          ["wasm", "application/wasm"],
          ["wav", "audio/x-wav"],
          ["wax", "audio/x-ms-wax"],
          ["wbmp", "image/vnd.wap.wbmp"],
          ["wbs", "application/vnd.criticaltools.wbs+xml"],
          ["wbxml", "application/wbxml"],
          ["wcm", "application/vnd.ms-works"],
          ["wdb", "application/vnd.ms-works"],
          ["wdp", "image/vnd.ms-photo"],
          ["weba", "audio/webm"],
          ["webapp", "application/x-web-app-manifest+json"],
          ["webm", "video/webm"],
          ["webmanifest", "application/manifest+json"],
          ["webp", "image/webp"],
          ["wg", "application/vnd.pmi.widget"],
          ["wgt", "application/widget"],
          ["wks", "application/vnd.ms-works"],
          ["wm", "video/x-ms-wm"],
          ["wma", "audio/x-ms-wma"],
          ["wmd", "application/x-ms-wmd"],
          ["wmf", "image/wmf"],
          ["wml", "text/vnd.wap.wml"],
          ["wmlc", "application/wmlc"],
          ["wmls", "text/vnd.wap.wmlscript"],
          ["wmlsc", "application/vnd.wap.wmlscriptc"],
          ["wmv", "video/x-ms-wmv"],
          ["wmx", "video/x-ms-wmx"],
          ["wmz", "application/x-msmetafile"],
          ["woff", "font/woff"],
          ["woff2", "font/woff2"],
          ["word", "application/msword"],
          ["wpd", "application/vnd.wordperfect"],
          ["wpl", "application/vnd.ms-wpl"],
          ["wps", "application/vnd.ms-works"],
          ["wqd", "application/vnd.wqd"],
          ["wri", "application/x-mswrite"],
          ["wrl", "model/vrml"],
          ["wsc", "message/vnd.wfa.wsc"],
          ["wsdl", "application/wsdl+xml"],
          ["wspolicy", "application/wspolicy+xml"],
          ["wtb", "application/vnd.webturbo"],
          ["wvx", "video/x-ms-wvx"],
          ["x3d", "model/x3d+xml"],
          ["x3db", "model/x3d+fastinfoset"],
          ["x3dbz", "model/x3d+binary"],
          ["x3dv", "model/x3d-vrml"],
          ["x3dvz", "model/x3d+vrml"],
          ["x3dz", "model/x3d+xml"],
          ["x32", "application/x-authorware-bin"],
          ["x_b", "model/vnd.parasolid.transmit.binary"],
          ["x_t", "model/vnd.parasolid.transmit.text"],
          ["xaml", "application/xaml+xml"],
          ["xap", "application/x-silverlight-app"],
          ["xar", "application/vnd.xara"],
          ["xav", "application/xcap-att+xml"],
          ["xbap", "application/x-ms-xbap"],
          ["xbd", "application/vnd.fujixerox.docuworks.binder"],
          ["xbm", "image/x-xbitmap"],
          ["xca", "application/xcap-caps+xml"],
          ["xcs", "application/calendar+xml"],
          ["xdf", "application/xcap-diff+xml"],
          ["xdm", "application/vnd.syncml.dm+xml"],
          ["xdp", "application/vnd.adobe.xdp+xml"],
          ["xdssc", "application/dssc+xml"],
          ["xdw", "application/vnd.fujixerox.docuworks"],
          ["xel", "application/xcap-el+xml"],
          ["xenc", "application/xenc+xml"],
          ["xer", "application/patch-ops-error+xml"],
          ["xfdf", "application/vnd.adobe.xfdf"],
          ["xfdl", "application/vnd.xfdl"],
          ["xht", "application/xhtml+xml"],
          ["xhtml", "application/xhtml+xml"],
          ["xhvml", "application/xv+xml"],
          ["xif", "image/vnd.xiff"],
          ["xl", "application/excel"],
          ["xla", "application/vnd.ms-excel"],
          ["xlam", "application/vnd.ms-excel.addin.macroEnabled.12"],
          ["xlc", "application/vnd.ms-excel"],
          ["xlf", "application/xliff+xml"],
          ["xlm", "application/vnd.ms-excel"],
          ["xls", "application/vnd.ms-excel"],
          ["xlsb", "application/vnd.ms-excel.sheet.binary.macroEnabled.12"],
          ["xlsm", "application/vnd.ms-excel.sheet.macroEnabled.12"],
          [
            "xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ],
          ["xlt", "application/vnd.ms-excel"],
          ["xltm", "application/vnd.ms-excel.template.macroEnabled.12"],
          [
            "xltx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
          ],
          ["xlw", "application/vnd.ms-excel"],
          ["xm", "audio/xm"],
          ["xml", "application/xml"],
          ["xns", "application/xcap-ns+xml"],
          ["xo", "application/vnd.olpc-sugar"],
          ["xop", "application/xop+xml"],
          ["xpi", "application/x-xpinstall"],
          ["xpl", "application/xproc+xml"],
          ["xpm", "image/x-xpixmap"],
          ["xpr", "application/vnd.is-xpr"],
          ["xps", "application/vnd.ms-xpsdocument"],
          ["xpw", "application/vnd.intercon.formnet"],
          ["xpx", "application/vnd.intercon.formnet"],
          ["xsd", "application/xml"],
          ["xsl", "application/xml"],
          ["xslt", "application/xslt+xml"],
          ["xsm", "application/vnd.syncml+xml"],
          ["xspf", "application/xspf+xml"],
          ["xul", "application/vnd.mozilla.xul+xml"],
          ["xvm", "application/xv+xml"],
          ["xvml", "application/xv+xml"],
          ["xwd", "image/x-xwindowdump"],
          ["xyz", "chemical/x-xyz"],
          ["xz", "application/x-xz"],
          ["yaml", "text/yaml"],
          ["yang", "application/yang"],
          ["yin", "application/yin+xml"],
          ["yml", "text/yaml"],
          ["ymp", "text/x-suse-ymp"],
          ["z", "application/x-compress"],
          ["z1", "application/x-zmachine"],
          ["z2", "application/x-zmachine"],
          ["z3", "application/x-zmachine"],
          ["z4", "application/x-zmachine"],
          ["z5", "application/x-zmachine"],
          ["z6", "application/x-zmachine"],
          ["z7", "application/x-zmachine"],
          ["z8", "application/x-zmachine"],
          ["zaz", "application/vnd.zzazz.deck+xml"],
          ["zip", "application/zip"],
          ["zir", "application/vnd.zul"],
          ["zirz", "application/vnd.zul"],
          ["zmm", "application/vnd.handheld-entertainment+xml"],
          ["zsh", "text/x-scriptzsh"],
        ]);
        function i(a, b, c) {
          let d = (function (a) {
              let { name: b } = a;
              if (b && -1 !== b.lastIndexOf(".") && !a.type) {
                let c = b.split(".").pop().toLowerCase(),
                  d = h.get(c);
                d &&
                  Object.defineProperty(a, "type", {
                    value: d,
                    writable: !1,
                    configurable: !1,
                    enumerable: !0,
                  });
              }
              return a;
            })(a),
            { webkitRelativePath: e } = a,
            f =
              "string" == typeof b
                ? b
                : "string" == typeof e && e.length > 0
                  ? e
                  : `./${a.name}`;
          return (
            "string" != typeof d.path && j(d, "path", f),
            void 0 !== c &&
              Object.defineProperty(d, "handle", {
                value: c,
                writable: !1,
                configurable: !1,
                enumerable: !0,
              }),
            j(d, "relativePath", f),
            d
          );
        }
        function j(a, b, c) {
          Object.defineProperty(a, b, {
            value: c,
            writable: !1,
            configurable: !1,
            enumerable: !0,
          });
        }
        let k = [".DS_Store", "Thumbs.db"];
        function l(a) {
          return "object" == typeof a && null !== a;
        }
        function m(a) {
          return a.filter((a) => -1 === k.indexOf(a.name));
        }
        function n(a) {
          if (null === a) return [];
          let b = [];
          for (let c = 0; c < a.length; c++) {
            let d = a[c];
            b.push(d);
          }
          return b;
        }
        function o(a) {
          if ("function" != typeof a.webkitGetAsEntry) return p(a);
          let b = a.webkitGetAsEntry();
          return b && b.isDirectory ? r(b) : p(a, b);
        }
        function p(a, b) {
          return g(this, void 0, void 0, function* () {
            var c;
            if (
              globalThis.isSecureContext &&
              "function" == typeof a.getAsFileSystemHandle
            ) {
              let b = yield a.getAsFileSystemHandle();
              if (null === b) throw Error(`${a} is not a File`);
              if (void 0 !== b) {
                let a = yield b.getFile();
                return ((a.handle = b), i(a));
              }
            }
            let d = a.getAsFile();
            if (!d) throw Error(`${a} is not a File`);
            return i(
              d,
              null != (c = null == b ? void 0 : b.fullPath) ? c : void 0,
            );
          });
        }
        function q(a) {
          return g(this, void 0, void 0, function* () {
            return a.isDirectory
              ? r(a)
              : (function (a) {
                  return g(this, void 0, void 0, function* () {
                    return new Promise((b, c) => {
                      a.file(
                        (c) => {
                          b(i(c, a.fullPath));
                        },
                        (a) => {
                          c(a);
                        },
                      );
                    });
                  });
                })(a);
          });
        }
        function r(a) {
          let b = a.createReader();
          return new Promise((a, c) => {
            let d = [];
            !(function e() {
              b.readEntries(
                (b) =>
                  g(this, void 0, void 0, function* () {
                    if (b.length) {
                      let a = Promise.all(b.map(q));
                      (d.push(a), e());
                    } else
                      try {
                        let b = yield Promise.all(d);
                        a(b);
                      } catch (a) {
                        c(a);
                      }
                  }),
                (a) => {
                  c(a);
                },
              );
            })();
          });
        }
        var s = c(86337);
        function t(a) {
          return (
            (function (a) {
              if (Array.isArray(a)) return z(a);
            })(a) ||
            (function (a) {
              if (
                ("undefined" != typeof Symbol && null != a[Symbol.iterator]) ||
                null != a["@@iterator"]
              )
                return Array.from(a);
            })(a) ||
            y(a) ||
            (function () {
              throw TypeError(
                "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function u(a, b) {
          var c = Object.keys(a);
          if (Object.getOwnPropertySymbols) {
            var d = Object.getOwnPropertySymbols(a);
            (b &&
              (d = d.filter(function (b) {
                return Object.getOwnPropertyDescriptor(a, b).enumerable;
              })),
              c.push.apply(c, d));
          }
          return c;
        }
        function v(a) {
          for (var b = 1; b < arguments.length; b++) {
            var c = null != arguments[b] ? arguments[b] : {};
            b % 2
              ? u(Object(c), !0).forEach(function (b) {
                  w(a, b, c[b]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    a,
                    Object.getOwnPropertyDescriptors(c),
                  )
                : u(Object(c)).forEach(function (b) {
                    Object.defineProperty(
                      a,
                      b,
                      Object.getOwnPropertyDescriptor(c, b),
                    );
                  });
          }
          return a;
        }
        function w(a, b, c) {
          return (
            b in a
              ? Object.defineProperty(a, b, {
                  value: c,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (a[b] = c),
            a
          );
        }
        function x(a, b) {
          return (
            (function (a) {
              if (Array.isArray(a)) return a;
            })(a) ||
            (function (a, b) {
              var c,
                d,
                e =
                  null == a
                    ? null
                    : ("undefined" != typeof Symbol && a[Symbol.iterator]) ||
                      a["@@iterator"];
              if (null != e) {
                var f = [],
                  g = !0,
                  h = !1;
                try {
                  for (
                    e = e.call(a);
                    !(g = (c = e.next()).done) &&
                    (f.push(c.value), !b || f.length !== b);
                    g = !0
                  );
                } catch (a) {
                  ((h = !0), (d = a));
                } finally {
                  try {
                    g || null == e.return || e.return();
                  } finally {
                    if (h) throw d;
                  }
                }
                return f;
              }
            })(a, b) ||
            y(a, b) ||
            (function () {
              throw TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function y(a, b) {
          if (a) {
            if ("string" == typeof a) return z(a, b);
            var c = Object.prototype.toString.call(a).slice(8, -1);
            if (
              ("Object" === c && a.constructor && (c = a.constructor.name),
              "Map" === c || "Set" === c)
            )
              return Array.from(a);
            if (
              "Arguments" === c ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)
            )
              return z(a, b);
          }
        }
        function z(a, b) {
          (null == b || b > a.length) && (b = a.length);
          for (var c = 0, d = Array(b); c < b; c++) d[c] = a[c];
          return d;
        }
        var A = "function" == typeof s ? s : s.default,
          B = function () {
            var a =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : "",
              b = a.split(","),
              c = b.length > 1 ? "one of ".concat(b.join(", ")) : b[0];
            return {
              code: "file-invalid-type",
              message: "File type must be ".concat(c),
            };
          },
          C = function (a) {
            return {
              code: "file-too-large",
              message: "File is larger than "
                .concat(a, " ")
                .concat(1 === a ? "byte" : "bytes"),
            };
          },
          D = function (a) {
            return {
              code: "file-too-small",
              message: "File is smaller than "
                .concat(a, " ")
                .concat(1 === a ? "byte" : "bytes"),
            };
          },
          E = { code: "too-many-files", message: "Too many files" };
        function F(a, b) {
          var c = "application/x-moz-file" === a.type || A(a, b);
          return [c, c ? null : B(b)];
        }
        function G(a, b, c) {
          if (H(a.size)) {
            if (H(b) && H(c)) {
              if (a.size > c) return [!1, C(c)];
              if (a.size < b) return [!1, D(b)];
            } else if (H(b) && a.size < b) return [!1, D(b)];
            else if (H(c) && a.size > c) return [!1, C(c)];
          }
          return [!0, null];
        }
        function H(a) {
          return null != a;
        }
        function I(a) {
          return "function" == typeof a.isPropagationStopped
            ? a.isPropagationStopped()
            : void 0 !== a.cancelBubble && a.cancelBubble;
        }
        function J(a) {
          return a.dataTransfer
            ? Array.prototype.some.call(a.dataTransfer.types, function (a) {
                return "Files" === a || "application/x-moz-file" === a;
              })
            : !!a.target && !!a.target.files;
        }
        function K(a) {
          a.preventDefault();
        }
        function L() {
          for (var a = arguments.length, b = Array(a), c = 0; c < a; c++)
            b[c] = arguments[c];
          return function (a) {
            for (
              var c = arguments.length, d = Array(c > 1 ? c - 1 : 0), e = 1;
              e < c;
              e++
            )
              d[e - 1] = arguments[e];
            return b.some(function (b) {
              return (!I(a) && b && b.apply(void 0, [a].concat(d)), I(a));
            });
          };
        }
        function M(a) {
          return (
            "audio/*" === a ||
            "video/*" === a ||
            "image/*" === a ||
            "text/*" === a ||
            "application/*" === a ||
            /\w+\/[-+.\w]+/g.test(a)
          );
        }
        function N(a) {
          return /^.*\.[\w]+$/.test(a);
        }
        var O = ["children"],
          P = ["open"],
          Q = [
            "refKey",
            "role",
            "onKeyDown",
            "onFocus",
            "onBlur",
            "onClick",
            "onDragEnter",
            "onDragOver",
            "onDragLeave",
            "onDrop",
          ],
          R = ["refKey", "onChange", "onClick"];
        function S(a, b) {
          return (
            (function (a) {
              if (Array.isArray(a)) return a;
            })(a) ||
            (function (a, b) {
              var c,
                d,
                e =
                  null == a
                    ? null
                    : ("undefined" != typeof Symbol && a[Symbol.iterator]) ||
                      a["@@iterator"];
              if (null != e) {
                var f = [],
                  g = !0,
                  h = !1;
                try {
                  for (
                    e = e.call(a);
                    !(g = (c = e.next()).done) &&
                    (f.push(c.value), !b || f.length !== b);
                    g = !0
                  );
                } catch (a) {
                  ((h = !0), (d = a));
                } finally {
                  try {
                    g || null == e.return || e.return();
                  } finally {
                    if (h) throw d;
                  }
                }
                return f;
              }
            })(a, b) ||
            T(a, b) ||
            (function () {
              throw TypeError(
                "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })()
          );
        }
        function T(a, b) {
          if (a) {
            if ("string" == typeof a) return U(a, b);
            var c = Object.prototype.toString.call(a).slice(8, -1);
            if (
              ("Object" === c && a.constructor && (c = a.constructor.name),
              "Map" === c || "Set" === c)
            )
              return Array.from(a);
            if (
              "Arguments" === c ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)
            )
              return U(a, b);
          }
        }
        function U(a, b) {
          (null == b || b > a.length) && (b = a.length);
          for (var c = 0, d = Array(b); c < b; c++) d[c] = a[c];
          return d;
        }
        function V(a, b) {
          var c = Object.keys(a);
          if (Object.getOwnPropertySymbols) {
            var d = Object.getOwnPropertySymbols(a);
            (b &&
              (d = d.filter(function (b) {
                return Object.getOwnPropertyDescriptor(a, b).enumerable;
              })),
              c.push.apply(c, d));
          }
          return c;
        }
        function W(a) {
          for (var b = 1; b < arguments.length; b++) {
            var c = null != arguments[b] ? arguments[b] : {};
            b % 2
              ? V(Object(c), !0).forEach(function (b) {
                  X(a, b, c[b]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(
                    a,
                    Object.getOwnPropertyDescriptors(c),
                  )
                : V(Object(c)).forEach(function (b) {
                    Object.defineProperty(
                      a,
                      b,
                      Object.getOwnPropertyDescriptor(c, b),
                    );
                  });
          }
          return a;
        }
        function X(a, b, c) {
          return (
            b in a
              ? Object.defineProperty(a, b, {
                  value: c,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (a[b] = c),
            a
          );
        }
        function Y(a, b) {
          if (null == a) return {};
          var c,
            d,
            e = (function (a, b) {
              if (null == a) return {};
              var c,
                d,
                e = {},
                f = Object.keys(a);
              for (d = 0; d < f.length; d++)
                ((c = f[d]), b.indexOf(c) >= 0 || (e[c] = a[c]));
              return e;
            })(a, b);
          if (Object.getOwnPropertySymbols) {
            var f = Object.getOwnPropertySymbols(a);
            for (d = 0; d < f.length; d++)
              ((c = f[d]),
                !(b.indexOf(c) >= 0) &&
                  Object.prototype.propertyIsEnumerable.call(a, c) &&
                  (e[c] = a[c]));
          }
          return e;
        }
        var Z = (0, e.forwardRef)(function (a, b) {
          var c = a.children,
            d = aa(Y(a, O)),
            f = d.open,
            g = Y(d, P);
          return (
            (0, e.useImperativeHandle)(
              b,
              function () {
                return { open: f };
              },
              [f],
            ),
            e.createElement(e.Fragment, null, c(W(W({}, g), {}, { open: f })))
          );
        });
        Z.displayName = "Dropzone";
        var $ = {
          disabled: !1,
          getFilesFromEvent: function (a) {
            return g(this, void 0, void 0, function* () {
              var b;
              if (l(a) && l(a.dataTransfer))
                return (function (a, b) {
                  return g(this, void 0, void 0, function* () {
                    if (a.items) {
                      let c = n(a.items).filter((a) => "file" === a.kind);
                      return "drop" !== b
                        ? c
                        : m(
                            (function a(b) {
                              return b.reduce(
                                (b, c) => [
                                  ...b,
                                  ...(Array.isArray(c) ? a(c) : [c]),
                                ],
                                [],
                              );
                            })(yield Promise.all(c.map(o))),
                          );
                    }
                    return m(n(a.files).map((a) => i(a)));
                  });
                })(a.dataTransfer, a.type);
              if (l((b = a)) && l(b.target))
                return n(a.target.files).map((a) => i(a));
              return Array.isArray(a) &&
                a.every((a) => "getFile" in a && "function" == typeof a.getFile)
                ? (function (a) {
                    return g(this, void 0, void 0, function* () {
                      return (yield Promise.all(a.map((a) => a.getFile()))).map(
                        (a) => i(a),
                      );
                    });
                  })(a)
                : [];
            });
          },
          maxSize: 1 / 0,
          minSize: 0,
          multiple: !0,
          maxFiles: 0,
          preventDropOnDocument: !0,
          noClick: !1,
          noKeyboard: !1,
          noDrag: !1,
          noDragEventsBubbling: !1,
          validator: null,
          useFsAccessApi: !1,
          autoFocus: !1,
        };
        ((Z.defaultProps = $),
          (Z.propTypes = {
            children: f.func,
            accept: f.objectOf(f.arrayOf(f.string)),
            multiple: f.bool,
            preventDropOnDocument: f.bool,
            noClick: f.bool,
            noKeyboard: f.bool,
            noDrag: f.bool,
            noDragEventsBubbling: f.bool,
            minSize: f.number,
            maxSize: f.number,
            maxFiles: f.number,
            disabled: f.bool,
            getFilesFromEvent: f.func,
            onFileDialogCancel: f.func,
            onFileDialogOpen: f.func,
            useFsAccessApi: f.bool,
            autoFocus: f.bool,
            onDragEnter: f.func,
            onDragLeave: f.func,
            onDragOver: f.func,
            onDrop: f.func,
            onDropAccepted: f.func,
            onDropRejected: f.func,
            onError: f.func,
            validator: f.func,
          }));
        var _ = {
          isFocused: !1,
          isFileDialogActive: !1,
          isDragActive: !1,
          isDragAccept: !1,
          isDragReject: !1,
          acceptedFiles: [],
          fileRejections: [],
        };
        function aa() {
          var a =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            b = W(W({}, $), a),
            c = b.accept,
            d = b.disabled,
            f = b.getFilesFromEvent,
            g = b.maxSize,
            h = b.minSize,
            i = b.multiple,
            j = b.maxFiles,
            k = b.onDragEnter,
            l = b.onDragLeave,
            m = b.onDragOver,
            n = b.onDrop,
            o = b.onDropAccepted,
            p = b.onDropRejected,
            q = b.onFileDialogCancel,
            r = b.onFileDialogOpen,
            s = b.useFsAccessApi,
            u = b.autoFocus,
            y = b.preventDropOnDocument,
            z = b.noClick,
            A = b.noKeyboard,
            B = b.noDrag,
            C = b.noDragEventsBubbling,
            D = b.onError,
            O = b.validator,
            P = (0, e.useMemo)(
              function () {
                return H(c)
                  ? Object.entries(c)
                      .reduce(function (a, b) {
                        var c = x(b, 2),
                          d = c[0],
                          e = c[1];
                        return [].concat(t(a), [d], t(e));
                      }, [])
                      .filter(function (a) {
                        return M(a) || N(a);
                      })
                      .join(",")
                  : void 0;
              },
              [c],
            ),
            V = (0, e.useMemo)(
              function () {
                return H(c)
                  ? [
                      {
                        description: "Files",
                        accept: Object.entries(c)
                          .filter(function (a) {
                            var b = x(a, 2),
                              c = b[0],
                              d = b[1],
                              e = !0;
                            return (
                              M(c) ||
                                (console.warn(
                                  'Skipped "'.concat(
                                    c,
                                    '" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.',
                                  ),
                                ),
                                (e = !1)),
                              (Array.isArray(d) && d.every(N)) ||
                                (console.warn(
                                  'Skipped "'.concat(
                                    c,
                                    '" because an invalid file extension was provided.',
                                  ),
                                ),
                                (e = !1)),
                              e
                            );
                          })
                          .reduce(function (a, b) {
                            var c = x(b, 2),
                              d = c[0],
                              e = c[1];
                            return v(v({}, a), {}, w({}, d, e));
                          }, {}),
                      },
                    ]
                  : c;
              },
              [c],
            ),
            Z = (0, e.useMemo)(
              function () {
                return "function" == typeof r ? r : ac;
              },
              [r],
            ),
            aa = (0, e.useMemo)(
              function () {
                return "function" == typeof q ? q : ac;
              },
              [q],
            ),
            ad = (0, e.useRef)(null),
            ae = (0, e.useRef)(null),
            af = S((0, e.useReducer)(ab, _), 2),
            ag = af[0],
            ah = af[1],
            ai = ag.isFocused,
            aj = ag.isFileDialogActive,
            ak = (0, e.useRef)(
              "undefined" != typeof window &&
                window.isSecureContext &&
                s &&
                "showOpenFilePicker" in window,
            ),
            al = function () {
              !ak.current &&
                aj &&
                setTimeout(function () {
                  ae.current &&
                    (ae.current.files.length ||
                      (ah({ type: "closeDialog" }), aa()));
                }, 300);
            };
          (0, e.useEffect)(
            function () {
              return (
                window.addEventListener("focus", al, !1),
                function () {
                  window.removeEventListener("focus", al, !1);
                }
              );
            },
            [ae, aj, aa, ak],
          );
          var am = (0, e.useRef)([]),
            an = function (a) {
              (ad.current && ad.current.contains(a.target)) ||
                (a.preventDefault(), (am.current = []));
            };
          ((0, e.useEffect)(
            function () {
              return (
                y &&
                  (document.addEventListener("dragover", K, !1),
                  document.addEventListener("drop", an, !1)),
                function () {
                  y &&
                    (document.removeEventListener("dragover", K),
                    document.removeEventListener("drop", an));
                }
              );
            },
            [ad, y],
          ),
            (0, e.useEffect)(
              function () {
                return (
                  !d && u && ad.current && ad.current.focus(),
                  function () {}
                );
              },
              [ad, u, d],
            ));
          var ao = (0, e.useCallback)(
              function (a) {
                D ? D(a) : console.error(a);
              },
              [D],
            ),
            ap = (0, e.useCallback)(
              function (a) {
                var b;
                (a.preventDefault(),
                  a.persist(),
                  aC(a),
                  (am.current = [].concat(
                    (function (a) {
                      if (Array.isArray(a)) return U(a);
                    })((b = am.current)) ||
                      (function (a) {
                        if (
                          ("undefined" != typeof Symbol &&
                            null != a[Symbol.iterator]) ||
                          null != a["@@iterator"]
                        )
                          return Array.from(a);
                      })(b) ||
                      T(b) ||
                      (function () {
                        throw TypeError(
                          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                        );
                      })(),
                    [a.target],
                  )),
                  J(a) &&
                    Promise.resolve(f(a))
                      .then(function (b) {
                        if (!I(a) || C) {
                          var c,
                            d,
                            e,
                            f,
                            l,
                            m,
                            n,
                            o,
                            p = b.length,
                            q =
                              p > 0 &&
                              ((d = (c = {
                                files: b,
                                accept: P,
                                minSize: h,
                                maxSize: g,
                                multiple: i,
                                maxFiles: j,
                                validator: O,
                              }).files),
                              (e = c.accept),
                              (f = c.minSize),
                              (l = c.maxSize),
                              (m = c.multiple),
                              (n = c.maxFiles),
                              (o = c.validator),
                              (!!m || !(d.length > 1)) &&
                                (!m || !(n >= 1) || !(d.length > n)) &&
                                d.every(function (a) {
                                  var b = x(F(a, e), 1)[0],
                                    c = x(G(a, f, l), 1)[0],
                                    d = o ? o(a) : null;
                                  return b && c && !d;
                                }));
                          (ah({
                            isDragAccept: q,
                            isDragReject: p > 0 && !q,
                            isDragActive: !0,
                            type: "setDraggedFiles",
                          }),
                            k && k(a));
                        }
                      })
                      .catch(function (a) {
                        return ao(a);
                      }));
              },
              [f, k, ao, C, P, h, g, i, j, O],
            ),
            aq = (0, e.useCallback)(
              function (a) {
                (a.preventDefault(), a.persist(), aC(a));
                var b = J(a);
                if (b && a.dataTransfer)
                  try {
                    a.dataTransfer.dropEffect = "copy";
                  } catch (a) {}
                return (b && m && m(a), !1);
              },
              [m, C],
            ),
            ar = (0, e.useCallback)(
              function (a) {
                (a.preventDefault(), a.persist(), aC(a));
                var b = am.current.filter(function (a) {
                    return ad.current && ad.current.contains(a);
                  }),
                  c = b.indexOf(a.target);
                (-1 !== c && b.splice(c, 1),
                  (am.current = b),
                  !(b.length > 0) &&
                    (ah({
                      type: "setDraggedFiles",
                      isDragActive: !1,
                      isDragAccept: !1,
                      isDragReject: !1,
                    }),
                    J(a) && l && l(a)));
              },
              [ad, l, C],
            ),
            as = (0, e.useCallback)(
              function (a, b) {
                var c = [],
                  d = [];
                (a.forEach(function (a) {
                  var b = S(F(a, P), 2),
                    e = b[0],
                    f = b[1],
                    i = S(G(a, h, g), 2),
                    j = i[0],
                    k = i[1],
                    l = O ? O(a) : null;
                  if (e && j && !l) c.push(a);
                  else {
                    var m = [f, k];
                    (l && (m = m.concat(l)),
                      d.push({
                        file: a,
                        errors: m.filter(function (a) {
                          return a;
                        }),
                      }));
                  }
                }),
                  ((!i && c.length > 1) || (i && j >= 1 && c.length > j)) &&
                    (c.forEach(function (a) {
                      d.push({ file: a, errors: [E] });
                    }),
                    c.splice(0)),
                  ah({
                    acceptedFiles: c,
                    fileRejections: d,
                    isDragReject: d.length > 0,
                    type: "setFiles",
                  }),
                  n && n(c, d, b),
                  d.length > 0 && p && p(d, b),
                  c.length > 0 && o && o(c, b));
              },
              [ah, i, P, h, g, j, n, o, p, O],
            ),
            at = (0, e.useCallback)(
              function (a) {
                (a.preventDefault(),
                  a.persist(),
                  aC(a),
                  (am.current = []),
                  J(a) &&
                    Promise.resolve(f(a))
                      .then(function (b) {
                        (!I(a) || C) && as(b, a);
                      })
                      .catch(function (a) {
                        return ao(a);
                      }),
                  ah({ type: "reset" }));
              },
              [f, as, ao, C],
            ),
            au = (0, e.useCallback)(
              function () {
                if (ak.current) {
                  (ah({ type: "openDialog" }),
                    Z(),
                    window
                      .showOpenFilePicker({ multiple: i, types: V })
                      .then(function (a) {
                        return f(a);
                      })
                      .then(function (a) {
                        (as(a, null), ah({ type: "closeDialog" }));
                      })
                      .catch(function (a) {
                        a instanceof DOMException &&
                        ("AbortError" === a.name || a.code === a.ABORT_ERR)
                          ? (aa(a), ah({ type: "closeDialog" }))
                          : a instanceof DOMException &&
                              ("SecurityError" === a.name ||
                                a.code === a.SECURITY_ERR)
                            ? ((ak.current = !1),
                              ae.current
                                ? ((ae.current.value = null),
                                  ae.current.click())
                                : ao(
                                    Error(
                                      "Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided.",
                                    ),
                                  ))
                            : ao(a);
                      }));
                  return;
                }
                ae.current &&
                  (ah({ type: "openDialog" }),
                  Z(),
                  (ae.current.value = null),
                  ae.current.click());
              },
              [ah, Z, aa, s, as, ao, V, i],
            ),
            av = (0, e.useCallback)(
              function (a) {
                ad.current &&
                  ad.current.isEqualNode(a.target) &&
                  (" " === a.key ||
                    "Enter" === a.key ||
                    32 === a.keyCode ||
                    13 === a.keyCode) &&
                  (a.preventDefault(), au());
              },
              [ad, au],
            ),
            aw = (0, e.useCallback)(function () {
              ah({ type: "focus" });
            }, []),
            ax = (0, e.useCallback)(function () {
              ah({ type: "blur" });
            }, []),
            ay = (0, e.useCallback)(
              function () {
                z ||
                  ((function () {
                    var a =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : window.navigator.userAgent;
                    return (
                      -1 !== a.indexOf("MSIE") ||
                      -1 !== a.indexOf("Trident/") ||
                      -1 !== a.indexOf("Edge/")
                    );
                  })()
                    ? setTimeout(au, 0)
                    : au());
              },
              [z, au],
            ),
            az = function (a) {
              return d ? null : a;
            },
            aA = function (a) {
              return A ? null : az(a);
            },
            aB = function (a) {
              return B ? null : az(a);
            },
            aC = function (a) {
              C && a.stopPropagation();
            },
            aD = (0, e.useMemo)(
              function () {
                return function () {
                  var a =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                    b = a.refKey,
                    c = a.role,
                    e = a.onKeyDown,
                    f = a.onFocus,
                    g = a.onBlur,
                    h = a.onClick,
                    i = a.onDragEnter,
                    j = a.onDragOver,
                    k = a.onDragLeave,
                    l = a.onDrop,
                    m = Y(a, Q);
                  return W(
                    W(
                      X(
                        {
                          onKeyDown: aA(L(e, av)),
                          onFocus: aA(L(f, aw)),
                          onBlur: aA(L(g, ax)),
                          onClick: az(L(h, ay)),
                          onDragEnter: aB(L(i, ap)),
                          onDragOver: aB(L(j, aq)),
                          onDragLeave: aB(L(k, ar)),
                          onDrop: aB(L(l, at)),
                          role:
                            "string" == typeof c && "" !== c
                              ? c
                              : "presentation",
                        },
                        void 0 === b ? "ref" : b,
                        ad,
                      ),
                      d || A ? {} : { tabIndex: 0 },
                    ),
                    m,
                  );
                };
              },
              [ad, av, aw, ax, ay, ap, aq, ar, at, A, B, d],
            ),
            aE = (0, e.useCallback)(function (a) {
              a.stopPropagation();
            }, []),
            aF = (0, e.useMemo)(
              function () {
                return function () {
                  var a =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                    b = a.refKey,
                    c = a.onChange,
                    d = a.onClick,
                    e = Y(a, R);
                  return W(
                    W(
                      {},
                      X(
                        {
                          accept: P,
                          multiple: i,
                          type: "file",
                          style: {
                            border: 0,
                            clip: "rect(0, 0, 0, 0)",
                            clipPath: "inset(50%)",
                            height: "1px",
                            margin: "0 -1px -1px 0",
                            overflow: "hidden",
                            padding: 0,
                            position: "absolute",
                            width: "1px",
                            whiteSpace: "nowrap",
                          },
                          onChange: az(L(c, at)),
                          onClick: az(L(d, aE)),
                          tabIndex: -1,
                        },
                        void 0 === b ? "ref" : b,
                        ae,
                      ),
                    ),
                    e,
                  );
                };
              },
              [ae, c, i, at, d],
            );
          return W(
            W({}, ag),
            {},
            {
              isFocused: ai && !d,
              getRootProps: aD,
              getInputProps: aF,
              rootRef: ad,
              inputRef: ae,
              open: az(au),
            },
          );
        }
        function ab(a, b) {
          switch (b.type) {
            case "focus":
              return W(W({}, a), {}, { isFocused: !0 });
            case "blur":
              return W(W({}, a), {}, { isFocused: !1 });
            case "openDialog":
              return W(W({}, _), {}, { isFileDialogActive: !0 });
            case "closeDialog":
              return W(W({}, a), {}, { isFileDialogActive: !1 });
            case "setDraggedFiles":
              return W(
                W({}, a),
                {},
                {
                  isDragActive: b.isDragActive,
                  isDragAccept: b.isDragAccept,
                  isDragReject: b.isDragReject,
                },
              );
            case "setFiles":
              return W(
                W({}, a),
                {},
                {
                  acceptedFiles: b.acceptedFiles,
                  fileRejections: b.fileRejections,
                  isDragReject: b.isDragReject,
                },
              );
            case "reset":
              return W({}, _);
            default:
              return a;
          }
        }
        function ac() {}
        var ad = c(30520);
        async function ae(a, b) {
          let c = await fetch(a, {
            method: "PUT",
            headers: { "content-type": b.type || "application/octet-stream" },
            body: b,
          });
          if (!c.ok) {
            let a = await c.text().catch(() => "");
            throw Error(`Upload failed (${c.status}): ${a}`);
          }
          return !0;
        }
        let af = 1;
        function ag() {
          let { push: a, element: b } = (function () {
              let [a, b] = e.useState([]);
              return {
                push: (a) => b((b) => [...b, { id: af++, text: a }]),
                element: (0, d.jsx)("div", {
                  className: "fixed bottom-4 right-4 z-50 space-y-2",
                  children: a.map((a) =>
                    (0, d.jsx)(
                      "div",
                      {
                        className:
                          "rounded bg-black px-3 py-2 text-white shadow",
                        children: (0, d.jsxs)("div", {
                          className: "flex items-center gap-3",
                          children: [
                            (0, d.jsx)("span", {
                              className: "text-sm",
                              children: a.text,
                            }),
                            (0, d.jsx)("button", {
                              onClick: () => {
                                let c;
                                return (
                                  (c = a.id),
                                  b((a) => a.filter((a) => a.id !== c))
                                );
                              },
                              className: "text-xs underline",
                              children: "Dismiss",
                            }),
                          ],
                        }),
                      },
                      a.id,
                    ),
                  ),
                }),
              };
            })(),
            c = ad.F.uploads.createUrl.useMutation(),
            {
              getRootProps: f,
              getInputProps: g,
              isDragActive: h,
            } = aa({
              onDrop: e.useCallback(
                async (b) => {
                  let d = b[0];
                  if (d)
                    try {
                      let { url: b } = await c.mutateAsync({
                        filename: d.name,
                      });
                      (await ae(b, d), a("Upload complete!"));
                    } catch (b) {
                      a(String(b?.message ?? "Upload failed"));
                    }
                },
                [c, a],
              ),
            });
          return (0, d.jsxs)("div", {
            className: "p-4 space-y-4",
            children: [
              b,
              (0, d.jsx)("h1", {
                className: "text-lg font-semibold",
                children: "Direct Uploads",
              }),
              (0, d.jsxs)("div", {
                ...f(),
                className:
                  "flex h-40 items-center justify-center rounded border border-dashed " +
                  (h ? "bg-neutral-50" : ""),
                children: [
                  (0, d.jsx)("input", { ...g() }),
                  (0, d.jsx)("p", {
                    children:
                      "Drag 'n' drop a file here, or click to select one",
                  }),
                ],
              }),
            ],
          });
        }
      },
      97728: (a, b, c) => {
        a.exports = c(47158)();
      },
    }));
  var b = require("../../../webpack-runtime.js");
  b.C(a);
  var c = b.X(0, [767, 792, 280], () => b((b.s = 92015)));
  module.exports = c;
})();
