export const camposToShow = (
  valor: any,
  campos?: string[],
  joinWith?: string
) => {
  if (campos) {
    return campos
      .map((campo) => {
        if (campo.includes('.')) {
          const [a, b] = campo.split('.')
          return (
            valor[a]?.[b] ??
            valor[a] ??
            valor[b] ??
            'No se ha encontrado el campo'
          )
        }
        return valor[campo]
      })
      .join(joinWith ?? ' ')
  }
  return 'No se ha definido el campo'
}
