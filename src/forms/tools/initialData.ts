import { EstructuraFormulario } from '../type'
import { ordenar } from './ordenar'
import { repitTimes } from './repeatTimes'

export const initData = (estructura: EstructuraFormulario) => {
  estructura = repitTimes(estructura)
  estructura = ordenar(estructura)
  const data: any = {}
  Object.entries(estructura).forEach(([key, value]) => {
    data[key] = value.defaultValue ?? ''
  })
  return data
}
