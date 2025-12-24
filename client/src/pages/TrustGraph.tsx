import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

const regionOptions = ["All", "Africa", "Americas", "Europe", "Asia-Pacific", "Global"];
const roleOptions = [
  "All",
  "Steward",
  "Funder",
  "Protocol",
  "Data Partner",
  "Operator",
  "Supplier",
  "Governance",
  "Research",
  "Marketplace"
];
const impactOptions = [
  "All",
  "Coastal Restoration",
  "Regenerative Finance",
  "MRV Data",
  "Indigenous Data",
  "Energy Resilience",
  "Soil Carbon",
  "Collective Governance",
  "Innovation",
  "Agroforestry",
  "Market Access"
];

type TrustSignals = {
  evidence: number;
  delivery: number;
  transparency: number;
  community: number;
};

type TrustNode = {
  id: string;
  name: string;
  region: string;
  role: string;
  impactArea: string;
  summary: string;
  connections: string[];
  signals: TrustSignals;
};

type ScoreResponse = {
  scores: Array<{ id: string; score: number; confidence: number }>;
};

const trustNodes: TrustNode[] = [
  {
    id: "mangrove-guardians",
    name: "Mangrove Guardians",
    region: "Africa",
    role: "Steward",
    impactArea: "Coastal Restoration",
    summary: "Community stewards restoring mangrove belts with youth livelihoods.",
    connections: ["impact-market", "community-trust-council", "regen-ledger"],
    signals: { evidence: 82, delivery: 88, transparency: 76, community: 92 }
  },
  {
    id: "impact-market",
    name: "Impact Market",
    region: "Africa",
    role: "Marketplace",
    impactArea: "Market Access",
    summary: "Local marketplace connecting verified projects to regional buyers.",
    connections: ["mangrove-guardians", "karma-grants", "biochar-alliance"],
    signals: { evidence: 70, delivery: 76, transparency: 72, community: 80 }
  },
  {
    id: "karma-grants",
    name: "Karma Grants Network",
    region: "Americas",
    role: "Funder",
    impactArea: "Regenerative Finance",
    summary: "Catalytic capital pool underwriting early restoration pilots.",
    connections: ["impact-market", "indigenous-commons", "solar-microgrid"],
    signals: { evidence: 78, delivery: 84, transparency: 81, community: 75 }
  },
  {
    id: "indigenous-commons",
    name: "Indigenous Data Commons",
    region: "Americas",
    role: "Data Partner",
    impactArea: "Indigenous Data",
    summary: "Data sovereignty hub supporting ancestral land claims and maps.",
    connections: ["karma-grants", "community-trust-council", "refi-lab"],
    signals: { evidence: 86, delivery: 79, transparency: 88, community: 94 }
  },
  {
    id: "biochar-alliance",
    name: "Biochar Alliance",
    region: "Americas",
    role: "Supplier",
    impactArea: "Soil Carbon",
    summary: "Biochar producers scaling soil carbon removal and rural jobs.",
    connections: ["impact-market", "forest-dao", "regen-ledger"],
    signals: { evidence: 75, delivery: 82, transparency: 70, community: 73 }
  },
  {
    id: "regen-ledger",
    name: "Regen Ledger",
    region: "Europe",
    role: "Protocol",
    impactArea: "MRV Data",
    summary: "Open MRV protocol aligning data attestations across networks.",
    connections: ["mangrove-guardians", "biochar-alliance", "refi-lab"],
    signals: { evidence: 90, delivery: 85, transparency: 92, community: 78 }
  },
  {
    id: "refi-lab",
    name: "ReFi Research Lab",
    region: "Europe",
    role: "Research",
    impactArea: "Innovation",
    summary: "Research cell validating trust signals and impact verification.",
    connections: ["regen-ledger", "indigenous-commons", "community-trust-council"],
    signals: { evidence: 88, delivery: 74, transparency: 90, community: 72 }
  },
  {
    id: "forest-dao",
    name: "Forest DAO",
    region: "Europe",
    role: "Steward",
    impactArea: "Agroforestry",
    summary: "DAO-backed agroforestry cooperative with shared revenue flows.",
    connections: ["biochar-alliance", "community-trust-council", "solar-microgrid"],
    signals: { evidence: 80, delivery: 83, transparency: 77, community: 85 }
  },
  {
    id: "solar-microgrid",
    name: "Solar Microgrid Guild",
    region: "Asia-Pacific",
    role: "Operator",
    impactArea: "Energy Resilience",
    summary: "Rural microgrid operators powering regen processing hubs.",
    connections: ["forest-dao", "karma-grants", "community-trust-council"],
    signals: { evidence: 74, delivery: 80, transparency: 69, community: 82 }
  },
  {
    id: "community-trust-council",
    name: "Community Trust Council",
    region: "Global",
    role: "Governance",
    impactArea: "Collective Governance",
    summary: "Cross-network council aligning mutual accountability charters.",
    connections: [
      "mangrove-guardians",
      "indigenous-commons",
      "refi-lab",
      "forest-dao",
      "solar-microgrid"
    ],
    signals: { evidence: 92, delivery: 78, transparency: 85, community: 90 }
  }
];

