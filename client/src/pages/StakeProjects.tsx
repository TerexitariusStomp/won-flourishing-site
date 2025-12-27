import { Link, useLocation } from "wouter";
import SiteLayout from "@/components/SiteLayout";
import "./bridge.css";

type Project = {
  id: string;
  region: string;
  name: string;
  focus: string;
  target: string;
  staked: string;
  update: string;
};

const projects: Project[] = [
  {
    id: "latam-1",
    region: "latam",
    name: "Barichara Regeneration Fund",
    focus: "Bioregional regeneration hub, agroforestry terraces",
    target: "1,200 households",
    staked: "420k WON",
    update: "Land stewards onboarded, seedling nurseries expanding."
  },
  {
    id: "latam-2",
    region: "latam",
    name: "Tota Sacred Lake",
    focus: "Water quality restoration and permaculture biohubs",
    target: "120 hectares",
    staked: "310k WON",
    update: "Floating gardens underway; youth crews mapped shoreline." 
  },
  {
    id: "africa-1",
    region: "africa",
    name: "Youth Pawa Mangroves",
    focus: "Community-led mangrove restoration",
    target: "50 hectares",
    staked: "280k WON",
    update: "Seed collection and nursery setup in progress."
  },
  {
    id: "africa-2",
    region: "africa",
    name: "Kilimanjaro Reforestation",
    focus: "Forest protection and replanting",
    target: "75 hectares",
    staked: "195k WON",
    update: "Satellite MRV baseline complete; planting cohort recruited."
  },
  {
    id: "apac-1",
    region: "apac",
    name: "AERF Myforest Program",
    focus: "Sacred grove protection",
    target: "300 communities",
    staked: "210k WON",
    update: "Stewardship pledges collected from village circles."
  },
  {
    id: "apac-2",
    region: "apac",
    name: "Western Ghats Soil Labs",
    focus: "Regenerative soil monitoring",
    target: "20 micro-labs",
    staked: "160k WON",
    update: "Pilot sensors deployed with open data dashboards."
  }
];

const regionLabels: Record<string, string> = {
  latam: "Latin America (LatAm)",
  africa: "Africa",
  apac: "Asia-Pacific (APAC)",
  mena: "Middle East & North Africa (MENA)",
  europe: "Europe",
  na: "North America"
};

export default function StakeProjectsPage() {
  const [location] = useLocation();
  const search = location.split("?")[1] ?? "";
  const regionKey = new URLSearchParams(search).get("region") ?? "latam";
  const regionName = regionLabels[regionKey] ?? "Selected Region";
  const filtered = projects.filter((project) => project.region === regionKey);

  return (
    <SiteLayout>
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
              <p className="bridge-eyebrow">Impact projects</p>
              <h1 className="bridge-title">{regionName} funding queue</h1>
              <p className="bridge-subhead">
                Review the impact projects that rise as this region gets more WON stakes. The top
                staked region selects a single monthly project; others queue for the following cycle.
              </p>
            </div>
          </div>

        <div className="bridge-card">
          <div className="bridge-pill-grid">
            <div>
              <p className="bridge-muted">Region focus</p>
              <strong>{regionName}</strong>
            </div>
            <div>
              <p className="bridge-muted">Active projects</p>
              <strong>{filtered.length}</strong>
            </div>
            <div>
              <p className="bridge-muted">Next update</p>
              <strong>Weekly</strong>
            </div>
          </div>

          <div className="bridge-grid" style={{ marginTop: 10 }}>
            {filtered.map((project) => (
              <div
                key={project.id}
                className="border border-border rounded-2xl p-5 shadow-sm bg-white"
              >
                <h3 className="font-display text-lg font-semibold">{project.name}</h3>
                <p className="bridge-muted" style={{ marginTop: 6 }}>
                  {project.focus}
                </p>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stake support</span>
                    <strong>{project.staked}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Target impact</span>
                    <strong>{project.target}</strong>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Stake WON to back this project</span>
                  <Link
                    href={`/stake?region=${regionKey}#stake-form`}
                    className="bridge-primary text-xs px-3 py-1"
                  >
                    Stake WON
                  </Link>
                </div>
                <div className="bridge-banner" style={{ marginTop: 12 }}>
                  {project.update}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </SiteLayout>
  );
}
