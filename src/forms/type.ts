import { ButtonProps } from '@heroui/react'
import { ReactNode } from 'react'
import { ClassNamesDropZoneProps } from './dropZone'

export type EstructuraFormulario = {
  [key: string]: {
    /**
     * Etiqueta que se mostrará para el campo de formulario.
     */
    label: string
    /**
     * Tipo de campo de formulario.
     */
    type: inputTypes
    /**
     * Indica si el campo es obligatorio.
     * @optional
     * @default false
     */
    required?: boolean
    /**
     * Se utiliza para ir a traer los datos de la API.
     * Se utiliza solo en los tipos: select, autoComplete.
     * @optional
     */
    url?: string
    /**
     * Se utiliza para ir a traer los datos de la API omitiendo el dominio puesto en .env
     * Se utiliza solo en el tipo: select, autoComplete.
     * @optional
     */
    fullUrl?: string
    /**
     * Campos que se mostrarán en el select o autoComplete.
     * Se utiliza solo en los tipos: select, autoComplete.
     * @optional
     * @example ['nombre', 'apellido'] -> mostrara los campos nombre y apellido concatenados.
     */
    campos?: string[]
    /**
     * Se utiliza para concatenar los campos en el select o autoComplete.
     * Se utiliza solo en los tipos: select, autoComplete.
     * @optional
     */
    joinWith?: string
    /**
     * ID del campo, por defecto es 'id'.
     * Se utiliza solo en los tipos: select, autoComplete.
     * @optional
     * @default 'id'
     */
    id?: string
    /**
     * Desactiva el campo de formulario.
     * @optional
     * @default false
     */
    disabled?: boolean
    /**
     * Icono que se mostrara en el input.
     * Se utiliza solo en input tipo: datetime, text, number, password, email.
     * @optional
     */
    icon?: ReactNode
    /**
     * Indica si se muestra el campo de formulario.
     * @optional
     * @default true
     */
    show?: boolean
    /**
     * Valor por defecto del campo.
     * @optional
     */
    defaultValue?: any
    /**
     * Clase(s) CSS que se aplicarán al campo de formulario.
     * @optional
     */
    className?: string
    /**
     * Función de validación personalizada.
     * @optional
     */
    validate?: (value: string | any[]) => string | undefined | void
    /**
     * Opcion para limpiar el campo, en input tipo select y autoComplete agrega una X para limpiar el campo.
     * @optional
     */
    clearable?: boolean
    /**
     * Placeholder que se mostrará en el campo de formulario.
     * @optional
     */
    placeholder?: string
    isNulleable?: boolean
    /**
     * Indica el orden en que se mostrarán los campos de formulario, si no se asigna el formulario lo hara automaticamente.
     * @optional
     */
    orden?: number
    /**
     * Indica si el campo se muestra en una sola línea o no.
     * @optional
     * @default false
     */
    onlyLine?: boolean
    /**
     * Agrupador para agrupar campos en el formulario.
     * @optional
     *  'personal_info' -> Agrupa los campos que tengan el mismo nombre de agrupador.
     * Retorna un objeto con las siguientes propiedades:
     * - key: el nombre del campo agrupador.
     * - values: objeto con keys y values de los campos que pertenecen al mismo agrupador.
     * @example
     * personal_info: {name: 'Juan', age: 30, address: 'Calle 123'}
     *
     * Si se utiliza con la combinación de repeatTimes, se retornará un array de objetos con las mismas propiedades mencionadas anteriormente.
     * agrupador: 'direcciones'
     * repeatTimes: 3
     *
     * Retornará un array con 3 objetos, cada uno con las propiedades key y values de los campos que pertenecen al agrupador 'direcciones'.
     * @example
     * direcciones: [{city: 'Ciudad1', street: 'Calle1'}, {city: 'Ciudad2', street: 'Calle2'}, {city: 'Ciudad3', street: 'Calle3'}]
     */
    agrupador?: string
    /**
     * Número de veces que se repetirá campo o agrupador.
     * @optional
     * @example 3 -> Repetirá el campo o agrupador 3 veces.
     *
     * Si se utiliza en un campo normal, se retornará un array con los valores de cada repetición.
     * @example
     * phone: ['1234567890', '0987654321', '1122334455']
     * Si se utiliza en un agrupador, se retornará un array de objetos con las keys y values de los campos que pertenecen al mismo agrupador.
     * @example
     * direcciones: [{city: 'Ciudad1', street: 'Calle1'}, {city: 'Ciudad2', street: 'Calle2'}, {city: 'Ciudad3', street: 'Calle3'}]
     */
    repeatTimes?: number
    /**
     * Número máximo de caracteres permitidos en el campo.
     * @optional
     */
    maxLength?: number
    /**
     * Agrega un divisor para separar secciones del formulario.
     * Tambien se puede convinar con textDivider para agregar texto al divisor.
     * @optional
     */
    dividerAfter?: boolean
    /**
     * Agrega un divisor para separar secciones del formulario.
     * Tambien se puede convinar con textDivider para agregar texto al divisor.
     * @optional
     */
    dividerBefore?: boolean
    /**
     * Texto que se mostrará en el divisor.
     * @optional
     */
    textDivider?: string
    /**
     * @deprecated no usar, usar repeatTimes en su lugar.
     */
    canRepeat?: boolean
    /**
     * Datos estáticos para los tipos select y autoComplete.
     * @optional
     */
    data?: any[]
    /**
     * Permite omitir la llamada a la API para obtener los datos.
     * Se utiliza solo en los tipos: select, autoComplete.
     * @optional
     * @default false
     */
    omitFetch?: boolean
    /**
     * Función que permite retornar los datos obtenidos de la llamada a la API
     * Usualmente se utiliza para guardar los datos en un estado padre.
     * Se utiliza solo en los tipos: select, autoComplete.
     * @optional
     * @example
     * (data) => { console.log(data) }
     */
    returnData?: (data: any) => any
    /**
     * Utilizado en el checkboxGroup para definir si el label del checkbox group se muestra en la misma línea que los checkboxes.
     * @optional
     */
    inSameLine?: boolean
    /**
     * Usado en el checkboxGroup para definir si se selecciona solo un checkbox o múltiples.
     * @optional
     * @default false
     */
    selectOne?: boolean
    /**
     * Permite definir si se seleccionaran varias opciones en el select
     * @optional
     * @default 'single'
     */
    selectionMode?: 'single' | 'multiple'
    /**
     * Función que se ejecuta dentro del fetch antes de setear los datos en el componente.
     * Se utiliza solo en los tipos: select, autoComplete.
     * @optional
     * @example
     * (data) => { return data.results o lo que necesites hacer}
     */
    insidefetch?: (data: any) => any
    /**
     * Classes CSS personalizadas para el dropZone.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     */
    classNamesDropZone?: ClassNamesDropZoneProps
    /**
     * Funcion para manejar el evento onDrop.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     */
    onDrop?: (acceptedFiles: File[]) => void
    /**
     * Tipo de archivos aceptados en el dropZone.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     * @example {'image/*': ['.png', '.jpg', '.jpeg']}
     */
    acceptedFiles?: { [key: string]: string[] }
    /**
     * Limita el número de elementos que se pueden soltar en el dropZone.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     * @default undefined (sin límite)
     */
    limitItemsDropped?: number
    /**
     * Si el dropZone debe mostrar una imagen.
     * Si este esta en true se tomara por defecto el valor de defaultValue como url de la imagen.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     * @default false
     */
    urlImageDropZone?: boolean
    /**
     * Función que retorna la imagen en base64 cuando se carga una imagen en el dropZone.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     */
    returnB64DropZone?: (b64: string | string[] | null) => void
    /**
     * Parametro que permite parsear automaticamente el valor del dropZone a base64 y formateado a json.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     * @default true
     *
     */
    automaticParseJsonDropZone?: boolean
    /**
     * Permite mostrar u ocultar el label del dropZone.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     * @default true
     */
    showLabelDropZone?: boolean
    /**
     * Propiedad utilizada unicamente por funciones internas de FormsyKit.
     * @internal
     */
    repeatAgrupadorTimes?: number
    /**
     * Propiedad que permite agregar boton para repetir campos o agrupadores.
     * Se utiliza en conjunto con la propiedad repeatTimes y agrupador.
     * @optional
     * @default false
     */
    addButtonToRepeat?: boolean
    /**
     * Propiedad que permite agregar boton para eliminar campos o agrupadores repetidos.
     * @internal usado por funciones internas de FormsyKit.
     * Se puede utilizar de forma manual tambien.
     */
    buttonTrash?: boolean
    /**
     * Permite cambiar el color del boton de eliminar campos o agrupadores repetidos.
     * Se utiliza en conjunto con la propiedad buttonTrash.
     * @optional
     */
    colorButtonTrash?: ButtonColors
    /**
     * Permite cambiar el color del boton de agregar campos o agrupadores repetidos.
     * Se utiliza en conjunto con la propiedad addButtonToRepeat.
     * @optional
     */
    colorButtonAdd?: ButtonColors
    /**
     * Permite establecer la URL para ver lo que actualmente esta subido en el dropZone.
     * Hace una llamada fetch a esa URL para obtener la imagen.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     */
    urlActual?: string
    /**
     * Tamaño máximo en bytes para los archivos subidos en el dropZone.
     * Se utiliza solo en el tipo: dropzone.
     * @optional
     * @default unlimited
     * @example 5 * 1024 * 1024 -> 5 MB
     */
    maxSizeDropZone?: number
    /**
     * Transforma el texto del divisor.
     */
    textDividerCase?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
    /**
     * Indica si se deben mostrar los segundos en el input de tiempo.
     */
    showSeconds?: boolean
    /**
     * Formato de hora a mostrar en el input de tiempo.
     * @optional
     */
    timeFormat?: string
    /**
     * Variante de estilo para el input de tiempo.
     */
    timeVariant?: 'outlined' | 'filled' | 'subtle'
    /**
     * Texto de ayuda que se mostrará debajo del campo de formulario.
     * Se utiliza solo en input tipo time
     * @optional
     */
    helperText?: string
  }
}

export type ButtonColors = Partial<ButtonProps>['color']

export type inputTypes =
  | 'text'
  | 'select'
  | 'selectLlaveForanea'
  | 'autoComplete'
  | 'password'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'checkbox'
  | 'email'
  | 'checkboxGroup'
  | 'textarea'
  | 'textareaWithEditor'
  | 'phone'
  | 'dropzone'
  | 'signature'

export type ParseEstructuraFormulario = {
  key: string
  type: inputTypes
  dependiente: string[]
  disabled: boolean
  required: boolean
  defaultValue?: string | number | null
  label: string
  data?: any[]
  campos: string[]
  url?: string
  id?: string
  orden?: number
}
