import { Checkbox, CheckboxProps } from '@heroui/react'

interface props extends CheckboxProps {
  label?: string
}

function CheckboxCustom({ label, ...resto }: props) {
  return (
    <Checkbox classNames={{ label: 'dark:text-white' }} {...resto}>
      {label}
    </Checkbox>
  )
}

export default CheckboxCustom
