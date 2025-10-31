'use client'
import { Button } from '@heroui/react'
import { IconTrash, IconUpload } from '@tabler/icons-react'
import { useRef, useState } from 'react'
//se agrega require para evitar error en nextjs
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { SignatureCanvas } = require('react-signature-canvas')

interface SignatureCustomProps {
  className?: string
  onChange?: (image: string | null) => void
  label: string
  isRequired?: boolean
}

function SignatureCustom({
  className,
  onChange,
  label,
  isRequired
}: SignatureCustomProps) {
  const [imageSignature, setImageSignature] = useState<string | null>(null)
  const [required, setRequired] = useState<boolean>(false)
  const sigCanvas = useRef<any>({})

  const saveSignature = () => {
    const img = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
    setImageSignature(img)
    setRequired(false)
    if (onChange) onChange(img)
  }

  const clearSignature = () => {
    setImageSignature(null)
    sigCanvas.current!.clear()
    if (isRequired) {
      setRequired(true)
    }
  }

  const handleUploadImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        const imgSrc = reader.result as string
        setImageSignature(imgSrc)
        if (onChange) onChange(imgSrc)
        setRequired(false)

        // Mostrar la imagen en el canvas manteniendo proporciones
        const canvas = sigCanvas.current.getCanvas()
        const ctx = canvas.getContext('2d')
        const img = new window.Image()
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Calcular la escala para mantener las proporciones
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          )
          const newWidth = img.width * scale
          const newHeight = img.height * scale

          // Centrar la imagen
          const x = (canvas.width - newWidth) / 2
          const y = (canvas.height - newHeight) / 2

          ctx.drawImage(img, x, y, newWidth, newHeight)
        }
        img.src = imgSrc
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  return (
    <>
      <div className="flex flex-col relative gap-2 w-full">
        <p className="">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </p>
        <div
          className={`flex w-full border ${
            required ? 'border-red-500' : 'border-gray-300'
          } rounded ${className || ''}`}
        >
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: `w-full`
            }}
            onEnd={saveSignature}
            clearOnResize={false}
          />
        </div>
        <div className="flex w-full justify-between">
          <Button color="primary" onPress={handleUploadImage}>
            <IconUpload />
            Subir firma personalizada
          </Button>
          <Button color="danger" onPress={clearSignature}>
            <IconTrash />
            Limpiar
          </Button>
        </div>
      </div>
    </>
  )
}

export default SignatureCustom
