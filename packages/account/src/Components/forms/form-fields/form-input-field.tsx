import React from 'react';
import { FieldInputProps, FormikHelpers, FormikState, Field } from 'formik';
import { Input } from '@deriv/components';

type FormInputFieldProps = {
    name: string;
    optional?: boolean;
    warn?: string;
} & React.ComponentProps<typeof Input>;

type TFormInputFieldHelpers = {
    field: FieldInputProps<string>;
    form: FormikHelpers<Record<string, string>> & FormikState<Record<string, string>>;
};

/**
 * FormInputField is a wrapper around Input that can be used with Formik.
 * @name FormInputField
 * @param name - Name of the field
 * @param [optional] - Whether the field is optional
 * @param [warn] - Display a warning message
 * @param [props] - Other props to pass to Input
 * @returns {React.ReactNode}
 */
const FormInputField = ({ name, optional = false, warn, ...rest }: FormInputFieldProps) => (
    <Field name={name}>
        {({ field, form: { errors, touched } }: TFormInputFieldHelpers) => (
            <Input
                {...field}
                {...rest}
                type='text'
                required={!optional}
                autoComplete='off'
                error={touched[field.name] && errors[field.name] ? errors[field.name] : undefined}
                warn={warn}
            />
        )}
    </Field>
);

export default FormInputField;
