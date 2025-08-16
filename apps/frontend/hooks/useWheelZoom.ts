import { useEffect, RefObject } from 'react';
import { useDiagramStore } from './useDiagramStore';

export function useWheelZoom(containerRef: RefObject<HTMLElement | null>) {
  const { zoomLevel, setZoomLevel } = useDiagramStore();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
      // Only zoom when Ctrl/Cmd is held
      if (!event.ctrlKey && !event.metaKey) return;

      event.preventDefault();
      
      const delta = -event.deltaY;
      const zoomSensitivity = 0.1;
      const currentZoom = zoomLevel / 100;
      
      // Calculate new zoom level
      const newZoomLevel = Math.max(0.25, Math.min(2, currentZoom + delta * zoomSensitivity));
      const newZoomPercentage = Math.round(newZoomLevel * 100);
      
      setZoomLevel(newZoomPercentage);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [containerRef, zoomLevel, setZoomLevel]);
}