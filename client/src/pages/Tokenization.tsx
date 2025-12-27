import { CheckCircle2 } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
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
};

const flows: Flow[] = [
  {
    title: "Redeemable Goods Token (ECO-VEG)",
    desc: "A token redeemable only for specific goods or services from an ecovillage.",
    fields: [
      { label: "Token name", placeholder: "Ecovillage Veg Share" },
      { label: "Symbol", placeholder: "ECO-VEG" },
      { label: "Redeemable for", placeholder: "Weekly vegetable box" },
      { label: "Redemption unit", placeholder: "1 token = 1 box" },
      { label: "Issuing community", placeholder: "Temple Earth Farm" }
    ]
  },
  {
    title: "Renewable Energy Credits",
    desc: "Each token represents a specific unit of verified renewable energy.",
    fields: [
      { label: "Energy source", placeholder: "Solar microgrid" },
      { label: "Token unit", placeholder: "1 token = 1 kWh" },
      { label: "Site location", placeholder: "Hilltop array" },
      { label: "Verification cadence", placeholder: "Monthly meter report" },
      { label: "Issuing cooperative", placeholder: "Sunrise Energy Co-op" }
    ]
  },
  {
    title: "Food Share Tokens",
    desc: "Community food shares redeemable for harvest pickups.",
    fields: [
      { label: "Share size", placeholder: "Family basket" },
      { label: "Pickup schedule", placeholder: "Every Friday" },
      { label: "Season window", placeholder: "May - October" },
      { label: "Issuing farm", placeholder: "Cascadia CSA" }
    ]
  },
  {
    title: "Compost Credits",
    desc: "Each token represents a specific compost allocation.",
    fields: [
      { label: "Compost type", placeholder: "Hot-compost blend" },
      { label: "Token unit", placeholder: "1 token = 1 kg" },
      { label: "Collection window", placeholder: "Monthly pickup" },
      { label: "Redemption location", placeholder: "Soil shed" }
    ]
  },
  {
    title: "Community Labor Hours",
    desc: "One token equals one hour of agreed community labor.",
    fields: [
      { label: "Labor category", placeholder: "Garden care" },
      { label: "Token unit", placeholder: "1 token = 1 hour" },
      { label: "Task exchange", placeholder: "Up to 4 hours / week" },
      { label: "Steward contact", placeholder: "labor@templeearth.cc" }
    ]
  },
  {
    title: "Festival & Learning Tokens",
    desc: "Game-like tokens for events, festivals, learning experiences, or low-cost services like room nights and tool lending.",
    fields: [
      { label: "Event or service", placeholder: "Harvest festival pass" },
      { label: "Experience type", placeholder: "Workshop + ritual" },
      { label: "Token utility", placeholder: "Redeem for entry + meal" },
      { label: "Redemption window", placeholder: "Festival week" }
    ]
  }
];

export default function TokenizationPage() {
  return (
    <SiteLayout>
      <div className="bridge-shell">
        <div className="bridge-page">
          <div className="bridge-header">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi" alt="We Won Logo" className="w-9 h-9 rounded-full object-cover" />
                <span className="font-display font-bold text-xl">We Won</span>
              </div>
              <p className="bridge-eyebrow">Tokenization Protocols</p>
              <h1 className="bridge-title">Launch Your Impact Asset</h1>
              <p className="bridge-subhead">
                Example tokenization flows only. Focus on redeemable goods, energy, compost, and
                community services before opening a production build.
              </p>
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
                      <div className="space-y-2">
                        {flow.fields.map((field) => (
                          <div key={field.label} className="text-sm">
                            <span className="font-semibold">{field.label}:</span>{" "}
                            <span className="text-muted-foreground">
                              {field.placeholder || "Example value"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="bridge-muted mt-3 text-xs">
                        Example only. Deployments reopen with production staking and licensing checks.
                      </p>
                    </div>
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
