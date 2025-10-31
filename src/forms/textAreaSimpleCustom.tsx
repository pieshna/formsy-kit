'use client'

import { Textarea, TextAreaProps } from '@heroui/react'

function TextAreaSimpleCustom({ ...resto }: TextAreaProps) {
  return (
    <>
      <Textarea
        classNames={{
          inputWrapper:
            'bg-transparent blur:bg-transparent data-[hover=true]:bg-transparent data-[focus=true]:bg-transparent',
        }}
        {...resto}
      />
    </>
  )
}

export default TextAreaSimpleCustom
