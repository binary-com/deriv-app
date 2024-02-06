import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Field, FieldProps } from 'formik';
import { Input, useDevice } from '@deriv-com/ui';
import { WalletDatePicker } from '../../components/base/WalletDatePicker';
import { WalletText } from '../../components/base/WalletText';
import { TManualDocumentTypes } from '../../constants/manualFormConstants';
import { useManualForm } from '../../hooks';
import { getFieldsConfig, getTitleForFormInputs } from '../../utils/manualFormUtils';

type TManualFormInputsProps = { selectedDocument: TManualDocumentTypes };

export const ManualFormInputs = ({ selectedDocument }: TManualFormInputsProps) => {
    const fieldsConfig = getFieldsConfig(selectedDocument);
    const { isExpiryDateRequired } = useManualForm();
    const { isDesktop } = useDevice();

    return (
        <Fragment>
            <WalletText>{getTitleForFormInputs(selectedDocument)}</WalletText>
            <div
                className={classNames('gap-1200', {
                    'flex flex-col': !isDesktop,
                    'grid grid-cols-2': isDesktop,
                })}
            >
                <Field name='document_number'>
                    {({ field, meta }: FieldProps) => {
                        const hasError = meta.touched && !!meta.error;
                        const fieldLabel = `${fieldsConfig.documentNumber.label}*`;
                        return (
                            <Input
                                {...field}
                                aria-label={fieldLabel}
                                error={hasError}
                                label={fieldLabel}
                                message={hasError ? meta.error : ''}
                            />
                        );
                    }}
                </Field>
                {isExpiryDateRequired && (
                    <Field name='document_expiry'>
                        {({ field, form, meta }: FieldProps) => (
                            <WalletDatePicker
                                {...field}
                                errorMessage={meta.error}
                                isInvalid={(meta.touched && !!meta.error) || !!form.errors.document_expiry}
                                label={`${fieldsConfig.documentExpiry.label}*`}
                                onDateChange={(date: string | null) => {
                                    form.setFieldValue('document_expiry', date);
                                }}
                            />
                        )}
                    </Field>
                )}
            </div>
        </Fragment>
    );
};
