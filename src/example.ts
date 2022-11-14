import { monthsData, qwikStart } from './qwikStart'
import { testData } from './utils/testData'

export function example() {
  /**
   * Быстрый старт с предустановленными настройками, графиками и настройками графиков
   */
  const graph = qwikStart({
    /**
     * Элемент в который вставляется график
     */
    wrapper: document.getElementById('graph')!,
    /**
     * Данные для графиков и фаз
     */
    data: {
      /**
       * Данные для фаз
       */
      phases: [
        {
          type: 'ОР',
          start: {
            month: 1,
            day: 1, // Необязательный параметр
            hour: 1, // Необязательный параметр
          },
          end: {
            month: 2,
            day: 15, // Необязательный параметр
            hour: 10, // Необязательный параметр
          },
        },
        {
          type: 'ОПП',
          start: {
            month: 2,
            day: 15,
            hour: 10,
          },
          end: {
            month: 3,
          },
        },
        {
          type: 'ЛД',
          start: {
            month: 3,
          },
          end: {
            month: 7,
          },
        },
        {
          type: 'ВПП',
          start: {
            month: 7,
          },
          end: {
            month: 7,
            day: 10,
          },
        },
        {
          type: 'ЛД',
          start: {
            month: 7,
            day: 10,
          },
          end: {
            month: 7,
            day: 15,
          },
        },
        {
          type: 'ВПП',
          start: {
            month: 7,
            day: 15,
          },
          end: {
            month: 8,
          },
        },
        {
          type: 'ОР',
          start: {
            month: 8,
          },
          end: {
            month: 13,
            day: 31,
            /**
             * Выбор даты ставит "курсор" в начало этой даты,
             * Чтобы день или час был полностью закрашен,
             * можно указать этот параметр
             */
            fill: true,
          },
        },
      ],
      airTemperature: {
        min: monthsData(testData({ minus: true })),
        middle: monthsData(testData({ minus: true })),
        max: monthsData(testData({ minus: true })),
      },
      precipitation: {
        liquid: monthsData(testData({ minus: false, skip: 0.5 })),
        solid: monthsData(testData({ minus: false, skip: 0.5 })),
      },
      waterTemperature: {
        default: monthsData(testData({ minus: false, skip: 0 })),
      },
      snowLevel: {
        default: monthsData({
          10: [
            {
              day: 1,
              value: 10,
            },
            {
              day: 10,
              value: 5,
            },
            {
              day: 25,
              value: 11,
            },
          ],
          11: [
            {
              day: 5,
              value: 5,
            },
            {
              day: 18,
              value: 13,
            },
            {
              day: 26,
              value: 7,
            },
          ],
        }),
      },
      waterlevel: {
        default: monthsData(testData({ minus: false, skip: 0, max: 300 })),
      },
      waterСonsumption: {
        qh: monthsData(testData({ minus: false, skip: 0.9, max: 250 })),
        measured: monthsData(testData({ minus: false, skip: 0.8, max: 200 })),
        calculated: monthsData(testData({ minus: false, skip: 0.9, max: 200 })),
      },
    },
  })

  /**
   * Прячет весь график
   */
  graph.airTemperature.hide()

  /**
   * Показывает весь график обратно
   */
  graph.airTemperature.show()

  /**
   * Прячет только кривую "max"
   */
  graph.airTemperature.hide('max')

  /**
   * Показывает кривую "max" обратно
   */
  graph.airTemperature.show('max')

  /**
   * hide/show аналогично работает и для остальных графиков
   */

  /**
   * Вызвать "destroy" когда график больше не нужен
   */
  addEventListener('keydown', (e) => {
    if (e.key === 'd') {
      graph.destroy() // <---
    }
  })
}
