export type Category = { color: string; label: string };

export const projectCategories: Record<string, Category> = {
  // Platform lenses
  "Restor.eco": { color: "#10b981", label: "Restor.eco" },
  "Karma HQ": { color: "#f97316", label: "Karma HQ / Grants" },
  "Giveth.io": { color: "#a855f7", label: "Giveth.io" },
  "Toucan Protocol": { color: "#0ea5e9", label: "Toucan Protocol" },
  Coorest: { color: "#f43f5e", label: "Coorest" },
  Nori: { color: "#6b7280", label: "Nori (archived)" },
  "Regen Network": { color: "#22c55e", label: "Regen Network" },
  KlimaDAO: { color: "#14b8a6", label: "KlimaDAO" },
  Terra0: { color: "#6366f1", label: "Terra0" },
  // Legacy community lenses
  ReFi: { color: "#3bc9db", label: "ReFi / Climate DeFi" },
  Indigenous: { color: "#f59f00", label: "Indigenous / Ancestral" },
  Tech: { color: "#845ef7", label: "Tech / DeSci" },
  "Network State": { color: "#12b886", label: "Network State" },
  Ecovillage: { color: "#fcc419", label: "Ecovillage" },
  "Database/Map": { color: "#4c6ef5", label: "Database / Map infra" },
  "Network Hub": { color: "#f06595", label: "Network hub (signal)" },
  Restoration: { color: "#10b981", label: "Restoration Projects" },
  "Community Submission": {
    color: "#72f2c0",
    label: "Community Submission"
  }
};

export const projectCategoryOptions = Object.keys(projectCategories);
