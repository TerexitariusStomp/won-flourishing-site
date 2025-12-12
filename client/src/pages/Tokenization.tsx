import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import "./bridge.css";

type FlowField = {
  label: string;
  type?: "text" | "number" | "select";
  placeholder?: string;
  options?: string[];
  helper?: string;
};

type Flow = {
  title: string;
  desc: string;
  fields: FlowField[];
  cta: string;
};

const flows: Flow[] = [
  {
    title: "Carbon Credit Vault (ERC-4626)",
    desc: "Deposit carbon credits, name your vault, and show how many tons you are compounding.",
    cta: "Preview vault",
    fields: [
      { label: "Your name", placeholder: "Amina" },
      { label: "Project name", placeholder: "Cahuita mangrove credits" },
      { label: "Amount of credits", type: "number", placeholder: "120" },
      { label: "Expected yield %", type: "number", placeholder: "4.5" },
      {
        label: "Reinvest cadence",
        type: "select",
        options: ["Auto-compound", "Monthly payout", "Quarterly payout"]
      }
    ]
  },
  {
    title: "Fair-trade Cacao Batch (ERC-6960)",
    desc: "Tokenize a cacao batch with layered certifications and who stewarded it.",
    cta: "Issue batch token",
    fields: [
      { label: "Batch name", placeholder: "Cacao - Valley Lot #12" },
      { label: "Farmer / co-op", placeholder: "Bribri Collective" },
      { label: "Amount (kg)", type: "number", placeholder: "500" },
      {
        label: "Certification type",
        type: "select",
        options: ["Organic", "Fair Trade", "Rainforest Alliance", "Direct trade"]
      },
      {
        label: "Destination chain",
        type: "select",
        options: ["Ethereum", "Base", "Optimism", "Polygon"]
      }
    ]
  },
  {
    title: "Automated Donations (ERC-995)",
    desc: "Attach a donation stream to every transfer in a social token.",
    cta: "Route donations",
    fields: [
      { label: "Token name", placeholder: "Community Care Token" },
      { label: "Symbol", placeholder: "CARE" },
      { label: "Donation percentage", type: "number", placeholder: "2.5" },
      { label: "Beneficiary address", placeholder: "0x..." }
    ]
  },
  {
    title: "Abundant Liquidity Pools",
    desc: "Seed liquidity with clear intent and who is funded.",
    cta: "Create pool",
    fields: [
      { label: "Pool name", placeholder: "Eco-village launch pool" },
      { label: "Initial liquidity amount", type: "number", placeholder: "10,000" },
      {
        label: "Project focus",
        type: "select",
        options: ["Energy", "Water", "Food", "Housing", "Education"]
      },
      { label: "Your wallet", placeholder: "0x..." }
    ]
  }
];

export default function TokenizationPage() {
  const [activeForm, setActiveForm] = useState<number | null>(null);

  return (
    <div className="bridge-shell">
      <div className="bridge-page">
        <div className="bridge-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="https://gateway.pinata.cloud/ipfs/QmaMTBq3xaZqxW63ynsoA9mCbYWKuRx9S7SXnE4uwVMB2v" alt="We Won Logo" className="w-9 h-9 rounded-full object-cover" />
              <span className="font-display font-bold text-xl">We Won</span>
            </div>
            <p className="bridge-eyebrow">Tokenization Protocols</p>
            <h1 className="bridge-title">Launch Your Impact Asset</h1>
            <p className="bridge-subhead">
              Use these simple forms to tokenize real-world impact projects. Enter your own name, amounts, and destinations just like on the live tokenization page.
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/" className="bridge-nav-link">
              Back home
            </Link>
            <Link href="/stablecoin" className="bridge-nav-link">
              Stablecoin
            </Link>
          </div>
        </div>

        <div className="bridge-card">
          <div className="bridge-grid">
            {flows.map((flow, index) => (
              <div key={flow.title} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="bridge-title" style={{ fontSize: "20px", marginBottom: "8px" }}>
                      {flow.title}
                    </h3>
                    <p className="bridge-muted mb-4">{flow.desc}</p>
                    {activeForm === index ? (
                      <form className="space-y-4">
                        {flow.fields.map((field) => (
                          <div key={field.label}>
                            <label className="block text-sm font-medium mb-1">{field.label}</label>
                            {field.type === "select" ? (
                              <select className="bridge-select w-full">
                                {field.options?.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.type ?? "text"}
                                placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}`}
                                className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            )}
                            {field.helper && (
                              <p className="bridge-muted text-xs mt-1">{field.helper}</p>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                          {flow.cta}
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setActiveForm(index)}
                        className="text-primary hover:underline text-sm"
                      >
                        Fill in details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
