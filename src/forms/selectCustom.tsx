'use client'
import { Select, SelectItem, SelectProps } from '@heroui/react'
import { useEffect, useState } from 'react'
import { getCookie } from '../cookies'
import { customFetch } from '../customFetch'
import { camposToShow } from './tools/camposToShow'

interface SelectCustomProps extends SelectProps {
  data?: any[]
  url?: string
  fullUrl?: string
  joinWith?: string
  campos?: string[]
  idCustom?: string
  returnData?: (data: any) => void
  insideFetch?: (data: any) => any
}

export default function SelectCustom({
  data,
  url,
  fullUrl,
  joinWith,
  campos,
  idCustom = 'id',
  returnData,
  insideFetch,
  ...resto
}: Omit<SelectCustomProps, 'children'>) {
  const [datos, setDatos] = useState(data)

  useEffect(() => {
    if (data) setDatos(data)
  }, [])

  useEffect(() => {
    if (url || fullUrl) {
      customFetch({
        url,
        fullUrl,
        method: 'GET',
        token: getCookie('token')
      }).then(async (res) => {
        if (res.success) {
          let tmp = res.data ?? res
          if (insideFetch) tmp = await insideFetch(res.data ?? res)
          setDatos(tmp)
          if (returnData) returnData(tmp)
        }
      })
    }
  }, [url])

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select variant="bordered" label="Select" disabledKeys={'0'} {...resto}>
        {datos?.length ? (
          datos.map((v) => (
            <SelectItem
              key={v[idCustom]}
              textValue={camposToShow(v, campos, joinWith)}
              className="dark:text-white"
            >
              {camposToShow(v, campos, joinWith)}
            </SelectItem>
          ))
        ) : (
          <SelectItem
            key={'0'}
            textValue="No hay datos"
            className="dark:text-white"
          >
            No hay datos
          </SelectItem>
        )}
      </Select>
    </div>
  )
}
