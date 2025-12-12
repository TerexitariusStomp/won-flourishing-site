import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  Leaf,
  Shield,
  Users,
  Coins,
  Activity,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import heroBg from "@assets/generated_images/hero_background_showing_digital_abundance_merging_with_nature.webp";
import tokenImg from "@assets/generated_images/tokenization_concept_art.webp";
import communityImg from "@assets/generated_images/community_network_visualization.webp";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Won</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/map" className="hover:text-primary transition-colors">
              Map
            </Link>
            <a href="#foundation" className="hover:text-primary transition-colors">Foundation</a>
            <a href="#impact" className="hover:text-primary transition-colors">Impact</a>
            <a href="#stablecoin" className="hover:text-primary transition-colors">Stablecoin</a>
            <a href="#tokenization" className="hover:text-primary transition-colors">Tokenization</a>
          </div>
          <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Join the Movement
          </button>
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
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Abundance, not scarcity
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 text-foreground">
              The Currency of <span className="text-gradient">Shared Flourishing</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              A universally accessible system that channels humanity's abundant resources, knowledge, and cooperation toward thriving communities everywhere.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/25 flex items-center gap-2">
                Begin the Build <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/50 backdrop-blur-sm border border-white/60 text-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-white/80 transition-all flex items-center gap-2">
                Learn How It Works
              </button>
              <Link
                href="/map"
                className="bg-foreground/80 text-background px-8 py-4 rounded-full font-bold text-lg hover:bg-foreground transition-all flex items-center gap-2"
              >
                View the Map <ArrowUpRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Foundation Section */}
      <section id="foundation" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Sufficiency, Not Scarcity</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Live systems naturally cooperate to thrive. When we align incentives toward shared abundance, sufficiency is a design choice. 
                </p>
                <p>
                  Won aligns incentives so communities can resource what they need without fear-based scarcity loops. With transparent commitments to give back before taking, Won transforms underperforming resources into collective assets.
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, title: "Financial Systems", desc: "Stable value, aligned with community benefit." },
                  { icon: Users, title: "Local Trust", desc: "Cooperative assurance that promises are kept." },
                  { icon: Coins, title: "Collective Treasury", desc: "Capital flows back to those who build it." },
                  { icon: Activity, title: "Community Decision", desc: "Voting keeps action aligned with values." }
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
              <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <img
                  src={communityImg}
                  alt="Community Systems"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-2xl max-w-xs shadow-xl hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white" />
                    ))}
                  </div>
                  <span className="font-bold text-sm">+2.4k Members</span>
                </div>
                <p className="text-sm font-medium">"The community itself decides. This democratic process eliminates powerlessness."</p>
              </div>
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
                  <ArrowUpRight className="w-4 h-4" /> Impact Verified
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
                An impact-backed stablecoin without complexity
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                See the essential path from collateral to impact. No extra buttons, just the flow.
              </p>
              <button className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all group">
                Start Minting <ArrowRight className="w-5 h-5 group-hover:text-accent transition-colors" />
              </button>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { step: "01", title: "Choose Backing", desc: "Pick reserves that anchor a stable store of value." },
                { step: "02", title: "Mint Stablecoin", desc: "Lock reserves and mint the stable asset." },
                { step: "03", title: "Put it to Work", desc: "Use for payments, trade, and service access." },
                { step: "04", title: "Rebalance & Prove", desc: "Dashboards expose reserves, flows, and impacts." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
                  <span className="text-6xl font-display font-bold text-black/5 mb-4 block">{item.step}</span>
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
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
                  { title: "Fair-trade Cacao Batch (ERC-6960)", desc: "Ownership stays in core layer, certifications in extension layer." },
                  { title: "Automated Donations (ERC-995)", desc: "Social token routes fee on each transfer to verified beneficiaries." }
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

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-6 h-6 text-primary" />
                <span className="font-display font-bold text-2xl">Won</span>
              </div>
              <p className="text-white/50 max-w-sm mb-8">
                We already have what we need. The choice is to coordinate differently—letting abundance circulate through trust.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white">Platform</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-primary transition-colors">Foundation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Stablecoin</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tokenization</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Governance</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white">Community</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Github</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-16 pt-8 text-center text-white/30 text-sm">
            © 2024 Won Flourishing Network. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
