import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { transactions as initialTx, offices, staff, formatTZS, getOfficeName, getStaffName } from "@/data/mockData";
import { useRole } from "@/contexts/RoleContext";
import { Transaction, TransactionType, Network } from "@/types";
import { Plus, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const txTypes: TransactionType[] = ["Cash In", "Cash Out", "Bill Payment", "Airtime"];
const networks: Network[] = ["M-Pesa", "Tigo Pesa", "Airtel Money"];

const typeColors: Record<TransactionType, string> = {
  "Cash In": "bg-secondary text-secondary-foreground",
  "Cash Out": "bg-primary text-primary-foreground",
  "Bill Payment": "bg-accent text-accent-foreground",
  "Airtime": "bg-chart-purple text-primary-foreground",
};

export default function Transactions() {
  const { role, currentOfficeId } = useRole();
  const [txList, setTxList] = useState<Transaction[]>(initialTx);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);

  // Filters
  const [filterOffice, setFilterOffice] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterNetwork, setFilterNetwork] = useState("all");

  // Form
  const [form, setForm] = useState({
    officeId: role === "admin" ? offices[0]?.id ?? "" : currentOfficeId,
    staffId: staff[0]?.id ?? "",
    type: "Cash In" as TransactionType,
    network: "M-Pesa" as Network,
    amount: "",
    customerPhone: "",
  });

  const visibleOfficeIds = role === "admin" ? offices.map(o => o.id) : [currentOfficeId];

  let filtered = txList.filter(t => visibleOfficeIds.includes(t.officeId));
  if (filterOffice !== "all") filtered = filtered.filter(t => t.officeId === filterOffice);
  if (filterType !== "all") filtered = filtered.filter(t => t.type === filterType);
  if (filterNetwork !== "all") filtered = filtered.filter(t => t.network === filterNetwork);

  const handleRecord = () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      officeId: form.officeId,
      staffId: form.staffId,
      type: form.type,
      network: form.network,
      amount: amt,
      commission: Math.round(amt * 0.005),
      date: new Date().toISOString().split("T")[0],
      customerPhone: form.customerPhone || undefined,
    };
    setTxList(prev => [newTx, ...prev]);
    toast({ title: "Transaction recorded" });
    setDialogOpen(false);
    setForm(f => ({ ...f, amount: "", customerPhone: "" }));
  };

  const officeStaff = staff.filter(s => s.officeId === form.officeId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Record and view transaction history</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {role === "admin" && (
              <Select value={filterOffice} onValueChange={setFilterOffice}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Offices" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  {offices.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
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
                {networks.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
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
                  <TableCell className="text-sm">{tx.date}</TableCell>
                  <TableCell>
                    <Badge className={typeColors[tx.type]}>{tx.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{tx.network}</TableCell>
                  <TableCell className="text-sm">{getOfficeName(tx.officeId)}</TableCell>
                  <TableCell className="text-sm">{getStaffName(tx.staffId)}</TableCell>
                  <TableCell className="text-right font-medium">{formatTZS(tx.amount)}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatTZS(tx.commission)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setReceiptTx(tx)}>
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
              {role === "admin" && (
                <div className="space-y-2">
                  <Label>Office</Label>
                  <Select value={form.officeId} onValueChange={v => setForm(f => ({ ...f, officeId: v, staffId: staff.find(s => s.officeId === v)?.id ?? "" }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {offices.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Staff</Label>
                <Select value={form.staffId} onValueChange={v => setForm(f => ({ ...f, staffId: v }))}>
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
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as TransactionType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {txTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Network</Label>
                <Select value={form.network} onValueChange={v => setForm(f => ({ ...f, network: v as Network }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {networks.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
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
                <Input value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} placeholder="+255..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRecord}>Record Transaction</Button>
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
                <div className="flex justify-between"><span className="text-muted-foreground">ID:</span><span className="font-mono">{receiptTx.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span>{receiptTx.date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type:</span><span>{receiptTx.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Network:</span><span>{receiptTx.network}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount:</span><span className="font-semibold">{formatTZS(receiptTx.amount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Commission:</span><span>{formatTZS(receiptTx.commission)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Office:</span><span>{getOfficeName(receiptTx.officeId)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Staff:</span><span>{getStaffName(receiptTx.staffId)}</span></div>
                {receiptTx.customerPhone && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Customer:</span><span>{receiptTx.customerPhone}</span></div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
