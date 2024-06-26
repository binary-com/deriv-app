import { Button, Loading, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import React from 'react';
import { useSettings } from '@deriv/api';
import { OECD_TIN_FORMAT_URL } from '../../Constants/external-urls';
import FormFieldInfo from '../form-field-info';
import { FormInputField } from '../forms/form-fields';
import FormSelectField from '../forms/form-select-field';
import { getFormConfig } from './form-config';
import { TListItem } from 'Types';
import { useDevice } from '@deriv-com/ui';

const FormTitle = () => {
    const { isDesktop } = useDevice();
    return (
        <Text
            as='p'
            line_height='xxl'
            align={isDesktop ? 'center' : 'left'}
            className='additional-kyc-info-modal__form--header'
        >
            <Localize i18n_default_text='Please take a moment to update your information now.' />
        </Text>
    );
};

type TAdditionalKycInfoFormProps = {
    setError?: React.Dispatch<React.SetStateAction<unknown>>;
};

export const AdditionalKycInfoForm = observer(({ setError }: TAdditionalKycInfoFormProps) => {
    const { client, ui, notifications } = useStore();
    const { residence_list, updateAccountStatus } = client;
    const {
        update,
        mutation: { isLoading, error, status },
        data: account_settings,
        isLoading: isAccountSettingsLoading,
    } = useSettings();

    const { fields, initialValues, validate } = getFormConfig({
        account_settings,
        residence_list,
        required_fields: ['place_of_birth', 'account_opening_reason'],
    });

    const onSubmit = (values: typeof initialValues) => {
        const place_of_birth = residence_list?.find(item => item.text === values.place_of_birth)?.value;

        const payload: Record<string, string | undefined> = {
            place_of_birth,
            account_opening_reason: values.account_opening_reason,
        };

        if (values.tax_identification_number) {
            payload.tax_identification_number = values.tax_identification_number;
        }

        if (values.tax_residence) {
            const tax_residence = residence_list?.find(item => item.text === values.tax_residence)?.value;
            payload.tax_residence = tax_residence;
        }

        update(payload);
    };

    React.useEffect(() => {
        if (status === 'success') {
            updateAccountStatus();
            notifications.refreshNotifications();
            ui.toggleAdditionalKycInfoModal();
            ui.toggleKycInformationSubmittedModal();
        } else if (status === 'error') {
            setError?.(error);
        }
    }, [error, notifications, setError, status, ui, updateAccountStatus]);

    if (isAccountSettingsLoading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <Formik
            validateOnMount
            validateOnBlur
            validateOnChange
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
        >
            {({ isValid, setFieldValue }) => (
                <Form className='additional-kyc-info-modal__form-layout'>
                    {isLoading ? (
                        <Loading is_fullscreen={false} />
                    ) : (
                        <section className='additional-kyc-info-modal__form-layout--fields'>
                            <FormTitle />
                            <fieldset className='additional-kyc-info-modal__form-field'>
                                <FormSelectField {...fields.place_of_birth} />
                            </fieldset>
                            <fieldset
                                className={clsx(
                                    'additional-kyc-info-modal__form-field',
                                    'additional-kyc-info-modal__form-field--info'
                                )}
                            >
                                <FormSelectField {...fields.tax_residence} />
                                <FormFieldInfo
                                    message={
                                        <Localize i18n_default_text='The country in which you meet the criteria for paying taxes. Usually the country in which you physically reside.' />
                                    }
                                />
                            </fieldset>
                            <fieldset className='additional-kyc-info-modal__form-field--info'>
                                {/* @ts-expect-error Label type of Input field is string instead of ReactNode */}
                                <FormInputField
                                    {...fields.tax_identification_number}
                                    data_testId='dt_tax_identification_number'
                                />
                                <FormFieldInfo
                                    message={
                                        <Localize
                                            i18n_default_text="Don't know your tax identification number? <1 />Click <0>here</0> to learn more."
                                            components={[
                                                <a
                                                    key={0}
                                                    className='link'
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    href={OECD_TIN_FORMAT_URL}
                                                />,
                                                <br key={1} />,
                                            ]}
                                        />
                                    }
                                />
                            </fieldset>
                            <fieldset className='additional-kyc-info-modal__form-field'>
                                <FormSelectField
                                    onItemSelection={({ value = '' }: TListItem) => {
                                        setFieldValue('account_opening_reason', value, true);
                                    }}
                                    list_height='6rem'
                                    {...fields.account_opening_reason}
                                />
                            </fieldset>
                        </section>
                    )}
                    <Modal.Footer has_separator className='additional-kyc-info-modal__form-action'>
                        <Button large primary type='submit' disabled={!isValid || isLoading}>
                            <Localize i18n_default_text='Submit' />
                        </Button>
                    </Modal.Footer>
                </Form>
            )}
        </Formik>
    );
});

AdditionalKycInfoForm.displayName = 'AdditionalKycInfoForm';

export default AdditionalKycInfoForm;
