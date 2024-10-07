/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors
// [TODO] - Remove React after CFD is configured with new JSX transformer
import React from 'react';
import { Field, FieldProps } from 'formik';
import { DateOfBirthPicker } from '@deriv/components';
import { toMoment } from '@deriv/shared';

type TDateOfBirthFieldProps = {
    name: string;
    portal_id: string;
} & Omit<React.ComponentProps<typeof DateOfBirthPicker>, 'onBlur' | 'onChange' | 'error'>;

/**
 * DateOfBirthField is a wrapper around DateOfBirthPicker that can be used with Formik.
 * @name DateOfBirthField
 * @param name - Name of the field
 * @param portal_id - Portal ID
 * @param [props] - Other props to pass to DateOfBirthPicker
 * @returns {ReactNode}
 */
const DateOfBirthField = ({ name, portal_id, ...rest }: TDateOfBirthFieldProps) => (
    <Field name={name}>
        {({ field, form: { setFieldValue }, meta: { error, touched } }: FieldProps<string | moment.Moment>) => (
            <DateOfBirthPicker
                {...rest}
                {...field}
                error={touched ? error : undefined}
                name={name}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={({ target }: any) =>
                    setFieldValue(name, target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '', true)
                }
                portal_id={portal_id}
            />
        )}
    </Field>
);

export default DateOfBirthField;
