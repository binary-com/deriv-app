import React, { useMemo } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { InferType } from 'yup';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import { Checkbox, InlineMessage, Text } from '@deriv-com/ui';
import { DatePicker } from '../../components/DatePicker';
import { FormInputField } from '../../components/FormFields';
import { getNameDOBValidationSchema } from '../../utils';
import { validateField } from '../../utils/validation';

type TPersonalDetailsFormWithExampleValues = InferType<ReturnType<typeof getNameDOBValidationSchema>>;

type TPersonalDetailsFormWithExampleProps = {
    error?: string;
    onConfirm?: () => void;
};

export const PersonalDetailsFormWithExample = ({ onConfirm }: TPersonalDetailsFormWithExampleProps) => {
    const formik = useFormikContext<TPersonalDetailsFormWithExampleValues>();

    if (!formik) {
        throw new Error('PersonalDetailsFormWithExample must be used within a Formik component');
    }

    const { errors, values } = formik;

    const isDisabled = useMemo(() => {
        return (
            !values?.firstName ||
            !values?.lastName ||
            !values?.dateOfBirth ||
            !!errors?.firstName ||
            !!errors?.lastName ||
            !!errors?.dateOfBirth
        );
    }, [values, errors]);

    const validationSchema = getNameDOBValidationSchema();

    return (
        <section className='p-16 outline outline-1 outline-system-light-active-background rounded-default'>
            <InlineMessage className='items-start mb-16' variant='warning'>
                <Text as='p' className='text-sm lg:text-default'>
                    To avoid delays, enter your <span className='font-bold'>name</span> and{' '}
                    <span className='font-bold'>date of birth</span> exactly as they appear on your identity document.
                </Text>
            </InlineMessage>
            <div className='grid sm:grid-rows-2 md:grid-cols-2 gap-16'>
                <div className='flex flex-col gap-16'>
                    <FormInputField
                        isFullWidth
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                        validationSchema={validationSchema.fields.firstName}
                    />
                    <FormInputField
                        isFullWidth
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                        validationSchema={validationSchema.fields.lastName}
                    />
                    <Field
                        name='dateOfBirth'
                        type='input'
                        validate={validateField(validationSchema.fields.dateOfBirth)}
                    >
                        {({ field, form, meta }: FieldProps<string>) => (
                            <DatePicker
                                {...field}
                                aria-label='Date of birth*'
                                errorMessage={meta.error}
                                isInvalid={meta.touched && !!meta.error}
                                label='Date of birth*'
                                onDateChange={(date: string | null) => {
                                    form.setFieldValue(field.name, date);
                                }}
                            />
                        )}
                    </Field>
                </div>
                <div>
                    <Text as='p' className='mt-2 mb-4' size='xs' weight='bold'>
                        Example:
                    </Text>
                    <DerivLightNameDobPoiIcon height='200px' />
                </div>
            </div>

            <div>
                <Field
                    name='nameDOBConfirmation'
                    type='checkbox'
                    validate={validateField(validationSchema.fields.nameDOBConfirmation)}
                >
                    {({ field, form, meta: { error, touched } }: FieldProps) => (
                        <Checkbox
                            {...field}
                            data-testid='dt_poi_confirm_with_example'
                            disabled={isDisabled}
                            error={Boolean(error && touched)}
                            label='I confirm that the name and date of birth above match my chosen identity document.'
                            onChange={value => {
                                form.setFieldValue(field.name, value.target.checked);
                                if (value.target.checked) {
                                    onConfirm?.();
                                }
                            }}
                        />
                    )}
                </Field>
            </div>
        </section>
    );
};
