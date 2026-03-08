import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useOffices() {
  return useQuery({
    queryKey: ["offices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offices").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function useFloatBalances() {
  return useQuery({
    queryKey: ["float_balances"],
    queryFn: async () => {
      const { data, error } = await supabase.from("float_balances").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useFloatEntries() {
  return useQuery({
    queryKey: ["float_entries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("float_entries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alerts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Mutations

export function useCreateOffice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (office: { name: string; location: string; status: string; gps_lat?: number; gps_lng?: number }) => {
      const { data, error } = await supabase.from("offices").insert(office).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["offices"] }),
  });
}

export function useUpdateOffice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; location?: string; status?: string }) => {
      const { data, error } = await supabase.from("offices").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["offices"] }),
  });
}

export function useDeleteOffice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("offices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["offices"] }),
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (staff: { name: string; phone?: string; email?: string; office_id: string; role: string }) => {
      const { data, error } = await supabase.from("staff").insert(staff).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useUpdateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; phone?: string; email?: string; office_id?: string; role?: string }) => {
      const { data, error } = await supabase.from("staff").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tx: { office_id: string; staff_id?: string; type: string; network: string; amount: number; commission: number; customer_phone?: string }) => {
      const { data, error } = await supabase.from("transactions").insert(tx).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useRecordFloat() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (entry: { office_id: string; network: string; type: string; amount: number }) => {
      // Insert float entry
      const { error: entryError } = await supabase.from("float_entries").insert({
        ...entry,
        recorded_by: user?.id,
      });
      if (entryError) throw entryError;

      // Upsert float balance
      const delta = entry.type === "deposit" ? entry.amount : -entry.amount;
      
      // Get current balance
      const { data: current } = await supabase
        .from("float_balances")
        .select("id, balance")
        .eq("office_id", entry.office_id)
        .eq("network", entry.network)
        .single();

      if (current) {
        const { error } = await supabase
          .from("float_balances")
          .update({ balance: Math.max(0, current.balance + delta) })
          .eq("id", current.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("float_balances")
          .insert({ office_id: entry.office_id, network: entry.network as any, balance: Math.max(0, delta) });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["float_balances"] });
      qc.invalidateQueries({ queryKey: ["float_entries"] });
    },
  });
}

export function useUpdateAlertStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("alerts").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

// Helper to format TZS
export function formatTZS(amount: number): string {
  return new Intl.NumberFormat("en-TZ", { style: "currency", currency: "TZS", minimumFractionDigits: 0 }).format(amount);
}
