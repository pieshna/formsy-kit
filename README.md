# formsy-kit

Librería de componentes y utilidades para formularios en React.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Instalación

Install my-project with npm

```bash
  npm install formsy-kit
```

## Usage/Examples

```javascript
import { FormularioGenerico, EstructuraFormulario } from 'formsy-kit'

const estructura: EstructuraFormulario = {
  email: {
    label: 'Correo electrónico',
    type: 'email',
    required: true
  },
  password: {
    label: 'Contraseña',
    type: 'password',
    required: true
  }
}

export default function MiFormulario() {
  return <FormularioGenerico estructura={estructura} />
}
```

## Componentes incluidos

- AutoComplete
- CalendarPicker
- CheckBoxCustom
- CheckBoxGroupCustom
- DropZone
- FormularioGenerico
- InputDate
- InputDateTime
- InputGenerico
- InputPhone
- InputRangeDate
- InputTime
- SelectCustom
- SignatureCustom
- TextAreaCustom
- TextAreaSimpleCustom

## Contribuir

¡Las contribuciones son bienvenidas! Abre un issue o pull request en el repositorio.

## Authors

- [Pieshna](https://www.github.com/pieshna)
