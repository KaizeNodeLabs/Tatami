import { CodeDiagramSection } from "@/app/app/diagram/code-diagram-section";
import { ModelStateProvider } from "@/hooks/useModelState";
import { memo } from "react";

const AppPage = memo(() => {
  return (
    <ModelStateProvider>
      <main className="w-full h-full p-10">
        <CodeDiagramSection />
      </main>
    </ModelStateProvider>
  );
});

AppPage.displayName = "AppPage";

export default AppPage;
