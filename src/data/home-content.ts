// Static fallbacks so the homepage renders instantly (no blink) and keeps
// working even when the database is unreachable.

export type MarketMetric = {
  label: string;
  value: string;
  delta: string | null;
  trend: string;
  sort_order: number;
};

export type RecentSale = {
  title: string;
  location: string;
  price_usd: number;
  settlement: string;
  sort_order: number;
};

export type MapMarker = {
  city: string;
  region: string | null;
  headline: string;
  x: number;
  y: number;
  btc_accepted: boolean;
  sort_order: number;
};

export const fallbackMetrics: MarketMetric[] = [
  { label: "Luxury Home Index", value: "412.8", delta: "+4.2%", trend: "up", sort_order: 1 },
  { label: "Luxury Market Volume", value: "$18.4B", delta: "+2.6%", trend: "up", sort_order: 2 },
  { label: "Tokenized Assets", value: "$6.1B", delta: "+11.3%", trend: "up", sort_order: 3 },
  { label: "Countries Active", value: "58", delta: "+3", trend: "up", sort_order: 4 },
  { label: "Properties Listed", value: "5,431", delta: "+128", trend: "up", sort_order: 5 },
  { label: "Avg. Days to Settle", value: "9", delta: "-2", trend: "down", sort_order: 6 },
];

export const fallbackSales: RecentSale[] = [
  { title: "Malibu Oceanfront Estate", location: "Malibu, California", price_usd: 38000000, settlement: "Purchased with BTC", sort_order: 1 },
  { title: "Manhattan Skyline Penthouse", location: "New York, New York", price_usd: 27500000, settlement: "Private Sale", sort_order: 2 },
  { title: "Palm Beach Waterfront Villa", location: "Palm Beach, Florida", price_usd: 61000000, settlement: "Closed", sort_order: 3 },
  { title: "Aspen Mountain Chalet", location: "Aspen, Colorado", price_usd: 19400000, settlement: "Purchased with BTC", sort_order: 4 },
  { title: "Hamptons Dune Compound", location: "East Hampton, New York", price_usd: 44250000, settlement: "Closed", sort_order: 5 },
  { title: "Beverly Hills Modern Estate", location: "Beverly Hills, California", price_usd: 52000000, settlement: "Private Sale", sort_order: 6 },
];

// x/y are percentages on an equirectangular world map:
//   x = (lon + 180) / 360 * 100 ; y = (90 - lat) / 180 * 100
export const fallbackMarkers: MapMarker[] = [
  { city: "Los Angeles", region: "California", headline: "$84M Cliffside Villa", x: 17.16, y: 31.08, btc_accepted: true, sort_order: 1 },
  { city: "San Francisco", region: "California", headline: "$36M Pacific Heights Manor", x: 16.03, y: 28.99, btc_accepted: false, sort_order: 2 },
  { city: "Aspen", region: "Colorado", headline: "$19M Mountain Chalet", x: 20.33, y: 28.23, btc_accepted: true, sort_order: 3 },
  { city: "Miami", region: "Florida", headline: "$61M Waterfront Estate", x: 27.72, y: 35.69, btc_accepted: true, sort_order: 4 },
  { city: "Palm Beach", region: "Florida", headline: "$44M Oceanfront Villa", x: 27.77, y: 35.16, btc_accepted: true, sort_order: 5 },
  { city: "New York", region: "New York", headline: "$27M Skyline Penthouse", x: 29.44, y: 27.38, btc_accepted: true, sort_order: 6 },
  { city: "The Hamptons", region: "New York", headline: "$44M Dune Compound", x: 29.95, y: 27.24, btc_accepted: false, sort_order: 7 },
  { city: "London", region: "Gateway Market", headline: "$40M Mayfair Residence", x: 49.96, y: 21.39, btc_accepted: false, sort_order: 8 },
  { city: "Dubai", region: "Gateway Market", headline: "$70M Palm Mansion", x: 59.8, y: 35.99, btc_accepted: true, sort_order: 9 },
];

