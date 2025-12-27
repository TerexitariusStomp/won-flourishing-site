import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { siteNavLinks } from "@/data/siteLinks";

type SiteHeaderProps = {
  showJoin?: boolean;
};

export default function SiteHeader({ showJoin = true }: SiteHeaderProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b-0">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
          <img
            src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi"
            alt="We Won Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-display font-bold text-xl tracking-tight">We Won</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {siteNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {showJoin && (
            <a
              href="https://t.me/templeearth"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Join the Movement
            </a>
          )}
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-full border border-border bg-white/80 px-3 py-2 text-foreground shadow-sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-6">
                {siteNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {showJoin && (
                  <a
                    href="https://t.me/templeearth"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Join the Movement
                  </a>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
