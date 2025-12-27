import SiteLayout from "@/components/SiteLayout";
import "./bridge.css";

type ProjectListing = {
  id: string;
  name: string;
  location: string;
  summary: string;
  tokenSymbol: string;
};

const projects: ProjectListing[] = [
  {
    id: "CR-001",
    name: "Monteverde Cloud Forest Alliance",
    location: "Puntarenas, Costa Rica",
    summary:
      "Example token representing canopy regeneration with rewilding corridors and ranger employment.",
    tokenSymbol: "MVFA"
  },
  {
    id: "CR-002",
    name: "Nicoya Blue Zones Water Fund",
    location: "Guanacaste, Costa Rica",
    summary:
      "Example token for watershed restoration with local cooperatives safeguarding springs.",
    tokenSymbol: "NZWF"
  },
  {
    id: "LAT-101",
    name: "Andes Agroforestry Commons",
    location: "Cusco, Peru",
    summary:
      "Example token for farmer-owned agroforestry financing with carbon-backed income streams.",
    tokenSymbol: "ANDF"
  },
  {
    id: "NA-204",
    name: "Appalachian Soil Regen",
    location: "West Virginia, USA",
    summary:
      "Example token for regenerative grazing cooperatives funding soil health and local food hubs.",
    tokenSymbol: "SOIL"
  }
];

const alcorSwapUrl = "https://proton.alcor.exchange/swap?input=XPR-eosio.token&output=WON-w3won";

export default function Marketplace() {
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
              <p className="bridge-eyebrow">Marketplace</p>
              <h1 className="bridge-title">Example impact tokens</h1>
              <p className="bridge-subhead">
                These listings are illustrative. Each token links out to the Proton Alcor swap so you
                can explore trading flows directly on the exchange.
              </p>
            </div>
          </div>

          <div className="bridge-card">
            <div className="bridge-banner">
              All projects listed are example tokens. Trade routes redirect to Alcor for execution on
              Proton; liquidity and fees are handled there.
            </div>
            <div className="bridge-grid" style={{ marginTop: 16 }}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-border rounded-2xl p-5 shadow-sm bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                        Example token
                      </p>
                      <h3 className="font-display text-lg font-semibold">{project.name}</h3>
                      <p className="bridge-muted" style={{ marginTop: 4 }}>
                        {project.location}
                      </p>
                    </div>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">
                      {project.tokenSymbol}
                    </span>
                  </div>
                  <p className="bridge-muted" style={{ marginTop: 10 }}>
                    {project.summary}
                  </p>
                  <div className="bridge-input-row" style={{ marginTop: 12 }}>
                    <a
                      className="bridge-primary"
                      href={alcorSwapUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Trade on Alcor
                    </a>
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
