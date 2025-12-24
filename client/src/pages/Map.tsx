import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import "./map.css";
import { projectCategories } from "@/data/projectCategories";
import type { Project } from "@shared/schema";

type MapNode = {
  id: string;
  name: string;
  type: keyof typeof categories | string;
  location: string;
  lat: number;
  lng: number;
  desc: string;
};

const categories = projectCategories;

const nodes: MapNode[] = [
  // Platform-tagged sample sites
  {
    id: "RST-001",
    name: "Youth Pawa Mangroves",
    type: "Restor.eco",
    location: "Mombasa, Kenya",
    lat: -4.04,
    lng: 39.62,
    desc: "Community-led mangrove restoration targeting 50+ hectares with CBEMR."
  },
  {
    id: "RST-002",
    name: "The Kilimanjaro Project",
    type: "Restor.eco",
    location: "Kilimanjaro, Tanzania",
    lat: -3.0674,
    lng: 37.3556,
    desc: "Forest protection and reforestation around Kilimanjaro with mobile MRV."
  },
  {
    id: "RST-003",
    name: "AERF Myforest Program",
    type: "Restor.eco",
    location: "Western Ghats, India",
    lat: 17.72,
    lng: 73.65,
    desc: "Incentive-based forest restoration and sacred grove conservation."
  },
  {
    id: "RST-004",
    name: "Instituto Terra",
    type: "Restor.eco",
    location: "Minas Gerais, Brazil",
    lat: -19.5,
    lng: -42.5,
    desc: "Atlantic Forest watershed restoration with 3M+ native trees planted."
  },
  {
    id: "RST-005",
    name: "Ecopore Amazon",
    type: "Restor.eco",
    location: "Rondonia, Brazil",
    lat: -10.8,
    lng: -65,
    desc: "Agroforestry and watershed protection restoring 2,500+ hectares."
  },
  {
    id: "RST-006",
    name: "Uru Uru Lake",
    type: "Restor.eco",
    location: "Oruro, Bolivia",
    lat: -18.9,
    lng: -67,
    desc: "Indigenous youth using totora rafts to absorb heavy metals from the lake."
  },
  {
    id: "RST-007",
    name: "Terraformation",
    type: "Restor.eco",
    location: "Hawaii, USA",
    lat: 19.8968,
    lng: -155.5828,
    desc: "Seed-to-carbon accelerator funding biodiverse reforestation cohorts."
  },
  {
    id: "KHQ-002",
    name: "Barichara Regeneration Fund",
    type: "Karma HQ",
    location: "Barichara, Colombia",
    lat: 6.6333,
    lng: -73.2167,
    desc: "Bioregional regenerative economy prototype; also listed on Giveth."
  },
  {
    id: "GIV-002",
    name: "ReFi Phangan",
    type: "Giveth.io",
    location: "Koh Phangan, Thailand",
    lat: 9.7489,
    lng: 100.0295,
    desc: "Island community hub funding regenerative initiatives via crypto donations."
  },
  {
    id: "GIV-003",
    name: "Territorial Regeneration Barichara",
    type: "Giveth.io",
    location: "Barichara, Colombia",
    lat: 6.6333,
    lng: -73.2167,
    desc: "Bioregional regeneration led by local stewards and Giveth supporters."
  },
  {
    id: "GIV-004",
    name: "Regeneration in War (Ukraine)",
    type: "Giveth.io",
    location: "Ukraine",
    lat: 48.3794,
    lng: 31.1656,
    desc: "Permaculture-driven soil restoration and food security in conflict zones."
  },
  {
    id: "GIV-005",
    name: "Tota Sacred Lake",
    type: "Giveth.io",
    location: "Boyaca, Colombia",
    lat: 5.55,
    lng: -72.9,
    desc: "Water and soil regeneration for a sacred lake via a permaculture biohub."
  },
  {
    id: "TOU-001",
    name: "BC Biocarbon",
    type: "Toucan Protocol",
    location: "McBride, Canada",
    lat: 53.3017,
    lng: -120.1682,
    desc: "Biochar producer turning forestry residues into CORCs and CHAR credits."
  },
  {
    id: "TOU-002",
    name: "American BioCarbon",
    type: "Toucan Protocol",
    location: "Louisiana, USA",
    lat: 30.1699,
    lng: -91.1468,
    desc: "Biochar from sugarcane bagasse; thermal and electric energy co-product."
  },
  {
    id: "COO-001",
    name: "Spanish Fig Orchard",
    type: "Coorest",
    location: "Zaragoza, Spain",
    lat: 41.6488,
    lng: -0.8891,
    desc: "NFTree-backed fig orchard with 5,500 trees and local farmer jobs."
  },
  {
    id: "COO-003",
    name: "315 Guild Forest",
    type: "Coorest",
    location: "Mohawk, USA",
    lat: 42.997,
    lng: -75.0043,
    desc: "Native-species reforestation on reclaimed land with 11,500 trees planned."
  },
  {
    id: "NOR-001",
    name: "Harborview Farms",
    type: "Nori",
    location: "Maryland, USA",
    lat: 39.0458,
    lng: -76.6413,
    desc: "Soil carbon pioneer sequestering 8,000+ tonnes via cover crops and rotation."
  },
  {
    id: "NOR-002",
    name: "Knuth Farms",
    type: "Nori",
    location: "Nebraska, USA",
    lat: 42.0667,
    lng: -95.05,
    desc: "Minimal tillage and diversified rotations on 2,200 acres of cropland."
  },
  {
    id: "RGN-002",
    name: "Sharamentsa Jaguar Credits",
    type: "Regen Network",
    location: "Pastaza, Ecuador",
    lat: -2.5,
    lng: -77,
    desc: "Indigenous-led jaguar habitat protection with blockchain-verified credits."
  },
  {
    id: "RGN-003",
    name: "Philipson Estate Blaston",
    type: "Regen Network",
    location: "Leicestershire, UK",
    lat: 52.517,
    lng: -0.85,
    desc: "Regenerative agriculture generating GHG benefit ecocredits on 267 hectares."
  },
  {
    id: "TER-001",
    name: "Terra0 Autonomous Forest",
    type: "Terra0",
    location: "Brandenburg, Germany",
    lat: 52.4611,
    lng: 13.8397,
    desc: "DAO-governed forest parcels sold as NFTs with biotope certification."
  },
  {
    id: "KLI-001",
    name: "Rimba Raya Reserve",
    type: "KlimaDAO",
    location: "Kalimantan, Indonesia",
    lat: -2.9,
    lng: 111.5,
    desc: "REDD+ forest protection for orangutan habitat; credits bridged via KlimaDAO."
  },

  // Legacy community nodes (kept as requested)
  {
    id: "refi-berlin",
    name: "ReFi DAO Berlin",
    type: "ReFi",
    location: "Berlin, Germany",
    lat: 52.52,
    lng: 13.405,
    desc: "Climate DeFi builders prototyping credit instruments with local regen projects."
  },
  {
    id: "greenpill-denver",
    name: "GreenPill Denver",
    type: "ReFi",
    location: "Denver, USA",
    lat: 39.7392,
    lng: -104.9903,
    desc: "Community of regen founders, active at ETHDenver and year-round meetups."
  },
  {
    id: "regen-network",
    name: "Regen Network HQ",
    type: "ReFi",
    location: "San Jose, Costa Rica",
    lat: 9.9281,
    lng: -84.0907,
    desc: "Core team stewarding ecological state ledgers and land-based pilots."
  },
  {
    id: "savimbo",
    name: "Savimbo",
    type: "ReFi",
    location: "Cali, Colombia",
    lat: 3.4516,
    lng: -76.532,
    desc: "Rainforest guardians channeling carbon income directly to forest communities."
  },
  {
    id: "dao-universe-mx",
    name: "DAO Universe MX",
    type: "Network State",
    location: "Mexico City, Mexico",
    lat: 19.4326,
    lng: -99.1332,
    desc: "Network state guild coordinating DAO services across LATAM."
  },
  {
    id: "klima-athens",
    name: "Klima Athens Cell",
    type: "ReFi",
    location: "Athens, Greece",
    lat: 37.9838,
    lng: 23.7275,
    desc: "KlimaDAO-inspired carbon circle experimenting with local offsets."
  },
  {
    id: "celo-nairobi",
    name: "Celo Nairobi Hub",
    type: "ReFi",
    location: "Nairobi, Kenya",
    lat: -1.2921,
    lng: 36.8219,
    desc: "Mobile-first regen finance pilots with farming cooperatives."
  },
  {
    id: "regen-ledger",
    name: "Regen Ledger Core",
    type: "Tech",
    location: "Portland, USA",
    lat: 45.5122,
    lng: -122.6587,
    desc: "Protocol engineering for ecological data attestation and MRV."
  },
  {
    id: "refi-spring-lisbon",
    name: "ReFi Spring Lisbon",
    type: "Tech",
    location: "Lisbon, Portugal",
    lat: 38.7223,
    lng: -9.1393,
    desc: "Regenerative startup studio blending public goods funding and DeSci tooling."
  },
  {
    id: "native-land",
    name: "Native Land Digital",
    type: "Tech",
    location: "Vancouver, Canada",
    lat: 49.2827,
    lng: -123.1207,
    desc: "Interactive indigenous territory map providing baseline cultural context."
  },
  {
    id: "digital-democracy",
    name: "Digital Democracy",
    type: "Database/Map",
    location: "San Francisco, USA",
    lat: 37.7749,
    lng: -122.4194,
    desc: "Mapeo creators supporting frontline partners in low-connectivity environments."
  },
  {
    id: "mapeo-quito",
    name: "Mapeo Pilot - Quito",
    type: "Database/Map",
    location: "Quito, Ecuador",
    lat: -0.1807,
    lng: -78.4678,
    desc: "City-level pilot connecting Mapeo tools to Andean indigenous mapping."
  },
  {
    id: "openforest-ghana",
    name: "Open Forest Ghana",
    type: "Database/Map",
    location: "Accra, Ghana",
    lat: 5.6037,
    lng: -0.187,
    desc: "Forest monitoring and community reporting using open geospatial stacks."
  },
  {
    id: "waorani",
    name: "Waorani Mapping",
    type: "Indigenous",
    location: "Pastaza, Ecuador",
    lat: -1.45,
    lng: -78.5,
    desc: "Community-led mapping project protecting Waorani territory and rivers."
  },
  {
    id: "suriname-terrastories",
    name: "Terrastories Suriname",
    type: "Indigenous",
    location: "Paramaribo, Suriname",
    lat: 5.852,
    lng: -55.2038,
    desc: "Story mapping with Matawai communities preserving oral histories."
  },
  {
    id: "maori-tech",
    name: "Maori Tech Guild",
    type: "Indigenous",
    location: "Auckland, Aotearoa",
    lat: -36.8485,
    lng: 174.7633,
    desc: "Indigenous technologists weaving tikanga with web-native governance."
  },
  {
    id: "auroville",
    name: "Auroville Ecovillage",
    type: "Ecovillage",
    location: "Tamil Nadu, India",
    lat: 12.0065,
    lng: 79.8109,
    desc: "Long-running intentional community experimenting with regenerative living."
  },
  {
    id: "tamera",
    name: "Tamera Ecovillage",
    type: "Ecovillage",
    location: "Alentejo, Portugal",
    lat: 37.6556,
    lng: -8.5839,
    desc: "Solar village demonstrating water retention landscapes and peace research."
  },
  {
    id: "findhorn",
    name: "Findhorn Ecovillage",
    type: "Ecovillage",
    location: "Moray, Scotland",
    lat: 57.649,
    lng: -3.6,
    desc: "Pioneer ecovillage linking spiritual ecology with local stewardship."
  },
  {
    id: "prospera",
    name: "Prospera",
    type: "Network State",
    location: "Roatan, Honduras",
    lat: 16.317,
    lng: -86.538,
    desc: "Charter city experimenting with alternative governance and ownership."
  },
  {
    id: "network-miami",
    name: "Signal Hub - Miami",
    type: "Network Hub",
    location: "Miami, USA",
    lat: 25.7617,
    lng: -80.1918,
    desc: "Connector group from Telegram chats bridging ReFi and climate tech."
  },
  {
    id: "network-berlin",
    name: "Signal Hub - Berlin",
    type: "Network Hub",
    location: "Berlin, Germany",
    lat: 52.52,
    lng: 13.405,
    desc: "Active WhatsApp hub coordinating IRL meetups and hack nights."
  },
  {
    id: "network-lagos",
    name: "Signal Hub - Lagos",
    type: "Network Hub",
    location: "Lagos, Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    desc: "Grassroots connector network for regen founders across West Africa."
  },
  {
    id: "network-cape-town",
    name: "Signal Hub - Cape Town",
    type: "Network Hub",
    location: "Cape Town, South Africa",
    lat: -33.9249,
    lng: 18.4241,
    desc: "Regional ReFi cluster linking ocean, agri, and on-chain communities."
  },
  {
    id: "network-nairobi",
    name: "Signal Hub - Nairobi",
    type: "Network Hub",
    location: "Nairobi, Kenya",
    lat: -1.2864,
    lng: 36.8172,
    desc: "Connector map of Telegram groups around smallholder regen pilots."
  },
  {
    id: "network-medellin",
    name: "Signal Hub - Medellin",
    type: "Network Hub",
    location: "Medellin, Colombia",
    lat: 6.2442,
    lng: -75.5812,
    desc: "Density of DeSci and public goods hackers visible via chat activity."
  },
  {
    id: "network-sydney",
    name: "Signal Hub - Sydney",
    type: "Network Hub",
    location: "Sydney, Australia",
    lat: -33.8688,
    lng: 151.2093,
    desc: "APAC cluster mixing climate activism and regenerative startups."
  },
  {
    id: "network-manila",
    name: "Signal Hub - Manila",
    type: "Network Hub",
    location: "Manila, Philippines",
    lat: 14.5995,
    lng: 120.9842,
    desc: "SEA coordination node translating regen playbooks for local orgs."
  },
  {
    id: "network-bangalore",
    name: "Signal Hub - Bengaluru",
    type: "Network Hub",
    location: "Bengaluru, India",
    lat: 12.9716,
    lng: 77.5946,
    desc: "Community chat featuring DeSci labs and earth observation engineers."
  },
  {
    id: "restor-site-1",
    name: "Amazon Reforestation Project",
    type: "ReFi",
    location: "Manaus, Brazil",
    lat: -3.119,
    lng: -60.0217,
    desc: "Large-scale reforestation initiative restoring Amazon biodiversity."
  },
  {
    id: "restor-site-2",
    name: "Great Green Wall",
    type: "Indigenous",
    location: "Dakar, Senegal",
    lat: 14.7167,
    lng: -17.4677,
    desc: "African-led initiative to combat desertification across Sahel."
  },
  {
    id: "restor-site-3",
    name: "Coral Reef Restoration",
    type: "Ecovillage",
    location: "Bali, Indonesia",
    lat: -8.4095,
    lng: 115.1889,
    desc: "Community-driven coral reef restoration using Biorock technology."
  },
  {
    id: "restor-site-4",
    name: "Wetland Restoration Ethiopia",
    type: "Database/Map",
    location: "Addis Ababa, Ethiopia",
    lat: 9.145,
    lng: 40.4897,
    desc: "Restoring highland wetlands to improve water security and agriculture."
  },
  {
    id: "restor-site-5",
    name: "Mangrove Protection Vietnam",
    type: "ReFi",
    location: "Ho Chi Minh City, Vietnam",
    lat: 10.8231,
    lng: 106.6297,
    desc: "Mangrove forests protecting coastlines and sequestering carbon."
  },
  {
    id: "agartha-2",
    name: "Agartha Eco-Community",
    type: "Ecovillage",
    location: "Chiapas, Mexico",
    lat: 16.8481,
    lng: -92.283,
    desc: "Sustainable living community focused on permaculture and education."
  },
  {
    id: "gen-ecovillage-1",
    name: "Earthaven Ecovillage",
    type: "Ecovillage",
    location: "Black Mountain, USA",
    lat: 35.6064,
    lng: -82.2587,
    desc: "Permaculture-based community in the Appalachian Mountains."
  },
  {
    id: "gen-ecovillage-2",
    name: "Sieben Linden Ecovillage",
    type: "Ecovillage",
    location: "Linden, Germany",
    lat: 52,
    lng: 14,
    desc: "Eco-community emphasizing natural building and organic farming."
  },
  {
    id: "wwoof-france",
    name: "WWOOF France Network",
    type: "Network Hub",
    location: "Paris, France",
    lat: 48.8566,
    lng: 2.3522,
    desc: "Worldwide Opportunities on Organic Farms host sites across France."
  },
  {
    id: "transition-towns",
    name: "Transition Towns UK",
    type: "Network Hub",
    location: "Totnes, UK",
    lat: 50.4329,
    lng: -3.6851,
    desc: "Resilience-building initiatives in local communities."
  },
  {
    id: "regen-australia",
    name: "Regen Australia",
    type: "ReFi",
    location: "Melbourne, Australia",
    lat: -37.8136,
    lng: 144.9631,
    desc: "Regenerative agriculture and finance projects down under."
  },
  {
    id: "indigenous-brazil",
    name: "Kayapo Territory",
    type: "Indigenous",
    location: "Para, Brazil",
    lat: -7,
    lng: -52,
    desc: "Indigenous-led conservation of Amazon rainforest territories."
  },
  {
    id: "desci-europe",
    name: "DeSci Europe Hub",
    type: "Tech",
    location: "Zurich, Switzerland",
    lat: 47.3769,
    lng: 8.5417,
    desc: "Decentralized science initiatives fostering open research."
  },
  {
    id: "carbon-credits-africa",
    name: "Carbon Credits Africa",
    type: "ReFi",
    location: "Johannesburg, South Africa",
    lat: -26.2041,
    lng: 28.0473,
    desc: "Platform for African carbon credit projects and verification."
  },
  {
    id: "permaculture-asia",
    name: "Asia Pacific Permaculture",
    type: "Ecovillage",
    location: "Kathmandu, Nepal",
    lat: 27.7172,
    lng: 85.324,
    desc: "Regional network promoting permaculture design and training."
  },
  {
    id: "open-data-earth",
    name: "Open Data for Earth",
    type: "Database/Map",
    location: "London, UK",
    lat: 51.5074,
    lng: -0.1278,
    desc: "Open geospatial data for environmental monitoring and restoration."
  },
  {
    id: "network-tokyo",
    name: "Regen Network Tokyo",
    type: "Network Hub",
    location: "Tokyo, Japan",
    lat: 35.6895,
    lng: 139.6917,
    desc: "Urban regeneration and sustainability hubs in East Asia."
  },
  {
    id: "biodiversity-hotspot",
    name: "Cape Floristic Region",
    type: "Indigenous",
    location: "Cape Town, South Africa",
    lat: -33.9249,
    lng: 18.4241,
    desc: "Biodiversity hotspot with community conservation efforts."
  },
  {
    id: "refi-india",
    name: "ReFi India Collective",
    type: "ReFi",
    location: "Mumbai, India",
    lat: 19.076,
    lng: 72.8777,
    desc: "Blockchain-based solutions for sustainable development in India."
  },
  {
    id: "ecovillage-africa",
    name: "Konohas Eco-Village",
    type: "Ecovillage",
    location: "Nairobi, Kenya",
    lat: -1.2921,
    lng: 36.8219,
    desc: "African ecovillage focusing on agroecology and youth empowerment."
  },
  {
    id: "dudley-leggett-org",
    name: "Regenesis Group",
    type: "Network Hub",
    location: "London, UK",
    lat: 51.5074,
    lng: -0.1278,
    desc: "Dudley Leggett's organization promoting regenerative practices in urban planning and community building."
  },
  {
    id: "julia-becker-org",
    name: "Regeneration Mission",
    type: "ReFi",
    location: "Berlin, Germany",
    lat: 52.52,
    lng: 13.405,
    desc: "Julia Becker's initiative on a mission of regeneration, focusing on sustainable tech and community networks."
  },
  {
    id: "tree-willard-org",
    name: "Water Unity Networks",
    type: "Ecovillage",
    location: "California, USA",
    lat: 36.7783,
    lng: -119.4179,
    desc: "Tree Willard's work with Water Unity Networks on water stewardship and cultural spirit in indigenous communities."
  },
  {
    id: "katie-hillborn-org",
    name: "NextGen Stewardship",
    type: "Indigenous",
    location: "Kermode Park, Canada",
    lat: 54,
    lng: -129,
    desc: "Katie Hillborn's NextGen Stewardship projects in indigenous land protection and youth empowerment."
  },
  {
    id: "victor-vorski-org",
    name: "Regenerative Ecosystem Systems",
    type: "Tech",
    location: "Sydney, Australia",
    lat: -33.8688,
    lng: 151.2093,
    desc: "Victor Vorski's building of regenerative ecosystems through tech and community-driven solutions."
  },
  {
    id: "elena-keller-org",
    name: "Positive Planetary Transition",
    type: "Network Hub",
    location: "Moscow, Russia",
    lat: 55.7558,
    lng: 37.6173,
    desc: "Elena Keller's mission for positive planetary transitions via collaborative networks."
  },
  {
    id: "marcelo-shama-org",
    name: "Gaia HUB",
    type: "Ecovillage",
    location: "Sao Paulo, Brazil",
    lat: -23.5505,
    lng: -46.6333,
    desc: "Marcelo Shama's Gaia HUB for unified regenerative living and earth stewardship."
  },
  {
    id: "scarlet-ai-org",
    name: "Scarlet Global AI",
    type: "Tech",
    location: "Global (Remote)",
    lat: 0,
    lng: 0,
    desc: "Relational AI unified network by Scarlet for positive impact in AI-driven regeneration."
  },
  {
    id: "brad-nye-org",
    name: "Regen Ecosystem Admin",
    type: "Network Hub",
    location: "San Francisco, USA",
    lat: 37.7749,
    lng: -122.4194,
    desc: "Brad Nye's administrative role in regenerative ecosystems and community coordination."
  },
  {
    id: "jess-allen-org",
    name: "Glowacki Initiatives",
    type: "ReFi",
    location: "New York, USA",
    lat: 40.7128,
    lng: -74.006,
    desc: "Jess Allen Glowacki's work on glowing regenerative finance and impact projects."
  },
  {
    id: "starseed-village",
    name: "Starseed Village",
    type: "Ecovillage",
    location: "Lake Atitlan, Guatemala",
    lat: 14.742,
    lng: -91.155,
    desc: "Regenerative starseed community fostering positive impact, spiritual ecology, and sustainable living in Guatemala."
  }
];

