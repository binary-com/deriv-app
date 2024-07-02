import React, { forwardRef, Ref, useState } from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import WalletTextField, { WalletTextFieldProps } from '../Base/WalletTextField/WalletTextField';

export interface TFormFieldProps extends WalletTextFieldProps {
    isInvalid?: WalletTextFieldProps['isInvalid'];
    name: string;
    validationSchema?: Yup.AnySchema;
}

/**
 * This component is just a wrapper to the Field Formik component and WalletTextField
 * Use this component when you are using the FlowProvider with a form and several inputs,
 * and you want those input values to be tracked and validated
 */
const FormField = forwardRef(
    (
        { disabled, errorMessage, isInvalid, name, validationSchema, ...rest }: TFormFieldProps,
        ref: Ref<HTMLInputElement>
    ) => {
        const [hasTouched, setHasTouched] = useState(false);

        const validateField = (value: unknown) => {
            try {
                if (validationSchema) {
                    validationSchema.validateSync(value);
                }
            } catch (err: unknown) {
                return (err as Yup.ValidationError).message;
            }
        };

        return (
            <Field name={name} validate={validateField}>
                {({ field, form }: FieldProps) => {
                    return (
                        <WalletTextField
                            {...rest}
                            defaultValue={field.value}
                            disabled={disabled}
                            errorMessage={hasTouched && (form.errors[name] || errorMessage)}
                            isInvalid={(hasTouched && isInvalid) || (hasTouched && Boolean(form.errors[name]))}
                            name={field.name}
                            onChange={field.onChange}
                            onFocus={e => {
                                setHasTouched(true);
                                field.onBlur(e);
                            }}
                            ref={ref}
                        />
                    );
                }}
            </Field>
        );
    }
);

FormField.displayName = 'FormField';
export default FormField;
