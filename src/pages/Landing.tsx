import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Wallet, ArrowLeftRight, BarChart3, Shield, Users, ChevronRight } from "lucide-react";

const features = [
  { icon: Building2, title: "Office Management", description: "Create and manage multiple Wakala offices across locations with GPS tracking.", color: "stat-card-blue" },
  { icon: Users, title: "Staff Management", description: "Assign staff to offices, track roles, and monitor individual performance.", color: "stat-card-green" },
  { icon: Wallet, title: "Float Tracking", description: "Real-time float balances per office and network — M-Pesa, Tigo Pesa, Airtel Money.", color: "stat-card-orange" },
  { icon: ArrowLeftRight, title: "Transaction Records", description: "Record Cash In, Cash Out, Bill Payments, and Airtime with full audit trail.", color: "stat-card-purple" },
  { icon: BarChart3, title: "Reports & Analytics", description: "Daily, weekly, and monthly reports with commission tracking per office.", color: "stat-card-blue" },
  { icon: Shield, title: "Alerts & Security", description: "Low float warnings, abnormal activity detection, and role-based access control.", color: "stat-card-green" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
              W
            </div>
            <div>
              <span className="font-bold text-foreground tracking-tight">WBMS</span>
              <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Wakala Business Management</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started <ChevronRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 stat-card-blue opacity-[0.03]" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Wallet className="h-4 w-4 text-primary" />
            Built for Mobile Money Agents in Tanzania
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight max-w-3xl mx-auto">
            Manage Your <span className="text-primary">Wakala</span> Business with Confidence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            Track float balances, record transactions, manage staff across offices, and get real-time alerts — all in one powerful system.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button size="lg" className="text-base px-8 h-12" asChild>
              <Link to="/auth">Start Free <ChevronRight className="h-4 w-4 ml-1" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
              <a href="#features">See Features</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Networks Supported", value: "3" },
            { label: "Transaction Types", value: "4" },
            { label: "Role-Based Access", value: "✓" },
            { label: "Real-Time Alerts", value: "✓" },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Everything You Need to Run Your Wakala</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            From float management to commission reports, WBMS covers all your daily operations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => (
            <Card key={feature.title} className="group hover:shadow-lg transition-shadow border">
              <CardContent className="p-6">
                <div className={`inline-flex items-center justify-center rounded-xl ${feature.color} p-3 mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="stat-card-blue">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Streamline Your Operations?</h2>
          <p className="text-white/80 mt-4 text-lg max-w-xl mx-auto">
            Join Wakala agents across Tanzania who trust WBMS to manage their business.
          </p>
          <Button size="lg" variant="secondary" className="mt-8 text-base px-8 h-12" asChild>
            <Link to="/auth">Create Your Account <ChevronRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              W
            </div>
            <span className="text-sm font-semibold text-foreground">WBMS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wakala Business Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
