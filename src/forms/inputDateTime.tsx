import { DatePicker, DatePickerProps } from '@heroui/react'
import { I18nProvider } from '@react-aria/i18n'

interface InputDateTimeProps extends Omit<DatePickerProps, 'value'> {
  value: DatePickerProps['value'] | null
}

function InputDateTime({ value, ...resto }: InputDateTimeProps) {
  return (
    <>
      <I18nProvider locale="es-MX">
        <DatePicker
          hideTimeZone
          showMonthAndYearPickers
          granularity="minute"
          variant="bordered"
          classNames={{
            calendarContent: ['dark:text-white']
          }}
          value={value ?? undefined}
          {...resto}
        />
      </I18nProvider>
    </>
  )
}

export default InputDateTime
