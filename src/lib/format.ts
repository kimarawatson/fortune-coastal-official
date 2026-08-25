export const formatUsd = (n: number) =>
  !n || n <= 0
    ? "Price on Request"
    :  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2)}M`
    : `$${n.toLocaleString()}`;

export const formatBtc = (n: number | null | undefined) =>
  n == null ? "—" : `₿ ${Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
