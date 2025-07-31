import { Database, LayoutTemplate, TestTube } from "lucide-react";
import { useState, useEffect } from "react";

const staticMenuItems = [
  { id: "models", label: "Models", icon: Database },
  { id: "metrics", label: "Metrics", icon: LayoutTemplate },
  { id: "unit-tests", label: "Unit Tests", icon: TestTube },
];

const initialDynamicContent = {
  layers: [
    { id: "layer1", label: "Layer 1" },
    { id: "layer2", label: "Layer 2" },
    { id: "layer3", label: "Layer 3" },
  ],
  settings: [
    { id: "account", label: "Account Settings" },
    { id: "preferences", label: "Preferences" },
    { id: "theme", label: "Theme" },
  ],
};

const dynamicMenuItems = ['Metrics', 'Users', 'Settings'];
export const useSidebar = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState(initialDynamicContent);

  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const margin = selectedOption=='models' ? '410px' : '60px';
      mainContent.style.marginLeft = margin;
    }
  }, [selectedOption]);

  const toggleOption = (optionId: string) => {
    if (selectedOption === optionId) {
      setSelectedOption(null);
    } else {
      setSelectedOption(optionId);
    }
  };

  return {
    selectedOption,
    dynamicContent,
    staticMenuItems,
    toggleOption, dynamicMenuItems
  };
};
