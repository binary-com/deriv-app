import React from 'react';
import classNames from 'classnames';
import { Field, Form, FormikValues } from 'formik';
import { Button, DesktopWrapper, Input, Loading, Text } from '@deriv/components';
import { isDesktop, isEmptyObject, isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import ModalForm from 'Components/modal-manager/modal-form';
import PageReturn from 'Components/page-return';
import { TPaymentMethod } from 'Types/my-profile.types';

const EditPaymentMethodForm = () => {
    const { general_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();
    const {
        initial_values,
        payment_method_to_edit,
        setPaymentMethodToEdit,
        setSelectedPaymentMethod,
        setSelectedPaymentMethodDisplayName,
        setShouldShowEditPaymentMethodForm,
        updatePaymentMethod,
        validatePaymentMethodFields,
    } = my_profile_store;

    type FieldsInitialValues = {
        [key: string]: TPaymentMethod;
    };

    const fields_initial_values: FieldsInitialValues = {};

    if (payment_method_to_edit.fields) {
        Object.keys(payment_method_to_edit.fields).forEach((key: string) => {
            fields_initial_values[key] = payment_method_to_edit.fields[key].value;
        });
    }

    React.useEffect(() => {
        return () => {
            setSelectedPaymentMethod('');
            setSelectedPaymentMethodDisplayName('');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isEmptyObject(payment_method_to_edit)) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <React.Fragment>
            <ModalForm
                enableReinitialize
                initialValues={initial_values}
                onSubmit={updatePaymentMethod}
                validate={validatePaymentMethodFields}
            >
                {({ dirty, handleChange, isSubmitting, errors }: FormikValues) => {
                    return (
                        <React.Fragment>
                            <DesktopWrapper>
                                <PageReturn
                                    onClick={() => {
                                        if (dirty) {
                                            showModal({
                                                key: 'CancelEditPaymentMethodModal',
                                            });
                                        } else {
                                            setShouldShowEditPaymentMethodForm(false);
                                        }
                                    }}
                                    page_title={localize('Edit payment method')}
                                />
                            </DesktopWrapper>
                            <Form className='edit-payment-method-form__form'>
                                <div className='edit-payment-method-form__form-wrapper'>
                                    <Field name='choose_payment_method'>
                                        {({ field }: FormikValues) => (
                                            <Input
                                                {...field}
                                                disabled
                                                label={
                                                    <Text color='prominent' size='xs'>
                                                        <Localize i18n_default_text='Choose your payment method' />
                                                    </Text>
                                                }
                                                required
                                                type='field'
                                                value={payment_method_to_edit.display_name}
                                            />
                                        )}
                                    </Field>
                                    {payment_method_to_edit.fields &&
                                        Object.keys(payment_method_to_edit.fields).map(payment_method_key => {
                                            const current_field = payment_method_to_edit.fields[payment_method_key];

                                            return (
                                                <Field
                                                    name={payment_method_key}
                                                    id={payment_method_key}
                                                    key={payment_method_key}
                                                >
                                                    {({ field }: FormikValues) => {
                                                        return (
                                                            <Input
                                                                {...field}
                                                                data-lpignore='true'
                                                                error={errors[payment_method_key]}
                                                                type={
                                                                    payment_method_key === 'instructions'
                                                                        ? 'textarea'
                                                                        : current_field.type
                                                                }
                                                                label={current_field.display_name}
                                                                className={classNames({
                                                                    'edit-payment-method-form__payment-method-field':
                                                                        !errors[payment_method_key]?.length,
                                                                    'edit-payment-method-form__payment-method-field--text-area':
                                                                        payment_method_key === 'instructions',
                                                                })}
                                                                onChange={handleChange}
                                                                name={payment_method_key}
                                                                required={!!current_field.required}
                                                            />
                                                        );
                                                    }}
                                                </Field>
                                            );
                                        })}
                                </div>
                                <div
                                    className={classNames('edit-payment-method-form__buttons', {
                                        'edit-payment-method-form__buttons--separated-footer':
                                            general_store.active_index === 3 && isMobile(),
                                        'edit-payment-method-form__buttons--separated-footer-profile':
                                            general_store.active_index === 3 && isDesktop(),
                                    })}
                                >
                                    <Button
                                        secondary
                                        large
                                        onClick={() => {
                                            if (dirty) {
                                                showModal({
                                                    key: 'CancelEditPaymentMethodModal',
                                                });
                                            } else {
                                                setPaymentMethodToEdit(null);
                                                setShouldShowEditPaymentMethodForm(false);
                                            }
                                        }}
                                        type='button'
                                    >
                                        <Localize i18n_default_text='Cancel' />
                                    </Button>
                                    <Button
                                        className='edit-payment-method-form__buttons--add'
                                        primary
                                        large
                                        is_disabled={isSubmitting || !dirty || !!Object.keys(errors)?.length}
                                    >
                                        <Localize i18n_default_text='Save changes' />
                                    </Button>
                                </div>
                            </Form>
                        </React.Fragment>
                    );
                }}
            </ModalForm>
        </React.Fragment>
    );
};

export default observer(EditPaymentMethodForm);
