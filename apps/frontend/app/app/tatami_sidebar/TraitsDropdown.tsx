'use client'
import React, { useState, useRef, useEffect } from 'react'; 
import { ChevronDown, Check } from 'lucide-react';
import { TypeInfoTooltip } from '@/components/ui/type-info-tooltip';

interface TraitsDropdownProps {
  modelId: string;
  onTraitToggle: (modelId: string, name: string, isEnabled: boolean) => void;
  selectedTraits: string[];
}

interface Trait {
  id: string;
  name: string;
}

const availableTraits: Trait[] = [
  { id: '1', name: 'Copy'},
  { id: '2', name: 'Drop'},
  { id: '3', name: 'Serde'},
  { id: '4', name: 'IntrospectPacked'},
  { id: '5', name: 'Debug'}
];

const TuneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
    <g clipPath="url(#clip0_917_310)">
      <path d="M3 17V19H9V17H3ZM3 5V7H13V5H3ZM13 21V19H21V17H13V15H11V21H13ZM7 9V11H3V13H7V15H9V9H7ZM21 13V11H11V13H21ZM15 9H17V7H21V5H17V3H15V9Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_917_310">
        <rect width="24" height="24" fill="currentColor"/>
      </clipPath>
    </defs>
  </svg>
);

const TraitsDropdown: React.FC<TraitsDropdownProps> = ({ modelId, onTraitToggle, selectedTraits = [] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTrait = (traitId: string) => {
    const trait = availableTraits.find(t => t.id === traitId);
  
    if (trait) {
      const isSelected = selectedTraits.includes(trait.name);
      onTraitToggle(modelId, trait.name, !isSelected);
    }
  };
  
  return (
    <div className="relative inline-block flex-wrap" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-foreground/95 bg-foreground text-background font-medium gap-1 flex items-center justify-center h-8 px-3 border border-neutral rounded transition-colors"
      >
        <div className="flex items-center gap-0 max-w-[100px]">
            <TuneIcon />
            <span className="font-medium">Traits</span>
        </div>
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-background border border-neutral rounded shadow-lg z-20">
          <div className="px-4 py-1 border-b border-neutral font-medium flex items-center">
            <TuneIcon />
            <span>Traits</span>
          </div>
          <div className="py-0 max-h-72 overflow-y-auto">
            {availableTraits.map((trait) => (
              <div 
                key={trait.id}
                className="flex items-center px-4 py-1.5 hover:bg-neutral-100 cursor-pointer"
                onClick={() => toggleTrait(trait.id)}
              >
                <span className="text-sm flex-grow">{trait.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 flex items-center justify-center border border-neutral rounded bg-foreground text-background">
                    {selectedTraits.includes(trait.name) && <Check className="h-3 w-3" />}
                  </div>
                  <TypeInfoTooltip value={trait.name} className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TraitsDropdown;