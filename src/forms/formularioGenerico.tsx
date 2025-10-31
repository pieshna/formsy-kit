'use client'
import { Button, Divider, Form } from '@heroui/react'
import { parseZonedDateTime } from '@internationalized/date'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Fragment, Key, useEffect, useMemo, useState } from 'react'
import AutoCompleteCustom from './autoComplete'
import CheckboxCustom from './checkBoxCustom'
import CheckBoxGroupCustom from './checkBoxGroupCustom'
import DropZoneCustom from './dropZone'
import CustomInputDate from './inputDate'
import InputDateTime from './inputDateTime'
import InputGenerico from './inputGenerico'
import InputPhone from './inputPhone'
import InputTimeCustom from './inputTime'
import SelectCustom from './selectCustom'
import SignatureCustom from './signatureCustom'
import TextAreaCustom from './textAreaCustom'
import TextAreaSimpleCustom from './textAreaSimpleCustom'
import { agruparDatos, desagruparDatos } from './tools/agrupar'
import { initData } from './tools/initialData'
import { ordenar } from './tools/ordenar'
import { EstructuraFormulario } from './type'

dayjs.extend(utc)
dayjs.extend(timezone)

interface FormularioGenericoProps {
  estructura: EstructuraFormulario
  columnas?: number
  defaultValues?: any
  children?: React.ReactNode
  typeButtonSubmit?: 'submit' | 'button'
  onSubmit?: (data: any) => void
  onClick?: () => void
  onCancel?: () => void
  onChanges?: (name: string, value: string) => void
  alignButton?: 'center' | 'start' | 'end' | 'between' | 'around'
  hideCancel?: boolean
  hideSubmit?: boolean
  textButtonSave?: string
  textButtonCancel?: string
  colorSave?: colorButton
  colorCancel?: colorButton
  addClassName?: string
  setGlobalState?: (data: any) => void
  getGlobalState?: any
  reloadmeGlobalState?: boolean
  disableAll?: boolean
  childrenInButtons?: React.ReactNode
  disableSubmit?: boolean
  clearValuesOnSubmit?: boolean
}
type colorButton = 'primary' | 'secondary' | 'success' | 'warning' | 'default' | 'danger'

