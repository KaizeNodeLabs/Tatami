import { create } from 'zustand';
import { DIAGRAM_ZOOM_CONFIG } from '@/types/diagram';

type EntityPorition = { x: number; y: number };

interface DiagramStore {
    entityPositions: Record<string, EntityPorition>;
    setEntityPosition: (id: string, position: EntityPorition) => void;
    setAllPositions: (positions: Record<string, EntityPorition>) => void;
    activeSections: "code" | "diagram";
    setActiveSection: (section: "code" | "diagram") => void;
    resetDiiagram: () => void;
    // New zoom and fullscreen state
    zoomLevel: number;
    isFullscreen: boolean;
    setZoomLevel: (level: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    toggleFullscreen: () => void;
    setFullscreen: (isFullscreen: boolean) => void;
}

export const useDiagramStore = create<DiagramStore>((set, get) => ({
    entityPositions: {},
    setEntityPosition: (id, position) => set((state) => ({
        entityPositions: {
            ...state.entityPositions,
            [id]: position
        }
    })),
    setAllPositions: (positions) => set(() => ({
        entityPositions: positions
    })),
    activeSections: "code",
    setActiveSection: (section) => set(() => ({
        activeSections: section
    })),
    resetDiiagram: () => set(() => ({
        entityPositions: {},
        activeSections: "code",
        zoomLevel: DIAGRAM_ZOOM_CONFIG.default,
        isFullscreen: false
    })),
    // New zoom and fullscreen implementation
    zoomLevel: DIAGRAM_ZOOM_CONFIG.default,
    isFullscreen: false,
    setZoomLevel: (level: number) => set(() => {
        const clampedLevel = Math.max(
            DIAGRAM_ZOOM_CONFIG.min,
            Math.min(DIAGRAM_ZOOM_CONFIG.max, level)
        );
        return { zoomLevel: clampedLevel };
    }),
    zoomIn: () => {
        const currentLevel = get().zoomLevel;
        const newLevel = Math.min(
            DIAGRAM_ZOOM_CONFIG.max,
            currentLevel + DIAGRAM_ZOOM_CONFIG.step
        );
        set({ zoomLevel: newLevel });
    },
    zoomOut: () => {
        const currentLevel = get().zoomLevel;
        const newLevel = Math.max(
            DIAGRAM_ZOOM_CONFIG.min,
            currentLevel - DIAGRAM_ZOOM_CONFIG.step
        );
        set({ zoomLevel: newLevel });
    },
    resetZoom: () => set(() => ({
        zoomLevel: DIAGRAM_ZOOM_CONFIG.default
    })),
    toggleFullscreen: () => set((state) => ({
        isFullscreen: !state.isFullscreen
    })),
    setFullscreen: (isFullscreen: boolean) => set(() => ({
        isFullscreen
    }))
}))