/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Settings,
  Moon,
  Sun,
  MoreHorizontal,
  Timer,
  CalendarClock,
  Medal,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { useAuthStore } from "../store/useAuthStore";
import SettingsDialog from "../components/SettingsDialog";

export default function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const timerItems = [
    { to: "/", icon: Timer, label: "Pomodoro", tooltip: "Pomodoro" },
    {
      onClick: () => setSettingsOpen(true),
      icon: Settings,
      label: "Settings",
      tooltip: "Settings",
    },
  ];

  const statsItems = [
    { to: "/reports", icon: BarChart3, label: "Reports", tooltip: "Reports" },
    { to: "/timesheet", icon: CalendarClock, label: "Timesheet" },
    { to: "/leaderboard", icon: Medal, label: "Leaderboard" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-neutral-800 text-white">
                    <span className="text-sm font-bold">P</span>
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">PomoWaves</span>
                    <span className="truncate text-xs text-muted-foreground">
                      v2.0.0
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarContent>
              <SidebarSection label="Timer" items={timerItems} />
              <SidebarSection label="Stats" items={statsItems} />
            </SidebarContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip="User Menu"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg font-extrabold text-lg bg-neutral-800 text-white">
                        <span className="text-sm font-bold">
                          {user?.name?.[0] || "U"}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                    <MoreHorizontal className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="cursor-pointer"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="mr-2 size-4" />
                        Switch to Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 size-4" />
                        Switch to Dark Mode
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

// Updated NavItem to handle both links and onClick actions
const NavItem = ({ to, onClick, icon: Icon, label, tooltip }) => {
  const location = useLocation();
  const isActive = to && location.pathname === to;

  const content = (
    <>
      <Icon className="size-4" />
      <span>{label}</span>
    </>
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={tooltip} isActive={isActive}>
        {to ? (
          <Link to={to} className="relative">
            {content}
          </Link>
        ) : (
          <button onClick={onClick} className="relative w-full">
            {content}
          </button>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

// Group section abstraction
const SidebarSection = ({ label, items }) => (
  <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);
