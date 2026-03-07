import { useRole } from "@/contexts/RoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { transactions, offices, floatBalances, alerts, dailyTransactionSummary, formatTZS, getOfficeName } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Building2, Wallet, ArrowLeftRight, AlertTriangle, TrendingUp } from "lucide-react";

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
  const { role, currentOfficeId } = useRole();

  const isAdmin = role === "admin";
  const relevantOffices = isAdmin ? offices.filter(o => o.status === "active") : offices.filter(o => o.id === currentOfficeId);
  const relevantOfficeIds = relevantOffices.map(o => o.id);

  const totalFloat = floatBalances
    .filter(f => relevantOfficeIds.includes(f.officeId))
    .reduce((sum, f) => sum + f.balance, 0);

  const todayTx = transactions.filter(t =>
    t.date === "2026-03-07" && relevantOfficeIds.includes(t.officeId)
  );
  const todayVolume = todayTx.reduce((sum, t) => sum + t.amount, 0);
  const todayCommission = todayTx.reduce((sum, t) => sum + t.commission, 0);

  const newAlerts = alerts.filter(a =>
    a.status === "new" && relevantOfficeIds.includes(a.officeId)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isAdmin ? "Admin Dashboard" : `Office Dashboard — ${getOfficeName(currentOfficeId)}`}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview for {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Float" value={formatTZS(totalFloat)} icon={Wallet} gradient="stat-card-green" subtitle={`${relevantOfficeIds.length} offices`} />
        <StatCard title="Today's Transactions" value={todayTx.length.toString()} icon={ArrowLeftRight} gradient="stat-card-blue" subtitle={formatTZS(todayVolume)} />
        <StatCard title="Today's Commission" value={formatTZS(todayCommission)} icon={TrendingUp} gradient="stat-card-purple" />
        {isAdmin ? (
          <StatCard title="Active Offices" value={relevantOffices.length.toString()} icon={Building2} gradient="stat-card-orange" subtitle={`${offices.length} total`} />
        ) : (
          <StatCard title="Active Alerts" value={newAlerts.length.toString()} icon={AlertTriangle} gradient="stat-card-orange" />
        )}
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Daily Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTransactionSummary}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Kariakoo" fill="hsl(var(--chart-blue))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Mwanza" fill="hsl(var(--chart-green))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Arusha" fill="hsl(var(--chart-orange))" radius={[4, 4, 0, 0]} />
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
              newAlerts.map(alert => (
                <div key={alert.id} className="rounded-lg border bg-accent/10 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Float Breakdown */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Float by Office & Network</CardTitle>
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
                {offices.filter(o => o.status === "active").map(office => {
                  const fb = (network: string) => floatBalances.find(f => f.officeId === office.id && f.network === network)?.balance ?? 0;
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
      )}
    </div>
  );
}
