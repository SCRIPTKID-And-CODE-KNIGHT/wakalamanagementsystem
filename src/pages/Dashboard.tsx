import { useAuth } from "@/contexts/AuthContext";
import { useOffices, useFloatBalances, useTransactions, useAlerts, formatTZS } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Building2, Wallet, ArrowLeftRight, AlertTriangle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { NETWORKS } from "@/lib/constants";

function StatCard({ title, value, icon: Icon, gradient, subtitle }: {
  title: string; value: string; icon: React.ElementType; gradient: string; subtitle?: string;
}) {
  return (
    <Card className={`${gradient} border-0 text-white shadow-lg`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
          </div>
          <div className="rounded-xl bg-white/20 p-2.5">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { role, userOfficeId } = useAuth();
  const { data: offices, isLoading: officesLoading } = useOffices();
  const { data: floatBalances, isLoading: floatLoading } = useFloatBalances();
  const { data: transactions, isLoading: txLoading } = useTransactions();
  const { data: alerts } = useAlerts();

  const isAdmin = role === "admin";
  const loading = officesLoading || floatLoading || txLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  const activeOffices = offices?.filter(o => o.status === "active") ?? [];
  const relevantOfficeIds = isAdmin
    ? activeOffices.map(o => o.id)
    : userOfficeId ? [userOfficeId] : [];

  const relevantFloat = floatBalances?.filter(f => relevantOfficeIds.includes(f.office_id)) ?? [];
  const totalFloat = relevantFloat.reduce((sum, f) => sum + Number(f.balance), 0);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayTx = transactions?.filter(t =>
    format(parseISO(t.created_at), "yyyy-MM-dd") === today && relevantOfficeIds.includes(t.office_id)
  ) ?? [];
  const todayVolume = todayTx.reduce((sum, t) => sum + Number(t.amount), 0);
  const todayCommission = todayTx.reduce((sum, t) => sum + Number(t.commission), 0);

  const newAlerts = alerts?.filter(a => a.status === "new" && relevantOfficeIds.includes(a.office_id)) ?? [];

  const officeNameMap = new Map(offices?.map(o => [o.id, o.name]) ?? []);
  const dailyData: Record<string, Record<string, number>> = {};
  const last7 = transactions?.filter(t => relevantOfficeIds.includes(t.office_id)).slice(0, 200) ?? [];
  last7.forEach(t => {
    const day = format(parseISO(t.created_at), "MMM d");
    if (!dailyData[day]) dailyData[day] = {};
    const oName = officeNameMap.get(t.office_id) ?? "Other";
    dailyData[day][oName] = (dailyData[day][oName] ?? 0) + 1;
  });
  const chartData = Object.entries(dailyData).map(([date, offices]) => ({ date, ...offices }));
  const officeNames = [...new Set(last7.map(t => officeNameMap.get(t.office_id) ?? "Other"))];
  const chartColors = ["hsl(var(--chart-blue))", "hsl(var(--chart-green))", "hsl(var(--chart-orange))", "hsl(var(--chart-purple))"];

  const currentOfficeName = !isAdmin && userOfficeId ? officeNameMap.get(userOfficeId) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isAdmin ? "Admin Dashboard" : `Office Dashboard — ${currentOfficeName ?? "Unassigned"}`}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview for {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Float" value={formatTZS(totalFloat)} icon={Wallet} gradient="stat-card-green" subtitle={`${relevantOfficeIds.length} offices`} />
        <StatCard title="Today's Transactions" value={todayTx.length.toString()} icon={ArrowLeftRight} gradient="stat-card-blue" subtitle={formatTZS(todayVolume)} />
        <StatCard title="Today's Commission" value={formatTZS(todayCommission)} icon={TrendingUp} gradient="stat-card-purple" />
        {isAdmin ? (
          <StatCard title="Active Offices" value={activeOffices.length.toString()} icon={Building2} gradient="stat-card-orange" subtitle={`${offices?.length ?? 0} total`} />
        ) : (
          <StatCard title="Active Alerts" value={newAlerts.length.toString()} icon={AlertTriangle} gradient="stat-card-orange" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Daily Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                  <Legend />
                  {officeNames.map((name, i) => (
                    <Bar key={name} dataKey={name} fill={chartColors[i % chartColors.length]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {newAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active alerts</p>
            ) : (
              newAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="rounded-lg border bg-accent/10 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(parseISO(alert.created_at), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {isAdmin && offices && floatBalances && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Float by Office & Network</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Office</TableHead>
                  {NETWORKS.map(n => (
                    <TableHead key={n} className="text-right">{n}</TableHead>
                  ))}
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOffices.map(office => {
                  const fb = (network: string) => Number(floatBalances.find(f => f.office_id === office.id && f.network === network)?.balance ?? 0);
                  const total = NETWORKS.reduce((s, n) => s + fb(n), 0);
                  return (
                    <TableRow key={office.id}>
                      <TableCell className="font-medium">{office.name}</TableCell>
                      {NETWORKS.map(n => (
                        <TableCell key={n} className="text-right">{formatTZS(fb(n))}</TableCell>
                      ))}
                      <TableCell className="text-right font-semibold">{formatTZS(total)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
