// Centralized network list — keep in sync with the DB enum `network_type`
export const NETWORKS = [
  "M-Pesa",
  "Tigo Pesa",
  "Airtel Money",
  "Halo Pesa",
  "NMB BANK",
  "CRDB BANK",
] as const;

export type NetworkType = (typeof NETWORKS)[number];
