import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from './button';

interface HelpTooltipProps {
  shortcuts: string[];
}

export function HelpTooltip({ shortcuts }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 opacity-60 hover:opacity-100"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        title="Show keyboard shortcuts"
      >
        <HelpCircle className="h-3 w-3" />
      </Button>
      
      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 p-3 bg-black/90 text-white text-xs rounded-lg shadow-lg min-w-[200px] z-[1000]">
          <div className="space-y-1">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between">
                <span className="opacity-80">{shortcut.split(' - ')[1]}</span>
                <kbd className="bg-white/20 px-1 py-0.5 rounded text-xs">
                  {shortcut.split(' - ')[0]}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}