function FormularioGenerico({
  estructura,
  columnas = 1,
  defaultValues,
  children,
  typeButtonSubmit = 'submit',
  onSubmit,
  onChanges,
  onClick,
  alignButton,
  hideCancel = false,
  onCancel,
  textButtonSave = 'Guardar',
  colorSave = 'primary',
  colorCancel = 'danger',
  addClassName,
  textButtonCancel = 'Cancelar',
  setGlobalState,
  getGlobalState,
  reloadmeGlobalState,
  hideSubmit,
  disableAll,
  childrenInButtons,
  disableSubmit,
  clearValuesOnSubmit = false,
}: FormularioGenericoProps) {
  const [formValues, setFormValues] = useState<any>(initData(estructura))
  const [formErrors, setFormErrors] = useState<any>({})
  const [windowWidth, setWindowWidth] = useState<number | undefined>()
  const [recalculateStructure, setRecalculateStructure] = useState<boolean>(false)
  //todo: crear un custom hook para manejar la logica del formulario

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getGridCols = () => {
    return windowWidth! < 1024 ? 1 : columnas
  }

  useEffect(() => {
    if (Object.keys(getGlobalState ?? defaultValues ?? {}).length === 0) {
      const datosIniciales = initData(estructura)
      //unificar datos iniciales con formValues, si en formValues es diferente de '' se toma el valor de formValues y el resto de initData
      for (const key in datosIniciales) {
        if (formValues[key] !== '') {
          datosIniciales[key] = formValues[key]
        }
      }
      setFormValues(datosIniciales)
    } else {
      //obtener valores por defecto de la estructura
      const valoresDef = Object.keys(estructura).reduce((acc: any, key) => {
        if (estructura[key].defaultValue) {
          acc[key] = estructura[key].defaultValue
        }
        return acc
      }, {})

      const valoresDefecto = {
        ...getGlobalState,
        ...defaultValues,
        ...valoresDef,
      }
      setFormValues(desagruparDatos(valoresDefecto))
    }
  }, [estructura, defaultValues, reloadmeGlobalState, recalculateStructure])

  useEffect(() => {
    if (Object.keys(getGlobalState ?? defaultValues ?? {}).length > 0) {
      for (const key in estructura) {
        if (estructura[key].validate && getGlobalState) {
          setFormErrors({
            ...formErrors,
            [key]: estructura[key].validate(getGlobalState[key]) ?? undefined,
          })
        }
      }
    }
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value: valor } = event.target
    let value = valor
    let tmp: any = value?.split(',').filter((item: any) => item !== '')
    if (tmp.length === 1) {
      tmp = tmp[0]
    } else if (value.length > 1) {
      tmp = tmp.join(',')
    }

    value = estructura[name].type === 'select' ? tmp : valor

    if (estructura[name].maxLength && value.length > estructura[name].maxLength) {
      return
    }

    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(value) ?? undefined,
      })
    }
    if (formErrors[name]) delete formErrors[name]

    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }))

    if (onChanges) {
      onChanges(name, value)
    }
    if (setGlobalState) {
      setGlobalState({ ...formValues, [name]: value })
    }
  }

  const handleChangeAutoComplete = (event: Key | null, name: string) => {
    let value: number | string = event?.toString() ?? ''
    if (!isNaN(Number(value)) && value !== '') value = Number(value)
    setFormValues({ ...formValues, [name]: value })
    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(value.toString()) ?? undefined,
      })
    }
    if (formErrors[name]) delete formErrors[name]

    if (setGlobalState) setGlobalState({ ...formValues, [name]: value })
    if (onChanges) onChanges(name, value.toString())
  }

  const handleChangeDate = (valor: Date | null, name: string) => {
    const value = valor?.toString() ?? ''
    setFormValues({ ...formValues, [name]: value })
    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(value) ?? undefined,
      })
    }
    if (formErrors[name]) delete formErrors[name]
    if (setGlobalState) setGlobalState({ ...formValues, [name]: value })
    if (onChanges) onChanges(name, value)
  }

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    setFormValues({ ...formValues, [name]: checked })
    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(checked.toString()) ?? undefined,
      })
    }
    if (formErrors[name]) {
      delete formErrors[name]
    }
    if (setGlobalState) {
      setGlobalState({ ...formValues, [name]: checked.toString() })
    }
    if (onChanges) {
      onChanges(name, checked.toString())
    }
  }

  const handleDropZone = (key: string, b64: string | string[] | null) => {
    if (b64) {
      setFormValues({ ...formValues, [key]: b64 })
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const errors: Record<string, string> = {}
    Object.entries(estructura).forEach(([key, value]) => {
      if (value.required && (formValues[key] === '' || formValues[key] === null)) {
        errors[key] = 'Este campo es requerido'
      }
      if (value?.validate) {
        const error = value.validate(formValues[key])
        if (error) {
          errors[key] = error
        } else {
          delete errors[key]
        }
      }
    })
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      let dataToSend = { ...formValues }

      for (const key in dataToSend) {
        if (dataToSend[key] === '' || dataToSend[key] === null) {
          if (!estructura[key]?.isNulleable) {
            delete dataToSend[key]
          } else {
            dataToSend[key] = null
          }
        }
      }

      //pasamos todo array a string separado por comas en caso haya mas de un valor si no solo el string
      for (const key in dataToSend) {
        if (Array.isArray(dataToSend[key])) {
          dataToSend[key] = dataToSend[key].join(',')
        }
      }

      //parseamos cualquier dato que tenga "true" o "false" a boolean
      for (const key in dataToSend) {
        if (dataToSend[key] === 'true') {
          dataToSend[key] = true
        } else if (dataToSend[key] === 'false') {
          dataToSend[key] = false
        }
      }

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

      Object.keys(estructura).forEach((key) => {
        if (
          estructura[key].type === 'number' ||
          estructura[key].type === 'autoComplete'
        ) {
          // Solo convierte si el valor es un string que representa exactamente un número
          if (
            !uuidRegex.test(dataToSend[key]) &&
            typeof dataToSend[key] === 'string' &&
            /^-?\d+(\.\d+)?$/.test(dataToSend[key])
          ) {
            dataToSend[key] = parseFloat(dataToSend[key])
          }
        }
      })
      dataToSend = agruparDatos(estructura, dataToSend)
      if (setGlobalState) setGlobalState(formValues)
      if (onSubmit) onSubmit(dataToSend)
      if (clearValuesOnSubmit) setFormValues(initData(estructura))
    }
  }

  const chunk = <T,>(arr: T[], size: number) => {
    const result: T[][] = []
    let currentChunk: T[] = []

    arr.forEach((item) => {
      const [, value] = item as [string, any]
      if (value.onlyLine) {
        if (currentChunk.length > 0) {
          result.push(currentChunk)
          currentChunk = []
        }
        result.push([item])
      } else {
        currentChunk.push(item)
        if (currentChunk.length === size) {
          result.push(currentChunk)
          currentChunk = []
        }
      }
    })

    if (currentChunk.length > 0) {
      result.push(currentChunk)
    }
    return result
  }

  const formChunk = useMemo(() => {
    return chunk(Object.entries(ordenar(estructura)), getGridCols())
  }, [estructura, columnas, windowWidth, recalculateStructure])

  const handleChangeGroup = (value: any[], name: string) => {
    // value ya es un array de valores seleccionados
    let valor = value
    //si value es un string lo pasamos a array
    if (typeof valor === 'string') {
      valor = (valor as string).split(',')
    }

    if (estructura[name].selectOne && valor.length > 1) {
      valor = [valor[valor.length - 1]]
    }
    setFormValues({ ...formValues, [name]: valor })
    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(valor) ?? undefined,
      })
    }
    if (formErrors[name]) delete formErrors[name]
    if (setGlobalState) setGlobalState({ ...formValues, [name]: valor })
    if (onChanges) onChanges(name, valor.join(','))
  }

  const handleChangeDateTime = (valor: any, name: string) => {
    //parse Datevalue to string
    let fecha = valor.toString()
    if (fecha.split('T')[1].includes('-')) {
      fecha = fecha.split('T')[0] + 'T' + fecha.split('T')[1].split('-')[0]
    }
    const value = dayjs(fecha)
      .tz('America/Mexico_City')
      .format('YYYY-MM-DDTHH:mm')
      .concat('[America/Mexico_City]')
    setFormValues({ ...formValues, [name]: value })
    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(value) ?? undefined,
      })
    }
    if (formErrors[name]) delete formErrors[name]
    if (setGlobalState) setGlobalState({ ...formValues, [name]: value })
    if (onChanges) onChanges(name, value)
  }

  const handlePhoneChange = (value: string, name: string) => {
    if (estructura[name]?.maxLength && value.length > estructura[name].maxLength) {
      return
    }

    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(value) ?? undefined,
      })
    }
    if (formErrors[name]) delete formErrors[name]

    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }))

    if (setGlobalState) setGlobalState({ ...formValues, [name]: value })

    if (onChanges) onChanges(name, value)
  }

  const handleChangeSignature = (name: string, img: string | null) => {
    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(img as any) ?? undefined,
      })
    }
    if (formErrors[name]) delete formErrors[name]

    if (!img && estructura[name].required) {
      setFormErrors({ ...formErrors, [name]: 'Este campo es requerido' })
    }

    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: img,
    }))
  }

  const handleChangeTime = (value: string, name: string) => {
    if (estructura[name]?.validate) {
      setFormErrors({
        ...formErrors,
        [name]: estructura[name].validate(value) ?? undefined,
      })
    }
    if (formErrors[name]) delete formErrors[name]

    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }))

    if (setGlobalState) setGlobalState({ ...formValues, [name]: value })
    if (onChanges) onChanges(name, value)
  }

  const getKeysToRepeat = (estructura: any, agrupador: string) =>
    Object.keys(estructura).filter((key) => estructura[key].agrupador === agrupador)

  const getMaxRepeatTimes = (keys: string[]) =>
    Math.max(
      1,
      ...keys.map((key) => {
        const match = key.match(/(\d+)$/)
        return match ? parseInt(match[1], 10) + 1 : 1
      }),
    )

  const getKeyWithButtonAdd = (estructura: any, agrupador: string) =>
    Object.keys(estructura).find(
      (key) =>
        estructura[key].agrupador === agrupador && estructura[key].addButtonToRepeat,
    )

  const normalizeKeys = (
    estructura: any,
    keysToRepeat: string[],
    maxRepeatTimes: number,
    keyWithButtonAdd: string | undefined,
  ) => {
    return Array.from(
      new Set(
        keysToRepeat.map((key) => {
          const match = key.match(/^(.*?)(\d+)$/)
          if (match && match[2] === String(maxRepeatTimes - 1)) {
            const baseKey = match[1]
            estructura[baseKey] = {
              ...estructura[key],
              repeatAgrupadorTimes: maxRepeatTimes,
              buttonTrash: false,
              addButtonToRepeat: keyWithButtonAdd?.match(/^(.*?)(\d+)$/)?.[1] === baseKey,
            }
            delete estructura[key]
            return baseKey
          }
          return key.replace(/\d+$/, '')
        }),
      ),
    )
  }

  const updateRepeatTimes = (estructura: any, uniqueKeys: string[]) => {
    uniqueKeys.forEach((key) => {
      estructura[key].repeatAgrupadorTimes =
        (estructura[key]?.repeatAgrupadorTimes || 1) + 1
    })
  }

  const resetLabelsAndOrden = (estructura: any, agrupador: string) => {
    Object.keys(estructura).forEach((key) => {
      if (estructura[key].agrupador === agrupador) {
        estructura[key].label = estructura[key].label.replace(/\d+$/, '')
      }
      if (estructura[key].orden < 9999) estructura[key].orden = undefined
    })
  }

  function syncFormValuesOnAdd(estructura: any, formValues: any, agrupador: string) {
    const keysToRepeat = Object.keys(estructura).filter(
      (key) => estructura[key].agrupador === agrupador,
    )
    const baseKeys = Array.from(
      new Set(keysToRepeat.map((key) => key.replace(/\d+$/, ''))),
    )
    const newFormValues = { ...formValues }

    baseKeys.forEach((baseKey) => {
      // Si existe la key base sin número, renómbrala a baseKey0
      if (newFormValues.hasOwnProperty(baseKey)) {
        newFormValues[`${baseKey}0`] = newFormValues[baseKey]
        delete newFormValues[baseKey]
      }
      // Si se agregó un nuevo grupo, inicializa la nueva key vacía
      const maxIndex = Math.max(
        0,
        ...Object.keys(newFormValues)
          .filter((k) => k.startsWith(baseKey))
          .map((k) => parseInt(k.match(/(\d+)$/)?.[1] || '0', 10)),
      )
      newFormValues[`${baseKey}${maxIndex + 1}`] = ''
    })

    return newFormValues
  }

  function syncFormValuesOnRemove(estructura: any, formValues: any, agrupador: string) {
    const keysAgrupador = Object.keys(estructura)
      .filter((key) => estructura[key].agrupador === agrupador)
      .sort((a, b) => {
        const aNum = parseInt(a.match(/(\d+)$/)?.[1] || '0', 10)
        const bNum = parseInt(b.match(/(\d+)$/)?.[1] || '0', 10)
        return aNum - bNum
      })

    const baseKeys = Array.from(
      new Set(keysAgrupador.map((key) => key.replace(/\d+$/, ''))),
    )
    const newFormValues: any = { ...formValues }

    baseKeys.forEach((baseKey) => {
      // Reordena los sufijos de las keys en formValues
      const keys = keysAgrupador.filter((key) => key.startsWith(baseKey))
      keys.forEach((key, idx) => {
        const newKey = `${baseKey}${idx}`
        if (newKey !== key) {
          newFormValues[newKey] = newFormValues[key]
          delete newFormValues[key]
        }
      })
    })

    return newFormValues
  }

  const handleAddToRepeat = (agrupador: string) => {
    const keysToRepeat = getKeysToRepeat(estructura, agrupador)
    const maxRepeatTimes = getMaxRepeatTimes(keysToRepeat)
    const keyWithButtonAdd = getKeyWithButtonAdd(estructura, agrupador)
    const uniqueKeys = normalizeKeys(
      estructura,
      keysToRepeat,
      maxRepeatTimes,
      keyWithButtonAdd,
    )
    updateRepeatTimes(estructura, uniqueKeys)
    resetLabelsAndOrden(estructura, agrupador)
    setFormValues((prev: any) => syncFormValuesOnAdd(estructura, prev, agrupador))
    setRecalculateStructure((prev) => !prev)
  }

  const handleRemoveFromRepeat = (agrupador: string, indexToRemove: number) => {
    const keysToRemove = Object.keys(estructura).filter((key) => {
      const match = key.match(/^(.*?)(\d+)$/)
      return (
        estructura[key].agrupador === agrupador &&
        match &&
        parseInt(match[2], 10) === indexToRemove
      )
    })

    keysToRemove.forEach((key) => {
      delete estructura[key]
      if (formValues.hasOwnProperty(key)) {
        delete formValues[key]
      }
    })

    const keysAgrupador = Object.keys(estructura)
      .filter((key) => estructura[key].agrupador === agrupador)
      .sort((a, b) => {
        const aNum = parseInt(a.match(/(\d+)$/)?.[1] || '0', 10)
        const bNum = parseInt(b.match(/(\d+)$/)?.[1] || '0', 10)
        return aNum - bNum
      })

    const baseKeys = Array.from(
      new Set(keysAgrupador.map((key) => key.replace(/\d+$/, ''))),
    )

    baseKeys.forEach((baseKey) => {
      const keys = keysAgrupador.filter((key) => key.startsWith(baseKey))
      keys.forEach((key, idx) => {
        const newKey = `${baseKey}${idx}`
        if (newKey !== key) {
          // Actualiza estructura
          estructura[newKey] = {
            ...estructura[key],
            label: estructura[key].label.replace(/\d+$/, '') + (idx > 0 ? idx + 1 : ''),
          }
          delete estructura[key]
          // Actualiza formValues
          if (formValues.hasOwnProperty(key)) {
            formValues[newKey] = formValues[key]
            delete formValues[key]
          }
        }
      })
    })
    setFormValues({ ...formValues })
    setFormValues((prev: any) => syncFormValuesOnRemove(estructura, prev, agrupador))
    setRecalculateStructure((prev) => !prev)
  }

  return (
    <>
      <Form
        validationBehavior="aria"
        onSubmit={handleSubmit}
        className={`flex flex-col gap-2 p-2 w-full ${addClassName ?? ''} `}
      >
        <div className="flex flex-col w-full gap-3">
          {formChunk.map((fchunk, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                width: '100%',
                gap: '1rem',
              }}
            >
              {fchunk.map(([key, value], j) => (
                <Fragment key={'fragment' + j}>
                  {value.dividerAfter && (
                    <div
                      style={{
                        width: '100%',
                      }}
                    >
                      {value.textDivider && (
                        <h3
                          className={`text-lg font-semibold text-foreground ${
                            value.textDividerCase ?? 'uppercase'
                          }`}
                        >
                          {value.textDivider}
                        </h3>
                      )}
                      <Divider />
                    </div>
                  )}
                  <div
                    key={j}
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {value.type === 'select' &&
                      value.show != false &&
                      (value.url || formValues) && (
                        <SelectCustom
                          name={key}
                          url={!value.omitFetch ? value.url : undefined}
                          fullUrl={value.fullUrl}
                          joinWith={value.joinWith}
                          campos={value.campos}
                          idCustom={value.id}
                          label={value.label}
                          value={formValues[key]}
                          selectedKeys={formValues[key] + ''}
                          onChange={handleChange}
                          isDisabled={disableAll ?? value.disabled}
                          className={value.className}
                          isInvalid={!!formErrors[key]}
                          errorMessage={formErrors[key]}
                          isRequired={value.required}
                          data={value.data}
                          returnData={value.returnData}
                          selectionMode={value.selectionMode ?? 'single'}
                          insideFetch={value.insidefetch}
                        />
                      )}
                    {value.type === 'autoComplete' &&
                      (value.url || formValues) &&
                      value.show != false && (
                        <AutoCompleteCustom
                          url={!value.omitFetch ? value.url : undefined}
                          fullUrl={value.fullUrl}
                          joinWith={value.joinWith}
                          campos={value.campos}
                          idCustom={value.id}
                          label={value.label}
                          value={formValues[key]}
                          selectedKey={formValues[key] + ''}
                          onSelectionChange={(e) => handleChangeAutoComplete(e, key)}
                          isDisabled={disableAll ?? value.disabled}
                          className={`dark:text-white ${value.className}`}
                          isInvalid={!!formErrors[key]}
                          errorMessage={formErrors[key]}
                          isClearable={value.clearable}
                          isRequired={value.required}
                          data={value.data}
                          returnData={value.returnData}
                          insideFetch={value.insidefetch}
                        />
                      )}
                    {value.type === 'date' && (
                      <CustomInputDate
                        name={key}
                        label={value.label}
                        value={formValues[key]}
                        onChange={(e) => handleChangeDate(e, key)}
                        disabled={disableAll ?? value.disabled}
                        required={value.required}
                        className={value.className}
                      />
                    )}
                    {value.type === 'checkbox' && value.show != false && (
                      <CheckboxCustom
                        type={value.type}
                        name={key}
                        label={value.label}
                        value={formValues[key]}
                        isSelected={formValues[key]}
                        onChange={handleChangeCheckbox}
                        isDisabled={disableAll ?? value.disabled}
                        isRequired={value.required}
                        className={value.className}
                      />
                    )}
                    {value.type === 'checkboxGroup' && value.show != false && (
                      <CheckBoxGroupCustom
                        datos={value.data}
                        name={key}
                        label={value.label}
                        value={formValues[key]}
                        onChange={(value) => handleChangeGroup(value, key)}
                        isDisabled={disableAll ?? value.disabled}
                        isRequired={value.required}
                        className={value.className}
                        inSameLine={value.inSameLine}
                      />
                    )}
                    {value.type === 'datetime' && (
                      <InputDateTime
                        name={key}
                        label={value.label}
                        value={
                          formValues[key] ? parseZonedDateTime(formValues[key]) : null
                        }
                        onChange={(e) => handleChangeDateTime(e, key)}
                        isDisabled={disableAll ?? value.disabled}
                        startContent={value.icon}
                        isRequired={value.required}
                        isInvalid={!!formErrors[key]}
                        errorMessage={formErrors[key]}
                        className={value.className}
                      />
                    )}
                    {value.type === 'textareaWithEditor' && (
                      <TextAreaCustom
                        name={key}
                        value={formValues[key]}
                        onChange={handleChange}
                        className={`p-2 border rounded-lg ${value.className}`}
                        placeholder={value.placeholder}
                        label={value.label}
                        maxLength={value.maxLength}
                        isDisabled={disableAll ?? value.disabled}
                        isRequired={value.required}
                        isInvalid={!!formErrors[key]}
                        max={value.maxLength}
                      />
                    )}
                    {value.type === 'textarea' && (
                      <TextAreaSimpleCustom
                        name={key}
                        value={formValues[key]}
                        onChange={handleChange}
                        className={`p-2 border-2 border-gray-300 rounded-lg ${value.className}`}
                        placeholder={value.placeholder}
                        label={value.label}
                        maxLength={value.maxLength}
                        isDisabled={disableAll ?? value.disabled}
                        isRequired={value.required}
                        isInvalid={!!formErrors[key]}
                        max={value.maxLength}
                      />
                    )}
                    {value.type === 'phone' && (
                      <InputPhone
                        name={key}
                        label={value.label}
                        value={formValues[key]}
                        onChange={(value) => handlePhoneChange(value, key)}
                        isDisabled={disableAll ?? value.disabled}
                        isRequired={value.required}
                        isInvalid={!!formErrors[key]}
                        errorMessage={formErrors[key]}
                        className={value.className}
                        placeholder={value.placeholder}
                      />
                    )}
                    {value.type === 'dropzone' && (
                      <DropZoneCustom
                        label={value.showLabelDropZone ? value.label : undefined}
                        onDrop={value.onDrop}
                        maxSize={value.maxSizeDropZone}
                        accept={value.acceptedFiles!}
                        limit={value.limitItemsDropped}
                        urlImage={value.urlImageDropZone ? formValues[key] : undefined}
                        returnB64={
                          value.automaticParseJsonDropZone
                            ? (b64: string | string[] | null) => handleDropZone(key, b64)
                            : value.returnB64DropZone
                        }
                        className={value.className}
                        classNames={value.classNamesDropZone}
                        required={value.required}
                        urlActual={value.urlActual}
                      />
                    )}
                    {value.type === 'signature' && value.show != false && (
                      <SignatureCustom
                        label={value.label}
                        className={value.className}
                        onChange={(img) => handleChangeSignature(key, img)}
                        isRequired={value.required}
                      />
                    )}
                    {value.type === 'time' && value.show != false && (
                      <InputTimeCustom
                        label={value.label}
                        value={formValues[key]}
                        onChange={(value) => handleChangeTime(value, key)}
                        disabled={disableAll ?? value.disabled}
                        required={value.required}
                        placeholder={value.placeholder}
                        showSeconds={value.showSeconds}
                        format={value.timeFormat}
                        variant={value.timeVariant}
                        helperText={value.helperText}
                        error={formErrors[key]}
                        className={value.className}
                      />
                    )}
                    {![
                      'select',
                      'autoComplete',
                      'date',
                      'checkbox',
                      'checkboxGroup',
                      'datetime',
                      'textarea',
                      'textareaWithEditor',
                      'phone',
                      'dropzone',
                      'signature',
                      'time',
                    ].includes(value.type) &&
                      value.show != false && (
                        <InputGenerico
                          type={value.type}
                          name={key}
                          label={value.label}
                          value={formValues[key]}
                          onChange={handleChange}
                          isDisabled={disableAll ?? value.disabled}
                          startContent={value.icon}
                          isRequired={value.required}
                          isInvalid={!!formErrors[key]}
                          errorMessage={formErrors[key]}
                          className={value.className}
                          isClearable={value.clearable}
                          placeholder={value.placeholder}
                          maxLength={value.maxLength}
                        />
                      )}
                  </div>
                  {value.buttonTrash && (
                    <Button
                      isIconOnly
                      color={value.colorButtonTrash ?? 'danger'}
                      onPress={() => {
                        // Extrae el sufijo numérico real de la key
                        const match = key.match(/(\d+)$/)
                        const groupIndex = match ? parseInt(match[1], 10) : 0
                        handleRemoveFromRepeat(value.agrupador ?? '', groupIndex)
                      }}
                    >
                      <IconTrash />
                    </Button>
                  )}
                  {value.addButtonToRepeat && (
                    <Button
                      isIconOnly
                      color={value.colorButtonAdd}
                      onPress={() => handleAddToRepeat(value.agrupador ?? '')}
                    >
                      <IconPlus />
                    </Button>
                  )}
                  {value.dividerBefore && (
                    <div
                      style={{
                        width: '100%',
                      }}
                    >
                      {value.textDivider && (
                        <h3
                          className={`text-lg font-semibold text-foreground ${
                            value.textDividerCase ?? 'uppercase'
                          }`}
                        >
                          {value.textDivider}
                        </h3>
                      )}
                      <Divider />
                    </div>
                  )}
                  {/*value.canRepeat && (
                    <div
                      className="flex"
                      style={{
                        gridColumn: `span ${columnas}`
                      }}
                    >
                      <Button
                        color="primary"
                        type="button"
                        onClick={() => handleAddGroup(value.agrupador ?? '')}
                      >
                        <IconPlus />
                      </Button>
                    </div>
                  )*/}
                </Fragment>
              ))}
            </div>
          ))}

          {children}
        </div>
        <div className={`flex w-full justify-${alignButton ?? 'center'} gap-2`}>
          {!hideCancel && (
            <Button color={colorCancel} type="button" onPress={onCancel}>
              {textButtonCancel}
            </Button>
          )}
          {childrenInButtons && childrenInButtons}
          {!hideSubmit && (
            <>
              {typeButtonSubmit === 'submit' ? (
                <Button
                  color={disableSubmit ? 'default' : colorSave}
                  type="submit"
                  disabled={disableSubmit}
                >
                  {textButtonSave}
                </Button>
              ) : (
                <Button
                  color={disableSubmit ? 'default' : colorSave}
                  type="button"
                  onPress={onClick}
                  disabled={disableSubmit}
                >
                  {textButtonSave}
                </Button>
              )}
            </>
          )}
        </div>
      </Form>
    </>
  )
}

export default FormularioGenerico
