import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import "./bridge.css";

export default function StablecoinPage() {
  return (
    <div className="bridge-shell">
      <div className="bridge-page">
        <div className="bridge-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="https://gateway.pinata.cloud/ipfs/QmaMTBq3xaZqxW63ynsoA9mCbYWKuRx9S7SXnE4uwVMB2v" alt="We Won Logo" className="w-9 h-9 rounded-full object-cover" />
              <span className="font-display font-bold text-xl">We Won</span>
            </div>
            <p className="bridge-eyebrow">Stable Plus</p>
            <h1 className="bridge-title">Impact assets, plain language</h1>
            <p className="bridge-subhead">
              Inspired by Mutiraon and simplified so anyone can follow: every unit is backed by easy-to-name impact assets like eco-villages, clean energy, and carbon, and held at a steady $1 floor.
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
          <div className="bridge-grid">
            <div>
              <h3 className="bridge-title" style={{ fontSize: "24px" }}>What backs it</h3>
              <p className="bridge-muted" style={{ marginTop: 8 }}>
                Impact assets you can point to: carbon tons, solar and microgrid revenue, eco-village upgrades. Held across trusted chains like Ethereum and Base, with receipts you can read.
              </p>
            </div>
            <div>
              <h3 className="bridge-title" style={{ fontSize: "24px" }}>How the $1 floor holds</h3>
              <p className="bridge-muted" style={{ marginTop: 8 }}>
                Starts at $1. Arbitrage bots keep prices aligned and pay a small transfer fee whenever they move fast. That fee flows to regeneration, making it harder for price to drift down.
              </p>
            </div>
          </div>

          <div className="bridge-pill-grid" style={{ marginTop: 20 }}>
            <div>
              <p className="bridge-muted">Magic: Transfer Fee</p>
              <strong>
                Arbitrage bots pay the fee that funds regeneration. They race to close price gaps; we route the yield.
              </strong>
              <p className="bridge-muted" style={{ marginTop: 8 }}>
                Plain-speak: the faster traders move, the more impact assets get topped up.
              </p>
            </div>
            <div>
              <p className="bridge-muted">Impact Focus</p>
              <strong>
                Every transaction helps fund eco-villages and regenerative projects around the world, keeping the Mutiraon clarity but aimed at real-world improvements.
              </strong>
              <p className="bridge-muted" style={{ marginTop: 8 }}>
                You pick the bucket; we publish the proof and keep the wording simple.
              </p>
            </div>
          </div>

          <div className="bridge-input-row" style={{ marginTop: 22 }}>
            <div className="bridge-field">
              <label className="bridge-label">Your name</label>
              <input
                type="text"
                className="bridge-input"
                placeholder="e.g., Amina or River Collective"
              />
              <p className="bridge-muted">We put your name on the receipt, just like Mutiraon keeps things personal.</p>
            </div>
            <div className="bridge-field">
              <label className="bridge-label">Impact amount (USD)</label>
              <input
                type="number"
                className="bridge-input"
                placeholder="250"
                min="0"
              />
              <p className="bridge-muted">See how many impact-backed stable units you mint from that deposit.</p>
            </div>
          </div>

          <div className="bridge-input-row" style={{ marginTop: 12 }}>
            <div className="bridge-field">
              <label className="bridge-label">Choose asset bucket</label>
              <select className="bridge-select">
                <option>Eco-village upgrades</option>
                <option>Carbon and biodiversity credits</option>
                <option>Community micro-grids</option>
                <option>Water and soil restoration</option>
              </select>
              <p className="bridge-muted">Pick the impact lane your mint supports.</p>
            </div>
            <div className="bridge-field">
              <label className="bridge-label">Transfer fee destination</label>
              <div className="bridge-input" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="bridge-muted">Route fee to regeneration pool</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </div>
              <p className="bridge-muted">Bots race to balance price; their fee keeps the regeneration pool topped up.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
