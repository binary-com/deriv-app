import React from 'react';
import { FieldInputProps } from 'formik';
import { Checkbox } from '@deriv/components';

type TCheckboxFieldProps = {
    field: FieldInputProps<boolean>;
    id: string;
    className: string;
    label: string;
};

/**
 * This component is used with Formik's Field component.
 * @param {FieldInputProps<boolean>} field - Formik's field props
 * @param {string} id - Checkbox id
 * @param {string} className - Class name for styling
 * @param {string} label - Checkbox label
 * @param {object} props - Other props
 * @returns {React.ReactNode} - React node
 */
const CheckboxField = ({ field: { name, value, onChange }, label, className, ...props }: TCheckboxFieldProps) => {
    return (
        <div className={className}>
            <Checkbox value={value} name={name} label={label} onChange={onChange} {...props} />
        </div>
    );
};

export default CheckboxField;
