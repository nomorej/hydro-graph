import { qwikStart, QwikStartParameters } from '../src'
import { airTemperatureData } from './airTemperatureData'
import { iceRulerData } from './iceRulerData'
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
  const phases = await phasesData()
  const airTemperature = await airTemperatureData()
  const precipitation = await precipitationData()
  const waterTemperature = await waterTemperatureData()
  const snowIce = await snowIceData()
  const waterlevel = await waterLevelData()
  const iceRuler = await iceRulerData()
  const waterСonsumption = await waterСonsumptionData()

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
