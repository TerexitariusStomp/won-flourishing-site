// SPDX-License-Identifier: BUSL-1.1
/**
 * Copyright (c) 2024 Temple Earth
 *
 * Entire stack is licensed under BUSL-1.1. Production use requires a license
 * agreement; see /LICENSE and docs/LICENSING.md.
 */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Shield,
  Users,
  Coins,
  Activity,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import heroBg from "@assets/generated_images/hero_background_showing_digital_abundance_merging_with_nature.webp";
import tokenImg from "@assets/generated_images/tokenization_concept_art.webp";
import MapPage from "@/pages/Map";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

const supporterTiers = [
  {
    name: "Seed Supporter",
    amount: "50 WON",
    note: "Donate or stake",
    perks: [
      "Logo placement on the ecosystem supporter wall",
      "Monthly on-chain impact recap",
      "Priority invites to community calls"
    ]
  },
  {
    name: "Builder Circle",
    amount: "100 WON",
    note: "Donate or stake",
    perks: [
      "Discord buy-in + Builder Circle role",
      "Prioritize your project for tokenization review",
      "Access to steward-only strategy threads"
    ]
  },
  {
    name: "Steward Collective",
    amount: "250 WON",
    note: "Donate or stake",
    perks: [
      "Co-create quarterly ecosystem roadmaps",
      "Early access to partner drops and launches",
      "Featured on the ecosystem map spotlight"
    ]
  },
  {
    name: "Guardian Guild",
    amount: "500 WON",
    note: "Donate or stake",
    perks: [
      "Private governance salons with core team",
      "Dedicated onboarding for regional initiatives",
      "Premium supporter badge + co-branding options"
    ]
  }
];

