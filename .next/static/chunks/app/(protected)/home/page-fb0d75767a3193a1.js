(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [650],
  {
    4908: (e, s, r) => {
      "use strict";
      r.d(s, { F: () => c, x: () => d });
      var t = r(9835),
        l = r(5931),
        n = r(9668),
        a = r(1129),
        i = r(6262);
      r(9088);
      let c = (0, n.pY)();
      function d(e) {
        let { children: s } = e,
          r = (0, i.jE)(),
          [d] = l.useState(() =>
            c.createClient({
              links: [
                (0, n.fu)({
                  url: "".concat("", "/api/trpc"),
                  transformer: a.Ay,
                }),
              ],
            }),
          );
        return (0, t.jsx)(c.Provider, {
          client: d,
          queryClient: r,
          children: s,
        });
      }
    },
    5274: (e, s, r) => {
      "use strict";
      (r.r(s), r.d(s, { default: () => i }));
      var t = r(9835);
      r(5931);
      var l = r(5123),
        n = r.n(l),
        a = r(4908);
      function i() {
        let { data: e } = a.F.health.ping.useQuery();
        return (0, t.jsxs)("main", {
          className: "mx-auto max-w-5xl px-4 py-8 space-y-6",
          children: [
            (0, t.jsx)("h1", {
              className: "text-2xl font-semibold",
              children: "LESiAB — Dashboard",
            }),
            (0, t.jsxs)("p", {
              className: "text-sm text-neutral-600",
              children: ["tRPC health: ", null != e ? e : "…"],
            }),
            (0, t.jsxs)("section", {
              className: "grid gap-4 sm:grid-cols-2",
              children: [
                (0, t.jsxs)(n(), {
                  href: "/uploads",
                  className: "rounded border p-4 hover:bg-neutral-50",
                  children: [
                    (0, t.jsx)("h2", {
                      className: "font-medium",
                      children: "Uploads",
                    }),
                    (0, t.jsx)("p", {
                      className: "text-sm text-neutral-600",
                      children: "Direct-to-Supabase Storage via presigned URL.",
                    }),
                  ],
                }),
                (0, t.jsxs)(n(), {
                  href: "/flows",
                  className: "rounded border p-4 hover:bg-neutral-50",
                  children: [
                    (0, t.jsx)("h2", {
                      className: "font-medium",
                      children: "Flows",
                    }),
                    (0, t.jsx)("p", {
                      className: "text-sm text-neutral-600",
                      children:
                        "Multi-entity screens (generated from profile.json).",
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsxs)("section", {
              className: "rounded border p-4",
              children: [
                (0, t.jsx)("h2", {
                  className: "mb-2 font-medium",
                  children: "Next steps",
                }),
                (0, t.jsxs)("ol", {
                  className:
                    "list-decimal pl-5 text-sm leading-6 text-neutral-700",
                  children: [
                    (0, t.jsxs)("li", {
                      children: [
                        "Generate CRUD routers & pages from your ",
                        (0, t.jsx)("code", { children: "profile.json" }),
                        ".",
                      ],
                    }),
                    (0, t.jsxs)("li", {
                      children: [
                        "Wire new routers under ",
                        (0, t.jsx)("code", {
                          children: "server/trpc/router.ts",
                        }),
                        " using the Hygen anchors.",
                      ],
                    }),
                    (0, t.jsx)("li", {
                      children: "(Optional) Add login to protect these routes.",
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      }
    },
    5496: (e, s, r) => {
      Promise.resolve().then(r.bind(r, 5274));
    },
  },
  (e) => {
    (e.O(0, [789, 123, 900, 341, 358], () => e((e.s = 5496))), (_N_E = e.O()));
  },
]);
