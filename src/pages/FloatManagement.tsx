import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOffices, useFloatBalances, useRecordFloat, formatTZS } from "@/hooks/use-data";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const networks = ["M-Pesa", "Tigo Pesa", "Airtel Money"];

export default function FloatManagement() {
  const { role, userOfficeId } = useAuth();
  const { data: offices, isLoading: officesLoading } = useOffices();
  const { data: balances, isLoading: balancesLoading } = useFloatBalances();
  const recordFloat = useRecordFloat();

  const isAdmin = role === "admin";
  const [officeId, setOfficeId] = useState("");
  const [network, setNetwork] = useState<"M-Pesa" | "Tigo Pesa" | "Airtel Money">("M-Pesa");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit");

  // Set default office when loaded
  const effectiveOfficeId = isAdmin ? (officeId || offices?.[0]?.id || "") : (userOfficeId || "");

  const visibleOfficeIds = isAdmin ? (offices?.map(o => o.id) ?? []) : (userOfficeId ? [userOfficeId] : []);
  const visibleBalances = balances?.filter(b => visibleOfficeIds.includes(b.office_id)) ?? [];
  const totalFloat = visibleBalances.reduce((s, b) => s + Number(b.balance), 0);

  const handleRecord = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    try {
      await recordFloat.mutateAsync({
        office_id: effectiveOfficeId,
        network,
        type,
        amount: num,
      });
      toast({ title: `Float ${type} of ${formatTZS(num)} recorded` });
      setAmount("");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  if (officesLoading || balancesLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Float Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Record deposits & withdrawals, track float balances</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Record Float</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAdmin && (
              <div className="space-y-2">
                <Label>Office</Label>
                <Select value={effectiveOfficeId} onValueChange={setOfficeId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {offices?.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Network</Label>
              <Select value={network} onValueChange={v => setNetwork(v as "M-Pesa" | "Tigo Pesa" | "Airtel Money")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {networks.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant={type === "deposit" ? "default" : "outline"} className={type === "deposit" ? "bg-secondary text-secondary-foreground" : ""} onClick={() => setType("deposit")}>
                  <ArrowDownCircle className="h-4 w-4 mr-1" /> Deposit
                </Button>
                <Button variant={type === "withdrawal" ? "default" : "outline"} className={type === "withdrawal" ? "bg-accent text-accent-foreground" : ""} onClick={() => setType("withdrawal")}>
                  <ArrowUpCircle className="h-4 w-4 mr-1" /> Withdraw
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Amount (TZS)</Label>
              <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500000" />
            </div>
            <Button className="w-full" onClick={handleRecord} disabled={recordFloat.isPending}>
              <Wallet className="h-4 w-4 mr-2" /> Record
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Float Balances</CardTitle>
              <div className="rounded-lg stat-card-green px-3 py-1.5 text-sm font-semibold text-primary-foreground">
                Total: {formatTZS(totalFloat)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Office</TableHead>
                  <TableHead className="text-right">M-Pesa</TableHead>
                  <TableHead className="text-right">Tigo Pesa</TableHead>
                  <TableHead className="text-right">Airtel Money</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offices?.filter(o => visibleOfficeIds.includes(o.id)).map(office => {
                  const fb = (n: string) => Number(balances?.find(b => b.office_id === office.id && b.network === n)?.balance ?? 0);
                  const total = fb("M-Pesa") + fb("Tigo Pesa") + fb("Airtel Money");
                  return (
                    <TableRow key={office.id}>
                      <TableCell className="font-medium">{office.name}</TableCell>
                      <TableCell className="text-right">{formatTZS(fb("M-Pesa"))}</TableCell>
                      <TableCell className="text-right">{formatTZS(fb("Tigo Pesa"))}</TableCell>
                      <TableCell className="text-right">{formatTZS(fb("Airtel Money"))}</TableCell>
                      <TableCell className="text-right font-semibold">{formatTZS(total)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
