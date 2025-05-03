import { Button } from "@/components/ui/button";
import { Code, Copy, Download, SquareDashedMousePointer } from "lucide-react";

interface ActionButtonsProps {
  activeSection: string;
  onToggleSection: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export function ActionButtons({
  activeSection,
  onToggleSection,
  onCopy,
  onDownload,
}: ActionButtonsProps) {
  return (
    <div className="flex justify-end p-2">
      <Button
        size="icon"
        variant="secondary"
        onClick={onToggleSection}
      >
        {activeSection === "code" ? (
         <SquareDashedMousePointer style={{ height: '20px', width: '20px' }}/>
        ) : (
          <Code />
        )}
      </Button>
      {activeSection === "code" && (
        <Button
          size="icon"
          variant="secondary"
          onClick={onCopy}
        >
          <Copy style={{ height: '20px', width: '20px' }} />
        </Button>
      )}
      <Button
        size="icon"
        variant="secondary"
        onClick={onDownload}
      >
        <Download style={{ height: '20px', width: '20px' }} />
      </Button>
    </div>
  );
}