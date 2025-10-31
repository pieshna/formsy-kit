import { EstructuraFormulario } from '../type'

export const agruparDatos = (estructura: EstructuraFormulario, datos: any) => {
  const agrupado: any = {}
  const arrs: Record<string, any[]> = {} // array por agrupador
  const indices: Record<string, number> = {} // indice por agrupador
  const hasNotRepeated: string[] = [] // agrupadores que no son arrays
  Object.keys(estructura).forEach((key) => {
    const newKey = key.replace(/\d+$/, '')
    const agrupador = estructura[key].agrupador
    if (agrupador) {
      if (
        typeof estructura[key]?.repeatAgrupadorTimes === 'undefined' &&
        !hasNotRepeated.includes(agrupador)
      ) {
        hasNotRepeated.push(agrupador)
      }

      if (!arrs[agrupador]) {
        arrs[agrupador] = []
        indices[agrupador] = 0
      }
      // Detectar el indice real por sufijo numerico
      const match = key.match(/(\d+)$/)
      const idx = match ? parseInt(match[1], 10) : indices[agrupador]
      arrs[agrupador][idx] = { ...arrs[agrupador][idx], [newKey]: datos[key] }
      agrupado[agrupador] = arrs[agrupador]
      indices[agrupador] = idx + 1
    } else {
      agrupado[key] = datos[key]
    }
  })

  hasNotRepeated.forEach((agrupador) => {
    if (agrupado[agrupador]) {
      const obj: any = {}
      Object.values(agrupado[agrupador]).forEach((element: any) => {
        Object.keys(element).forEach((key) => {
          obj[key] = element[key]
        })
      })
      agrupado[agrupador] = obj
    }
  })

  return agrupado
}

export const desagruparDatos = (datos: any) => {
  const desagrupado = Object.keys(datos)

  desagrupado.forEach((key) => {
    if (Array.isArray(datos[key])) {
      datos[key].forEach((element: any) => {
        if (typeof element === 'object') {
          Object.keys(element).forEach((key2) => {
            datos[key2] = element[key2]
          })
          delete datos[key]
        }
      })
    }
  })

  return datos
}
