import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <div
          className="relative flex-1 w-full pt-16"
          style={{ marginLeft: "60px" }}
        >
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
