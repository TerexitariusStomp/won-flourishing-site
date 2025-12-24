import { Link } from "wouter";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Filter,
  ShieldCheck,
  ShieldOff
} from "lucide-react";
import "./bridge.css";

type SubmissionSource = "Discord" | "Website";

type ImpactProject = {
  id: string;
  name: string;
  region: string;
  focus: string;
  source: SubmissionSource;
  stakeWon: number;
  donateWon: number;
};

const projects: ImpactProject[] = [
  {
    id: "cr-mangrove",
    name: "Cahuita Mangrove Guardians",
    region: "Costa Rica",
    focus: "Coastal regeneration",
    source: "Website",
    stakeWon: 2400,
    donateWon: 780
  },
  {
    id: "cr-cacao",
    name: "Bribri Cacao Commons",
    region: "Costa Rica",
    focus: "Agroforestry",
    source: "Discord",
    stakeWon: 860,
    donateWon: 420
  },
  {
    id: "pnw-salmon",
    name: "Salmon Run Watershed",
    region: "Pacific Northwest",
    focus: "River restoration",
    source: "Website",
    stakeWon: 1330,
    donateWon: 510
  },
  {
    id: "pnw-coop",
    name: "Coastal Co-op Microgrids",
    region: "Pacific Northwest",
    focus: "Energy sovereignty",
    source: "Discord",
    stakeWon: 190,
    donateWon: 260
  },
  {
    id: "ea-solar",
    name: "Lake Region Solar Labs",
    region: "East Africa",
    focus: "Clean energy",
    source: "Website",
    stakeWon: 1100,
    donateWon: 930
  },
  {
    id: "ea-water",
    name: "Rift Valley Water Trust",
    region: "East Africa",
    focus: "Water access",
    source: "Discord",
    stakeWon: 140,
    donateWon: 310
  },
  {
    id: "sea-rice",
    name: "Delta Rice Resilience",
    region: "Southeast Asia",
    focus: "Food systems",
    source: "Website",
    stakeWon: 1580,
    donateWon: 620
  },
  {
    id: "sea-mangrove",
    name: "Island Mangrove Shield",
    region: "Southeast Asia",
    focus: "Coastal defense",
    source: "Discord",
    stakeWon: 670,
    donateWon: 540
  },
  {
    id: "balkan-soil",
    name: "Danube Soil Revival",
    region: "Balkans",
    focus: "Soil health",
    source: "Website",
    stakeWon: 980,
    donateWon: 410
  },
  {
    id: "balkan-housing",
    name: "Mountain Housing Guild",
    region: "Balkans",
    focus: "Housing",
    source: "Discord",
    stakeWon: 120,
    donateWon: 190
  }
];

const regions = ["All regions", ...new Set(projects.map((project) => project.region))];
const sources: Array<"All sources" | SubmissionSource> = [
  "All sources",
  "Discord",
  "Website"
];

const formatWon = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 0 });

