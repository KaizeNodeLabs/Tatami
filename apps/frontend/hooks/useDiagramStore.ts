import { create } from 'zustand';

type EntityPorition = { x: number; y: number };

interface DiagramStore {
    entityPositions: Record<string, EntityPorition>;
    setEntityPosition: (id: string, position: EntityPorition) => void;
    setAllPositions: (positions: Record<string, EntityPorition>) => void;
    activeSections: "code" | "diagram";
    setActiveSection: (section: "code" | "diagram") => void;
    resetDiiagram: () => void;
}

export const useDiagramStore = create<DiagramStore>((set) => ({
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
        activeSections: "code"
    }))
}))