import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTransactions, useOffices, useStaff, useCreateTransaction, formatTZS } from "@/hooks/use-data";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

const txTypes = ["Cash In", "Cash Out", "Bill Payment", "Airtime"];
const networksList = ["M-Pesa", "Tigo Pesa", "Airtel Money"];

const typeColors: Record<string, string> = {
  "Cash In": "bg-secondary text-secondary-foreground",
  "Cash Out": "bg-primary text-primary-foreground",
  "Bill Payment": "bg-accent text-accent-foreground",
  "Airtime": "bg-chart-purple text-primary-foreground",
};

export default function Transactions() {
  const { role, userOfficeId } = useAuth();
  const { data: txList, isLoading } = useTransactions();
  const { data: offices } = useOffices();
  const { data: staffList } = useStaff();
  const createTx = useCreateTransaction();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [receiptTx, setReceiptTx] = useState<any | null>(null);
  const [filterOffice, setFilterOffice] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterNetwork, setFilterNetwork] = useState("all");

  const isAdmin = role === "admin";
  const defaultOfficeId = isAdmin ? (offices?.[0]?.id ?? "") : (userOfficeId ?? "");
  const [form, setForm] = useState({
    office_id: defaultOfficeId,
    staff_id: "",
    type: "Cash In" as "Cash In" | "Cash Out" | "Bill Payment" | "Airtime",
    network: "M-Pesa" as "M-Pesa" | "Tigo Pesa" | "Airtel Money",
    amount: "",
    customer_phone: "",
  });

  const visibleOfficeIds = isAdmin ? (offices?.map(o => o.id) ?? []) : (userOfficeId ? [userOfficeId] : []);

  let filtered = txList?.filter(t => visibleOfficeIds.includes(t.office_id)) ?? [];
  if (filterOffice !== "all") filtered = filtered.filter(t => t.office_id === filterOffice);
  if (filterType !== "all") filtered = filtered.filter(t => t.type === filterType);
  if (filterNetwork !== "all") filtered = filtered.filter(t => t.network === filterNetwork);

  const getOfficeName = (id: string) => offices?.find(o => o.id === id)?.name ?? "Unknown";
  const getStaffName = (id: string | null) => staffList?.find(s => s.id === id)?.name ?? "—";
  const officeStaff = staffList?.filter(s => s.office_id === form.office_id) ?? [];

  const handleRecord = async () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    try {
      await createTx.mutateAsync({
        office_id: form.office_id || defaultOfficeId,
        staff_id: form.staff_id || undefined,
        type: form.type,
        network: form.network,
        amount: amt,
        commission: Math.round(amt * 0.005),
        customer_phone: form.customer_phone || undefined,
      });
      toast({ title: "Transaction recorded" });
      setDialogOpen(false);
      setForm(f => ({ ...f, amount: "", customer_phone: "" }));
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Record and view transaction history</p>
        </div>
        <Button onClick={() => {
          setForm(f => ({ ...f, office_id: defaultOfficeId, staff_id: officeStaff[0]?.id ?? "" }));
          setDialogOpen(true);
        }} className="gap-2">
          <Plus className="h-4 w-4" /> New Transaction
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {isAdmin && (
              <Select value={filterOffice} onValueChange={setFilterOffice}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Offices" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  {offices?.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {txTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterNetwork} onValueChange={setFilterNetwork}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Networks" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                {networksList.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Office</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm">{format(parseISO(tx.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge className={typeColors[tx.type] ?? ""}>{tx.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{tx.network}</TableCell>
                  <TableCell className="text-sm">{getOfficeName(tx.office_id)}</TableCell>
                  <TableCell className="text-sm">{getStaffName(tx.staff_id)}</TableCell>
                  <TableCell className="text-right font-medium">{formatTZS(Number(tx.amount))}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatTZS(Number(tx.commission))}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReceiptTx(tx)}>
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No transactions found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Transaction Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {isAdmin && (
                <div className="space-y-2">
                  <Label>Office</Label>
                  <Select value={form.office_id} onValueChange={v => setForm(f => ({ ...f, office_id: v, staff_id: staffList?.find(s => s.office_id === v)?.id ?? "" }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {offices?.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Staff</Label>
                <Select value={form.staff_id} onValueChange={v => setForm(f => ({ ...f, staff_id: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {officeStaff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as "Cash In" | "Cash Out" | "Bill Payment" | "Airtime" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {txTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Network</Label>
                <Select value={form.network} onValueChange={v => setForm(f => ({ ...f, network: v as "M-Pesa" | "Tigo Pesa" | "Airtel Money" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {networksList.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (TZS)</Label>
                <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 500000" />
              </div>
              <div className="space-y-2">
                <Label>Customer Phone</Label>
                <Input value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))} placeholder="+255..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRecord} disabled={createTx.isPending}>Record Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={!!receiptTx} onOpenChange={() => setReceiptTx(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Transaction Receipt</DialogTitle>
          </DialogHeader>
          {receiptTx && (
            <div className="space-y-3 text-sm border rounded-lg p-4 bg-muted/30">
              <div className="text-center border-b pb-3">
                <p className="font-bold text-lg">WBMS</p>
                <p className="text-muted-foreground text-xs">Wakala Business Management</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">ID:</span><span className="font-mono text-xs">{receiptTx.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span>{format(parseISO(receiptTx.created_at), "MMM d, yyyy HH:mm")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type:</span><span>{receiptTx.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Network:</span><span>{receiptTx.network}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount:</span><span className="font-semibold">{formatTZS(Number(receiptTx.amount))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Commission:</span><span>{formatTZS(Number(receiptTx.commission))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Office:</span><span>{getOfficeName(receiptTx.office_id)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Staff:</span><span>{getStaffName(receiptTx.staff_id)}</span></div>
                {receiptTx.customer_phone && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Customer:</span><span>{receiptTx.customer_phone}</span></div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