export default function PrioritizationPage() {
  const [regionFilter, setRegionFilter] = useState(regions[0]);
  const [sourceFilter, setSourceFilter] = useState(sources[0]);
  const [stakeWeight, setStakeWeight] = useState(60);
  const [donateWeight, setDonateWeight] = useState(40);

  const weights = useMemo(() => {
    const stake = Math.max(stakeWeight, 0);
    const donate = Math.max(donateWeight, 0);
    const total = stake + donate;
    if (!total) {
      return { stake: 0, donate: 0, total: 0 };
    }
    return {
      stake: stake / total,
      donate: donate / total,
      total
    };
  }, [stakeWeight, donateWeight]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesRegion =
        regionFilter === "All regions" || project.region === regionFilter;
      const matchesSource =
        sourceFilter === "All sources" || project.source === sourceFilter;
      return matchesRegion && matchesSource;
    });
  }, [regionFilter, sourceFilter]);

  const rankedProjects = useMemo(() => {
    return filteredProjects
      .map((project) => {
        const score =
          project.stakeWon * weights.stake + project.donateWon * weights.donate;
        const alignmentMet = project.stakeWon >= 1000;
        const discordEligible =
          project.source !== "Discord" || project.stakeWon >= 100;
        return {
          ...project,
          score,
          alignmentMet,
          discordEligible
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [filteredProjects, weights]);

  const alignedProjects = rankedProjects.filter((project) => project.alignmentMet);
  const pendingProjects = rankedProjects.filter((project) => !project.alignmentMet);

  const regionSummary = useMemo(() => {
    return regions
      .filter((region) => region !== "All regions")
      .map((region) => {
        const regionProjects = projects.filter(
          (project) => project.region === region
        );
        const totalStake = regionProjects.reduce(
          (sum, project) => sum + project.stakeWon,
          0
        );
        const totalDonate = regionProjects.reduce(
          (sum, project) => sum + project.donateWon,
          0
        );
        return {
          region,
          count: regionProjects.length,
          totalStake,
          totalDonate
        };
      });
  }, []);

  return (
    <div className="bridge-shell">
      <div className="bridge-page">
        <div className="bridge-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi"
                alt="We Won Logo"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-display font-bold text-xl">We Won</span>
            </div>
            <p className="bridge-eyebrow">Project Prioritization Engine</p>
            <h1 className="bridge-title">Rank impact projects for tokenization</h1>
            <p className="bridge-subhead">
              Scores combine staking + donations from Discord submissions and website
              forms. Projects need 1,000 WON staked to signal alignment, and Discord
              submissions require at least 100 WON staked to be selectable.
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/" className="bridge-nav-link">
              Back home
            </Link>
            <Link href="/tokenization" className="bridge-nav-link">
              Tokenization
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {regionSummary.map((summary) => (
              <div
                key={summary.region}
                className="bg-white border border-border rounded-2xl p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                  {summary.region}
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{summary.count} active submissions</p>
                  <p>{formatWon(summary.totalStake)} WON staked</p>
                  <p>{formatWon(summary.totalDonate)} WON donated</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bridge-card space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <h2 className="bridge-title" style={{ fontSize: "20px", marginBottom: 0 }}>
                  Filters + scoring weights
                </h2>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                  <BadgeCheck className="w-4 h-4" /> 1,000 WON alignment minimum
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 font-semibold text-foreground">
                  <ShieldCheck className="w-4 h-4" /> 100 WON Discord selection
                </span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-2">Benefactor region</label>
                <select
                  className="bridge-select w-full"
                  value={regionFilter}
                  onChange={(event) => setRegionFilter(event.target.value)}
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Submission source</label>
                <select
                  className="bridge-select w-full"
                  value={sourceFilter}
                  onChange={(event) =>
                    setSourceFilter(event.target.value as typeof sourceFilter)
                  }
                >
                  {sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Weight normalization</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span>
                    Stake: {(weights.stake * 100).toFixed(0)}% · Donation:{" "}
                    {(weights.donate * 100).toFixed(0)}% · Total inputs: {weights.total}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stake weight ({stakeWeight}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stakeWeight}
                  onChange={(event) => setStakeWeight(Number(event.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Donation weight ({donateWeight}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={donateWeight}
                  onChange={(event) => setDonateWeight(Number(event.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Aligned projects
                  </p>
                  <h3 className="bridge-title" style={{ fontSize: "22px" }}>
                    Ready for ranking
                  </h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {alignedProjects.length} aligned
                </span>
              </div>
              <div className="space-y-4">
                {alignedProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No aligned projects match these filters yet.
                  </p>
                ) : (
                  alignedProjects.map((project, index) => (
                    <div
                      key={project.id}
                      className="border border-border rounded-xl p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            #{index + 1} · {project.region}
                          </p>
                          <h4 className="font-semibold text-base">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.focus}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Weighted score</p>
                          <p className="text-lg font-semibold text-primary">
                            {formatWon(Math.round(project.score))}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-foreground">
                          {project.source} submission
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                          {formatWon(project.stakeWon)} WON staked
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                          {formatWon(project.donateWon)} WON donated
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                          <BadgeCheck className="w-3 h-3" /> Alignment met
                        </span>
                        {!project.discordEligible && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                            <ShieldOff className="w-3 h-3" /> Discord needs 100 WON
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Needs alignment
                  </p>
                  <h3 className="bridge-title" style={{ fontSize: "22px" }}>
                    Build buy-in
                  </h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {pendingProjects.length} pending
                </span>
              </div>
              <div className="space-y-4">
                {pendingProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    All filtered projects have reached the alignment threshold.
                  </p>
                ) : (
                  pendingProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-border rounded-xl p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{project.region}</p>
                          <h4 className="font-semibold text-base">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.focus}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Weighted score</p>
                          <p className="text-lg font-semibold text-foreground">
                            {formatWon(Math.round(project.score))}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-foreground">
                          {project.source} submission
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                          {formatWon(project.stakeWon)} WON staked
                        </span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                          {formatWon(project.donateWon)} WON donated
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                          <ShieldOff className="w-3 h-3" /> Needs +{formatWon(1000 - project.stakeWon)} WON
                        </span>
                        {!project.discordEligible && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">
                            <ShieldOff className="w-3 h-3" /> Discord needs 100 WON
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 bg-secondary/40 border border-border rounded-2xl p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                Next actions
              </p>
              <h3 className="font-display text-2xl font-semibold">
                Use the rankings to schedule tokenization sprints.
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                Discord submissions are unlocked once they reach 100 WON staked. When
                a project crosses 1,000 WON, it moves into the aligned queue and is
                sorted by your live weight mix.
              </p>
            </div>
            <Link
              href="/tokenization"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              Launch tokenization <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
