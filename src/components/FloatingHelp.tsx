import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HelpCircle, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface HelpStep {
  title: string;
  description: string;
}

const adminGuide: HelpStep[] = [
  { title: "Dashboard Overview", description: "View total float, daily transactions, commissions, and alerts across all offices at a glance." },
  { title: "Manage Offices", description: "Go to Offices to create, edit, or deactivate branch offices. Each office tracks its own float and staff." },
  { title: "Add Staff", description: "Navigate to Staff → New Staff. Assign a name, office, role, email and password. Staff will use these credentials to sign in." },
  { title: "Record Transactions", description: "Go to Transactions → New Transaction. Select office, staff, type, network, enter amount and commission, then record." },
  { title: "Float Management", description: "Use Float Management to deposit or withdraw float for any office and network. Balances update in real time." },
  { title: "View Reports", description: "Reports page shows revenue breakdowns, transaction trends, and per-office performance summaries." },
  { title: "Monitor Alerts", description: "Alerts page shows low-float warnings, high-volume flags, and abnormal activity. Acknowledge them once resolved." },
];

const staffGuide: HelpStep[] = [
  { title: "Your Dashboard", description: "See your office's float balance, today's transaction count, volume, and any active alerts." },
  { title: "Record Transactions", description: "Go to Transactions → New Transaction. Choose the type (Cash In, Cash Out, etc.), network, enter the amount and commission, then record." },
  { title: "Float Management", description: "Record float deposits and withdrawals for your assigned office. Select the network and enter the amount." },
  { title: "View Alerts", description: "Check the Alerts page for any low-float warnings or flags on your office. Acknowledge them once handled." },
  { title: "Transaction History", description: "Filter your office's transactions by type or network to review past records and receipts." },
];

export function FloatingHelp() {
  const [open, setOpen] = useState(false);
  const { role } = useAuth();

  const guide = role === "admin" ? adminGuide : staffGuide;

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setOpen(!open)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        {open ? <X className="h-6 w-6" /> : <HelpCircle className="h-6 w-6" />}
      </Button>

      {/* Help panel */}
      {open && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 shadow-2xl border animate-in slide-in-from-bottom-4 fade-in-0 duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                How to Use WBMS
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {role === "admin" ? "Admin" : "Staff"} Guide
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Step-by-step guide for your role
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-72 px-4 pb-4">
              <div className="space-y-3">
                {guide.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-3 rounded-lg border p-3 bg-muted/30 hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-tight">{step.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </>
  );
}
