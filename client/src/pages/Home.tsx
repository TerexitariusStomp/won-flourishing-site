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

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

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
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0">
          <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi" alt="We Won Logo" className="w-8 h-8 rounded-full object-cover" />
              <span className="font-display font-bold text-xl tracking-tight">We Won</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <Link href="/map" className="hover:text-primary transition-colors">
                Map
              </Link>
              <Link href="/bridge" className="hover:text-primary transition-colors">
                Bridge
              </Link>
              <Link href="/buy" className="hover:text-primary transition-colors">
                Buy WON
              </Link>
              <Link href="/stake" className="hover:text-primary transition-colors">
                Stake
              </Link>
              <Link href="/stablecoin" className="hover:text-primary transition-colors">Stablecoin</Link>
              <Link href="/tokenization" className="hover:text-primary transition-colors">Tokenization</Link>
            </div>
            {showJoin && (
              <a
                href="https://t.me/templeearth"
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Join the Movement
              </a>
            )}
          </div>
        </nav>

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
                <Link
                  href="/tokenization"
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center gap-2"
                >
                  Begin the Build <ArrowRight className="w-5 h-5" />
                </Link>
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
                <Link
                  href="/bridge"
                  className="bg-secondary text-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary/80 transition-all flex items-center gap-2 border border-border"
                >
                  Launch Bridge <ArrowUpRight className="w-5 h-5" />
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
              <motion.div
                variants={fadeIn}
                className="glass border border-primary/30 bg-white/60 backdrop-blur-md p-6 rounded-2xl max-w-xl shadow-xl"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
                  Magic: Transfer Fee
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Arbitrage bots pay the fee that funds regeneration. They race to close price gaps; we route the yield.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* WON ROI */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
                  ROI: How WON grows
                </p>
                <h3 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Regenerative umbrella that lifts the WON price.
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Each project tokenized contributes a percent fee and liquidity to the shared pool. Staking and DEX activity stack on top, letting communities of impact and every steward see upside as more ecovillages launch.
                </p>
              </div>
              <div className="space-y-6">
                <div className="glass p-5 rounded-2xl border border-border">
                  <p className="text-sm font-semibold text-primary mb-1">Project fees + liquidity</p>
                  <p className="text-muted-foreground">
                    Every tokenized project routes a small percent fee and LP contribution into the WON umbrella pool. More launches = deeper liquidity = higher price support.
                  </p>
                </div>
                <div className="glass p-5 rounded-2xl border border-border">
                  <p className="text-sm font-semibold text-primary mb-1">Staking & DEX fees</p>
                  <p className="text-muted-foreground">
                    Staked WON and paired DEX liquidity earn trading fees; even a 0.3% pool with modest volume compounds yearly yield back to holders and the regen treasury.
                  </p>
                </div>
                <div className="glass p-5 rounded-2xl border border-border">
                  <p className="text-sm font-semibold text-primary mb-1">Compounding flywheel</p>
                  <p className="text-muted-foreground">
                    Fees, LP rewards, and staking yields recycle into new tokenizations and buy pressure, reinforcing the regenerative loop instead of extractive drift.
                  </p>
                </div>
              </div>
            </div>
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
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Your Voice Determines Outcomes</h2>
              <p className="text-xl text-white/70">
                The democratic process affirms: your participation matters. Your voice shapes real outcomes in the physical world.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Climate Restoration", desc: "Direct funding to reforestation, clean energy, and ecosystem recovery.", color: "bg-emerald-500" },
                { title: "Economic Development", desc: "Support local businesses, job creation, and financial inclusion.", color: "bg-blue-500" },
                { title: "Community Wellbeing", desc: "Invest in healthcare, education, and food security initiatives.", color: "bg-amber-500" }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm"
                >
                  <div className={`w-12 h-12 rounded-full ${card.color} mb-6 opacity-90`} />
                  <h3 className="font-display text-2xl font-bold mb-4">{card.title}</h3>
                  <p className="text-white/60 leading-relaxed">{card.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-50">
                    Impact Verified
                  </div>
                </motion.div>
              ))}
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
                  The magic is a transfer fee paid mostly by arbitrage bots. They keep pricing aligned while their activity funds regeneration.
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
                  { step: "01", title: "Assets & Chains", desc: "Backed by USDC, DAI, and native LSTs across Ethereum, Arbitrum, Base, Optimism, and Avalanche.", reveal: true },
                  { step: "02", title: "Magic: Transfer Fee", desc: "Arbitrage bots pay the fee that funds regeneration. They race to close price gaps; we route the yield.", reveal: true },
                  { step: "03", title: "Pricing Mechanics", desc: "Backed at $1.00. Price can rise but never drops below $1.00. Over time it becomes mathematically harder to approach $1 even if every asset outside locked pools sold.", reveal: true },
                  { step: "04", title: "The Vision", desc: "Your one-time gift of giving yourself an asset that appreciates also funds a world of abundance on a world tour tokenizing and connecting eco villages.", reveal: true }
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
                    { title: "Carbon Credit Vault (ERC-4626)", desc: "Users deposit credits; yield is reinvested to accumulate more." },
                    { title: "Fair-trade Redeemable Land-Base-Backed Value Systems Batch (ERC-6960)", desc: "Ownership stays in core layer, certifications in extension layer." },
                    { title: "Automated Donations (ERC-995)", desc: "Social token routes fee on each transfer to verified beneficiaries." },
                    { title: "Abundant Liquidity Pools", desc: "Abundant liquidity pools powered by an abundant stream of funding from WON holders." }
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
                  Our Liquity-inspired Forkonomics model keeps the Won stack coordinated under a single BUSL-1.1 license. Production use requires an agreement; non-production exploration is free. Change License: GPL-2.0-or-later on January 1, 2029.
                </p>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {[
                    "One license across the stack: BUSL-1.1 (Change License: GPL-2.0-or-later on 1/1/2029).",
                    "Additional Use Grant: None. Production deployments require a license agreement with Temple Earth.",
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
                    href="mailto:licensing@templeearth.cc"
                    className="bg-primary text-primary-foreground px-5 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  >
                    Request Production License <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:licensing@templeearth.cc?subject=Friendly%20Fork%20Program"
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
                    desc: "Production license required. Change License: GPL-2.0-or-later on 1/1/2029.",
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
                    desc: "Reach out at licensing@templeearth.cc to request production access.",
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
        <footer className="bg-foreground text-background py-16 border-t border-white/10 relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi"
                    alt="We Won Logo"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-display font-bold text-2xl">We Won</span>
                </div>
                <p className="text-white/50 max-w-sm mb-8 text-[17px] leading-relaxed">
                  We already have what we need. The choice is to coordinate differently, letting abundance circulate through trust.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-white text-2xl">Platform</h4>
                <ul className="space-y-4 text-white/60 text-[17px] leading-relaxed">
                  <li><Link href="/stablecoin" className="hover:text-primary transition-colors">Stablecoin</Link></li>
                  <li><Link href="/tokenization" className="hover:text-primary transition-colors">Tokenization</Link></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Governance</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-white text-2xl">Community</h4>
                <ul className="space-y-4 text-white/60 text-[17px] leading-relaxed">
                  <li><a href="https://t.me/templeearth" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Telegram</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Github</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-16 text-center">
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">Explore the New Earth</h1>
            </div>
            <div className="border-t border-white/10 mt-16 pt-8 text-center text-white/30 text-sm">
              (c) 2024 Won Flourishing Network. All rights reserved.
            </div>
          </div>
        </footer>
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
