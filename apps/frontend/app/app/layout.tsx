import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <SidebarProvider defaultOpen={false}>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <div
          className="relative flex-1 w-full pt-16"
        >
          {children}
        </div>
      </div>
    </SidebarProvider>
      </body>

    </html>

  );
}
