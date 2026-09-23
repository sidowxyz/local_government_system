export const manifest = {
  screens: {
    scr_53cr2l: { name: "Inbox — My tasks", route: "/inbox", state: { "tab": "mine" }, position: { "x": 160, "y": 2200 } },
    scr_y9uqrc: { name: "Inbox — Office queue", route: "/inbox", state: { "tab": "office" }, position: { "x": 1560, "y": 2200 } },
    scr_2zxibp: { name: "New application", route: "/applications/new", position: { "x": 160, "y": 220 } },
    scr_hqgem3: { name: "Business licence form", route: "/applications/new/BIZ_LICENCE_ISSUE", position: { "x": 7160, "y": 220 } },
    scr_2bxwh5: { name: "Business registration form", route: "/applications/new/BIZ_NEW_REGISTRATION", position: { "x": 8560, "y": 220 } },
    scr_uru2nc: { name: "Birth registration form", route: "/applications/new/CIV_BIRTH_REGISTRATION", position: { "x": 9960, "y": 220 } },
    scr_ky835h: { name: "Vehicle registration form", route: "/applications/new/VEH_REGISTRATION", position: { "x": 11360, "y": 220 } },
    scr_rvnxzk: { name: "Applications — Citizen cases", route: "/applications", state: { "tab": "citizen" }, position: { "x": 1560, "y": 220 } },
    scr_b5cou4: { name: "Applications — Issued", route: "/applications", state: { "tab": "citizen", "state": "ISSUED" }, position: { "x": 2960, "y": 220 } },
    scr_l93be9: { name: "Applications — Internal cases", route: "/applications", state: { "tab": "internal" }, position: { "x": 4360, "y": 220 } },
    scr_n0qhgo: { name: "Applications — No matches", route: "/applications", state: { "tab": "citizen", "state": "DRAFT" }, position: { "x": 5760, "y": 220 } },
    scr_3tdmbm: { name: "Case — open review", route: "/applications/app-2", position: { "x": 12760, "y": 220 } },
    scr_eisy8q: { name: "Case — issued", route: "/applications/app-1", position: { "x": 14160, "y": 220 } },
    scr_0kroag: { name: "Parties", route: "/parties", position: { "x": 160, "y": 4180 } },
    scr_gqh9fh: { name: "Register a party", route: "/parties/new", position: { "x": 1560, "y": 4180 } },
    scr_liue24: { name: "Parties — No matches", route: "/parties", state: { "query": "zzzz" }, position: { "x": 2960, "y": 4180 } },
    scr_76t83x: { name: "Party record", route: "/parties/party-2", position: { "x": 4360, "y": 4180 } }
  },
  sections: {
    sec_ig95cm: { name: "Applications", x: 0, y: 0, width: 15520, height: 1180 },
    sec_vdcb97: { name: "Inbox", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_nb7qi0: { name: "Parties", x: 0, y: 3960, width: 5720, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_ig95cm", children: [
    { kind: "screen", id: "scr_2zxibp" },
    { kind: "screen", id: "scr_rvnxzk" },
    { kind: "screen", id: "scr_b5cou4" },
    { kind: "screen", id: "scr_l93be9" },
    { kind: "screen", id: "scr_n0qhgo" },
    { kind: "screen", id: "scr_hqgem3" },
    { kind: "screen", id: "scr_2bxwh5" },
    { kind: "screen", id: "scr_uru2nc" },
    { kind: "screen", id: "scr_ky835h" },
    { kind: "screen", id: "scr_3tdmbm" },
    { kind: "screen", id: "scr_eisy8q" }]
  },
  { kind: "section", id: "sec_vdcb97", children: [
    { kind: "screen", id: "scr_53cr2l" },
    { kind: "screen", id: "scr_y9uqrc" }]
  },
  { kind: "section", id: "sec_nb7qi0", children: [
    { kind: "screen", id: "scr_0kroag" },
    { kind: "screen", id: "scr_gqh9fh" },
    { kind: "screen", id: "scr_liue24" },
    { kind: "screen", id: "scr_76t83x" }]
  }]

};