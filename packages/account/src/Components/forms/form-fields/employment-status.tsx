import React from 'react';
import { Field, FieldProps } from 'formik';
import { Dropdown, SelectNative } from '@deriv/components';
import { useTranslations } from '@deriv-com/translations';
import { getEmploymentStatusList } from '../../../Constants/financial-information-list';
import { useDevice } from '@deriv-com/ui';
import clsx from 'clsx';

type TEmploymentStatusFieldProps = {
    required: boolean;
    is_disabled: boolean;
    fieldFocused?: boolean;
};

const EmploymentStatusField = ({ required, is_disabled, fieldFocused }: TEmploymentStatusFieldProps) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    return (
        <Field name='employment_status'>
            {({ field, form: { setFieldValue, setFieldTouched, handleBlur, handleChange }, meta }: FieldProps) => (
                <div className='account-form__fieldset'>
                    {isDesktop ? (
                        <Dropdown
                            {...field}
                            placeholder={required ? localize('Employment status*') : localize('Employment status')}
                            is_align_text_left
                            name={field.name}
                            list={getEmploymentStatusList()}
                            value={field.value}
                            onChange={(e: { target: { name: string; value: string } }) => {
                                setFieldValue('tin_skipped', 0, true);
                                setFieldValue(field.name, e.target?.value, true);
                                handleChange(e);
                            }}
                            handleBlur={handleBlur}
                            error={meta.touched ? meta.error : undefined}
                            disabled={is_disabled}
                            className={clsx('dropdown-field', { 'focus-field': fieldFocused })}
                        />
                    ) : (
                        <SelectNative
                            {...field}
                            placeholder={localize('Please select')}
                            name={field.name}
                            label={required ? localize('Employment status*') : localize('Employment status')}
                            list_items={getEmploymentStatusList()}
                            value={field.value}
                            error={meta.touched ? meta.error : undefined}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setFieldValue('tin_skipped', 0, true);
                                setFieldTouched('employment_status', true);
                                handleChange(e);
                            }}
                            disabled={is_disabled}
                            className={clsx({ 'focus-field': fieldFocused })}
                        />
                    )}
                </div>
            )}
        </Field>
    );
};

export default EmploymentStatusField;