export default function Home() {
  const [showJoin, setShowJoin] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const MAP_REVEAL_OFFSET = 260;

  useEffect(() => {
    const onScroll = () => {
      setShowJoin(window.scrollY > 20);
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - MAP_REVEAL_OFFSET;
      setAtBottom(nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/20">
      <div
        className={`transition-all duration-700 ${
          atBottom ? "opacity-0 translate-y-6 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Navigation */}
        <SiteHeader showJoin={showJoin} />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={heroBg}
              alt="Abundance flowing"
              className="w-full h-full object-cover opacity-90"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-5xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl flex flex-col"
              style={{ gap: "21px" }}
            >
              <motion.h1 variants={fadeIn} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-foreground">
                The Currency of <span className="text-gradient">Shared Flourishing</span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                A universally accessible system that channels humanity's abundant resources, knowledge, and cooperation toward thriving communities everywhere.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/templeearth"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center gap-2"
                >
                  Begin the Build <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#stablecoin"
                  className="bg-white/50 backdrop-blur-sm border border-white/60 text-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-white/80 transition-all flex items-center gap-2"
                >
                  Learn How It Works
                </a>
                <Link
                  href="/map"
                  className="bg-foreground/80 text-background px-8 py-4 rounded-full font-bold text-lg hover:bg-foreground transition-all flex items-center gap-2"
                >
                  View the Map <ArrowUpRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://t.me/templeearth"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-primary/10 text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/20 transition-all flex items-center gap-2 border border-primary/20"
                >
                  Join the Movement <ArrowUpRight className="w-5 h-5" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Eco-Villages Section */}
        <section id="foundation" className="py-24 md:py-32 relative">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Ecovillages in Motion</h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>We support ecovillages of every size and climate, starting where momentum is strong and building the tools that help each community thrive.</p>
                  <p>Each launch is built for the next village to plug in, compounding trust, liquidity, and shared tools so regenerative teams can focus on their land and people.</p>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Shield, title: "Stewardship", desc: "Redeemable, interchangeable land-base-backed value systems stewarded with care." },
                    { icon: Users, title: "Community", desc: "Diverse ecovillages blending indigenous wisdom, permaculture practices, and innovative technologies to foster sustainable, abundant communities." },
                    { icon: Coins, title: "Reciprocity", desc: "Value loops back into the soil and people." },
                    { icon: Activity, title: "Vitality", desc: "Movement, ritual, and daily practice." }
                  ].map((item, i) => (
                    <div key={i} className="glass p-6 rounded-2xl hover:border-primary/50 transition-colors group">
                      <item.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80"
                  alt="Ecovillage landscape"
                  className="aspect-square w-full rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-24 bg-foreground text-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] rounded-full" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-20">
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Staking Prioritizes Outcomes</h2>
              <p className="text-xl text-white/70">
                Staked WON signals which projects rise to the top of the queue. Stewardship weight guides review priority, funding sequences, and the rollout calendar.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Stake to Signal", desc: "Stake WON to express which initiatives deserve attention first.", color: "bg-emerald-500" },
                { title: "Priority Queue", desc: "Higher-staked projects move forward faster in the tokenization pipeline.", color: "bg-blue-500" },
                { title: "Transparent Outcomes", desc: "Progress updates and verification keep priorities accountable to stewards.", color: "bg-amber-500" }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm"
                >
                  <div className={`w-12 h-12 rounded-full ${card.color} mb-6 opacity-90`} />
                  <h3 className="font-display text-2xl font-bold mb-4">{card.title}</h3>
                  <p className="text-white/60 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WON ROI */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                  Impact Verified
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                  Value Alignment
                </p>
                <h3 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
                  A liquidity flywheel designed to support long-term resilience.
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Each project tokenized contributes fees and liquidity into a shared pool. Staking and DEX activity can add depth, helping communities coordinate stewardship as more ecovillages launch.
                </p>
              </div>
              <div className="space-y-6">
                <div className="glass p-5 rounded-2xl border border-border">
                  <p className="text-sm font-semibold text-primary mb-1">Project fees + liquidity</p>
                  <p className="text-muted-foreground">
                    Every tokenized project routes a small percent fee and LP contribution into the WON umbrella pool. More launches can deepen liquidity and support healthier market conditions.
                  </p>
                </div>
                <div className="glass p-5 rounded-2xl border border-border">
                  <p className="text-sm font-semibold text-primary mb-1">Staking & DEX fees</p>
                  <p className="text-muted-foreground">
                    Staked WON and paired DEX liquidity may earn trading fees that can be shared with participants and the community treasury.
                  </p>
                </div>
                <div className="glass p-5 rounded-2xl border border-border">
                  <p className="text-sm font-semibold text-primary mb-1">Compounding flywheel</p>
                  <p className="text-muted-foreground">
                    Fees, LP rewards, and staking yields can be recycled into new tokenizations and liquidity programs as governed by stewards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Card */}
        <section className="py-20 bg-foreground text-background">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">WON Card</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Spend your impact rewards anywhere.
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                A dedicated WON card is being prepared so supporters can spend wherever Visa and Mastercard are accepted while keeping rewards on-chain. Balances draw from your WON holdings; impact remains auditable.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="px-3 py-2 rounded-full bg-white/10 border border-white/20">On-chain balance funding</span>
                <span className="px-3 py-2 rounded-full bg-white/10 border border-white/20">Visa / Mastercard acceptance</span>
                <span className="px-3 py-2 rounded-full bg-white/10 border border-white/20">Impact rewards preserved</span>
              </div>
            </div>
            <div className="glass bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-background">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-primary">WON Impact Card</p>
                  <p className="text-2xl font-display font-bold">Preview</p>
                </div>
                <div className="text-right text-sm text-white/70">
                  <p>Card Network</p>
                  <p className="font-semibold text-white">Visa / Mastercard</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="font-display text-2xl font-bold">WON</div>
                  <div className="text-sm">Impact Balance</div>
                </div>
                <div className="mt-6 text-3xl font-bold tracking-wide">4,820 WON</div>
                <div className="mt-8 flex items-center justify-between text-sm">
                  <div>
                    <p className="opacity-80">Name</p>
                    <p className="font-semibold">We Won Steward</p>
                  </div>
                  <div className="text-right">
                    <p className="opacity-80">Valid</p>
                    <p className="font-semibold">12/30</p>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm text-white/70">
                Load from WON, spend globally, and keep regenerative impact in view.
              </p>
            </div>
          </div>
        </section>

        {/* Stablecoin Flow */}
        <section id="stablecoin" className="py-24 md:py-32 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3">
                <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">The Mechanism</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Stable Plus
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  WON is backed by stablecoins on XPR, designed to keep reserves transparent and community-directed.
                </p>
                <Link
                  href="/stablecoin"
                  className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all group"
                >
                  Start Minting <ArrowRight className="w-5 h-5 group-hover:text-accent transition-colors" />
                </Link>
              </div>

              <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { step: "01", title: "Assets & Chains", desc: "WON is backed by stablecoins on XPR with on-chain reserves visible to stewards.", reveal: true },
                  { step: "02", title: "Treasury Routing", desc: "Governance steers how fees and reserves support new tokenizations, liquidity, and community grants.", reveal: true },
                  { step: "03", title: "Pricing Mechanics", desc: "Designed to reference a $1 baseline with buffers and governance controls; market prices can drift above that baseline as demand and liquidity evolve.", reveal: true },
                  { step: "04", title: "The Vision", desc: "Shared units of account that empower ecovillages to coordinate funding, tokenization, and long-term stewardship.", reveal: true }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`bg-white p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow group ${
                      item.reveal ? "overflow-hidden relative" : ""
                    }`}
                  >
                    <span className="text-6xl font-display font-bold text-black/5 mb-4 block">{item.step}</span>
                    <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                    <p
                      className={`text-muted-foreground transition-all duration-200 ${
                        item.reveal ? "opacity-0 group-hover:opacity-100 translate-y-2" : ""
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tokenization */}
        <section id="tokenization" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <img
                  src={tokenImg}
                  alt="Tokenization"
                  className="rounded-3xl shadow-2xl w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="order-1 md:order-2">
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">Impact projects, tokenized simply.</h2>

                <div className="space-y-6">
                  {[
                    { title: "Redeemable Goods Tokens (e.g., ECO-VEG)", desc: "Redeemable only for specific goods or services, like weekly vegetable boxes or farm products." },
                    { title: "Renewable Energy Credits", desc: "Each token represents 1 kWh of verified solar or wind energy." },
                    { title: "Food Share Tokens", desc: "Seasonal food shares redeemable for weekly harvest pickups." },
                    { title: "Compost Credits", desc: "Each token represents 1 kg of compost returned to the soil." },
                    { title: "Community Labor Hours", desc: "One token equals one hour of agreed community labor." },
                    { title: "Ecovillage Service Credits", desc: "Game-like or practical tokens for events, festivals, learning experiences, or low-cost services like room nights and tool lending." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Stakeholder Tiers */}
        <section id="tiers" className="py-24 md:py-32 bg-secondary/20 border-t border-border/60">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                Ecosystem Stakeholder Tiers
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Stake WON, shape shared priorities.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Supporters who donate or stake WON receive tiered benefits, visibility, and deeper access to the regenerative roadmap.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {supporterTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="bg-white rounded-3xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="mb-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">{tier.note}</p>
                    <h3 className="font-display text-2xl font-bold mt-2">{tier.name}</h3>
                    <p className="text-3xl font-display font-bold text-foreground mt-3">{tier.amount}</p>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground flex-1">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/buy"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    Get WON <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Licensing */}
        <section id="licensing" className="py-24 md:py-32 bg-secondary/30 border-t border-border/60">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-14 items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                  Licensing & Alignment
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Stewarded core. Open integrations.
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our Liquity-inspired Forkonomics model keeps the Won stack coordinated under a single BUSL-1.1 license. Production use requires an agreement and a GitHub pull request; non-production exploration is free.
                </p>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {[
                    "One license across the stack: BUSL-1.1 for all services and integrations.",
                    "Production deployments require a GitHub pull request to request and record the license grant.",
                    "Friendly fork program expects security audits for modifications plus alignment allocations to original users."
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="https://github.com/templeearth"
                    className="bg-primary text-primary-foreground px-5 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  >
                    Request Production License <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/templeearth"
                    className="border border-border px-5 py-3 rounded-full font-semibold text-sm hover:border-primary/60 hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    Join Friendly Forks <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  See docs/LICENSING.md in the repo for full parameters and stewardship expectations.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Entire Stack",
                    badge: "BUSL-1.1",
                    desc: "Production license captured via GitHub PR with the stewarding team.",
                    icon: Shield
                  },
                  {
                    title: "Non-Production Use",
                    badge: "Allowed",
                    desc: "Testing, audits, and development are permitted without a production agreement.",
                    icon: Activity
                  },
                  {
                    title: "Friendly Forks",
                    badge: "Stewarded",
                    desc: "Audits required for modifications; alignment drops for original users.",
                    icon: Coins
                  },
                  {
                    title: "Contact",
                    badge: "Licensing",
                    desc: "Open a GitHub PR or issue to initiate a production access review.",
                    icon: Users
                  }
                ].map((card, i) => (
                  <div
                    key={i}
                    className="glass p-5 rounded-2xl border border-border hover:border-primary/50 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <card.icon className="w-6 h-6 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <SiteFooter />
        <div className="h-28 md:h-36" aria-hidden />
      </div>

      {/* Map Reveal on bottom scroll */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-opacity duration-700 ${
          atBottom ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold shadow-lg"
          >
            Back to site
          </button>
        </div>
        <MapPage />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
          Scroll or tap "Back to site" to return up.
        </div>
      </div>
    </div>
  );
}
