import { EstructuraFormulario } from '../type'

export const ordenar = (estructura: EstructuraFormulario) => {
  // Crear una lista de pares clave-valor
  const entries = Object.entries(estructura)

  // Asignar un valor de `orden` predeterminado a los elementos que no lo tienen
  let defaultOrder = 1
  for (const [, value] of entries) {
    if (value.orden === undefined) {
      value.orden = defaultOrder++
    }
  }

  // Ordenar la lista basada en el valor de `orden`
  entries.sort(([, a], [, b]) => a.orden! - b.orden!)

  // Ajustar los valores de `orden` para que sean consecutivos
  let currentOrder = 1
  for (const [, value] of entries) {
    if (value.orden && value.orden >= 9999) continue
    value.orden = currentOrder++
  }

  // Reconstruir el objeto ordenado
  const newEstructura: any = {}
  for (const [key, value] of entries) {
    newEstructura[key] = value
  }

  return newEstructura as EstructuraFormulario
}
