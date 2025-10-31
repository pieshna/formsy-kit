import { DateRangePicker, DateRangePickerProps } from '@heroui/react'
import { I18nProvider } from '@react-aria/i18n'

interface InputRangeDateProps extends Omit<DateRangePickerProps, 'value'> {
  label: string
  value?: DateRangePickerProps['value'] | null
}

export default function InputRangeDate({ label, value, ...resto }: InputRangeDateProps) {
  return (
    <div className="flex flex-col gap-4">
      <I18nProvider locale="es-MX">
        <DateRangePicker label={label} value={value} visibleMonths={2} {...resto} />
      </I18nProvider>
    </div>
  )
}
