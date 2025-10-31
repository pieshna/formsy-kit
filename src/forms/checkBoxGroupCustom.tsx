import { Checkbox, CheckboxGroup, CheckboxGroupProps } from '@heroui/react'

interface checkBoxCustomProps extends CheckboxGroupProps {
  datos?: any[]
  inSameLine?: boolean
}

function CheckBoxGroupCustom({ datos, inSameLine, ...resto }: checkBoxCustomProps) {
  return (
    <div className="py-2 p-1">
      <CheckboxGroup
        orientation="horizontal"
        classNames={{
          label: 'dark:text-white ',
          wrapper: 'flex flex-wrap gap-6',
          base: inSameLine ? 'flex-row' : 'flex-col',
        }}
        {...resto}
      >
        {datos &&
          datos.map((dato, index) => (
            <Checkbox
              key={index}
              value={dato.value}
              classNames={{ label: 'dark:text-white' }}
            >
              {dato.label}
            </Checkbox>
          ))}
      </CheckboxGroup>
    </div>
  )
}

export default CheckBoxGroupCustom
