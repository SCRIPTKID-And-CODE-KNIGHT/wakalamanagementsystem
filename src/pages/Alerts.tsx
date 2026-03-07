import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { alerts as initialAlerts, getOfficeName } from "@/data/mockData";
import { Alert as AlertType } from "@/types";
import { AlertTriangle, Activity, ShieldAlert, CheckCircle2, Bell } from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  low_float: AlertTriangle,
  high_volume: Activity,
  abnormal_activity: ShieldAlert,
};

const typeBg: Record<string, string> = {
  low_float: "bg-accent/10 border-accent/30",
  high_volume: "bg-primary/10 border-primary/30",
  abnormal_activity: "bg-destructive/10 border-destructive/30",
};

export default function Alerts() {
  const [alertList, setAlertList] = useState<AlertType[]>(initialAlerts);

  const handleAcknowledge = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, status: "acknowledged" } : a));
  };

  const newAlerts = alertList.filter(a => a.status === "new");
  const ackAlerts = alertList.filter(a => a.status === "acknowledged");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor float levels and unusual activity</p>
        </div>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
          <Bell className="h-3.5 w-3.5 text-accent" />
          {newAlerts.length} active
        </Badge>
      </div>

      {/* New Alerts */}
      {newAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Alerts</h2>
          {newAlerts.map(alert => {
            const Icon = typeIcons[alert.type] ?? AlertTriangle;
            return (
              <Card key={alert.id} className={`border ${typeBg[alert.type]}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-card p-2">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground">{getOfficeName(alert.officeId)}</span>
                        {alert.network && <Badge variant="secondary" className="text-xs h-5">{alert.network}</Badge>}
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 gap-1" onClick={() => handleAcknowledge(alert.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Acknowledged */}
      {ackAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Acknowledged</h2>
          {ackAlerts.map(alert => {
            const Icon = typeIcons[alert.type] ?? AlertTriangle;
            return (
              <Card key={alert.id} className="border opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-muted-foreground">{getOfficeName(alert.officeId)}</span>
                        {alert.network && <Badge variant="secondary" className="text-xs h-5">{alert.network}</Badge>}
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">Resolved</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
