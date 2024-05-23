import React from 'react';
import { Field, FormikValues } from 'formik';
import { DatePicker, Input } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { ROOT_CLASS } from '../constants';

const InputField = ({ data }: FormikValues) => {
    const min_date = toMoment().add(6, 'months').format('YYYY-MM-DD');
    switch (data.type) {
        case 'text':
            return (
                <Field name={data.name}>
                    {({ field, form: { errors, touched } }: FormikValues) => (
                        <Input
                            {...field}
                            className={`${ROOT_CLASS}__field`}
                            type='text'
                            label={`${data.label}${data.required ? '*' : ''}`}
                            error={touched[field.name] && errors[field.name]}
                        />
                    )}
                </Field>
            );
        case 'date':
            return (
                <Field name={data.name}>
                    {({ field, form: { errors, touched } }: FormikValues) => (
                        <DatePicker
                            {...field}
                            className={`${ROOT_CLASS}__field`}
                            date_format='YYYY-MM-DD'
                            display_format='DD-MM-YYYY'
                            start_date={min_date}
                            min_date={min_date}
                            name={data.name}
                            label={`${data.label}${data.required ? '*' : ''}`}
                            error={touched[field.name] && errors[field.name]}
                            readOnly
                        />
                    )}
                </Field>
            );
        default:
            return null;
    }
};

export default InputField;
