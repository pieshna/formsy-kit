'use client'
import { Calendar, CalendarProps, DateValue } from '@heroui/react'
import { parseDate } from '@internationalized/date'
import { I18nProvider } from '@react-aria/i18n'
import { useEffect, useState } from 'react'

interface CalendarPickerProps extends CalendarProps {
  defaultDate?: string
  returnValue?: (str: string) => void
  daysNotAvailable?: {
    currentMonth?: number[]
    nextMonth?: number[]
  }
  maxMonthAvailable?: number
}

const today = new Date().toISOString().split('T')[0]

// Función para obtener el último día de los meses disponibles
const getLastDayOfAvailableMonths = (monthsAvailable: number = 2) => {
  const currentDate = new Date()
  const lastAvailableMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + monthsAvailable,
    0,
  )
  return lastAvailableMonth.toISOString().split('T')[0]
}

function CalendarPicker({
  defaultDate,
  returnValue,
  daysNotAvailable,
  maxMonthAvailable,
  ...resto
}: CalendarPickerProps) {
  const [value, setValue] = useState<DateValue | null>(
    defaultDate ? parseDate(defaultDate) : parseDate(today),
  )

  useEffect(() => {
    if (returnValue) returnValue(defaultDate || today)
  }, [])

  const handleChange = (date: DateValue | null) => {
    setValue(date)
    if (returnValue) {
      returnValue(date?.toString() || '')
    }
  }

  // Calcular maxValue dinámicamente basado en maxMonthAvailable
  const calculateMaxValue = () => {
    if (!maxMonthAvailable) return undefined
    const maxDateString = getLastDayOfAvailableMonths(maxMonthAvailable)
    return parseDate(maxDateString)
  }

  // Función para determinar si una fecha no está disponible
  const isDateUnavailable = (date: DateValue) => {
    if (!daysNotAvailable) return false

    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const checkDate = new Date(date.year, date.month - 1, date.day)
    const checkMonth = checkDate.getMonth()
    const checkYear = checkDate.getFullYear()
    const checkDay = checkDate.getDate()

    const monthDifference = (checkYear - currentYear) * 12 + (checkMonth - currentMonth)

    if (monthDifference === 0) {
      return daysNotAvailable.currentMonth?.includes(checkDay) || false
    } else if (monthDifference === 1) {
      return daysNotAvailable.nextMonth?.includes(checkDay) || false
    }

    return false
  }

  return (
    <>
      <I18nProvider locale="es-MX">
        <Calendar
          aria-label="Date"
          minValue={parseDate(today)}
          maxValue={calculateMaxValue()}
          value={value}
          onChange={handleChange}
          isDateUnavailable={daysNotAvailable ? isDateUnavailable : undefined}
          {...resto}
        />
      </I18nProvider>
    </>
  )
}

export default CalendarPicker
