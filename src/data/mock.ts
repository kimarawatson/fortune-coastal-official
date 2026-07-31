import villa from "@/assets/asset-villa.jpg";
import penthouse from "@/assets/asset-penthouse.jpg";
import lambo from "@/assets/asset-lambo.jpg";
import ferrari from "@/assets/asset-ferrari.jpg";
import yacht from "@/assets/asset-yacht.jpg";
import jet from "@/assets/asset-jet.jpg";
import concierge from "@/assets/asset-concierge.jpg";
import hamptons from "@/assets/asset-hamptons.jpg";
import aspen from "@/assets/asset-aspen.jpg";
import beverlyhills from "@/assets/asset-beverlyhills.jpg";
import miami from "@/assets/asset-miami.jpg";
import bugatti from "@/assets/asset-bugatti.jpg";
import rolls from "@/assets/asset-rolls.jpg";
import napa from "@/assets/asset-napa.jpg";
import bombardier from "@/assets/asset-bombardier.jpg";
import westport from "@/assets/asset-westport.jpg";

export type Category = "Real Estate" | "Luxury Cars" | "Yachts" | "Private Jets" | "Concierge Services";

export interface Asset {
  id: string;
  title: string;
  category: Category;
  location: string;
  country: string;
  priceUsd: number;
  priceBtc: number;
  image: string;
  gallery: string[];
  description: string;
  specs: { label: string; value: string }[];
  verified: boolean;
  btcAccepted: boolean;
  seller: { name: string; rating: number; deals: number };
  featured?: boolean;
}

const btc = (usd: number) => +(usd / 95000).toFixed(2);

