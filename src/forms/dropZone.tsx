'use client'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface DropZoneCustomProps {
  accept: { [key: string]: string[] }
  label?: string
  onDrop?: (acceptedFiles: File[]) => void
  limit?: number
  urlImage?: string
  className?: string
  classNames?: ClassNamesDropZoneProps
  returnB64?: (b64: string | string[] | null) => void
  required?: boolean
  urlActual?: string
  maxSize?: number
}

export interface ClassNamesDropZoneProps {
  hasImage?: string
  content?: string
  isDragActive?: string
  isDragNotActive?: string
  label?: string
}

const defaultImagen = '/assets/upload.png'

function DropZoneCustom({
  label,
  onDrop: onDropExternal,
  accept,
  urlImage: imagenProps,
  limit = 1,
  className,
  classNames,
  returnB64,
  required,
  urlActual,
  maxSize
}: DropZoneCustomProps) {
  const [urlImage, setUrlImage] = useState(imagenProps)
  const [files, setFiles] = useState<File[]>([])
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    const hasImageType = Object.keys(accept).some((type) =>
      type.startsWith('image/')
    )
    if (hasImageType && !urlImage) {
      setUrlImage(defaultImagen)
    }
    if (imagenProps) {
      setUrlImage(imagenProps)
    }
  }, [imagenProps])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept,
    maxFiles: limit,
    maxSize: maxSize,
    onDrop: (acceptedFiles) => {
      setErrors([]) // Limpiar errores cuando se seleccionan archivos válidos
      setFiles(acceptedFiles)
      if (acceptedFiles.length === 1) {
        const file = acceptedFiles[0]
        if (file.type.startsWith('image/')) {
          setPreview(URL.createObjectURL(file))
        } else {
          setPreview(null)
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          returnB64?.(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else if (acceptedFiles.length > 1) {
        setPreview(null)
        const promises = acceptedFiles.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve(reader.result as string)
            }
            reader.readAsDataURL(file)
          })
        })
        Promise.all(promises).then((b64Array) => {
          returnB64?.(b64Array)
        })
      } else {
        setPreview(null)
        returnB64?.(null)
      }
      if (onDropExternal) onDropExternal(acceptedFiles)
    },
    onDropRejected: (rejectedFiles) => {
      const newErrors: string[] = []
      rejectedFiles.forEach((rejectedFile) => {
        rejectedFile.errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            const maxSizeMB = maxSize
              ? (maxSize / (1024 * 1024)).toFixed(1)
              : 'el límite'
            newErrors.push(
              `El archivo "${rejectedFile.file.name}" es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`
            )
          } else if (error.code === 'file-invalid-type') {
            newErrors.push(
              `El archivo "${rejectedFile.file.name}" no tiene un formato válido`
            )
          } else if (error.code === 'too-many-files') {
            newErrors.push(`Solo se permiten ${limit} archivo(s)`)
          } else {
            newErrors.push(
              `Error con el archivo "${rejectedFile.file.name}": ${error.message}`
            )
          }
        })
      })
      setErrors(newErrors)
    }
  })

  const handleRemove = (index: number) => {
    setErrors([]) // Limpiar errores al eliminar archivos
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    if (newFiles.length === 1) {
      const file = newFiles[0]
      if (file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file))
      } else {
        setPreview(null)
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        returnB64?.(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (newFiles.length > 1) {
      setPreview(null)
      const promises = newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      })
      Promise.all(promises).then((b64Array) => {
        returnB64?.(b64Array)
      })
    } else {
      setPreview(null)
      returnB64?.(null)
    }
  }

  return (
    <>
      {label && (
        <p className={classNames?.label}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </p>
      )}
      <div
        {...getRootProps()}
        className={`flex items-center justify-center ${
          classNames?.content ?? className ?? ''
        }
        ${
          preview
            ? ' rounded-full shadow-2xl border-2 border-dashed border-gray-300 text-center  '
            : classNames?.hasImage ?? ''
        }`}
      >
        <input {...getInputProps()} />
        {(files.length === 1 && preview) || urlImage ? (
          <div className="flex flex-col items-center">
            <img
              src={preview ?? urlImage}
              alt={files[0]?.name ?? 'Preview'}
              className="rounded-full"
              style={{ width: '150px', height: '150px' }}
            />
            {/*<button
              type="button"
              onClick={() => handleRemove(0)}
              className="mt-2 text-red-500"
            >
              Eliminar
            </button>*/}
          </div>
        ) : files.length > 0 ? (
          <div className="flex flex-col items-center">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(idx)
                  }}
                  className="text-red-500"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            {isDragActive ? (
              <p className={classNames?.isDragActive}>
                Arrastra tus archivos aquí ...
              </p>
            ) : (
              <p className={classNames?.isDragNotActive}>
                Arrastra y suelta algunos archivos aquí, o haz clic para
                seleccionar archivos
              </p>
            )}
          </>
        )}
      </div>
      {errors.length > 0 && (
        <div className="mt-2">
          {errors.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}
      {urlActual && (
        <a href={urlActual} className="text-blue-500">
          Ver Actual
        </a>
      )}
    </>
  )
}

export default DropZoneCustom
