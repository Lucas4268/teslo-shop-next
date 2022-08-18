import { FC } from "react"
import { UseFormRegister } from "react-hook-form";
import { TextField } from "@mui/material"
import { validations } from "../../utils";


interface Props {
  register: any;
  field: string;
  label: string;
  error?: string;
  minLength?: number;
  type?: string;
  required?: boolean;
}

export const TextControlField:FC<Props> = ({ register, error, minLength, field, label, type = 'text', required = true }) => {
  return (
    <TextField
      label={ label }
      variant="filled"
      type={ type }
      fullWidth
      {
        ...register( field, {
          required: required ? 'Este campo es requerido' : false,
          minLength: minLength && { value: minLength, message: `Este campo debe tener al menos ${ minLength } caracteres` },
          validate: type === 'email' ? validations.isEmail : undefined,
        })
      }
      error={ !!error }
      helperText={ error }
    />
  )
}