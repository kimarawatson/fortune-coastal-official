import villa from "@/assets/asset-villa.jpg";
import penthouse from "@/assets/asset-penthouse.jpg";
import lambo from "@/assets/asset-lambo.jpg";
import ferrari from "@/assets/asset-ferrari.jpg";
import yacht from "@/assets/asset-yacht.jpg";
import jet from "@/assets/asset-jet.jpg";
import concierge from "@/assets/asset-concierge.jpg";

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
  {
    id: "oceanfront-villa-maldives",
    title: "Oceanfront Sanctuary Villa",
    category: "Real Estate",
    location: "Malé Atoll",
    country: "Maldives",
    priceUsd: 24500000,
    priceBtc: btc(24500000),
    image: villa,
    gallery: [villa, penthouse, yacht],
    description:
      "A private 9-bedroom oceanfront estate set on its own peninsula. Designed by award-winning architect Lina Ghotmeh, featuring a 35-meter infinity pool, private dock, helipad, and direct turquoise lagoon access.",
    specs: [
      { label: "Bedrooms", value: "9" },
      { label: "Land", value: "12.4 acres" },
      { label: "Interior", value: "18,400 sq ft" },
      { label: "Year", value: "2023" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Atelier Coastal Estates", rating: 4.9, deals: 142 },
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
      "A full-floor penthouse with 360° views of Manhattan, Central Park, and the Hudson. Private elevator, double-height ceilings, and curated interiors by Foster + Partners.",
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
    id: "lamborghini-revuelto",
    title: "Lamborghini Revuelto LP 1015-8",
    category: "Luxury Cars",
    location: "Monaco",
    country: "Monaco",
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
    seller: { name: "Monaco Prestige Motors", rating: 5.0, deals: 64 },
    featured: true,
  },
  {
    id: "ferrari-12cilindri",
    title: "Ferrari 12Cilindri Coupé",
    category: "Luxury Cars",
    location: "Maranello",
    country: "Italy",
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
    seller: { name: "Cavallino Heritage", rating: 4.9, deals: 53 },
  },
  {
    id: "feadship-superyacht",
    title: "Feadship 95m Superyacht 'Aurelia'",
    category: "Yachts",
    location: "Monaco Harbour",
    country: "Monaco",
    priceUsd: 215000000,
    priceBtc: btc(215000000),
    image: yacht,
    gallery: [yacht, villa],
    description:
      "A custom 95-meter explorer yacht with helipad, beach club, 8 guest suites, owner's deck with private spa, and global range.",
    specs: [
      { label: "Length", value: "95 m" },
      { label: "Guests", value: "18" },
      { label: "Crew", value: "29" },
      { label: "Year", value: "2024" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Feadship Brokerage", rating: 4.9, deals: 21 },
    featured: true,
  },
  {
    id: "gulfstream-g700",
    title: "Gulfstream G700 — Ultra Long Range",
    category: "Private Jets",
    location: "Geneva",
    country: "Switzerland",
    priceUsd: 78000000,
    priceBtc: btc(78000000),
    image: jet,
    gallery: [jet, yacht],
    description:
      "The flagship Gulfstream G700, configured with five distinct living areas, master suite, and the longest range in business aviation.",
    specs: [
      { label: "Range", value: "7,500 nm" },
      { label: "Passengers", value: "19" },
      { label: "Cabin", value: "56 ft 11 in" },
      { label: "Year", value: "2024" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Helvetia Aviation", rating: 5.0, deals: 38 },
    featured: true,
  },
  {
    id: "vip-monaco-gp-package",
    title: "Monaco Grand Prix — Royal Box Experience",
    category: "Concierge Services",
    location: "Monte Carlo",
    country: "Monaco",
    priceUsd: 285000,
    priceBtc: btc(285000),
    image: concierge,
    gallery: [concierge],
    description:
      "Four-day, all-access concierge package: Royal Box trackside, yacht hospitality, paddock club, private chef, and chauffeured Bentley fleet.",
    specs: [
      { label: "Guests", value: "Up to 6" },
      { label: "Duration", value: "4 days" },
      { label: "Includes", value: "Yacht & Suite" },
      { label: "Tier", value: "Royal" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Côte d'Azur Concierge", rating: 5.0, deals: 112 },
  },
  {
    id: "bali-cliff-villa",
    title: "Cliffside Residence, Uluwatu",
    category: "Real Estate",
    location: "Bali",
    country: "Indonesia",
    priceUsd: 8900000,
    priceBtc: btc(8900000),
    image: villa,
    gallery: [villa],
    description:
      "Suspended over the Indian Ocean, this 6-bedroom cliff residence offers panoramic sunsets, private beach access, and resort-grade staff quarters.",
    specs: [
      { label: "Bedrooms", value: "6" },
      { label: "Interior", value: "11,200 sq ft" },
      { label: "Pool", value: "Infinity" },
      { label: "Year", value: "2022" },
    ],
    verified: true,
    btcAccepted: true,
    seller: { name: "Archipelago Estates", rating: 4.7, deals: 29 },
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
