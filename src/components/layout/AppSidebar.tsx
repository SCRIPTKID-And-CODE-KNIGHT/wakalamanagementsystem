import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  ArrowLeftRight,
  FileBarChart,
  Bell,
  Shield,
  UserCog,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { alerts } from "@/data/mockData";

const adminItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Offices", url: "/offices", icon: Building2 },
  { title: "Staff", url: "/staff", icon: Users },
  { title: "Float", url: "/float", icon: Wallet },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "Alerts", url: "/alerts", icon: Bell },
];

const staffItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Float", url: "/float", icon: Wallet },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Reports", url: "/reports", icon: FileBarChart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { role, setRole } = useRole();

  const items = role === "admin" ? adminItems : staffItems;
  const newAlerts = alerts.filter(a => a.status === "new").length;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg">
            W
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-sidebar-foreground tracking-tight">WBMS</h2>
              <p className="text-xs text-sidebar-foreground/60">Wakala Business</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-xs uppercase tracking-wider">
            {role === "admin" ? "Management" : "My Office"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={
                    item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url)
                  }>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!collapsed && item.title === "Alerts" && newAlerts > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1 text-xs">
                          {newAlerts}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="rounded-lg bg-sidebar-accent p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
              {role === "admin" ? <Shield className="h-3 w-3" /> : <UserCog className="h-3 w-3" />}
              <span className="uppercase tracking-wider font-medium">Role</span>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="role-switch" className="text-xs text-sidebar-foreground cursor-pointer">
                {role === "admin" ? "Admin" : "Staff"}
              </Label>
              <Switch
                id="role-switch"
                checked={role === "admin"}
                onCheckedChange={(checked) => setRole(checked ? "admin" : "staff")}
                className="scale-75"
              />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
