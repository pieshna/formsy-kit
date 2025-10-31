import { EstructuraFormulario } from '../type'

export const repitTimes = (estructura: EstructuraFormulario) => {
  const entries = Object.entries(estructura)
  const agrupadores: Record<string, { keys: string[]; repeat: number }> = {}

  for (const [key, value] of entries) {
    if (value.repeatAgrupadorTimes) {
      const agrupador = value.agrupador ?? key
      if (!agrupadores[agrupador]) {
        agrupadores[agrupador] = { keys: [], repeat: value.repeatAgrupadorTimes }
      }
      agrupadores[agrupador].keys.push(key)
    }
  }

  Object.entries(agrupadores).forEach(([agrupador, { keys, repeat }]) => {
    for (let i = 0; i < repeat; i++) {
      keys.forEach((key) => {
        const value = estructura[key]
        estructura[`${key}${i}`] = {
          ...value,
          label: `${value.label} ${i + 1}`,
          id: value.id,
          agrupador,
          repeatAgrupadorTimes: 0,
        }
        if (value.addButtonToRepeat && i === repeat - 1) {
          estructura[`${key}${i}`].addButtonToRepeat = true
        } else {
          if (i !== repeat - 1 && estructura[`${key}${i}`].addButtonToRepeat) {
            estructura[`${key}${i}`].buttonTrash = true
            estructura[`${key}${i}`].dividerBefore = true
          }
          delete estructura[`${key}${i}`].addButtonToRepeat
        }
      })
    }
    keys.forEach((key) => delete estructura[key])
  })

  for (const [key, value] of Object.entries(estructura)) {
    if (value.repeatTimes) {
      for (let i = 0; i < value.repeatTimes; i++) {
        estructura[`${key}${i}`] = {
          ...value,
          label: `${value.label} ${i + 1}`,
          id: value.id,
          agrupador: value.agrupador ?? key,
          repeatTimes: 0,
        }
      }
      delete estructura[key]
    }
  }

  return estructura
}
