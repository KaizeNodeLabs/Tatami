"use client";
import { AppSidebar } from "@/app/app/tatami_sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import AppNavbar from "@/app/app/navbar/app-navbar";
import { useState, useEffect, lazy, Suspense } from "react";
import Loader from "@/components/loader/Loader";
import { usePathname } from "next/navigation";
import { CartridgeProvider } from '@/components/providers/CartridgeProvider';
import { ErrorBoundary } from '@/components/providers/ErrorBoundary';

// Lazy load the main app page for faster initial load
const AppPage = lazy(() => import("./page"));

// Loading skeleton for the main content
const MainContentSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    <div className="h-32 bg-gray-300 rounded"></div>
  </div>
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mainContent, setMainContentRaw] = useState<React.ReactNode>(
    <Suspense fallback={<MainContentSkeleton />}>
      <AppPage />
    </Suspense>
  );
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<string>("models"); // Default section
  const pathname = usePathname();

  // Accept sectionKey as a string to identify the section
  const setMainContent = (content: React.ReactNode, sectionKey: string) => {
    if (sectionKey === currentSection) {
      setMainContentRaw(content); // Just update content, no loader
      return;
    }
    setLoading(true);
    setMainContentRaw(content);
    setCurrentSection(sectionKey);
    // Faster transition for better UX
    setTimeout(() => setLoading(false), 300);
  };

  // Initial loading sequence
  useEffect(() => {
    const initialLoadTimer = setTimeout(() => {
      setLoading(false);
    }, 600); // Reduced from 1200ms to 600ms for faster first load

    return () => clearTimeout(initialLoadTimer);
  }, []);

  // Route change loading
  useEffect(() => {
    if (!loading) {
      // Only show route change loading if not in initial load
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 200); // Faster route changes
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return (
    <html lang="en" className="dark">
      <body>
        <ErrorBoundary>
          <CartridgeProvider>
            {loading && (
              <Loader
                message={
                  currentSection === "models"
                    ? "Loading Tatami..."
                    : `Loading ${currentSection}...`
                }
              />
            )}
            <AppNavbar />
            <SidebarProvider defaultOpen={false} className="overflow-hidden">
              <div className="relative flex w-full overflow-x-hidden">
                <AppSidebar setMainContent={setMainContent} />
                <div
                  id="main-content"
                  className="relative flex-1 h-full overflow-auto pt-5 transition-all duration-300 ease-in-out"
                >
                  <Suspense fallback={<MainContentSkeleton />}>
                    {mainContent}
                  </Suspense>
                  <Toaster />
                  {/* Performance monitor disabled by default */}
                  {/* <PerformanceMonitor /> */}
                </div>
              </div>
            </SidebarProvider>
          </CartridgeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
