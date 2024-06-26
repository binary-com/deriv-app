/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors

import React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import DocumentUploader from '@binary-com/binary-document-uploader';
import { Button } from '@deriv/components';
import { readFiles, WS, UPLOAD_FILE_TYPE } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import FormBody from '../../../Components/form-body';
import FormSubHeader from '../../../Components/form-sub-header';
import FormBodySection from '../../../Components/form-body-section';
import Card from '../../../Containers/proof-of-ownership/card';
import {
    TPaymentMethod,
    TPaymentMethodInfo,
    TProofOfOwnershipData,
    TProofOfOwnershipErrors,
    TProofOfOwnershipFormValue,
} from '../../../Types';
import { isValidPaymentMethodIdentifier, isValidFile } from './validation';
import { API_ERROR_CODES } from 'Constants/api-error-codes';

type TProofOfOwnershipFormProps = {
    grouped_payment_method_data: Partial<Record<TPaymentMethod, TPaymentMethodInfo>>;
};

const ProofOfOwnershipForm = observer(({ grouped_payment_method_data }: TProofOfOwnershipFormProps) => {
    const { client, notifications } = useStore();
    const { refreshNotifications } = notifications;
    const { email: client_email, updateAccountStatus } = client;
    const { isDesktop } = useDevice();

    const grouped_payment_method_data_keys = Object.keys(grouped_payment_method_data) as Array<TPaymentMethod>;

    const fileReadErrorMessage = (filename: string) => {
        return localize('Unable to read file {{name}}', { name: filename });
    };

    const getScrollOffset = React.useCallback(
        (items_count = 0) => {
            if (!isDesktop) return '20rem';
            if (items_count <= 2) return '0rem';
            return '8rem';
        },
        [isDesktop]
    );

    const initial_values = React.useMemo(() => {
        if (!grouped_payment_method_data_keys?.length) {
            return {};
        }
        const default_value: TProofOfOwnershipData = {
            documents_required: 0,
            id: 0,
            identifier_type: '',
            is_generic_pm: false,
            payment_method_identifier: '',
            files: [],
        };
        const form_value = grouped_payment_method_data_keys.reduce<Partial<TProofOfOwnershipFormValue>>(
            (acc, payment_method) => {
                const documents_required = grouped_payment_method_data[payment_method]?.documents_required;
                const is_generic_pm = grouped_payment_method_data[payment_method]?.is_generic_pm;
                const items = grouped_payment_method_data[payment_method]?.items;
                const identifier_type = grouped_payment_method_data[payment_method]?.identifier_type;
                acc[payment_method] = {};
                items?.forEach(item => {
                    acc[payment_method][item.id] = {
                        ...default_value,
                        id: item.id,
                        documents_required: documents_required ?? 0,
                        is_generic_pm: is_generic_pm ?? false,
                        identifier_type: identifier_type ?? '',
                    };
                });

                return acc;
            },
            {}
        );

        return form_value;
    }, [grouped_payment_method_data_keys, grouped_payment_method_data]);

    const validateFields = (values: TProofOfOwnershipFormValue) => {
        let errors = {} as TProofOfOwnershipErrors;

        Object.keys(values).forEach(card_key => {
            const card_data = values[card_key as TPaymentMethod];
            Object.keys(card_data)?.forEach(payment_id => {
                const payment_method_data = card_data[payment_id];
                const is_payment_method_identifier_provided =
                    payment_method_data?.is_generic_pm ||
                    !!payment_method_data?.payment_method_identifier.trim()?.length;
                const are_files_uploaded =
                    payment_method_data?.files?.filter(file => file?.name).length ===
                    payment_method_data?.documents_required;
                if (are_files_uploaded && !is_payment_method_identifier_provided) {
                    errors = {
                        ...errors,
                        [card_key]: { ...(errors[card_key as TPaymentMethod] ?? {}) },
                    };
                    errors[card_key as TPaymentMethod] = {
                        ...errors[card_key as TPaymentMethod],
                        [payment_id]: {
                            ...(errors[card_key as TPaymentMethod]?.[payment_id] ?? {}),
                            payment_method_identifier: localize('Please complete this field.'),
                        },
                    };
                } else {
                    delete errors[card_key as TPaymentMethod]?.[payment_id]?.payment_method_identifier;
                }
                if (is_payment_method_identifier_provided) {
                    const verify_payment_method_identifier = isValidPaymentMethodIdentifier(
                        payment_method_data.payment_method_identifier.trim(),
                        payment_method_data.identifier_type
                    );
                    if (verify_payment_method_identifier) {
                        errors = {
                            ...errors,
                            [card_key]: { ...(errors[card_key as TPaymentMethod] ?? {}) },
                        };
                        errors[card_key as TPaymentMethod] = {
                            ...errors[card_key as TPaymentMethod],
                            [payment_id]: {
                                ...(errors[card_key as TPaymentMethod]?.[payment_id] ?? {}),
                                payment_method_identifier: verify_payment_method_identifier,
                            },
                        };
                    } else {
                        delete errors[card_key as TPaymentMethod]?.[payment_id]?.payment_method_identifier;
                    }
                    if (!are_files_uploaded) {
                        errors = {
                            ...errors,
                            [card_key]: { ...(errors[card_key as TPaymentMethod] ?? {}) },
                        };
                        errors[card_key as TPaymentMethod] = {
                            ...errors[card_key as TPaymentMethod],
                            [payment_id]: {
                                ...(errors[card_key as TPaymentMethod]?.[payment_id] ?? {}),
                                files: {},
                            },
                        };
                    }
                }
                payment_method_data?.files?.forEach((file, i) => {
                    if (!file?.name) {
                        return;
                    }
                    const verify_file = isValidFile(file);
                    if (verify_file) {
                        errors = {
                            ...errors,
                            [card_key]: { ...(errors[card_key as TPaymentMethod] ?? {}) },
                        };
                        errors[card_key as TPaymentMethod] = {
                            ...errors[card_key as TPaymentMethod],
                            [payment_id]: {
                                ...(errors[card_key as TPaymentMethod]?.[payment_id] ?? {}),
                                files: {
                                    ...errors[card_key as TPaymentMethod]?.[payment_id]?.files,
                                    [i]: verify_file,
                                },
                            },
                        };
                    } else {
                        delete errors?.[card_key as TPaymentMethod]?.[payment_id]?.files?.[i];
                    }
                });
            });
        });
        return errors;
    };

    const handleFormSubmit = async (
        values: Partial<TProofOfOwnershipFormValue>,
        action: FormikHelpers<Partial<TProofOfOwnershipFormValue>>
    ) => {
        const { setFieldError, setSubmitting } = action;
        try {
            const uploader = new DocumentUploader({ connection: WS.getSocket() });
            setSubmitting(true);
            await Object.keys(values).reduce(async (promise, card_key) => {
                await promise;
                const payment_method_details = values[card_key];
                await Object.keys(payment_method_details)?.reduce(async (promise, payment_id) => {
                    await promise;
                    const payment_method_detail = payment_method_details[payment_id];
                    if (payment_method_detail?.files?.length) {
                        const processed_files = await readFiles(payment_method_detail.files, fileReadErrorMessage, {
                            document_type: UPLOAD_FILE_TYPE.proof_of_ownership,
                            proof_of_ownership: {
                                details: {
                                    email: client_email,
                                    payment_identifier: payment_method_detail.payment_method_identifier,
                                },
                                id: payment_method_detail.id,
                            },
                        });
                        await processed_files.reduce(async (promise, processed_file, index) => {
                            await promise;
                            const response = await uploader.upload(processed_file);
                            const upload_error: Array<string> = [];
                            if (response?.warning) {
                                if (
                                    response?.warning?.trim() === API_ERROR_CODES.DUPLICATE_DOCUMENT &&
                                    response?.message
                                ) {
                                    upload_error[index] = response?.message;
                                    const error_obj = {
                                        [payment_id]: {
                                            files: upload_error,
                                        },
                                    };
                                    // @ts-expect-error Error is an array
                                    setFieldError(card_key, { ...error_obj });
                                }
                            } else {
                                updateAccountStatus();
                                refreshNotifications();
                            }
                        }, Promise.resolve());
                    }
                }, Promise.resolve());
            }, Promise.resolve());
        } catch (err) {
            console.warn(err); // eslint-disable-line no-console
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik initialValues={initial_values} validate={validateFields} onSubmit={handleFormSubmit}>
            {({ isValid, dirty, isSubmitting }) => (
                <Form data-testid='dt_poo_form' className='proof-of-ownership'>
                    <FormBody scroll_offset={getScrollOffset(grouped_payment_method_data_keys.length)}>
                        <FormSubHeader title={localize('Please upload the following document(s).')} />
                        <FormBodySection>
                            <fieldset>
                                {grouped_payment_method_data_keys?.map((grouped_payment_method_data_key, index) => (
                                    <div
                                        className='proof-of-ownership__form-content'
                                        key={grouped_payment_method_data_key}
                                    >
                                        {grouped_payment_method_data_keys.length > 1 && (
                                            <div className='proof-of-ownership__progress'>
                                                <div className='proof-of-ownership__progress-number'>{index + 1}</div>
                                                {index !== grouped_payment_method_data_keys.length - 1 && (
                                                    <div className='proof-of-ownership__progress-bar' />
                                                )}
                                            </div>
                                        )}
                                        <Card
                                            details={
                                                grouped_payment_method_data[
                                                    grouped_payment_method_data_key
                                                ] as TPaymentMethodInfo
                                            }
                                        />
                                    </div>
                                ))}
                            </fieldset>
                        </FormBodySection>
                    </FormBody>
                    <FormFooter>
                        <Button
                            type='submit'
                            className='account-form__footer-btn'
                            is_disabled={!dirty || !isValid}
                            has_effect
                            large
                            primary
                            is_loading={isSubmitting}
                        >
                            <Localize i18n_default_text='Submit' />
                        </Button>
                    </FormFooter>
                </Form>
            )}
        </Formik>
    );
});

ProofOfOwnershipForm.displayName = 'ProofOfOwnershipForm';

export default ProofOfOwnershipForm;
