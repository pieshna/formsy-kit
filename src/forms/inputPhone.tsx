import { useRef } from 'react'
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

interface InputPhoneProps extends PhoneInputProps {
  name: string
  label: string
  isDisabled?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  errorMessage?: string
  className?: string
}

function InputPhone(props: InputPhoneProps) {
  const { value, label, name, isDisabled, isInvalid, ...rest } = props
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative w-full h-full flex">
      <label
        htmlFor={name}
        className={`absolute left-10 top-1 z-21 px-2 py-0.5 rounded transition-all duration-200 bg-white/80 text-gray-500 pointer-events-none
         text-xs scale-90
        `}
      >
        {label} {props.isRequired && <span className="text-red-500">*</span>}
      </label>
      <PhoneInput
        country={'mx'}
        containerClass="flex h-full w-full z-20"
        inputClass="bg-white h-full text-gray-900 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-xl w-full px-4 py-4 pt-6 shadow-sm placeholder:text-gray-400 placeholder:opacity-70 transition-all duration-200"
        buttonClass="bg-white border-none shadow-none"
        inputStyle={{ width: '100%', height: '100%' }}
        inputProps={{
          id: name,
          ref: inputRef,
          disabled: isDisabled,
          required: props.isRequired,
        }}
        isValid={!isInvalid}
        value={value}
        {...rest}
      />
    </div>
  )
}

export default InputPhone
