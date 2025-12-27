import { Link } from "wouter";

export default function TrustGraphFallback() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            TG
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Trust & Vouching</p>
            <h1 className="text-3xl font-bold">KarmaHQ is our trust graph</h1>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">
          We’ve moved project discovery and vouching to KarmaHQ. All We Won projects live in our community there;
          supporters can vouch directly on those listings. This replaces the in-site trust graph.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.karmahq.xyz/communities"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold"
          >
            Open KarmaHQ community
          </a>
          <Link href="/" className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:border-primary">
            Back home
          </Link>
        </div>
        <div className="rounded-3xl border border-border bg-card/50 p-6">
          <h2 className="text-xl font-semibold mb-2">How to vouch</h2>
          <ol className="list-decimal list-inside text-muted-foreground space-y-1 text-sm">
            <li>Visit our KarmaHQ community page.</li>
            <li>Find the project you support and open its listing.</li>
            <li>Submit a vouch with context and evidence directly in KarmaHQ.</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-3">
            WON-linked staking and vouch boosts remain in our roadmap; for now, KarmaHQ is the canonical trust layer.
          </p>
        </div>
      </div>
    </div>
  );
}
