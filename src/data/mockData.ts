import { Office, Staff, Transaction, FloatBalance, FloatEntry, Alert } from "@/types";

export const offices: Office[] = [
  { id: "off-1", name: "Kariakoo Branch", location: "Kariakoo, Dar es Salaam", status: "active", createdAt: "2024-01-15", gps: { lat: -6.8235, lng: 39.2733 } },
  { id: "off-2", name: "Mwanza Central", location: "Mwanza City Center", status: "active", createdAt: "2024-02-20" },
  { id: "off-3", name: "Arusha Hub", location: "Arusha CBD", status: "active", createdAt: "2024-03-10" },
  { id: "off-4", name: "Dodoma Office", location: "Dodoma Town", status: "inactive", createdAt: "2024-04-05" },
];

export const staff: Staff[] = [
  { id: "stf-1", name: "Amina Hassan", phone: "+255712345678", email: "amina@wakala.co.tz", officeId: "off-1", role: "Manager", status: "active", createdAt: "2024-01-20" },
  { id: "stf-2", name: "Joseph Mwita", phone: "+255713456789", email: "joseph@wakala.co.tz", officeId: "off-1", role: "Staff", status: "active", createdAt: "2024-01-22" },
  { id: "stf-3", name: "Grace Kimaro", phone: "+255714567890", email: "grace@wakala.co.tz", officeId: "off-2", role: "Manager", status: "active", createdAt: "2024-02-25" },
  { id: "stf-4", name: "Peter Lema", phone: "+255715678901", email: "peter@wakala.co.tz", officeId: "off-2", role: "Staff", status: "active", createdAt: "2024-03-01" },
  { id: "stf-5", name: "Fatma Said", phone: "+255716789012", email: "fatma@wakala.co.tz", officeId: "off-3", role: "Manager", status: "active", createdAt: "2024-03-15" },
  { id: "stf-6", name: "David Msemwa", phone: "+255717890123", email: "david@wakala.co.tz", officeId: "off-3", role: "Staff", status: "active", createdAt: "2024-03-18" },
  { id: "stf-7", name: "Rehema Juma", phone: "+255718901234", email: "rehema@wakala.co.tz", officeId: "off-1", role: "Staff", status: "active", createdAt: "2024-04-01" },
  { id: "stf-8", name: "Hassan Mbwana", phone: "+255719012345", email: "hassan@wakala.co.tz", officeId: "off-4", role: "Manager", status: "inactive", createdAt: "2024-04-10" },
];

const txDates = [
  "2026-03-07", "2026-03-07", "2026-03-07", "2026-03-07", "2026-03-07",
  "2026-03-06", "2026-03-06", "2026-03-06", "2026-03-06",
  "2026-03-05", "2026-03-05", "2026-03-05",
  "2026-03-04", "2026-03-04", "2026-03-04",
  "2026-03-03", "2026-03-03",
  "2026-03-02", "2026-03-02",
  "2026-03-01",
];

