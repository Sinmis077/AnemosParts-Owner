import { SideNavBar } from "@/components/SideNavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <Toaster position="top-right" reverseOrder={true} />
      <SideNavBar />

      <Outlet />
    </SidebarProvider>
  );
}
