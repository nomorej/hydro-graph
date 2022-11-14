import { ComplexGraph, Parameters } from './core/ComplexGraph'
import { AirTemperature, AirTemperatureParameters } from './graphs/AirTemperature'
import { Precipitation, PrecipitationParameters } from './graphs/Precipitation'
import { WaterLevel, WaterLevelParameters } from './graphs/WaterLevel'
import { WaterСonsumption, WaterСonsumptionParameters } from './graphs/WaterСonsumption'
import { Content } from './objects/Content'
import { Phase, PhaseParameters } from './objects/Phase'
import { Scrollbar } from './objects/Scrollbar'
import { Timeline } from './objects/Timeline'

const phasesSettings = {
  ОР: {
    fontColor: '#C08C50',
    backgroundColor: '#FEFFD7',
    name: 'Открытое русло',
    shortName: 'ОР',
  },
  ОПП: {
    fontColor: '#C86546',
    backgroundColor: '#FBE9DD',
    name: 'Полное название',
    shortName: 'ОПП',
  },
  ЛД: {
    fontColor: '#243372',
    backgroundColor: '#D5F2FA',
    name: 'Ледостав',
    shortName: 'ЛД',
  },
  ВПП: {
    fontColor: '#2F7B3A',
    backgroundColor: '#E0FFDF',
    name: 'Полное название',
    shortName: 'ВПП',
  },
}

export interface QwikStartParameters extends Pick<Parameters, 'wrapper' | 'months' | 'font'> {
  data: {
    airTemperature: AirTemperatureParameters['data']
    precipitation: PrecipitationParameters['data']
    waterlevel: WaterLevelParameters['data']
    waterСonsumption: WaterСonsumptionParameters['data']
    phases?: Array<{
      type: keyof typeof phasesSettings
      start: PhaseParameters['start']
      end: PhaseParameters['end']
    }>
  }
}

export function qwikStart(parameters: QwikStartParameters) {
  const cg = new ComplexGraph({
    smoothness: 5,
    ...parameters,
  })

  cg.add(new Content())

  parameters.data.phases?.forEach((phase) => {
    cg.add(
      new Phase({
        ...phasesSettings[phase.type],
        start: phase.start,
        end: phase.end,
      })
    )
  })

  cg.add(new Timeline())
  cg.add(new Scrollbar())

  const airTemperature = cg.add(
    new AirTemperature({
      name: 'airTemperature',
      row: 0,
      scaleTitle: 't воздуха °C',
      data: parameters.data.airTemperature,
    })
  )

  const precipitation = cg.add(
    new Precipitation({
      name: 'precipitation',
      row: 1,
      scaleTitle: 'Осадки, мм',
      data: parameters.data.precipitation,
    })
  )

  const waterlevel = cg.add(
    new WaterLevel({
      name: 'waterlevel',
      row: 3,
      scaleTitle: 'Ур. воды, см',
      scaleStep: 50,
      data: parameters.data.waterlevel,
    })
  )

  const waterСonsumption = cg.add(
    new WaterСonsumption({
      name: 'waterСonsumption',
      row: 3,
      scaleTitle: 'Расход м / c',
      scalePosition: 'right',
      scaleStep: 50,
      data: parameters.data.waterСonsumption,
    })
  )

  return {
    airTemperature,
    precipitation,
    waterlevel,
    waterСonsumption,
    destroy() {
      cg.destroy()
    },
  }
}
