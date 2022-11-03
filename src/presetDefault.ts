import { AppGlobalsConfig, AppParameters, AppSettings } from './App'

export interface PresetParameters {
  data: AppParameters['globals']['data']
  container: AppParameters['container']
}

export function presetDefault({ data, container }: PresetParameters): AppParameters {
  const settings: Partial<AppSettings> = {
    maxZoom: 15,
    smoothness: 7,
    wheelZoomSpeed: 1,
    wheelTranlationSpeed: 1,
    zoomMouseButton: 'left',
  }

  const colors: AppGlobalsConfig['colors'] = {
    default: '#1e6062',
    timeline: '#000000',
    timelineSegment: '#66f5ff',
    content: '#ccfcff',
  }

  const sizes: AppGlobalsConfig['sizes'] = {
    font: 0.02,
    paddingX: 0.005,
    paddingY: 0.0,
    contentPaddingX: 0.1,
    timelineOffsetY: 0.05,
    timelineHeight: 0.02,
  }

  return {
    globals: {
      colors,
      sizes,
      font: 'sans-serif',
      data,
    },
    container,
    settings,
  }
}
