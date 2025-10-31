import { addToast } from '@heroui/react'
import { ReactNode } from 'react'

interface fetchProps {
  url?: string
  fullUrl?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  token?: string
  data?: Record<string, any>
  params?: Record<string, any>
  isFile?: boolean
  downloadFile?: string
  iconToastCatch?: ReactNode
}

type WithSuccess<T> = T & { success: boolean }

/**
 * Realiza una petición personalizada al servidor.
 * @param url La URL a la que se realizará la petición.
 * @param method El método HTTP de la petición (GET, POST, PUT o DELETE).
 * @param token El token de autenticación a incluir en la petición, si la ruta lo requiere (opcional).
 * @param data Los datos a enviar en la petición (opcional).
 * @param params Los parámetros de la URL (opcional).
 * @param isFile Indica si la respuesta es un archivo o blob o base64 y lo retorna directamente como blob (opcional).
 * @param downloadFile El nombre del archivo a descargar (opcional y SOLO usar en Client Side).
 * @param iconToastCatch Icono para el toast de error (opcional y SOLO en Client Side).
 * @returns Los datos devueltos por el servidor, formateados con la función formatDates.
 */
export const customFetch = async <T = Record<string, any>>({
  url,
  fullUrl,
  method = 'GET',
  token,
  data,
  params,
  isFile,
  downloadFile,
  iconToastCatch
}: fetchProps): Promise<WithSuccess<T>> => {
  let setIsLoading: ((v: boolean) => void) | null = null
  try {
    // Esto solo funciona en componentes React, así que verifica si existe el contexto
    // evitamos que de error si se utiliza en SSR
    setIsLoading = (window as any).setGlobalLoader
    if (setIsLoading) setIsLoading(true)
  } catch {}
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }

  if (data) {
    if (method === 'PUT') {
      delete data.created_at
      delete data.updated_at
      config.body = JSON.stringify(data)
    } else {
      config.body = JSON.stringify(data)
    }
  }

  config.cache = 'no-store'

  if (params) {
    const searchParams = new URLSearchParams()
    for (const key in params) {
      searchParams.append(key, params[key])
    }
    url += `?${searchParams.toString()}`
  }

  const datos = await fetch(
    fullUrl ?? `${process.env['NEXT_PUBLIC_HOST_API']}/${url}`,
    config
  )
    .then(async (res) => {
      // Si la respuesta es error (status >= 400), intenta leer el cuerpo como JSON para obtener el mensaje
      if (res.status >= 400) {
        let errorData = {}
        try {
          errorData = await res.json()
        } catch (e) {
          errorData = { message: 'Algo salió mal' }
        }
        return {
          ...errorData,
          success: false,
          status: res.status
        }
      }

      if (downloadFile) {
        return res.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.setAttribute('href', url)
          link.setAttribute('download', downloadFile)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      }

      if (isFile) {
        return res.blob()
      }

      //si la respuesta es un archivo o blob o base64 se retorna directamente
      if (!res.headers.get('content-type')?.includes('application/json'))
        return res

      return res
        .json()
        .then((data) => {
          data.success = res.ok
          return data
        })
        .catch(() => ({
          success: false,
          message: 'Algo salió mal'
        }))
    })
    .catch((err) => {
      return { success: false, message: err?.message || 'Algo salió mal' }
    })

  try {
    if (datos.success === false)
      if (typeof window !== 'undefined')
        addToast({
          icon: iconToastCatch || null,
          title: 'Error',
          description: datos.mensaje || datos.message || 'Algo salió mal',
          color: 'danger'
        })
  } catch (e) {
    console.log(e)
  }
  if (setIsLoading) setIsLoading(false)
  if (datos) return datos
  return { success: false } as WithSuccess<T>
}
