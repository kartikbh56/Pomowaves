import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import Home from "./pages/Home.jsx";

import Leaderboard from "./pages/Leaderboard.jsx";
import Reports from "./pages/Reports.jsx";
import Auth from "./pages/Auth";
import ProtectedRoute from "./pages/protectedRoute.jsx";

import AppSidebar from "./components/app-sidebar.jsx";

import { Toaster } from "@/components/ui/sonner";
import TimeSheet from "./pages/Timesheet.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <Router>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<Auth />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/timesheet" element={<TimeSheet />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Route>
            </Route>
          </Routes>
        </QueryClientProvider>
      </Router>
      <Toaster
        richColors
        toastOptions={{
          classNames: {
            toast: "text-center font-varela text-base",
            title: "text-center font-varela",
            description: "text-center font-varela",
          },
        }}
      />
    </>
  );
}

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppHeader() {
  return (
    <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 px-3 sm:px-4 border-b lg:hidden md:hidden">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2">
        <div className="flex aspect-square size-6 sm:size-7 items-center justify-center rounded-md bg-gradient-to-br from-[#ba4a49] to-[#7e53a2] text-white">
          <div className="size-3 sm:size-4 bg-white rounded-sm opacity-90" />
        </div>
        <span className="font-semibold text-sm sm:text-base">Pomowaves</span>
      </div>
    </header>
  );
}
