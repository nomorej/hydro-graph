import { qwikStart } from './qwikStart'

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
     * Исходя из количества месяцев и количества дней в месяцах строятся все графики
     */
    months: [
      {
        title: 'Октябрь',
        daysNumber: 31,
      },
      {
        title: 'Ноябрь',
        daysNumber: 30,
      },
      {
        title: 'Декабрь',
        daysNumber: 31,
      },
      {
        title: 'Январь',
        daysNumber: 31,
      },
      {
        title: 'Февраль',
        daysNumber: 28,
      },
      {
        title: 'Март',
        daysNumber: 31,
      },
      {
        title: 'Апрель',
        daysNumber: 30,
      },
      {
        title: 'Май',
        daysNumber: 31,
      },
      {
        title: 'Июнь',
        daysNumber: 30,
      },
      {
        title: 'Июль',
        daysNumber: 31,
      },
      {
        title: 'Август',
        daysNumber: 31,
      },
      {
        title: 'Сентябрь',
        daysNumber: 30,
      },
      {
        title: 'Октябрь',
        daysNumber: 31,
      },
    ],
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
      /**
       * Данные для графиков
       */
      airTemperature: {
        /**
         * Кривая минимальной температуры
         * Первый индекс массива соотвествует первому
         * месяцу указанному выше в параметре "months"
         */
        min: [
          /**
           * Месяц 1
           */
          [
            {
              day: 1,
              value: -10,
            },
            {
              day: 25,
              value: 10,
            },
          ],
          /**
           * Месяц 2
           */
          [
            {
              day: 15,
              value: 33,
            },
          ],
        ],
        middle: [
          [
            {
              day: 1,
              value: -5,
            },
            {
              day: 25,
              value: 5,
            },
          ],
        ],
        max: [
          [
            {
              day: 1,
              value: -10,
            },
            {
              day: 25,
              value: 20,
            },
          ],
        ],
      },
      precipitation: {
        liquid: [
          [
            {
              day: 1,
              value: 15,
            },
          ],
        ],
        solid: [
          [
            {
              day: 1,
              value: 35,
            },
          ],
        ],
      },
      waterTemperature: {
        default: [
          [
            {
              day: 1,
              value: 10,
            },
            {
              day: 30,
              value: 55,
            },
          ],
        ],
      },
      snowLevel: {
        default: [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [
            {
              day: 1,
              value: 10,
            },
            {
              day: 30,
              value: -10,
            },
          ],
          [
            {
              day: 31,
              value: 10,
            },
          ],
        ],
      },
      waterlevel: {
        default: [
          [
            {
              day: 1,
              value: 10,
            },
            {
              day: 30,
              value: 55,
            },
          ],
        ],
      },
      waterСonsumption: {
        qh: [
          [
            {
              day: 1,
              value: 10,
            },
            {
              day: 10,
              value: 50,
            },
          ],
        ],
        measured: [
          [
            {
              day: 13,
              value: 10,
            },
            {
              day: 30,
              /**
               * Можно указать данные по часам
               */
              value: [
                {
                  hour: 15,
                  value: 333,
                },
              ],
            },
          ],
        ],
        calculated: [
          [
            {
              day: 12,
              value: 10,
            },
            {
              day: 18,
              value: 13,
            },
          ],
        ],
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
