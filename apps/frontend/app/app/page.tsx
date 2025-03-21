"use client";

import { CodeDiagramSection } from "@/components/app/code-diagram-section";
import { Button } from "@/components/ui/button";
import DatatypeDropdown from "@/components/ui/datatype-dropdown";
import Link from "next/link";

export default function AppPage() {
  return (
    <main className="w-full h-full p-10">
      <CodeDiagramSection />
      <div className="mt-4 flex gap-4">
        <DatatypeDropdown />
        <Button asChild>
          <Link href="/some-route">Go to Page</Link>
        </Button>
      </div>
    </main>
  );
}
