import { useEffect } from 'react';
import { useDiagramStore } from './useDiagramStore';
import { useFullscreen } from './useFullscreen';

export function useKeyboardShortcuts() {
  const { zoomIn, zoomOut, resetZoom } = useDiagramStore();
  const { toggleFullscreen } = useFullscreen();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as any)?.contentEditable === 'true'
      ) {
        return;
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      switch (true) {
        // Zoom In: Ctrl/Cmd + Plus or Ctrl/Cmd + =
        case isCtrlOrCmd && (event.key === '+' || event.key === '='):
          event.preventDefault();
          zoomIn();
          break;

        // Zoom Out: Ctrl/Cmd + Minus
        case isCtrlOrCmd && event.key === '-':
          event.preventDefault();
          zoomOut();
          break;

        // Reset Zoom: Ctrl/Cmd + 0
        case isCtrlOrCmd && event.key === '0':
          event.preventDefault();
          resetZoom();
          break;

        // Fullscreen: F11 or F
        case event.key === 'F11' || (event.key === 'f' && !isCtrlOrCmd):
          event.preventDefault();
          // For fullscreen we need the diagram container element
          const diagramContainer = document.querySelector('[data-diagram-container]') as HTMLElement;
          if (diagramContainer) {
            toggleFullscreen(diagramContainer);
          }
          break;

        // Help: ? key
        case event.key === '?' && !event.shiftKey:
          event.preventDefault();
          showKeyboardShortcutsHelp();
          break;
      }
    };

    const showKeyboardShortcutsHelp = () => {
      // Create a simple toast or modal showing keyboard shortcuts
      const helpText = `
Keyboard Shortcuts:
• Ctrl/Cmd + Plus: Zoom In
• Ctrl/Cmd + Minus: Zoom Out  
• Ctrl/Cmd + 0: Reset Zoom
• F or F11: Toggle Fullscreen
• ESC: Exit Fullscreen
• Double-click: Reset Zoom
• ?: Show this help
      `.trim();
      
      console.info(helpText);
      
      // Show a temporary overlay with shortcuts
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[10001]';
      overlay.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
          <h3 class="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
          <div class="text-sm space-y-2">
            <div><kbd class="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl/Cmd + +</kbd> Zoom In</div>
            <div><kbd class="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl/Cmd + -</kbd> Zoom Out</div>
            <div><kbd class="bg-gray-100 px-2 py-1 rounded text-xs">Ctrl/Cmd + 0</kbd> Reset Zoom</div>
            <div><kbd class="bg-gray-100 px-2 py-1 rounded text-xs">F</kbd> or <kbd class="bg-gray-100 px-2 py-1 rounded text-xs">F11</kbd> Toggle Fullscreen</div>
            <div><kbd class="bg-gray-100 px-2 py-1 rounded text-xs">ESC</kbd> Exit Fullscreen</div>
            <div><kbd class="bg-gray-100 px-2 py-1 rounded text-xs">Double-click</kbd> Reset Zoom</div>
            <div><kbd class="bg-gray-100 px-2 py-1 rounded text-xs">?</kbd> Show this help</div>
          </div>
          <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
            Got it!
          </button>
        </div>
      `;
      
      const closeHelp = () => {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleEscClose);
      };
      
      const handleEscClose = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeHelp();
        }
      };
      
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || (e.target as HTMLElement).tagName === 'BUTTON') {
          closeHelp();
        }
      });
      
      document.addEventListener('keydown', handleEscClose);
      document.body.appendChild(overlay);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [zoomIn, zoomOut, resetZoom, toggleFullscreen]);
}