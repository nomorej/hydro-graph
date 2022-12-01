import { QwikStartPhases } from '../src'

export async function phasesData(): Promise<QwikStartPhases> {
  return [
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
        month: 2,
        day: 20,
      },
    },
    {
      type: 'ЗАР',
      start: {
        month: 2,
        day: 20,
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
        month: 12,
        day: 31,
        /**
         * Выбор даты ставит "курсор" в начало этой даты,
         * Чтобы день или час был полностью закрашен,
         * можно указать этот параметр
         */
        fill: true,
      },
    },
  ]
}
