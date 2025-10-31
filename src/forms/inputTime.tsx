'use client'

import { forwardRef } from 'react'
import { PickerHandle, TimePicker, TimePickerProps } from 'rsuite'
import 'rsuite/TimePicker/styles/index.css'

// Configuración de locale en español para rsuite
const esLocale = {
  sunday: 'Dom',
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mié',
  thursday: 'Jue',
  friday: 'Vie',
  saturday: 'Sáb',
  ok: 'Aceptar',
  now: 'Ahora',
  today: 'Hoy',
  yesterday: 'Ayer',
  hours: 'Horas',
  minutes: 'Minutos',
  seconds: 'Segundos',
}

interface InputTimeCustomProps extends Omit<TimePickerProps, 'onChange' | 'value'> {
  required?: boolean
  label?: string
  error?: string
  helperText?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'filled' | 'subtle'
  value?: string | Date | null
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  showSeconds?: boolean
  format?: string
  className?: string
}

const InputTimeCustom = forwardRef<PickerHandle, InputTimeCustomProps>(
  (
    {
      required = false,
      label,
      error,
      helperText,
      size = 'md',
      variant = 'outlined',
      value,
      onChange,
      placeholder = 'Seleccionar hora',
      disabled = false,
      showSeconds = false,
      format,
      className = '',
      ...resto
    },
    ref,
  ) => {
    // Convertir string a Date si es necesario
    const getDateValue = (): Date | null => {
      if (!value) return null

      if (value instanceof Date) {
        return value
      }

      if (typeof value === 'string') {
        // Si viene en formato HH:MM
        if (value.match(/^\d{2}:\d{2}$/)) {
          const [hours, minutes] = value.split(':')
          const date = new Date()
          date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
          return date
        }

        // Si viene en formato ISO
        return new Date(value)
      }

      return null
    }

    // Manejo cambio de valor
    const handleChange = (date: Date | null) => {
      if (!onChange) return

      if (!date) {
        onChange('')
        return
      }

      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      if (showSeconds) {
        onChange(`${hours}:${minutes}:${seconds}`)
      } else {
        onChange(`${hours}:${minutes}`)
      }
    }

    // Determina el formato automáticamente
    const timeFormat = format || (showSeconds ? 'HH:mm:ss' : 'HH:mm')

    return (
      <div className={`time-input-wrapper ${className}`}>
        {label && (
          <label
            className={`block text-sm font-medium mb-1 ${
              error ? 'text-red-600' : 'text-gray-700'
            } ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}`}
          >
            {label}
          </label>
        )}

        <TimePicker
          ref={ref}
          locale={esLocale}
          value={getDateValue()}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          format={timeFormat}
          menuStyle={{
            zIndex: 9999,
            ...resto.menuStyle,
          }}
          style={{
            width: '100%',
            ...resto.style,
          }}
          className={`
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${variant === 'filled' ? 'bg-gray-100' : ''}
            ${variant === 'subtle' ? 'border-transparent bg-gray-50' : ''}
          `}
          {...resto}
        />

        {(error || helperText) && (
          <p className={`text-xs mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  },
)

InputTimeCustom.displayName = 'InputTimeCustom'

export default InputTimeCustom
