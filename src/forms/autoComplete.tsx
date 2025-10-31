import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { getCookie } from '../cookies'
import { customFetch } from '../customFetch'
import { camposToShow } from './tools/camposToShow'

interface AutoCompleteProps extends AutocompleteProps {
  data?: any[]
  url?: string
  fullUrl?: string
  joinWith?: string
  campos?: string[]
  idCustom?: string
  returnData?: (data: any) => void
  insideFetch?: (data: any) => any
  reloadFetch?: boolean
}

function AutoCompleteCustom({
  data,
  url,
  fullUrl,
  joinWith,
  campos,
  idCustom = 'id',
  returnData,
  insideFetch,
  reloadFetch = false,
  ...resto
}: Omit<AutoCompleteProps, 'children'>) {
  const [datos, setDatos] = useState<any>(data)
  useEffect(() => {
    if (url || fullUrl) {
      customFetch({
        url,
        fullUrl,
        method: 'GET',
        token: getCookie('token')
      }).then(async (res) => {
        if (res.success) {
          let resData = res.data ?? res
          if (!Array.isArray(resData)) resData = [resData]
          if (insideFetch) resData = await insideFetch(resData)
          //validamos que no hayan keys duplicadas (TEMPORAL HASTA QUE EL BACK LO SOLUCIONE)
          resData = resData.filter(
            (item: any, index: number, self: any[]) =>
              index === self.findIndex((t) => t[idCustom] === item[idCustom])
          )
          setDatos(resData)
          if (returnData) returnData(resData)
        }
      })
    }
  }, [url, reloadFetch])

  return (
    <>
      <Autocomplete
        defaultItems={datos}
        variant="bordered"
        classNames={{
          popoverContent: 'dark:bg-black'
        }}
        listboxProps={{
          emptyContent: 'No hay datos'
        }}
        {...resto}
      >
        {datos?.map((item: any) => (
          <AutocompleteItem key={item[idCustom]} className="dark:text-white">
            {camposToShow(item, campos, joinWith)}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </>
  )
}

export default AutoCompleteCustom
