import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, UserCog, LogOut } from "lucide-react";
import { FloatingHelp } from "@/components/FloatingHelp";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { role, profile, signOut } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b bg-card px-4 shrink-0">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex-1" />
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {profile?.full_name}
            </span>
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium">
              {role === "admin" ? (
                <Shield className="h-3 w-3 text-primary" />
              ) : (
                <UserCog className="h-3 w-3 text-secondary" />
              )}
              {role === "admin" ? "Admin" : "Staff"}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <FloatingHelp />
    </SidebarProvider>
  );
}
