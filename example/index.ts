import { qwikStart, QwikStartParameters } from '../src'
import { airTemperatureData } from './airTemperatureData'
import { iceRulerWithRealData } from './iceRulerWithRealData'
import { monthsData } from './monthsData'
import { phasesData } from './phasesData'
import { precipitationData } from './precipitationData'
import { snowIceData } from './snowIceData'
import { waterLevelData } from './waterLevelData'
import { waterTemperatureData } from './waterTemperatureData'
import { waterСonsumptionData } from './waterСonsumptionData'

export async function start() {
  const wrapper = document.getElementById('graph')!
  const months = await monthsData()

  const phases = await phasesData(months)
  const airTemperature = await airTemperatureData(months)
  const precipitation = await precipitationData(months)
  const waterTemperature = await waterTemperatureData(months)
  const snowIce = await snowIceData(months)
  const waterlevel = await waterLevelData(months)
  const iceRuler = await iceRulerWithRealData(months)
  const waterСonsumption = await waterСonsumptionData(months)

  const graphParameters: QwikStartParameters = {
    wrapper: wrapper,
    months,
    data: {
      phases,
      airTemperature,
      precipitation,
      waterTemperature,
      snowIce,
      waterlevel,
      iceRuler,
      waterСonsumption,
    },
  }

  const graph = qwikStart(graphParameters)

  addEventListener('keydown', (e) => {
    if (e.key === 'd') {
      graph.destroy()
    } else if (e.key === 'r') {
      graph.recreate(graphParameters, true)
    }
  })
}

start()
