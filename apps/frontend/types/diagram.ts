export interface DiagramViewport {
  zoomLevel: number;
  isFullscreen: boolean;
}

export interface DiagramZoomConfig {
  min: number;
  max: number;
  step: number;
  default: number;
}

export const DIAGRAM_ZOOM_CONFIG: DiagramZoomConfig = {
  min: 25,
  max: 200,
  step: 15,
  default: 100,
};

export type ZoomDirection = 'in' | 'out';