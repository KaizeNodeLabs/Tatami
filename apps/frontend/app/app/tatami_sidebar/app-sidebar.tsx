"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "./useSidebar";
import { useModelSection } from "./use-model-section";
import { MemoizedModelSidebarSection } from "./model-sidebar-section";
import AppPage from "../page";
import MetricsPage from "../metrics/page";
import UnitTestsPage from "../../unit_tests/page";

export function AppSidebar({ setMainContent }: { setMainContent: (content: React.ReactNode, sectionKey: string) => void }) {
  const { selectedOption, dynamicContent, staticMenuItems, toggleOption,dynamicMenuItems } =
    useSidebar();
  const modelSection = useModelSection();
  return (
    <>
      {/* Sidebar principal fijo */}
      <Sidebar
        collapsible="none"
        className="fixed left-0 top-16 h-[calc(100vh-64px)] z-[100] shadow-lg w-[60px] border-r border-background"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {staticMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                 <SidebarMenuButton
                    isActive={selectedOption === item.id}
                    onClick={() => {
                      toggleOption(item.id);
                      if (item.id === "models") {
                        setMainContent(<AppPage />, item.id);
                      } else if (item.id === "metrics") {
                        setMainContent(<MetricsPage />, item.id);
                      } else if (item.id === "unit-tests") {
                        setMainContent(<UnitTestsPage />, item.id);
                      }
                    }}
                    tooltip={item.label}
                    className="justify-center p-3"
                  >
                    <item.icon className="text-primary-foreground h-9 w-9" style={{ color: "#f7c618" }} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Sidebar dinámico con transición */}
      <div
        className={`fixed left-[60px] top-16 h-[calc(100vh-64px)] z-[99] transition-all duration-300 ease-in-out ${
          selectedOption =='models'
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }`}
      >
        <Sidebar
          collapsible="none"
          className="h-full shadow-lg border-r border-primary-700 w-[350px] bg-neutral"
        >
          <SidebarContent className="h-full flex flex-col overflow-hidden">
            <SidebarGroup className="flex flex-col h-full overflow-hidden">
              <SidebarGroupLabel className="text-foreground text-xl flex-shrink-0">
                {
                  staticMenuItems.find((item) => item.id === selectedOption)
                    ?.label
                }
              </SidebarGroupLabel>
              <hr />

              <div
                className={`${
                  selectedOption === "models" ? "block" : "hidden"
                } h-full`}
              >
                <MemoizedModelSidebarSection modelSection={modelSection} />
              </div>

              {dynamicMenuItems.map((item) => (
                <div
                  key={item}
                  className={`${
                    selectedOption === item.toLowerCase() ? "block" : "hidden"
                  } h-full`}
                >
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {dynamicContent[
                        item.toLowerCase() as keyof typeof dynamicContent
                      ]?.map((menuItem) => (
                        <SidebarMenuItem key={menuItem.id}>
                          <SidebarMenuButton className="w-full text-base p-3">
                            {menuItem.label}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </div>
              ))}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </>
  );
}
