import { qwikStart, QwikStartParameters } from '../src'
import { iceRulerWithRealData } from './iceRulerWithRealData'
import { monthsData } from './monthsData'

export async function start() {
  const graphParameters: QwikStartParameters = {
    wrapper: document.getElementById('graph')!,
    timeline: await monthsData(),
    data: {
      // phases,
      // airTemperature: {
      //   max: [
      //     {
      //       date: '2020-01-12T03:00:00',
      //       value: 10,
      //     },
      //     {
      //       date: '2020-01-13T03:00:00',
      //       value: 20,
      //     },
      //     {
      //       date: '2020-01-14T03:00:00',
      //       value: 15,
      //     },
      //   ],
      // },
      // precipitation,
      // waterTemperature,
      // snowIce,
      // waterlevel,
      iceRuler: await iceRulerWithRealData(),
      // waterСonsumption,
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
