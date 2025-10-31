import { Datepicker, DatepickerProps } from 'flowbite-react'
import { useEffect, useState } from 'react'

interface CustomInputDateProps extends Omit<DatepickerProps, 'value'> {
  label: string
  value?: Date | string | null
  isRequired?: boolean
  name?: string
}

function CustomInputDate({
  label,
  value,
  isRequired,
  name,
  ...resto
}: CustomInputDateProps) {
  const [valor, setValor] = useState<Date | undefined | null>(null)

  useEffect(() => {
    if (typeof value === 'string') {
      const dateMatch = value.match(/^(\d{4}-\d{2}-\d{2})/)

      if (dateMatch) {
        const [year, month, day] = dateMatch[1].split('-').map(Number)
        const localDate = new Date(year, month - 1, day)
        setValor(localDate)
        return
      }
      const date = new Date(value)
      if (isNaN(date.getTime())) {
        setValor(null)
        return
      }
      setValor(date)
      return
    }
    if (value instanceof Date) {
      setValor(value)
    } else if (value === null || value === undefined) {
      setValor(null)
    }
  }, [value])

  // Estilos personalizados para el datepicker
  const customStyles = `
    .datepicker-dropdown {
      position: absolute !important;
      z-index: 99999 !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
    }
    
    [data-testid="datepicker"] > div:last-child {
      position: absolute !important;
      z-index: 99999 !important;
      top: 100% !important;
      left: 0 !important;
      margin-top: 4px !important;
    }
    
    .datepicker-picker {
      z-index: 99999 !important;
    }
    
    .flowbite-datepicker {
      z-index: 99999 !important;
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="relative">
        <label
          htmlFor={name}
          className={`absolute left-8 top-1 z-900 px-2 py-0.5 rounded transition-all duration-200 text-gray-500 pointer-events-none
           text-xs scale-90
          `}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <div className="relative overflow-visible">
          <Datepicker
            key={valor ? valor.getTime() : 'empty'}
            id={name}
            style={{
              paddingTop: '1.5rem',
            }}
            language="es"
            showClearButton={false}
            labelTodayButton="Hoy"
            value={valor || undefined}
            {...resto}
          />
        </div>
      </div>
    </>
  )
}

export default CustomInputDate
