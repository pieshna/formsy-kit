import { Button, Divider } from '@heroui/react'
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconUnderline,
} from '@tabler/icons-react'
import { Tooltip } from 'flowbite-react'
import isHotkey from 'is-hotkey'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { createEditor, Editor, Element as SlateElement, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact } from 'slate-react'

interface TextAreaCustomProps {
  value?: string
  name?: string
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  className?: string
  placeholder?: string
  label?: string
  maxLength?: number
  isRequired?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  max?: number
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
]

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

// Funciones de utilidad para el editor
const isBlockActive = (editor: any, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: any) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as any)[blockType] === format,
    }),
  )

  return !!match
}

const isMarkActive = (editor: any, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format as keyof typeof marks] === true : false
}

const toggleBlock = (editor: any, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n: any) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  let newProperties: any
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: any, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// Helpers para determinar tipos de formato
const isTextFormat = (format: string) =>
  !LIST_TYPES.includes(format) && !TEXT_ALIGN_TYPES.includes(format)

const getInitialValue = (value?: string) => {
  if (!value) return initialValue
  try {
    return JSON.parse(value)
  } catch {
    return initialValue
  }
}

const buttons = [
  {
    icon: <IconBold />,
    format: 'bold',
    tooltip: 'Negritas (Ctrl + B)',
  },
  {
    icon: <IconItalic />,
    format: 'italic',
    tooltip: 'Cursivas (Ctrl + I)',
  },
  {
    icon: <IconUnderline />,
    format: 'underline',
    tooltip: 'Subrayado (Ctrl + U)',
  },
  {
    icon: <IconListNumbers />,
    format: 'numbered-list',
    tooltip: 'Lista numerada',
  },
  {
    icon: <IconList />,
    format: 'bulleted-list',
    tooltip: 'Lista con viñetas',
  },
  {
    icon: <IconAlignLeft />,
    format: 'left',
    tooltip: 'Alinear a la izquierda',
  },
  {
    icon: <IconAlignCenter />,
    format: 'center',
    tooltip: 'Alinear al centro',
  },
  {
    icon: <IconAlignRight />,
    format: 'right',
    tooltip: 'Alinear a la derecha',
  },
  {
    icon: <IconAlignJustified />,
    format: 'justify',
    tooltip: 'Justificar',
  },
]

// Componente de botón que determina automáticamente si es mark o block
const FormatButton = ({
  button,
}: {
  button: { icon: any; format: string; tooltip: string }
}) => {
  const editor = useSlate()

  // Usar la función helper para determinar el tipo
  const isText = isTextFormat(button.format)

  const isActive = isText
    ? isMarkActive(editor, button.format)
    : isBlockActive(
        editor,
        button.format,
        TEXT_ALIGN_TYPES.includes(button.format) ? 'align' : 'type',
      )

  const handleFormatClick = (event: any) => {
    event.preventDefault()

    if (isText) {
      toggleMark(editor, button.format)
    } else {
      toggleBlock(editor, button.format)
    }
  }

  return (
    <Tooltip content={button.tooltip} className="dark:text-foreground text-xs">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onMouseDown={handleFormatClick}
        className={isActive ? 'bg-gray-200' : ''}
      >
        {button.icon}
      </Button>
    </Tooltip>
  )
}

function TextAreaCustom({
  value,
  name,
  onChange,
  placeholder,
  label,
  isRequired,
  isDisabled,
}: TextAreaCustomProps) {
  // Crear el editor usando useMemo y withHistory
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  // Estado para rastrear el último valor y forzar actualización cuando sea necesario
  const [lastValue, setLastValue] = useState(value)
  const [editorKey, setEditorKey] = useState(0)

  // Detectar cambios en el valor externo
  useEffect(() => {
    if (value !== lastValue) {
      setLastValue(value)
      setEditorKey((prev) => prev + 1) // Forzar re-mount para actualizar initialValue
    }
  }, [value, lastValue])

  const handleValueChange = (newValue: any) => {
    const str = JSON.stringify(newValue)
    if (onChange) {
      const event = {
        target: {
          name: name,
          value: str,
        },
      } as unknown as ChangeEvent<HTMLInputElement | HTMLSelectElement>
      onChange(event)
    }
  }

  const getCurrentInitialValue = () => getInitialValue(value)

  // Función para renderizar elementos
  const renderElement = useCallback((props: any) => {
    const { attributes, children, element } = props
    const style = { textAlign: element.align }

    switch (element.type) {
      case 'bulleted-list':
        return (
          <ul
            style={{ ...style, listStyleType: 'disc', paddingLeft: '20px', margin: '0' }}
            {...attributes}
          >
            {children}
          </ul>
        )
      case 'numbered-list':
        return (
          <ol
            style={{
              ...style,
              listStyleType: 'decimal',
              paddingLeft: '20px',
              margin: '0',
            }}
            {...attributes}
          >
            {children}
          </ol>
        )
      case 'list-item':
        return (
          <li style={{ ...style, display: 'list-item' }} {...attributes}>
            {children}
          </li>
        )
      default:
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        )
    }
  }, [])

  // Función para renderizar texto con formato
  const renderLeaf = useCallback((props: any) => {
    const { attributes, children, leaf } = props
    let element = <span {...attributes}>{children}</span>

    if (leaf.bold) {
      element = <strong>{element}</strong>
    }

    if (leaf.italic) {
      element = <em>{element}</em>
    }

    if (leaf.underline) {
      element = <u>{element}</u>
    }

    return element
  }, [])

  // Función para manejar atajos de teclado
  const handleKeyDown = (event: any) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault()
        const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS]
        toggleMark(editor, mark)
      }
    }
  }

  return (
    <div className="rounded-lg border-2 border-gray-300 p-4 flex flex-col gap-2">
      <p className="text-gray-500 dark:text-foreground text-xs">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </p>
      <Slate
        key={editorKey}
        editor={editor}
        initialValue={getCurrentInitialValue()}
        onValueChange={handleValueChange}
      >
        <div className="flex gap-2">
          {buttons.map((button, index) => (
            <FormatButton key={index} button={button} />
          ))}
        </div>
        <Divider />
        <Editable
          className="p-2 outline-none focus:outline-none"
          placeholder={placeholder}
          readOnly={isDisabled}
          spellCheck
          autoFocus
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
        />
      </Slate>
    </div>
  )
}

export default TextAreaCustom