const roleColors: Record<string, string> = {
  Steward: "#34d399",
  Funder: "#f97316",
  Protocol: "#38bdf8",
  "Data Partner": "#a855f7",
  Operator: "#facc15",
  Supplier: "#f43f5e",
  Governance: "#94a3b8",
  Research: "#6366f1",
  Marketplace: "#22c55e"
};

const regionCenters: Record<string, { x: number; y: number }> = {
  Africa: { x: 220, y: 230 },
  Americas: { x: 220, y: 450 },
  Europe: { x: 520, y: 210 },
  "Asia-Pacific": { x: 820, y: 250 },
  Global: { x: 620, y: 460 }
};

const layoutSize = { width: 960, height: 620 };

export default function TrustGraph() {
  const [regionFilter, setRegionFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [impactFilter, setImpactFilter] = useState("All");
  const [scores, setScores] = useState<Record<string, { score: number; confidence: number }>>({});
  const [scoreError, setScoreError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadScores = async () => {
      try {
        const response = await fetch("/api/trust-scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            signals: trustNodes.map((node) => ({
              id: node.id,
              ...node.signals
            }))
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to fetch trust scores");
        }

        const data = (await response.json()) as ScoreResponse;
        const nextScores = Object.fromEntries(
          data.scores.map((score) => [score.id, { score: score.score, confidence: score.confidence }])
        );
        setScores(nextScores);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setScoreError("Trust score service unavailable. Showing nodes only.");
        }
      }
    };

    loadScores();
    return () => controller.abort();
  }, []);

  const filteredNodes = useMemo(() => {
    return trustNodes.filter((node) => {
      const matchesRegion = regionFilter === "All" || node.region === regionFilter;
      const matchesRole = roleFilter === "All" || node.role === roleFilter;
      const matchesImpact = impactFilter === "All" || node.impactArea === impactFilter;
      return matchesRegion && matchesRole && matchesImpact;
    });
  }, [regionFilter, roleFilter, impactFilter]);

  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    const nodesByRegion = trustNodes.reduce<Record<string, TrustNode[]>>((acc, node) => {
      acc[node.region] = acc[node.region] ? [...acc[node.region], node] : [node];
      return acc;
    }, {});

    Object.entries(nodesByRegion).forEach(([region, nodes]) => {
      const center = regionCenters[region] ?? { x: 480, y: 310 };
      const count = nodes.length;
      nodes.forEach((node, index) => {
        if (count === 1) {
          positions.set(node.id, center);
          return;
        }
        const angle = (2 * Math.PI * index) / count;
        const radius = 70 + index * 6;
        positions.set(node.id, {
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle)
        });
      });
    });

    return positions;
  }, []);

  const visibleIds = useMemo(() => new Set(filteredNodes.map((node) => node.id)), [filteredNodes]);

  const edges = useMemo(() => {
    const edgeList: Array<{ from: string; to: string }> = [];
    const seen = new Set<string>();
    trustNodes.forEach((node) => {
      node.connections.forEach((target) => {
        const key = [node.id, target].sort().join("::");
        if (seen.has(key)) return;
        if (visibleIds.has(node.id) && visibleIds.has(target)) {
          seen.add(key);
          edgeList.push({ from: node.id, to: target });
        }
      });
    });
    return edgeList;
  }, [visibleIds]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  TG
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Trust Graph</p>
                  <h1 className="text-3xl font-bold">Network visualization & trust scoring</h1>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground max-w-2xl">
                Explore how regenerative initiatives interconnect through shared governance, data, and capital flows. Use the filters
                to isolate regions, roles, and impact areas, then review trust scores calculated via the new API.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Back home
              </Link>
              <Link href="/map" className="text-muted-foreground hover:text-foreground">
                Project map
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-border/60 bg-card/50 p-6 shadow-lg">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Filters</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <label className="flex flex-col text-xs font-semibold text-muted-foreground">
                      Region
                      <select
                        className="mt-1 rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground"
                        value={regionFilter}
                        onChange={(event) => setRegionFilter(event.target.value)}
                      >
                        {regionOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col text-xs font-semibold text-muted-foreground">
                      Role
                      <select
                        className="mt-1 rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground"
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value)}
                      >
                        {roleOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col text-xs font-semibold text-muted-foreground">
                      Impact area
                      <select
                        className="mt-1 rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground"
                        value={impactFilter}
                        onChange={(event) => setImpactFilter(event.target.value)}
                      >
                        {impactOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              {scoreError && (
                <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  {scoreError}
                </div>
              )}

              <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-background">
                <svg viewBox={`0 0 ${layoutSize.width} ${layoutSize.height}`} className="w-full h-[420px]">
                  <defs>
                    <linearGradient id="edgeFade" x1="0" x2="1">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.15" />
                      <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  {edges.map((edge) => {
                    const start = nodePositions.get(edge.from);
                    const end = nodePositions.get(edge.to);
                    if (!start || !end) return null;
                    return (
                      <line
                        key={`${edge.from}-${edge.to}`}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke="url(#edgeFade)"
                        strokeWidth={2}
                      />
                    );
                  })}
                  {filteredNodes.map((node) => {
                    const pos = nodePositions.get(node.id) ?? { x: 0, y: 0 };
                    const color = roleColors[node.role] ?? "#64748b";
                    const score = scores[node.id]?.score;
                    return (
                      <g key={node.id}>
                        <circle cx={pos.x} cy={pos.y} r={28} fill={color} opacity={0.2} />
                        <circle cx={pos.x} cy={pos.y} r={18} fill={color} />
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="10"
                          fill="#0f172a"
                          fontWeight={600}
                        >
                          {score ? score : "—"}
                        </text>
                        <text
                          x={pos.x}
                          y={pos.y + 32}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#0f172a"
                        >
                          {node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {Object.entries(roleColors).map(([role, color]) => (
                  <div key={role} className="flex items-center gap-2">
                    <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/50 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Filtered nodes</p>
                  <h2 className="text-xl font-semibold">Trust signal rollup</h2>
                </div>
                <span className="text-sm text-muted-foreground">{filteredNodes.length} nodes</span>
              </div>

              <div className="mt-5 space-y-4">
                {filteredNodes.map((node) => {
                  const scoreInfo = scores[node.id];
                  return (
                    <div key={node.id} className="rounded-2xl border border-border/40 bg-background p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">{node.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{node.summary}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Trust score</p>
                          <p className="text-lg font-semibold">
                            {scoreInfo ? scoreInfo.score : "—"}
                            {scoreInfo && <span className="text-xs text-muted-foreground">/100</span>}
                          </p>
                          {scoreInfo && (
                            <p className="text-xs text-muted-foreground">
                              Confidence {(scoreInfo.confidence * 100).toFixed(0)}%
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{node.region}</span>
                        <span className="rounded-full bg-secondary/50 px-3 py-1 text-foreground">{node.role}</span>
                        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">{node.impactArea}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
