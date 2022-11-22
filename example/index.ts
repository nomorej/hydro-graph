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

const graph = qwikStart({
  wrapper: document.getElementById('graph')!,
  months: monthsData(),
  data: {
    phases: phasesData(),
    airTemperature: airTemperatureData(),
    precipitation: precipitationData(),
    waterTemperature: waterTemperatureData(),
    snowIce: snowIceData(),
    waterlevel: waterLevelData(),
    iceRuler: iceRulerData(),
    waterСonsumption: waterСonsumptionData(),
  },
})

addEventListener('keydown', (e) => {
  if (e.key === 'd') {
    graph.destroy()
  }
})
