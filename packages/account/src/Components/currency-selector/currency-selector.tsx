import React from 'react';
import clsx from 'clsx';
import { Field, Formik, FormikHandlers, FormikState } from 'formik';
import { AutoHeightWrapper, FormSubmitButton, Div100vhContainer, Modal, ThemedScrollbars } from '@deriv/components';
import { reorderCurrencies, getAddressDetailsFields, CURRENCY_TYPE } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import RadioButton from './radio-button';
import RadioButtonGroup from './radio-button-group';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';
import { useDevice } from '@deriv-com/ui';

export const Hr = () => <div className='currency-hr' />;

export type TCurrencySelectorFormProps = {
    currency: string;
};

type TCurrencySelectorExtend = {
    getCurrentStep: () => number;
    goToNextStep: () => void;
    goToStep: (step: number) => void;
    goToPreviousStep: () => void;
    has_cancel: boolean;
    has_wallet_account: boolean;
    is_virtual: boolean;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSave: (current_step: number, values: TCurrencySelectorFormProps) => void;
    onSubmit: (
        current_step: number | null,
        values: TCurrencySelectorFormProps,
        action: (isSubmitting: boolean) => void,
        next_step: () => void
    ) => void;
    set_currency: boolean;
    validate: (values: TCurrencySelectorFormProps) => TCurrencySelectorFormProps;
    value: TCurrencySelectorFormProps;
};

type TCurrencySelector = React.HTMLAttributes<HTMLInputElement | HTMLLabelElement> & TCurrencySelectorExtend;

/**
 * Currency selector component to select the Account currency
 * @name CurrencySelector
 * @param getCurrentStep - Get the current step
 * @param goToNextStep - Go to the next step
 * @param goToStep - Go to a specific step
 * @param goToPreviousStep - Go to the previous step
 * @param has_cancel - Has cancel button
 * @param has_wallet_account - Has wallet account
 * @param is_virtual - Is virtual account
 * @param onCancel - To handle click on cancel button
 * @param onSave - To handle click on save button
 * @param onSubmit - To handle click on submit button
 * @param set_currency - Is current set
 * @param alidate - To validate the form
 * @param alue - Value of the form
 * @returns React node
 */
