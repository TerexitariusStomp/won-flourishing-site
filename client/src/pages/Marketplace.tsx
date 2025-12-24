import { useMemo, useState } from "react";
import { Link } from "wouter";

const regions = [
  "All",
  "Costa Rica",
  "Latin America",
  "North America",
  "Africa",
  "Asia Pacific",
  "Europe",
  "Global"
];

type ProjectToken = {
  symbol: string;
  name: string;
  chain: string;
  address: string;
  price: string;
  liquidity: string;
  impact: string;
};

type ProjectListing = {
  id: string;
  name: string;
  location: string;
  region: string;
  category: string;
  summary: string;
  token: ProjectToken;
};

const projects: ProjectListing[] = [
  {
    id: "CR-001",
    name: "Monteverde Cloud Forest Alliance",
    location: "Puntarenas, Costa Rica",
    region: "Costa Rica",
    category: "Biodiversity restoration",
    summary:
      "Community-led canopy regeneration with rewilding corridors and ranger employment.",
    token: {
      symbol: "MVFA",
      name: "Monteverde Forest Asset",
      chain: "Ethereum",
      address: "0x2fa3...9b21",
      price: "$1.42",
      liquidity: "$1.9M",
      impact: "1 token = 2m² reforested"
    }
  },
  {
    id: "CR-002",
    name: "Nicoya Blue Zones Water Fund",
    location: "Guanacaste, Costa Rica",
    region: "Costa Rica",
    category: "Watershed protection",
    summary:
      "Grassroots watershed restoration with local cooperatives safeguarding springs.",
    token: {
      symbol: "NZWF",
      name: "Nicoya Water Share",
      chain: "Polygon",
      address: "0x98d2...a774",
      price: "$0.68",
      liquidity: "$840K",
      impact: "1 token = 10L clean water preserved"
    }
  },
  {
    id: "LAT-101",
    name: "Andes Agroforestry Commons",
    location: "Cusco, Peru",
    region: "Latin America",
    category: "Agroforestry",
    summary:
      "Farmer-owned agroforestry financing with carbon-backed income streams.",
    token: {
      symbol: "ANDF",
      name: "Andes Farm Note",
      chain: "Base",
      address: "0x7a11...e5a0",
      price: "$2.13",
      liquidity: "$2.4M",
      impact: "1 token = 1kg CO₂ sequestered"
    }
  },
  {
    id: "NA-204",
    name: "Appalachian Soil Regen",
    location: "West Virginia, USA",
    region: "North America",
    category: "Soil regeneration",
    summary:
      "Regenerative grazing cooperatives funding soil health and local food hubs.",
    token: {
      symbol: "SOIL",
      name: "Soil Regen Credit",
      chain: "Arbitrum",
      address: "0x3c2f...0b71",
      price: "$0.94",
      liquidity: "$1.1M",
      impact: "1 token = 1m² soil restored"
    }
  },
  {
    id: "AF-310",
    name: "Sahel Solar Microgrids",
    location: "Ouagadougou, Burkina Faso",
    region: "Africa",
    category: "Clean energy",
    summary:
      "Solar microgrids funding women-led energy cooperatives across the Sahel.",
    token: {
      symbol: "SAHL",
      name: "Sahel Grid Share",
      chain: "Celo",
      address: "0xf190...7ce1",
      price: "$1.08",
      liquidity: "$600K",
      impact: "1 token = 1 week of clean power"
    }
  },
  {
    id: "AP-420",
    name: "Coral Triangle Revival",
    location: "Palawan, Philippines",
    region: "Asia Pacific",
    category: "Marine restoration",
    summary:
      "Reef monitoring + coral gardening with fisher co-ops and youth divers.",
    token: {
      symbol: "CORL",
      name: "Coral Revival Token",
      chain: "Solana",
      address: "9zYw...8t2q",
      price: "$3.55",
      liquidity: "$3.2M",
      impact: "1 token = 0.5m² reef restored"
    }
  },
  {
    id: "EU-530",
    name: "Nordic Circular Materials",
    location: "Gothenburg, Sweden",
    region: "Europe",
    category: "Circular economy",
    summary:
      "Recycled timber supply chain with verified impact reporting and dividends.",
    token: {
      symbol: "NORD",
      name: "Nordic Circular Share",
      chain: "Optimism",
      address: "0x5a21...12de",
      price: "$1.26",
      liquidity: "$1.4M",
      impact: "1 token = 1kg material reused"
    }
  },
  {
    id: "GL-777",
    name: "Regen Ocean Freight Pool",
    location: "Global",
    region: "Global",
    category: "Climate logistics",
    summary:
      "Pooling verified biofuel swaps to decarbonize shipping lanes.",
    token: {
      symbol: "WAVE",
      name: "Ocean Freight Note",
      chain: "Ethereum",
      address: "0x44be...98ac",
      price: "$4.12",
      liquidity: "$4.8M",
      impact: "1 token = 1kg CO₂ avoided"
    }
  }
];

