import { Link } from "wouter";
import "./bridge.css";

export default function StablecoinPage() {
  return (
    <div className="bridge-shell">
      <div className="bridge-page">
        <div className="bridge-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img
                src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi"
                alt="Impact stablecoin logo"
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-display font-bold text-xl">Impact Stablecoin Builder</span>
            </div>
            <p className="bridge-eyebrow">Mutiraon-inspired</p>
            <h1 className="bridge-title">Create your own impact-backed stable</h1>
            <p className="bridge-subhead">
              Impact assets once tokenized with us can help create local stablecoins. Explore the
              Amazonedollar example below.
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/" className="bridge-nav-link">
              Back home
            </Link>
            <Link href="/tokenization" className="bridge-nav-link">
              Tokenization
            </Link>
            <a
              href="https://github.com/TerexitariusStomp/Mutiraon"
              target="_blank"
              rel="noreferrer"
              className="bridge-nav-link"
            >
              View Mutiraon repo
            </a>
          </div>
        </div>

        <div className="bridge-card">
          <div className="bridge-banner">Stablecoin example: Amazonedollar.</div>
          <div className="bridge-embed" style={{ minHeight: "560px" }}>
            <iframe
              src="https://amazonedollar.org/"
              title="Amazonedollar stablecoin example"
              frameBorder="0"
              width="100%"
              height="540"
              style={{ border: "1px solid #ccc", borderRadius: "12px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