const CurrencySelector = observer(
    ({
        getCurrentStep,
        goToNextStep,
        goToStep,
        onSubmit,
        onSave,
        onCancel,
        goToPreviousStep,
        set_currency,
        validate,
        has_cancel = false,
        has_wallet_account,
        value,
    }: TCurrencySelector) => {
        const { client, ui } = useStore();

        const {
            currency,
            has_active_real_account: has_real_account,
            upgradeable_currencies: legal_allowed_currencies,
            available_crypto_currencies,
            has_fiat,
            accounts,
        } = client;

        const has_currency = Boolean(currency);

        const { real_account_signup, real_account_signup_target, resetRealAccountSignupParams } = ui;
        const { isMobile, isDesktop } = useDevice();

        // Wrapped with String() to avoid type mismatch
        const crypto = legal_allowed_currencies.filter(
            selected_currency => String(selected_currency.type) === CURRENCY_TYPE.CRYPTO
        );

        // Wrapped with String() to avoid type mismatch
        const fiat = legal_allowed_currencies.filter(
            selected_currency => String(selected_currency.type) === CURRENCY_TYPE.FIAT
        );
        const [is_bypass_step, setIsBypassStep] = React.useState<boolean>(false);

        const should_disable_fiat = !!Object.values(accounts).filter(
            item => item.landing_company_shortcode === real_account_signup_target
        ).length;

        const handleCancel = (values: TCurrencySelectorFormProps) => {
            const current_step = getCurrentStep() - 1;
            onSave(current_step, values);
            onCancel(current_step, goToPreviousStep);
        };

        const handleValidate = (values: TCurrencySelectorFormProps) => {
            const current_step = (getCurrentStep?.() || 1) - 1;
            onSave(current_step, values);

            const { errors } = splitValidationResultTypes(validate(values));
            return errors;
        };

        // In case of form error bypass to update personal data
        React.useEffect(() => {
            if (real_account_signup?.error_code) {
                setIsBypassStep(true);
            }
        }, [real_account_signup?.error_code]);

        React.useEffect(() => {
            if (is_bypass_step && real_account_signup?.error_details) {
                const keys = Object.keys(real_account_signup?.error_details);
                const route_to_address_details = Object.keys(getAddressDetailsFields()).filter(item =>
                    keys.includes(item)
                );
                if (route_to_address_details?.length > 0) {
                    goToStep(3);
                } else {
                    goToNextStep();
                }
                resetRealAccountSignupParams();
                setIsBypassStep(false);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [is_bypass_step]);

        const getHeightOffset = () => {
            if (!has_currency && has_real_account) {
                return '89px';
            }
            return '159px';
        };

        const getSubmitLabel = () => {
            if (set_currency) {
                return localize('Set currency');
            } else if (has_wallet_account) {
                return localize('Finish');
            }
            return localize('Next');
        };

        return (
            <Formik
                initialValues={value}
                onSubmit={(values, actions) => {
                    onSubmit(getCurrentStep ? getCurrentStep() - 1 : null, values, actions.setSubmitting, goToNextStep);
                }}
                validate={handleValidate}
            >
                {({ handleSubmit, values }: FormikState<TCurrencySelectorFormProps> & FormikHandlers) => (
                    <AutoHeightWrapper default_height={450}>
                        {({
                            setRef,
                            height,
                        }: {
                            setRef: (instance: HTMLFormElement | null) => void;
                            height: number;
                        }) => (
                            <form
                                ref={setRef}
                                onSubmit={handleSubmit}
                                className='currency-selector'
                                data-testid='currency_selector_form'
                            >
                                <Div100vhContainer
                                    className={clsx('currency-selector__container', {
                                        'currency-selector__container--no-top-margin':
                                            !has_currency && has_real_account && isMobile,
                                    })}
                                    height_offset={getHeightOffset()}
                                    is_disabled={isDesktop}
                                >
                                    <ThemedScrollbars height={height}>
                                        {!!fiat?.length && (
                                            <React.Fragment>
                                                <RadioButtonGroup
                                                    className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                                    is_fiat
                                                    item_count={fiat.length}
                                                >
                                                    {reorderCurrencies(fiat as keyof typeof reorderCurrencies).map(
                                                        avbl_currency => (
                                                            <Field
                                                                key={avbl_currency.value}
                                                                component={RadioButton}
                                                                name='currency'
                                                                id={avbl_currency.value}
                                                                label={avbl_currency.name}
                                                                selected={should_disable_fiat && has_fiat}
                                                            />
                                                        )
                                                    )}
                                                </RadioButtonGroup>
                                                {!!reorderCurrencies(crypto as keyof typeof reorderCurrencies, 'crypto')
                                                    ?.length && <Hr />}
                                            </React.Fragment>
                                        )}
                                        {!!reorderCurrencies(crypto as keyof typeof reorderCurrencies, 'crypto')
                                            ?.length && (
                                            <React.Fragment>
                                                <RadioButtonGroup
                                                    is_title_enabled={false}
                                                    className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                                    item_count={
                                                        reorderCurrencies(
                                                            crypto as keyof typeof reorderCurrencies,
                                                            'crypto'
                                                        ).length
                                                    }
                                                >
                                                    {reorderCurrencies(
                                                        crypto as keyof typeof reorderCurrencies,
                                                        'crypto'
                                                    ).map(avbl_currency => (
                                                        <Field
                                                            key={avbl_currency.value}
                                                            component={RadioButton}
                                                            selected={
                                                                available_crypto_currencies?.filter(
                                                                    crypto_data =>
                                                                        crypto_data.value === avbl_currency.value
                                                                )?.length === 0
                                                            }
                                                            name='currency'
                                                            id={avbl_currency.value}
                                                            label={avbl_currency.name}
                                                        />
                                                    ))}
                                                </RadioButtonGroup>
                                            </React.Fragment>
                                        )}
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={isMobile}>
                                    <FormSubmitButton
                                        className={
                                            set_currency
                                                ? 'currency-selector--set-currency'
                                                : 'currency-selector--deriv-account'
                                        }
                                        is_disabled={!values.currency}
                                        is_center={false}
                                        is_absolute={set_currency}
                                        label={getSubmitLabel()}
                                        {...(has_cancel
                                            ? {
                                                  cancel_label: localize('Previous'),
                                                  has_cancel: true,
                                                  onCancel: () => handleCancel(values),
                                              }
                                            : {})}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
);

export default CurrencySelector;
