'use client'

/**
 * Establece una cookie en el navegador.
 * @param name Nombre de la cookie a establecer.
 * @param value Valor de la cookie a establecer.
 * @returns null si se ejecuta en el servidor, de lo contrario, establece la cookie.
 */

export const setCookie = (name: string, value: string) => {
  if (typeof window === 'undefined') return null
  document.cookie = `${name}=${value}; path=/`
}

/**
 * Elimina una cookie del navegador.
 * @param name Nombre de la cookie a eliminar.
 * @returns null si se ejecuta en el servidor, de lo contrario, elimina la cookie.
 */

export const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return null
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
}

/**
 * Obtiene el valor de una cookie del navegador.
 * @param name Nombre de la cookie a obtener.

 * @returns El valor de la cookie o undefined si no existe.
 */

export const getCookie = (name: string) => {
  if (typeof window === 'undefined') return undefined
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  if (!cookie) return undefined
  return cookie.split('=')[1]
}
