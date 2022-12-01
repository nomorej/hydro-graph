import { qwikStart } from '../src'
import { airTemperatureData } from './airTemperatureData'
import { iceRulerData } from './iceRulerData'
import { monthsData } from './monthsData'
import { phasesData } from './phasesData'
import { precipitationData } from './precipitationData'
import { snowIceData } from './snowIceData'
import { waterLevelData } from './waterLevelData'
import { waterTemperatureData } from './waterTemperatureData'
import { waterСonsumptionData } from './waterСonsumptionData'

const months = monthsData()

const graphParameters = {
  wrapper: document.getElementById('graph')!,
  months: months,
  data: {
    phases: phasesData(),
    airTemperature: airTemperatureData(months),
    precipitation: precipitationData(months),
    waterTemperature: waterTemperatureData(months),
    snowIce: snowIceData(),
    waterlevel: waterLevelData(months),
    iceRuler: iceRulerData(),
    waterСonsumption: waterСonsumptionData(months),
  },
}

const graph = qwikStart(graphParameters)

addEventListener('keydown', (e) => {
  if (e.key === 'd') {
    graph.destroy()
  } else if (e.key === 'r') {
    graph.recreate(graphParameters)
  }
})
