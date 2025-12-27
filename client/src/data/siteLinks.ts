export type SiteNavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const siteNavLinks: SiteNavLink[] = [
  { label: "Home", href: "/" },
  { label: "Map", href: "/map" },
  { label: "Whitelist", href: "/whitelist" },
  { label: "APY Calculator", href: "/apy" },
  { label: "Buy WON", href: "/buy" },
  { label: "Stake", href: "/stake" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Stablecoin", href: "/stablecoin" },
  { label: "Tokenization", href: "/tokenization" },
  { label: "Documentation", href: "/docs" }
];

export const communityLinks: SiteNavLink[] = [
  { label: "Telegram", href: "https://t.me/templeearth", external: true },
  { label: "Github", href: "https://github.com/templeearth", external: true }
];
