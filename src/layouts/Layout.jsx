import { SideNavBar } from "@/components/SideNavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <SideNavBar />

      <Outlet />
    </SidebarProvider>
  );
}
