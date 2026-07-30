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

export const fallbackMarkers: MapMarker[] = [
  { city: "Los Angeles", region: "California", headline: "$84M Cliffside Villa", x: 14.5, y: 40, btc_accepted: true, sort_order: 1 },
  { city: "Miami", region: "Florida", headline: "$61M Waterfront Estate", x: 23, y: 47, btc_accepted: true, sort_order: 2 },
  { city: "New York", region: "New York", headline: "$27M Skyline Penthouse", x: 27, y: 36, btc_accepted: true, sort_order: 3 },
  { city: "Bahamas", region: "Caribbean", headline: "Private Island", x: 26, y: 50, btc_accepted: true, sort_order: 4 },
  { city: "London", region: "United Kingdom", headline: "$40M Mayfair Residence", x: 47, y: 30, btc_accepted: false, sort_order: 5 },
  { city: "Monaco", region: "French Riviera", headline: "$52M Sea-View Penthouse", x: 50, y: 35, btc_accepted: true, sort_order: 6 },
  { city: "Dubai", region: "United Arab Emirates", headline: "$70M Palm Mansion", x: 61, y: 45, btc_accepted: true, sort_order: 7 },
  { city: "Singapore", region: "Singapore", headline: "$33M Marina Residence", x: 74, y: 56, btc_accepted: false, sort_order: 8 },
  { city: "Tokyo", region: "Japan", headline: "$29M Azabu Tower Home", x: 83, y: 38, btc_accepted: true, sort_order: 9 },
];
