import React, { Fragment } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { Text } from '@deriv-com/ui';
import { DatePicker } from '../../components/DatePicker';
import { FormInputField } from '../../components/FormFields';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { getFieldsConfig, getTitleForFormInputs } from '../../utils/manualFormUtils';

type TManualFormInputsProps = { isExpiryDateRequired: boolean; selectedDocument: TManualDocumentTypes };

export const ManualFormInputs = ({ isExpiryDateRequired, selectedDocument }: TManualFormInputsProps) => {
    const formik = useFormikContext();

    if (!formik) {
        throw new Error('ManualFormInputs must be wrapped with Formik');
    }

    const fieldsConfig = getFieldsConfig(selectedDocument);

    return (
        <Fragment>
            <Text>{getTitleForFormInputs(selectedDocument)}</Text>
            <div className='gap-24 flex flex-col lg:grid lg:grid-cols-2'>
                <FormInputField isFullWidth label={`${fieldsConfig?.documentNumber?.label}*`} name='documentNumber' />
                {isExpiryDateRequired && (
                    <Field name='documentExpiry'>
                        {({ field, form, meta }: FieldProps) => {
                            const hasError = meta.touched && !!meta.error;
                            const fieldLabel = `${fieldsConfig?.documentExpiry?.label}*`;
                            return (
                                <DatePicker
                                    {...field}
                                    aria-label={fieldLabel}
                                    autoComplete='off'
                                    className='w-full'
                                    errorMessage={meta.error}
                                    isInvalid={hasError}
                                    label={fieldLabel}
                                    onDateChange={(date: string | null) => {
                                        form.setFieldValue('documentExpiry', date);
                                    }}
                                />
                            );
                        }}
                    </Field>
                )}
            </div>
        </Fragment>
    );
};
