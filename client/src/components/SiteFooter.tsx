import { Link } from "wouter";
import { communityLinks, siteNavLinks } from "@/data/siteLinks";

export default function SiteFooter() {
  return (
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
              {siteNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white text-2xl">Community</h4>
            <ul className="space-y-4 text-white/60 text-[17px] leading-relaxed">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">Explore Temple Earth</h1>
        </div>
        <div className="border-t border-white/10 mt-16 pt-8 text-center text-white/30 text-sm">
          (c) 2024 Won Flourishing Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