export const transactions: Transaction[] = [
  { id: "tx-1", officeId: "off-1", staffId: "stf-1", type: "Cash In", network: "M-Pesa", amount: 500000, commission: 2500, date: txDates[0], customerPhone: "+255700111222" },
  { id: "tx-2", officeId: "off-1", staffId: "stf-2", type: "Cash Out", network: "M-Pesa", amount: 300000, commission: 3000, date: txDates[1], customerPhone: "+255700222333" },
  { id: "tx-3", officeId: "off-1", staffId: "stf-7", type: "Bill Payment", network: "Tigo Pesa", amount: 150000, commission: 1500, date: txDates[2] },
  { id: "tx-4", officeId: "off-2", staffId: "stf-3", type: "Cash In", network: "Airtel Money", amount: 800000, commission: 4000, date: txDates[3] },
  { id: "tx-5", officeId: "off-2", staffId: "stf-4", type: "Airtime", network: "M-Pesa", amount: 50000, commission: 2000, date: txDates[4] },
  { id: "tx-6", officeId: "off-3", staffId: "stf-5", type: "Cash Out", network: "M-Pesa", amount: 1000000, commission: 5000, date: txDates[5] },
  { id: "tx-7", officeId: "off-3", staffId: "stf-6", type: "Cash In", network: "Tigo Pesa", amount: 250000, commission: 1250, date: txDates[6] },
  { id: "tx-8", officeId: "off-1", staffId: "stf-1", type: "Cash Out", network: "Airtel Money", amount: 400000, commission: 4000, date: txDates[7] },
  { id: "tx-9", officeId: "off-2", staffId: "stf-3", type: "Bill Payment", network: "M-Pesa", amount: 200000, commission: 2000, date: txDates[8] },
  { id: "tx-10", officeId: "off-1", staffId: "stf-2", type: "Airtime", network: "Tigo Pesa", amount: 30000, commission: 1200, date: txDates[9] },
  { id: "tx-11", officeId: "off-3", staffId: "stf-5", type: "Cash In", network: "M-Pesa", amount: 600000, commission: 3000, date: txDates[10] },
  { id: "tx-12", officeId: "off-2", staffId: "stf-4", type: "Cash Out", network: "Airtel Money", amount: 350000, commission: 3500, date: txDates[11] },
  { id: "tx-13", officeId: "off-1", staffId: "stf-7", type: "Cash In", network: "M-Pesa", amount: 750000, commission: 3750, date: txDates[12] },
  { id: "tx-14", officeId: "off-3", staffId: "stf-6", type: "Bill Payment", network: "Tigo Pesa", amount: 100000, commission: 1000, date: txDates[13] },
  { id: "tx-15", officeId: "off-2", staffId: "stf-3", type: "Airtime", network: "M-Pesa", amount: 25000, commission: 1000, date: txDates[14] },
  { id: "tx-16", officeId: "off-1", staffId: "stf-1", type: "Cash In", network: "Tigo Pesa", amount: 450000, commission: 2250, date: txDates[15] },
  { id: "tx-17", officeId: "off-3", staffId: "stf-5", type: "Cash Out", network: "M-Pesa", amount: 200000, commission: 2000, date: txDates[16] },
  { id: "tx-18", officeId: "off-2", staffId: "stf-4", type: "Cash In", network: "Tigo Pesa", amount: 550000, commission: 2750, date: txDates[17] },
  { id: "tx-19", officeId: "off-1", staffId: "stf-2", type: "Cash Out", network: "Airtel Money", amount: 650000, commission: 6500, date: txDates[18] },
  { id: "tx-20", officeId: "off-3", staffId: "stf-6", type: "Cash In", network: "Airtel Money", amount: 900000, commission: 4500, date: txDates[19] },
  { id: "tx-21", officeId: "off-1", staffId: "stf-1", type: "Cash In", network: "M-Pesa", amount: 320000, commission: 1600, date: "2026-03-07" },
  { id: "tx-22", officeId: "off-2", staffId: "stf-3", type: "Cash Out", network: "Tigo Pesa", amount: 180000, commission: 1800, date: "2026-03-07" },
  { id: "tx-23", officeId: "off-1", staffId: "stf-7", type: "Airtime", network: "Airtel Money", amount: 15000, commission: 600, date: "2026-03-07" },
  { id: "tx-24", officeId: "off-3", staffId: "stf-5", type: "Bill Payment", network: "M-Pesa", amount: 75000, commission: 750, date: "2026-03-07" },
  { id: "tx-25", officeId: "off-2", staffId: "stf-4", type: "Cash In", network: "M-Pesa", amount: 420000, commission: 2100, date: "2026-03-06" },
];

