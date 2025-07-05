import { CodeDiagramSection } from "@/app/app/diagram/code-diagram-section";
import { memo } from "react";

const AppPage = memo(() => {
  return (
    <main className="w-full h-full p-10">
      <CodeDiagramSection />
    </main>
  );
});

AppPage.displayName = "AppPage";

export default AppPage;
