import { AppSidebar } from "@/components/tatami_sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import Navbar from "../app/components/Navbar";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system">
          <SidebarProvider defaultOpen={false}>
            <div className="relative flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 w-full">
                <Navbar />
                <div className="relative w-full pt-16 pl-16">
                  {children}
                  <Toaster />
                </div>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