export const floatBalances: FloatBalance[] = [
  { officeId: "off-1", network: "M-Pesa", balance: 2500000 },
  { officeId: "off-1", network: "Tigo Pesa", balance: 1200000 },
  { officeId: "off-1", network: "Airtel Money", balance: 800000 },
  { officeId: "off-2", network: "M-Pesa", balance: 3000000 },
  { officeId: "off-2", network: "Tigo Pesa", balance: 900000 },
  { officeId: "off-2", network: "Airtel Money", balance: 1500000 },
  { officeId: "off-3", network: "M-Pesa", balance: 1800000 },
  { officeId: "off-3", network: "Tigo Pesa", balance: 600000 },
  { officeId: "off-3", network: "Airtel Money", balance: 450000 },
  { officeId: "off-4", network: "M-Pesa", balance: 50000 },
  { officeId: "off-4", network: "Tigo Pesa", balance: 20000 },
  { officeId: "off-4", network: "Airtel Money", balance: 10000 },
];

export const floatEntries: FloatEntry[] = [
  { id: "fl-1", officeId: "off-1", network: "M-Pesa", type: "deposit", amount: 5000000, date: "2026-03-01", recordedBy: "stf-1" },
  { id: "fl-2", officeId: "off-1", network: "Tigo Pesa", type: "deposit", amount: 2000000, date: "2026-03-01", recordedBy: "stf-1" },
  { id: "fl-3", officeId: "off-2", network: "M-Pesa", type: "deposit", amount: 4000000, date: "2026-03-02", recordedBy: "stf-3" },
  { id: "fl-4", officeId: "off-1", network: "M-Pesa", type: "withdrawal", amount: 1000000, date: "2026-03-05", recordedBy: "stf-1" },
  { id: "fl-5", officeId: "off-3", network: "M-Pesa", type: "deposit", amount: 3000000, date: "2026-03-03", recordedBy: "stf-5" },
];

export const alerts: Alert[] = [
  { id: "al-1", type: "low_float", officeId: "off-4", network: "M-Pesa", message: "M-Pesa float below TZS 100,000 at Dodoma Office", status: "new", date: "2026-03-07" },
  { id: "al-2", type: "low_float", officeId: "off-4", network: "Tigo Pesa", message: "Tigo Pesa float below TZS 100,000 at Dodoma Office", status: "new", date: "2026-03-07" },
  { id: "al-3", type: "low_float", officeId: "off-4", network: "Airtel Money", message: "Airtel Money float below TZS 100,000 at Dodoma Office", status: "new", date: "2026-03-07" },
  { id: "al-4", type: "high_volume", officeId: "off-1", message: "Unusually high transaction volume at Kariakoo Branch today", status: "new", date: "2026-03-07" },
  { id: "al-5", type: "low_float", officeId: "off-3", network: "Airtel Money", message: "Airtel Money float below TZS 500,000 at Arusha Hub", status: "acknowledged", date: "2026-03-06" },
  { id: "al-6", type: "abnormal_activity", officeId: "off-2", message: "Large cash out detected at Mwanza Central — TZS 1,000,000+", status: "acknowledged", date: "2026-03-05" },
];

export const dailyTransactionSummary = [
  { date: "Mar 1", "Kariakoo": 2, "Mwanza": 1, "Arusha": 1 },
  { date: "Mar 2", "Kariakoo": 1, "Mwanza": 2, "Arusha": 0 },
  { date: "Mar 3", "Kariakoo": 1, "Mwanza": 0, "Arusha": 2 },
  { date: "Mar 4", "Kariakoo": 1, "Mwanza": 1, "Arusha": 1 },
  { date: "Mar 5", "Kariakoo": 2, "Mwanza": 1, "Arusha": 1 },
  { date: "Mar 6", "Kariakoo": 1, "Mwanza": 2, "Arusha": 1 },
  { date: "Mar 7", "Kariakoo": 4, "Mwanza": 3, "Arusha": 2 },
];

export function formatTZS(amount: number): string {
  return new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS", minimumFractionDigits: 0 }).format(amount);
}

export function getOfficeName(officeId: string): string {
  return offices.find(o => o.id === officeId)?.name ?? "Unknown";
}

export function getStaffName(staffId: string): string {
  return staff.find(s => s.id === staffId)?.name ?? "Unknown";
}