const dexPartners = [
  {
    name: "Uniswap",
    route: "MVFA / WON",
    chain: "Ethereum",
    liquidity: "$3.4M",
    link: "https://app.uniswap.org/"
  },
  {
    name: "Sushi",
    route: "ANDF / USDC",
    chain: "Base",
    liquidity: "$1.2M",
    link: "https://www.sushi.com/"
  },
  {
    name: "Balancer",
    route: "WAVE / WON",
    chain: "Ethereum",
    liquidity: "$2.1M",
    link: "https://app.balancer.fi/"
  },
  {
    name: "Curve",
    route: "NZWF / USDC",
    chain: "Polygon",
    liquidity: "$720K",
    link: "https://curve.fi/"
  }
];

const defaultToken = projects[0]?.token.symbol ?? "";

export default function Marketplace() {
  const [region, setRegion] = useState("All");
  const [activeSide, setActiveSide] = useState<"buy" | "sell">("buy");
  const [selectedToken, setSelectedToken] = useState(defaultToken);
  const [amount, setAmount] = useState("0.0");

  const filteredProjects = useMemo(() => {
    if (region === "All") return projects;
    return projects.filter((project) => project.region === region);
  }, [region]);

  const activeToken = useMemo(
    () => projects.find((project) => project.token.symbol === selectedToken),
    [selectedToken]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Impact Marketplace
            </p>
            <h1 className="text-3xl font-semibold">Tokenized Project Exchange</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-white/70 transition hover:text-white">
              Home
            </Link>
            <Link
              href="/tokenization"
              className="text-white/70 transition hover:text-white"
            >
              Tokenization
            </Link>
            <Link
              href="/map"
              className="text-white/70 transition hover:text-white"
            >
              Project Map
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-12 px-6 py-12">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold">Trade verified impact tokens</h2>
              <p className="mt-3 text-sm text-white/70">
                Each listing represents a real-world regenerative project with a
                token that routes fees back to local stewards. Filter by region
                to discover climate investments aligned with your values.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              {["Verified listings", "DEX liquidity", "On-chain impact", "Treasury fees"].map(
                (label, index) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                  >
                    <p className="text-xs text-white/50">0{index + 1}</p>
                    <p className="mt-2 font-medium">{label}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Regional listings</h3>
              <p className="text-sm text-white/60">
                {filteredProjects.length} projects with active token pools.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((item) => (
                <button
                  key={item}
                  onClick={() => setRegion(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    region === item
                      ? "border-primary bg-primary text-slate-950"
                      : "border-white/20 text-white/70 hover:border-white/60"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                      {project.category}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold">{project.name}</h4>
                    <p className="text-sm text-white/60">{project.location}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                    {project.token.symbol}
                  </span>
                </div>
                <p className="mt-4 text-sm text-white/70">{project.summary}</p>
                <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs text-white/50">Token</p>
                    <p className="mt-1 font-semibold">{project.token.name}</p>
                    <p className="mt-1 text-xs text-white/60">
                      {project.token.chain} · {project.token.address}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-xs text-white/50">Impact Rate</p>
                    <p className="mt-1 font-semibold">{project.token.impact}</p>
                    <p className="mt-1 text-xs text-white/60">Pool {project.token.liquidity}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/50">Live price</p>
                    <p className="text-lg font-semibold">{project.token.price}</p>
                  </div>
                  <button
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase text-slate-950"
                    onClick={() => setSelectedToken(project.token.symbol)}
                  >
                    Trade {project.token.symbol}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Token buy/sell interface</h3>
                <p className="text-sm text-white/60">
                  Swap directly against curated DEX pools with impact fees routed
                  to each project treasury.
                </p>
              </div>
              <div className="flex rounded-full border border-white/10 bg-slate-900/70 p-1">
                {(["buy", "sell"] as const).map((side) => (
                  <button
                    key={side}
                    onClick={() => setActiveSide(side)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase transition ${
                      activeSide === side
                        ? "bg-primary text-slate-950"
                        : "text-white/60"
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50">
                  Token
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-white"
                  value={selectedToken}
                  onChange={(event) => setSelectedToken(event.target.value)}
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.token.symbol}>
                      {project.token.symbol} · {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-white/50">
                  Amount
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-white"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-white/60">Route</p>
                <p>{activeToken?.token.symbol ?? "--"} / WON</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-white/60">Estimated price</p>
                <p>{activeToken?.token.price ?? "--"}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-white/60">Liquidity depth</p>
                <p>{activeToken?.token.liquidity ?? "--"}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-white/60">Impact fee</p>
                <p>0.35% to treasury</p>
              </div>
            </div>

            <button className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-semibold uppercase text-slate-950">
              {activeSide === "buy" ? "Buy" : "Sell"} {selectedToken}
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
            <h3 className="text-xl font-semibold">DEX integrations</h3>
            <p className="mt-2 text-sm text-white/60">
              Connected liquidity venues with live routing and compliance checks.
            </p>
            <div className="mt-6 space-y-4">
              {dexPartners.map((dex) => (
                <a
                  key={dex.name}
                  href={dex.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-primary"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{dex.name}</p>
                      <p className="text-xs text-white/60">{dex.route}</p>
                    </div>
                    <span className="text-xs uppercase text-white/60">
                      {dex.chain}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-white/60">
                    Liquidity {dex.liquidity}
                  </p>
                </a>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs text-primary">
              Aggregated routing improves price execution for impact assets while
              maintaining on-chain traceability.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
