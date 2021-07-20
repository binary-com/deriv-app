import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { DatePicker, Input } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { ROOT_CLASS } from '../constants';

const InputField = ({ data }) => {
    const min_date = toMoment().add(6, 'months').format('YYYY-MM-DD');
    switch (data.type) {
        case 'text':
            return (
                <Field name={data.name}>
                    {({ field, form: { errors, touched } }) => (
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
                    {({ field, form: { errors, touched } }) => (
                        <DatePicker
                            {...field}
                            className={`${ROOT_CLASS}__field`}
                            date_format='YYYY-MM-DD'
                            display_format='DD-MM-YYYY'
                            start_date={min_date}
                            min_date={min_date}
                            should_show_today={false}
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

InputField.propTypes = {
    data: PropTypes.object,
};

export default InputField;
