import React from 'react';
import classNames from 'classnames';
import { Field, Form, FormikBag, FormikValues } from 'formik';
import { Button, Icon, Input, Loading, Text } from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { useDevice } from '@deriv-com/ui';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import ModalForm from 'Components/modal-manager/modal-form';
import { TPaymentMethodFieldMapProps, TPaymentMethodValues } from 'Types/my-profile.types';

type TAddPaymentMethodFormProps = {
    should_show_separated_footer?: boolean;
};

const AddPaymentMethodForm = ({ should_show_separated_footer = false }: TAddPaymentMethodFormProps) => {
    const { hideModal, isCurrentModal, modal, showModal } = useModalManagerContext();
    const { create, mutation } = useP2PAdvertiserPaymentMethods();
    const { general_store, my_ads_store, my_profile_store } = useStores();
    const { isDesktop } = useDevice();

    const {
        payment_method_value,
        selected_payment_method,
        selected_payment_method_display_name,
        selected_payment_method_fields,
    } = my_profile_store;
    const { error: mutation_error, status: mutation_status } = mutation;

    React.useEffect(() => {
        my_profile_store.getPaymentMethodsList();
        my_profile_store.getSelectedPaymentMethodDetails();
        my_profile_store.setAddPaymentMethodErrorMessage('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (mutation_status === 'success') {
            my_profile_store.setShouldShowAddPaymentMethodForm(false);
            my_profile_store.setSelectedPaymentMethod('');

            if (isCurrentModal('CreateAdAddPaymentMethodModal')) {
                hideModal();
            }

            if (my_ads_store.should_show_add_payment_method) {
                my_ads_store.setShouldShowAddPaymentMethod(false);
            }
        } else if (mutation_status === 'error') {
            my_profile_store.setAddPaymentMethodErrorMessage(mutation_error.message);
            showModal({
                key: 'AddPaymentMethodErrorModal',
                props: {},
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mutation_error, mutation_status]);

    const createPaymentMethod = async (
        values: TPaymentMethodValues,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { setSubmitting }: FormikBag<any, TPaymentMethodValues>
    ) => {
        await create({ ...values, method: payment_method_value || selected_payment_method });

        setSubmitting(false);
    };

    if (!selected_payment_method_display_name && selected_payment_method_fields.length === 0) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <ModalForm
            enableReinitialize
            initialValues={my_profile_store.initial_values}
            onSubmit={createPaymentMethod}
            validate={my_profile_store.validatePaymentMethodFields}
        >
            {({ dirty, handleChange, isSubmitting, errors, touched }: FormikValues) => {
                return (
                    <Form className='add-payment-method-form__form' noValidate>
                        <div className='add-payment-method-form__form-wrapper'>
                            <Field name='choose_payment_method'>
                                {({ field }: FormikValues) => (
                                    <Input
                                        {...field}
                                        disabled
                                        field_className='add-payment-method-form__field'
                                        label={
                                            <Text color='prominent' size='xs'>
                                                <Localize i18n_default_text='Choose your payment method' />
                                            </Text>
                                        }
                                        required
                                        trailing_icon={
                                            <Icon
                                                className='add-payment-method-form__cross-icon'
                                                color='secondary'
                                                data_testid='dt_add_payment_method_form_cross_icon'
                                                icon='IcCloseCircle'
                                                onClick={() => my_profile_store.setSelectedPaymentMethod('')}
                                            />
                                        }
                                        type='field'
                                        value={selected_payment_method_display_name}
                                    />
                                )}
                            </Field>
                            {selected_payment_method_fields?.map(
                                (payment_method_field: TPaymentMethodFieldMapProps, key: number) => (
                                    <Field
                                        name={payment_method_field[0]}
                                        id={payment_method_field[0]}
                                        key={`${key}__${payment_method_field[0]}`}
                                    >
                                        {({ field }: FormikValues) => (
                                            <Input
                                                {...field}
                                                className={classNames({
                                                    'add-payment-method-form__payment-method-field':
                                                        !errors[payment_method_field[0]]?.length,
                                                    'add-payment-method-form__payment-method-field--text-area':
                                                        payment_method_field[0] === 'instructions',
                                                })}
                                                data-lpignore='true'
                                                error={
                                                    touched[payment_method_field[0]] && errors[payment_method_field[0]]
                                                }
                                                label={payment_method_field[1].display_name}
                                                name={payment_method_field[0]}
                                                onChange={handleChange}
                                                required={!!payment_method_field[1].required}
                                                type={
                                                    payment_method_field[0] === 'instructions'
                                                        ? 'textarea'
                                                        : payment_method_field[1].type
                                                }
                                                value={field.value || ''}
                                            />
                                        )}
                                    </Field>
                                )
                            )}
                        </div>
                        <div
                            className={classNames('add-payment-method-form__buttons', {
                                'add-payment-method-form__buttons--separated-footer':
                                    (should_show_separated_footer && !isDesktop) || general_store.active_index !== 3,
                                'add-payment-method-form__buttons--separated-footer-profile':
                                    general_store.active_index === 3 && isDesktop,
                            })}
                        >
                            <Button
                                large
                                onClick={() => {
                                    if (dirty || !!my_profile_store.selected_payment_method) {
                                        showModal({
                                            key: 'CancelAddPaymentMethodModal',
                                            props: {},
                                        });
                                    } else {
                                        my_profile_store.hideAddPaymentMethodForm();
                                        // fixes an issue where in buy-sell-modal mobile, on clicking Cancel button without modifying form it just closes the buy sell modal as
                                        if (modal.key !== 'BuySellModal') {
                                            hideModal();
                                        }
                                    }
                                }}
                                secondary
                                type='button'
                            >
                                <Localize i18n_default_text='Cancel' />
                            </Button>
                            <Button
                                className='add-payment-method-form__buttons--add'
                                is_disabled={isSubmitting || !dirty || !!Object.keys(errors)?.length}
                                large
                                primary
                            >
                                <Localize i18n_default_text='Add' />
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </ModalForm>
    );
};

export default observer(AddPaymentMethodForm);
