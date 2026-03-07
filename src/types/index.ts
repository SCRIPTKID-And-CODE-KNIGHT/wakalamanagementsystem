export type UserRole = "admin" | "staff";

export type Network = "M-Pesa" | "Tigo Pesa" | "Airtel Money";

export type TransactionType = "Cash In" | "Cash Out" | "Bill Payment" | "Airtime";

export type StaffRole = "Manager" | "Staff";

export type AlertType = "low_float" | "high_volume" | "abnormal_activity";
export type AlertStatus = "new" | "acknowledged";

export interface Office {
  id: string;
  name: string;
  location: string;
  gps?: { lat: number; lng: number };
  status: "active" | "inactive";
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  officeId: string;
  role: StaffRole;
  status: "active" | "inactive";
  createdAt: string;
}

export interface FloatEntry {
  id: string;
  officeId: string;
  network: Network;
  type: "deposit" | "withdrawal";
  amount: number;
  date: string;
  recordedBy: string;
}

export interface FloatBalance {
  officeId: string;
  network: Network;
  balance: number;
}

export interface Transaction {
  id: string;
  officeId: string;
  staffId: string;
  type: TransactionType;
  network: Network;
  amount: number;
  commission: number;
  date: string;
  customerPhone?: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  officeId: string;
  network?: Network;
  message: string;
  status: AlertStatus;
  date: string;
}