export const assets: Asset[] = [
  // ───────── Real Estate (US-led) ─────────
  {
    id: "hamptons-oceanfront-estate",
    title: "Oceanfront Estate, East Hampton",
    category: "Real Estate",
    location: "East Hampton, NY",
    country: "United States",
    priceUsd: 49500000,
    priceBtc: btc(49500000),
    image: hamptons,
    gallery: [hamptons, penthouse, villa],
    description:
      "A shingle-style oceanfront compound on 4.2 oceanfront acres with private dune access, twin pools, guest cottage, and a tennis pavilion. Designed by Robert A.M. Stern Architects.",
    specs: [
      { label: "Bedrooms", value: "11" },
      { label: "Land", value: "4.2 acres" },
      { label: "Interior", value: "14,800 sq ft" },
      { label: "Year", value: "2022" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Hampton Sotheby's Realty", rating: 4.9, deals: 96 },
    featured: true,
  },
  {
    id: "beverly-hills-modern",
    title: "Beverly Hills Glass Residence",
    category: "Real Estate",
    location: "Beverly Hills, CA",
    country: "United States",
    priceUsd: 38500000,
    priceBtc: btc(38500000),
    image: beverlyhills,
    gallery: [beverlyhills, penthouse],
    description:
      "A contemporary glass residence above the Sunset Strip with 270° views of Los Angeles, infinity pool, screening room, and 8-car subterranean gallery.",
    specs: [
      { label: "Bedrooms", value: "7" },
      { label: "Interior", value: "12,400 sq ft" },
      { label: "Lot", value: "0.94 acres" },
      { label: "Year", value: "2023" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "The Agency Beverly Hills", rating: 4.9, deals: 134 },
    featured: true,
  },
  {
    id: "manhattan-skyline-penthouse",
    title: "Skyline Penthouse, 432 Park",
    category: "Real Estate",
    location: "Manhattan, NY",
    country: "United States",
    priceUsd: 68000000,
    priceBtc: btc(68000000),
    image: penthouse,
    gallery: [penthouse, villa],
    description:
      "A full-floor penthouse with 360° views of Manhattan, Central Park, and the Hudson. Private elevator, double-height ceilings, and curated interiors.",
    specs: [
      { label: "Bedrooms", value: "6" },
      { label: "Interior", value: "8,255 sq ft" },
      { label: "Ceilings", value: "12.5 ft" },
      { label: "Floor", value: "92" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Sterling Park Realty", rating: 4.8, deals: 87 },
    featured: true,
  },
  {
    id: "aspen-mountain-chalet",
    title: "Slopeside Chalet, Aspen",
    category: "Real Estate",
    location: "Aspen, CO",
    country: "United States",
    priceUsd: 32000000,
    priceBtc: btc(32000000),
    image: aspen,
    gallery: [aspen, villa],
    description:
      "Ski-in/ski-out timber and stone chalet on Aspen Mountain with private spa, wine cellar, heated motor court, and direct gondola access.",
    specs: [
      { label: "Bedrooms", value: "8" },
      { label: "Interior", value: "13,900 sq ft" },
      { label: "Elevation", value: "8,200 ft" },
      { label: "Year", value: "2021" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Aspen Snowmass Sotheby's", rating: 4.8, deals: 71 },
  },
  {
    id: "miami-waterfront-penthouse",
    title: "Waterfront Penthouse, Miami Beach",
    category: "Real Estate",
    location: "Miami Beach, FL",
    country: "United States",
    priceUsd: 19800000,
    priceBtc: btc(19800000),
    image: miami,
    gallery: [miami, westport],
    description:
      "Star Island-adjacent waterfront penthouse with private yacht slip, rooftop pool, summer kitchen, and unobstructed Biscayne Bay views.",
    specs: [
      { label: "Bedrooms", value: "5" },
      { label: "Interior", value: "7,100 sq ft" },
      { label: "Dock", value: "120 ft" },
      { label: "Year", value: "2024" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "ONE Sotheby's International", rating: 4.7, deals: 118 },
  },
  {
    id: "palm-beach-oceanfront-villa",
    title: "Oceanfront Sanctuary Villa",
    category: "Real Estate",
    location: "Palm Beach, FL",
    country: "United States",
    priceUsd: 24500000,
    priceBtc: btc(24500000),
    image: villa,
    gallery: [villa, penthouse, yacht],
    description:
      "A private 9-bedroom oceanfront estate on the Florida coast with a 35-meter infinity pool, private dock, helipad, and direct Atlantic frontage.",
    specs: [
      { label: "Bedrooms", value: "9" },
      { label: "Land", value: "12.4 acres" },
      { label: "Interior", value: "18,400 sq ft" },
      { label: "Year", value: "2023" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Palm Beach Coastal Estates", rating: 4.9, deals: 142 },
  },

  // ───────── Luxury Cars ─────────
  {
    id: "bugatti-chiron-supersport",
    title: "Bugatti Chiron Super Sport",
    category: "Luxury Cars",
    location: "Miami, FL",
    country: "United States",
    priceUsd: 4200000,
    priceBtc: btc(4200000),
    image: bugatti,
    gallery: [bugatti, lambo],
    description:
      "Quad-turbo W16 hypercar in bespoke Bleu Nuit over carbon. Delivery mileage, full provenance, U.S. EPA & DOT compliant.",
    specs: [
      { label: "Power", value: "1,577 hp" },
      { label: "Top Speed", value: "440 km/h" },
      { label: "0-60", value: "2.4s" },
      { label: "Year", value: "2024" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Miami Hypercar Collection", rating: 5.0, deals: 41 },
    featured: true,
  },
  {
    id: "rolls-royce-phantom-ewb",
    title: "Rolls-Royce Phantom EWB",
    category: "Luxury Cars",
    location: "Bel Air, CA",
    country: "United States",
    priceUsd: 720000,
    priceBtc: btc(720000),
    image: rolls,
    gallery: [rolls, ferrari],
    description:
      "Phantom Extended Wheelbase in Arctic White over Seashell. Privacy Suite, Starlight Headliner, and Bespoke Audio. One owner since new.",
    specs: [
      { label: "Engine", value: "6.75L V12" },
      { label: "Power", value: "563 hp" },
      { label: "Wheelbase", value: "Extended" },
      { label: "Year", value: "2024" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "O'Gara Coach Beverly Hills", rating: 4.9, deals: 88 },
  },
  {
    id: "lamborghini-revuelto",
    title: "Lamborghini Revuelto LP 1015-8",
    category: "Luxury Cars",
    location: "Beverly Hills, CA",
    country: "United States",
    priceUsd: 1250000,
    priceBtc: btc(1250000),
    image: lambo,
    gallery: [lambo, ferrari],
    description:
      "Hybrid V12 hypercar finished in Nero Aldebaran with carbon-skin interior. Delivery mileage, full Ad Personam program, certified authenticity.",
    specs: [
      { label: "Power", value: "1015 hp" },
      { label: "0-60", value: "2.5s" },
      { label: "Top Speed", value: "350 km/h" },
      { label: "Year", value: "2025" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Beverly Hills Prestige Motors", rating: 5.0, deals: 64 },
    featured: true,
  },
  {
    id: "ferrari-12cilindri",
    title: "Ferrari 12Cilindri Coupé",
    category: "Luxury Cars",
    location: "Scottsdale, AZ",
    country: "United States",
    priceUsd: 685000,
    priceBtc: btc(685000),
    image: ferrari,
    gallery: [ferrari, lambo],
    description:
      "Naturally aspirated 6.5L V12 grand tourer in Rosso Corsa. Tailor Made specification with full Daytona-inspired interior.",
    specs: [
      { label: "Power", value: "819 hp" },
      { label: "0-60", value: "2.9s" },
      { label: "Engine", value: "6.5L V12" },
      { label: "Year", value: "2025" },
    ],
    verified: true,
    btcAccepted: false,
    seller: { name: "Scottsdale Motor Collection", rating: 4.9, deals: 53 },
  },

  // ───────── Yachts ─────────
  {
    id: "westport-w172",
    title: "Westport W172 Tri-Deck 'Liberty'",
    category: "Yachts",
    location: "Fort Lauderdale, FL",
    country: "United States",
    priceUsd: 58500000,
    priceBtc: btc(58500000),
    image: westport,
    gallery: [westport, miami],
    description:
      "American-built 172' composite tri-deck superyacht. Sky lounge, beach club, on-deck owner's suite, and transatlantic range. Lying Fort Lauderdale.",
    specs: [
      { label: "Length", value: "172 ft" },
      { label: "Guests", value: "12" },
      { label: "Crew", value: "10" },
      { label: "Year", value: "2023" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Northrop & Johnson", rating: 4.9, deals: 47 },
    featured: true,
  },
  {
    id: "feadship-superyacht",
    title: "Feadship 95m 'Aurelia'",
    category: "Yachts",
    location: "Palm Beach, FL",
    country: "United States",
    priceUsd: 215000000,
    priceBtc: btc(215000000),
    image: yacht,
    gallery: [yacht, villa],
    description:
      "Custom 95-meter explorer yacht with helipad, beach club, 8 guest suites, owner's deck with private spa, and global cruising range.",
    specs: [
      { label: "Length", value: "95 m" },
      { label: "Guests", value: "18" },
      { label: "Crew", value: "29" },
      { label: "Year", value: "2024" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Palm Beach Superyacht Advisory", rating: 4.9, deals: 21 },
    featured: true,
  },

  // ───────── Private Jets ─────────
  {
    id: "bombardier-global-7500",
    title: "Bombardier Global 7500",
    category: "Private Jets",
    location: "Dallas, TX",
    country: "United States",
    priceUsd: 82500000,
    priceBtc: btc(82500000),
    image: bombardier,
    gallery: [bombardier, jet],
    description:
      "Flagship ultra-long-range jet with four true living spaces, full kitchen, and a permanent bed in the Principal Suite. U.S. N-registered.",
    specs: [
      { label: "Range", value: "7,700 nm" },
      { label: "Passengers", value: "19" },
      { label: "Cabin", value: "54 ft 5 in" },
      { label: "Year", value: "2024" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Jetcraft Americas", rating: 5.0, deals: 44 },
    featured: true,
  },
  {
    id: "gulfstream-g700",
    title: "Gulfstream G700 — Ultra Long Range",
    category: "Private Jets",
    location: "Savannah, GA",
    country: "United States",
    priceUsd: 78000000,
    priceBtc: btc(78000000),
    image: jet,
    gallery: [jet, bombardier],
    description:
      "Flagship Gulfstream G700 configured with five distinct living areas, master suite, and the longest range in business aviation.",
    specs: [
      { label: "Range", value: "7,500 nm" },
      { label: "Passengers", value: "19" },
      { label: "Cabin", value: "56 ft 11 in" },
      { label: "Year", value: "2024" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Gulfstream Pre-Owned", rating: 5.0, deals: 38 },
  },

  // ───────── Concierge ─────────
  {
    id: "napa-private-vineyard-experience",
    title: "Napa Valley Private Harvest Weekend",
    category: "Concierge Services",
    location: "Napa Valley, CA",
    country: "United States",
    priceUsd: 145000,
    priceBtc: btc(145000),
    image: napa,
    gallery: [napa],
    description:
      "Four-day private harvest experience: estate winery takeover, Michelin-starred chef residency, helicopter transfers from SFO, and a custom barrel program.",
    specs: [
      { label: "Guests", value: "Up to 12" },
      { label: "Duration", value: "4 days" },
      { label: "Includes", value: "Estate & Chef" },
      { label: "Tier", value: "Reserve" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Auberge Private Reserve", rating: 5.0, deals: 67 },
  },
  {
    id: "masters-augusta-package",
    title: "The Masters — Augusta Patron Suite",
    category: "Concierge Services",
    location: "Augusta, GA",
    country: "United States",
    priceUsd: 225000,
    priceBtc: btc(225000),
    image: concierge,
    gallery: [concierge],
    description:
      "Tournament-week hospitality: four-day patron badges, private estate accommodation, daily chauffeur, club fittings, and a Champions Dinner reception.",
    specs: [
      { label: "Guests", value: "Up to 4" },
      { label: "Duration", value: "4 days" },
      { label: "Includes", value: "Badges & Estate" },
      { label: "Tier", value: "Patron" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Magnolia Concierge", rating: 5.0, deals: 54 },
  },
  {
    id: "kentucky-derby-owners-club-package",
    title: "Kentucky Derby — Owner's Club Weekend",
    category: "Concierge Services",
    location: "Louisville, KY",
    country: "United States",
    priceUsd: 285000,
    priceBtc: btc(285000),
    image: concierge,
    gallery: [concierge],
    description:
      "Four-day luxury hospitality package with Owner's Club access, private estate accommodations, chef-led dining, bourbon tastings, and chauffeured transfers.",
    specs: [
      { label: "Guests", value: "Up to 6" },
      { label: "Duration", value: "4 days" },
      { label: "Includes", value: "Club & Estate" },
      { label: "Tier", value: "Owner's Club" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Bluegrass Reserve Concierge", rating: 5.0, deals: 112 },
  },
  // ───────── New arrivals (international marketplace inventory) ─────────
  {
    id: "bel-air-glass-residence",
    title: "Glass Pavilion Residence, Bel Air",
    category: "Real Estate",
    location: "Bel Air, Los Angeles, CA",
    country: "United States",
    priceUsd: 68000000,
    priceBtc: btc(68000000),
    image: beverlyhills,
    gallery: [beverlyhills, villa, penthouse],
    description:
      "A museum-grade glass pavilion above the city grid: 200-degree skyline views, infinity edge pool, subterranean gallery, and a ten-car display garage.",
    specs: [
      { label: "Bedrooms", value: "8" },
      { label: "Interior", value: "18,400 sq ft" },
      { label: "Land", value: "1.9 acres" },
      { label: "Year", value: "2023" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Fortune Coastal Private Office", rating: 5.0, deals: 41 },
    featured: true,
  },
  {
    id: "naples-gulf-shore-mansion",
    title: "Gulf Shore Beachfront Mansion",
    category: "Real Estate",
    location: "Naples, FL",
    country: "United States",
    priceUsd: 32500000,
    priceBtc: btc(32500000),
    image: miami,
    gallery: [miami, villa],
    description:
      "Direct Gulf frontage with 145 feet of private beach, resort pool deck, wine room for 2,400 bottles, and a guest wing with separate entry.",
    specs: [
      { label: "Bedrooms", value: "7" },
      { label: "Interior", value: "11,200 sq ft" },
      { label: "Beach", value: "145 ft" },
      { label: "Year", value: "2021" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Gulf Coast Estates", rating: 4.9, deals: 88 },
  },
  {
    id: "lake-tahoe-lakefront-lodge",
    title: "Lakefront Stone & Timber Lodge",
    category: "Real Estate",
    location: "Lake Tahoe, NV",
    country: "United States",
    priceUsd: 24900000,
    priceBtc: btc(24900000),
    image: napa,
    gallery: [napa, aspen],
    description:
      "Old-growth timber and granite lodge with a private pier, two boat lifts, spa level, and cinema — steps from the water on the Nevada shoreline.",
    specs: [
      { label: "Bedrooms", value: "6" },
      { label: "Interior", value: "9,600 sq ft" },
      { label: "Shoreline", value: "120 ft" },
      { label: "Pier", value: "Private" },
    ],
    verified: true,
    btcAccepted: false,
    seller: { name: "Sierra Alpine Realty", rating: 4.8, deals: 63 },
  },
  {
    id: "pagani-huayra-roadster-bc",
    title: "Pagani Huayra Roadster BC",
    category: "Luxury Cars",
    location: "Miami, FL",
    country: "United States",
    priceUsd: 5400000,
    priceBtc: btc(5400000),
    image: bugatti,
    gallery: [bugatti, ferrari],
    description:
      "One of 40 built. Carbo-Titanium HP62 monocoque, 800 hp AMG V12, delivery-mileage example with full factory documentation and books.",
    specs: [
      { label: "Year", value: "2022" },
      { label: "Mileage", value: "180 mi" },
      { label: "Power", value: "800 hp" },
      { label: "Build", value: "1 of 40" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Coastal Hypercar Collection", rating: 5.0, deals: 37 },
  },
  {
    id: "mclaren-speedtail",
    title: "McLaren Speedtail Hyper-GT",
    category: "Luxury Cars",
    location: "Newport Beach, CA",
    country: "United States",
    priceUsd: 3250000,
    priceBtc: btc(3250000),
    image: lambo,
    gallery: [lambo, ferrari],
    description:
      "Central-driving-position hyper-GT, 1,035 hp hybrid powertrain, bespoke MSO specification with matched luggage set and titanium tool kit.",
    specs: [
      { label: "Year", value: "2021" },
      { label: "Mileage", value: "640 mi" },
      { label: "Power", value: "1,035 hp" },
      { label: "Top Speed", value: "250 mph" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Pacific Marque Motors", rating: 4.9, deals: 121 },
  },
  {
    id: "rolls-royce-droptail",
    title: "Rolls-Royce Coachbuild Droptail",
    category: "Luxury Cars",
    location: "Palm Beach, FL",
    country: "United States",
    priceUsd: 24000000,
    priceBtc: btc(24000000),
    image: rolls,
    gallery: [rolls],
    description:
      "Coachbuild commission with hand-laid wood marquetry, removable hard top, and a bespoke timepiece integrated into the fascia.",
    specs: [
      { label: "Year", value: "2024" },
      { label: "Mileage", value: "90 mi" },
      { label: "Build", value: "1 of 4" },
      { label: "Engine", value: "6.75L V12" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Fortune Coastal Private Office", rating: 5.0, deals: 41 },
  },
  {
    id: "benetti-oasis-40m",
    title: "Benetti Oasis 40M Superyacht",
    category: "Yachts",
    location: "Fort Lauderdale, FL",
    country: "United States",
    priceUsd: 37500000,
    priceBtc: btc(37500000),
    image: yacht,
    gallery: [yacht, westport],
    description:
      "Beach-club transom with fold-out terraces, five staterooms, jacuzzi on the sundeck, and a full crew of eight. Warranty transferable.",
    specs: [
      { label: "Length", value: "131 ft" },
      { label: "Guests", value: "10" },
      { label: "Crew", value: "8" },
      { label: "Year", value: "2023" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Atlantic Yacht Brokerage", rating: 4.9, deals: 74 },
  },
  {
    id: "sunseeker-116-yacht",
    title: "Sunseeker 116 Sport Yacht",
    category: "Yachts",
    location: "Newport, RI",
    country: "United States",
    priceUsd: 14800000,
    priceBtc: btc(14800000),
    image: westport,
    gallery: [westport, yacht],
    description:
      "Sport-cruising flagship with a full-beam owner's suite, hydraulic bathing platform for a jet tender, and Seakeeper stabilization.",
    specs: [
      { label: "Length", value: "116 ft" },
      { label: "Guests", value: "8" },
      { label: "Range", value: "1,400 nm" },
      { label: "Year", value: "2022" },
    ],
    verified: true,
    btcAccepted: false,
    seller: { name: "Northeast Marine Group", rating: 4.8, deals: 52 },
  },
  {
    id: "gulfstream-g700",
    title: "Gulfstream G700 Ultra-Long Range",
    category: "Private Jets",
    location: "Dallas, TX",
    country: "United States",
    priceUsd: 78000000,
    priceBtc: btc(78000000),
    image: jet,
    gallery: [jet, bombardier],
    description:
      "Five living areas, ultragalley, and the industry's tallest cabin. Enrolled on comprehensive engine and airframe programs.",
    specs: [
      { label: "Year", value: "2024" },
      { label: "Range", value: "7,750 nm" },
      { label: "Passengers", value: "19" },
      { label: "Hours", value: "210" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Lone Star Aviation Partners", rating: 5.0, deals: 29 },
  },
  {
    id: "embraer-praetor-600",
    title: "Embraer Praetor 600 Super-Midsize",
    category: "Private Jets",
    location: "Scottsdale, AZ",
    country: "United States",
    priceUsd: 22400000,
    priceBtc: btc(22400000),
    image: bombardier,
    gallery: [bombardier, jet],
    description:
      "Low-hour super-midsize with full fly-by-wire, Bossa Nova interior, and transatlantic range from a single crew operation.",
    specs: [
      { label: "Year", value: "2023" },
      { label: "Range", value: "4,018 nm" },
      { label: "Passengers", value: "12" },
      { label: "Hours", value: "340" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Desert Jet Holdings", rating: 4.9, deals: 46 },
  },
];


export const categories: { name: Category; count: number }[] = [
  { name: "Real Estate", count: assets.filter((a) => a.category === "Real Estate").length },
  { name: "Luxury Cars", count: assets.filter((a) => a.category === "Luxury Cars").length },
  { name: "Yachts", count: assets.filter((a) => a.category === "Yachts").length },
  { name: "Private Jets", count: assets.filter((a) => a.category === "Private Jets").length },
  { name: "Concierge Services", count: assets.filter((a) => a.category === "Concierge Services").length },
];

export const countries = Array.from(new Set(assets.map((a) => a.country))).sort();

export const formatUsd = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`
    : `$${n.toLocaleString()}`;

export const formatBtc = (n: number) => `₿ ${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
