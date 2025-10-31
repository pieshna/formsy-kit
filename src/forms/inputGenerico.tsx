'use client'
import { Input, InputProps } from '@heroui/react'
import { IconEyeFilled, IconEyeOff } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

function InputGenerico(props: InputProps) {
  const [isVisible, setIsVisible] = useState(props.type === 'password')
  const [valor, setValor] = useState<any>()

  useEffect(() => {
    if (
      props.value !== undefined &&
      props.value !== null &&
      props.maxLength &&
      props.maxLength >= props.value.length
    ) {
      setValor(props.value)
    }
  }, [props.value])

  const handleClick = () => {
    setIsVisible(!isVisible)
  }
  return (
    <>
      {props.type === 'password' ? (
        <Input
          variant="bordered"
          {...props}
          type={!isVisible ? 'text' : 'password'}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={handleClick}
              aria-label="toggle password visibility"
            >
              {isVisible ? <IconEyeOff /> : <IconEyeFilled />}
            </button>
          }
        />
      ) : (
        <Input
          variant="bordered"
          classNames={{
            inputWrapper: ['dark:text-white'],
            label: ['dark:text-white'],
          }}
          value={valor}
          {...props}
        />
      )}
    </>
  )
}

export default InputGenerico