function buildPopup(node: MapNode) {
  const color = categories[node.type]?.color ?? "#72f2c0";
  return `
    <div style="min-width:220px;font-family:'Space Grotesk',sans-serif;color:#0f172a;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${color};"></span>
        <strong>${node.name}</strong>
      </div>
      <div style="color:#3c475f;font-size:12px;margin-bottom:6px;">${node.location} - ${node.type}</div>
      <div style="color:#1c2335;font-size:13px;line-height:1.4;">${node.desc}</div>
    </div>
  `;
}

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerIndexRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [submittedNodes, setSubmittedNodes] = useState<MapNode[]>([]);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(
    () => new Set(Object.keys(categories))
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      worldCopyJump: true
    }).setView([10, -20], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "(c) OpenStreetMap contributors"
    }).addTo(map);

    const clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 8
    });

    map.addLayer(clusterGroup);
    mapInstanceRef.current = map;
    clusterGroupRef.current = clusterGroup;

    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) return;
        const payload = (await response.json()) as Project[];
        const mapped = payload.map((project) => ({
          id: project.id,
          name: project.name,
          type: project.type,
          location: project.location,
          lat: project.lat,
          lng: project.lng,
          desc: project.desc
        }));
        setSubmittedNodes(mapped);
      } catch {
        // Ignore fetch errors; map still renders static nodes.
      }
    };

    loadProjects();
  }, []);

  const allNodes = useMemo(
    () => [...nodes, ...submittedNodes],
    [submittedNodes]
  );

  const filteredNodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allNodes.filter((node) => {
      const matchesType = activeTypes.has(node.type);
      const searchable = `${node.name} ${node.location} ${node.desc} ${node.type}`.toLowerCase();
      const matchesQuery = !q || searchable.includes(q);
      return matchesType && matchesQuery;
    });
  }, [activeTypes, allNodes, query]);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    const map = mapInstanceRef.current;
    if (!clusterGroup || !map) return;

    clusterGroup.clearLayers();
    markerIndexRef.current.clear();

    filteredNodes.forEach((node) => {
      const color = categories[node.type]?.color ?? "#72f2c0";
      const marker = L.circleMarker([node.lat, node.lng], {
        radius: 9,
        weight: 2,
        opacity: 0.9,
        color,
        fillColor: color,
        fillOpacity: 0.35
      }).bindPopup(buildPopup(node));

      markerIndexRef.current.set(node.id, marker);
      clusterGroup.addLayer(marker);
    });
  }, [filteredNodes]);

  const focusNode = useCallback((id: string) => {
    const marker = markerIndexRef.current.get(id);
    const map = mapInstanceRef.current;
    if (!marker || !map) return;
    const latLng = marker.getLatLng();
    map.setView(latLng, Math.max(map.getZoom(), 4));
    marker.openPopup();
  }, []);

  const toggleType = (type: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const regionLabel = useMemo(() => {
    const regions = new Set(
      filteredNodes.map((node) => {
        const lat = node.lat;
        if (lat > 35) return "North Atlantic";
        if (lat > 0 && lat <= 35) return "Tropics";
        if (lat <= 0 && lat > -35) return "South Atlantic";
        return "Global South";
      })
    );
    if (regions.size === 0) return "No region";
    if (regions.size > 3) return "Global";
    return Array.from(regions).join(" / ");
  }, [filteredNodes]);

  return (
    <div className="map-page">
      <header className="map-header">
        <div className="map-title-block flex items-center gap-3">
          <img
            src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi"
            alt="We Won Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1>Land-Based Regenerative Projects</h1>
          <p>Sample of mapped sites across Restor.eco, Giveth, Karma HQ, Toucan, and more.</p>
        </div>
        <div className="map-actions">
          <Link href="/" className="map-link">
            Back home
          </Link>
          <Link href="/projects/submit" className="map-link">
            Submit project
          </Link>
          <button
            className="map-link map-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? "Hide filters" : "Show filters"}
          </button>
        </div>
      </header>

      <div className="map-layout">
        <aside className={`map-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="map-stats">
            <span className="map-count">
              {filteredNodes.length} mapped projects
            </span>
            <span className="map-pill">{regionLabel}</span>
          </div>

          <div className="map-controls">
            <label className="map-search">
              <input
                type="search"
                placeholder="Search by name, city, or keyword..."
                value={query}
                onChange={(evt) => setQuery(evt.target.value)}
              />
            </label>

            <div className="map-filters">
              {Object.entries(categories).map(([type, meta]) => (
                <label
                  key={type}
                  className={`map-filter ${activeTypes.has(type) ? "active" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={activeTypes.has(type)}
                    onChange={() => toggleType(type)}
                  />
                  <span
                    className="map-dot"
                    aria-hidden
                    style={{ backgroundColor: meta.color }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            <div className="map-legend">
              {Object.entries(categories).map(([key, meta]) => (
                <span key={key}>
                  <span
                    className="map-dot"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden
                  />
                  {meta.label}
                </span>
              ))}
            </div>
          </div>

          <div className="map-list" id="list">
            {filteredNodes.map((node) => {
              const color = categories[node.type]?.color ?? "#72f2c0";
              return (
                <button
                  key={node.id}
                  className="map-card"
                  onClick={() => focusNode(node.id)}
                >
                  <div className="map-card-meta">
                    <span className="map-badge" style={{ borderColor: color }}>
                      <span
                        className="map-dot"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                      {node.type}
                    </span>
                    <span>{node.location}</span>
                  </div>
                  <div className="map-card-name">{node.name}</div>
                  <p className="map-card-desc">{node.desc}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="map-canvas" ref={mapContainerRef} />
      </div>
    </div>
  );
}
