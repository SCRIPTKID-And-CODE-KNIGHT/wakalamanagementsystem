import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions, useOffices, formatTZS } from "@/hooks/use-data";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, FileBarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

const COLORS = ["hsl(217,91%,50%)", "hsl(160,84%,39%)", "hsl(32,95%,52%)", "hsl(270,70%,55%)"];

export default function Reports() {
  const { role, userOfficeId } = useAuth();
  const { data: transactions, isLoading: txLoading } = useTransactions();
  const { data: offices, isLoading: officesLoading } = useOffices();
  const [filterOffice, setFilterOffice] = useState("all");

  const isAdmin = role === "admin";
  const visibleOfficeIds = isAdmin ? (offices?.map(o => o.id) ?? []) : (userOfficeId ? [userOfficeId] : []);
  
  let filtered = transactions?.filter(t => visibleOfficeIds.includes(t.office_id)) ?? [];
  if (filterOffice !== "all") filtered = filtered.filter(t => t.office_id === filterOffice);

  const totalAmount = filtered.reduce((s, t) => s + Number(t.amount), 0);
  const totalCommission = filtered.reduce((s, t) => s + Number(t.commission), 0);

  const officeSummary = (offices?.filter(o => visibleOfficeIds.includes(o.id)) ?? []).map(office => {
    const officeTx = filtered.filter(t => t.office_id === office.id);
    return {
      name: office.name,
      transactions: officeTx.length,
      volume: officeTx.reduce((s, t) => s + Number(t.amount), 0),
      commission: officeTx.reduce((s, t) => s + Number(t.commission), 0),
    };
  });

  const typeBreakdown = ["Cash In", "Cash Out", "Bill Payment", "Airtime"].map(type => ({
    name: type,
    value: filtered.filter(t => t.type === type).length,
  }));

  const dailyData: Record<string, { date: string; amount: number; count: number }> = {};
  filtered.forEach(t => {
    const day = format(parseISO(t.created_at), "MMM d");
    if (!dailyData[day]) dailyData[day] = { date: day, amount: 0, count: 0 };
    dailyData[day].amount += Number(t.amount);
    dailyData[day].count += 1;
  });
  const dailyChart = Object.values(dailyData);

  if (txLoading || officesLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Transaction & commission reports</p>
        </div>
        {isAdmin && (
          <Select value={filterOffice} onValueChange={setFilterOffice}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Offices" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Offices</SelectItem>
              {offices?.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="stat-card-blue border-0 text-primary-foreground">
          <CardContent className="p-5">
            <p className="text-sm text-primary-foreground/80">Total Volume</p>
            <p className="text-2xl font-bold mt-1">{formatTZS(totalAmount)}</p>
            <p className="text-xs text-primary-foreground/70 mt-1">{filtered.length} transactions</p>
          </CardContent>
        </Card>
        <Card className="stat-card-green border-0 text-secondary-foreground">
          <CardContent className="p-5">
            <p className="text-sm text-secondary-foreground/80">Total Commission</p>
            <p className="text-2xl font-bold mt-1">{formatTZS(totalCommission)}</p>
          </CardContent>
        </Card>
        <Card className="stat-card-purple border-0 text-primary-foreground">
          <CardContent className="p-5">
            <p className="text-sm text-primary-foreground/80">Avg. Transaction</p>
            <p className="text-2xl font-bold mt-1">{formatTZS(filtered.length ? Math.round(totalAmount / filtered.length) : 0)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Daily Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: number) => formatTZS(value)} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="amount" fill="hsl(var(--chart-blue))" radius={[4, 4, 0, 0]} name="Volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-accent" />
              By Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {typeBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Commission by Office</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Office</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {officeSummary.map(row => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-right">{row.transactions}</TableCell>
                    <TableCell className="text-right">{formatTZS(row.volume)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatTZS(row.commission)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
