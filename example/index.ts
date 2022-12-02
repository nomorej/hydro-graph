import { qwikStart, QwikStartParameters, TimelineSegmentDate } from '../src'
import { airTemperatureData } from './airTemperatureData'
import { iceRulerData } from './iceRulerData'
import { precipitationData } from './precipitationData'
import { waterTemperatureData } from './waterTemperatureData'
import { snowIceData } from './snowIceData'
import { waterLevelData } from './waterLevelData'
import { waterConsumptionData } from './waterConsumptionData'
import { phasesData } from './phasesData'
import { timelineData } from './timelineData'

async function fetchData(from: TimelineSegmentDate, to: TimelineSegmentDate) {
  const graphParameters: QwikStartParameters = {
    wrapper: document.getElementById('graph')!,
    timeline: await timelineData(from, to),
    data: {
      phases: await phasesData(from, to),
      airTemperature: await airTemperatureData(from, to),
      precipitation: await precipitationData(from, to),
      waterTemperature: await waterTemperatureData(from, to),
      snowIce: await snowIceData(from, to),
      waterlevel: await waterLevelData(from, to),
      iceRuler: await iceRulerData(from, to),
      waterСonsumption: await waterConsumptionData(from, to),
    },
  }

  return graphParameters
}

export async function createGraph(from: TimelineSegmentDate, to: TimelineSegmentDate) {
  const graph = qwikStart(await fetchData(from, to))

  return {
    destroy() {
      graph.destroy()
    },

    async recteate(from: TimelineSegmentDate, to: TimelineSegmentDate) {
      graph.recreate(await fetchData(from, to), true)
    },
  }
}

export async function main() {
  const graph = await createGraph('2021-01-01', '2021-12-31')

  // graph.recteate('2021-01-01', '2021-12-31')
  // graph.destroy()
}

main()
