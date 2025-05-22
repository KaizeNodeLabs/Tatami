'use client'
import { AppSidebar } from "@/app/app/tatami_sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import AppNavbar from "@/app/app/navbar/app-navbar";
import { useState } from "react";
import AppPage from "./page";
import Loader from "@/components/loader/Loader";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mainContent, setMainContentRaw] = useState<React.ReactNode>(<AppPage />);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("models"); // Default section

  // Accept sectionKey as a string to identify the section
  const setMainContent = (content: React.ReactNode, sectionKey: string) => {
    if (sectionKey === currentSection) {
      setMainContentRaw(content); // Just update content, no loader
      return;
    }
    setLoading(true);
    setMainContentRaw(content);
    setCurrentSection(sectionKey);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <html lang="en" className="dark">
      <body>
        <AppNavbar />
        <SidebarProvider defaultOpen={false} className="overflow-hidden">
          <div className="relative flex w-full overflow-x-hidden">
            <AppSidebar setMainContent={setMainContent} />
            <div
              id="main-content"
              className="relative flex-1 h-full overflow-auto pt-5 transition-all duration-300 ease-in-out"
            >
              {loading && <Loader />}
              {mainContent}
              <Toaster />
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
