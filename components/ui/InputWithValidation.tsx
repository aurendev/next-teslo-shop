import { TextField } from "@mui/material";
import { FC } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface Props {
	label: string;
  fieldValue: string;
	register: UseFormRegister<any>;
	required?: boolean;
	options?: any;
  hasError:FieldError| undefined;
}

export const InputWithValidation: FC<Props> = ({
	label,
	register,
  hasError,
	required = false,
  fieldValue,
}) => {
	return (
		<TextField
			{...register(fieldValue, {
				...(required ? { required: `${label} es requerido` } : {}),
			})}
			label={label}
      error={!!hasError}
      helperText={hasError?.message}
			variant="filled"
			fullWidth
		/>
	);
};
