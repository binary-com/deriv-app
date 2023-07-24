import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { Button, Input, Loading, Text, InlineMessage } from '@deriv/components';
import { CryptoConfig, getCurrencyName, isCryptocurrency } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { useCurrentAccountDetails } from '@deriv/hooks';
import CryptoFiatConverter from '../../../components/crypto-fiat-converter';
import PercentageSelector from '../../../components/percentage-selector';
import RecentTransaction from '../../../components/recent-transaction';
import { TReactChangeEvent } from '../../../types';
import { useCashierStore } from '../../../stores/useCashierStores';
import './crypto-withdraw-form.scss';

type THeaderProps = {
    currency: string;
};

type TFormValues = {
    address: string;
};

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;
const DEFAULT_FIAT_CURRENCY = 'USD';

const Header = ({ currency }: THeaderProps) => {
    const currency_name = getCurrencyName(currency);
    const currency_display_code = CryptoConfig.get()[currency].display_code;

    return (
        <Text as='h2' color='prominent' weight='bold' align='left'>
            <Localize
                i18n_default_text='Withdraw {{currency}} ({{currency_symbol}}) to your wallet'
                values={{
                    currency: currency_name,
                    currency_symbol: currency_display_code,
                }}
            />
        </Text>
    );
};

const CryptoWithdrawForm = observer(({ is_wallet }: { is_wallet?: boolean }) => {
    const { client } = useStore();
    const {
        balance,
        currency,
        current_fiat_currency,
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { crypto_fiat_converter, general_store, transaction_history, withdraw } = useCashierStore();
    const crypto_currency = currency;
    const {
        blockchain_address,
        onMountCryptoWithdraw: onMountWithdraw,
        requestWithdraw,
        setBlockchainAddress,
        setWithdrawPercentageSelectorResult,
        validateWithdrawFromAmount,
        validateWithdrawToAmount,
        resetWithdrawForm,
    } = withdraw;
    const {
        converter_from_error,
        converter_to_error,
        onChangeConverterFromAmount,
        onChangeConverterToAmount,
        resetConverter,
    } = crypto_fiat_converter;
    const { is_loading, percentage, percentageSelectorSelectionStatus, should_percentage_reset } = general_store;
    const { onMount: recentTransactionOnMount } = transaction_history;

    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    React.useEffect(() => {
        onMountWithdraw(verification_code);

        return () => {
            percentageSelectorSelectionStatus(false);
            resetWithdrawForm();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Messages = () => {
        return (
            <ul>
                <li>
                    <Localize i18n_default_text='Do not enter an address linked to an initial coin offering (ICO) purchase or crowdsale. If you do, the initial coin offering (ICO) tokens will not be credited into your account.' />
                </li>
                <li>
                    <Localize i18n_default_text='Please note that your maximum and minimum withdrawal limits aren’t fixed. They change due to the high volatility of cryptocurrency.' />
                </li>
            </ul>
        );
    };

    const validateAddress = (address: string): string | undefined => {
        if (!address) return localize('This field is required.');

        if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
            return localize('Your wallet address should have 25 to 64 characters.');
        }

        return undefined;
    };

    if (is_loading) return <Loading />;

    return (
        <div className='cashier__wrapper crypto-withdraw-form__container' data-testid='dt_crypto_withdraw_form'>
            <div
                className={classNames('crypto-withdraw-form__form', {
                    'crypto-withdraw-form__form--cashier': !is_wallet,
                })}
            >
                <Header currency={currency} />
                <div className='crypto-withdraw-form__messages'>
                    <InlineMessage message={<Messages />} type='warning' />
                </div>
                <Formik
                    initialValues={{
                        address: '',
                    }}
                    onSubmit={() => requestWithdraw(verification_code)}
                >
                    {({
                        errors,
                        isSubmitting,
                        touched,
                        setFieldTouched,
                        handleChange,
                        handleSubmit,
                        values,
                    }: FormikProps<TFormValues>) => (
                        <form className='crypto-withdraw-form' onSubmit={handleSubmit} autoComplete='off'>
                            <Field name='address' validate={validateAddress}>
                                {({ field }: FieldProps<string, TFormValues>) => (
                                    <Input
                                        {...field}
                                        onChange={(e: TReactChangeEvent) => {
                                            handleChange(e);
                                            setBlockchainAddress(e.target.value);
                                            setFieldTouched('address', true, false);
                                        }}
                                        className='cashier__input withdraw__input'
                                        data-testid='dt_address_input'
                                        type='text'
                                        label={
                                            <Localize
                                                i18n_default_text='Your {{currency_symbol}} wallet address'
                                                values={{
                                                    currency_symbol: currency?.toUpperCase(),
                                                }}
                                            />
                                        }
                                        error={touched.address ? errors.address : ''}
                                        required
                                        autoComplete='off'
                                    />
                                )}
                            </Field>
                            <div className='crypto-withdraw-form__percentage-container'>
                                <div className='crypto-withdraw-form__percentage-selector'>
                                    <PercentageSelector
                                        amount={Number(balance)}
                                        getCalculatedAmount={setWithdrawPercentageSelectorResult}
                                        percentage={percentage}
                                        should_percentage_reset={should_percentage_reset}
                                        from_currency={crypto_currency}
                                        to_currency={current_fiat_currency || DEFAULT_FIAT_CURRENCY}
                                    />
                                </div>
                                <CryptoFiatConverter
                                    from_currency={crypto_currency}
                                    onChangeConverterFromAmount={onChangeConverterFromAmount}
                                    onChangeConverterToAmount={onChangeConverterToAmount}
                                    resetConverter={resetConverter}
                                    to_currency={current_fiat_currency || DEFAULT_FIAT_CURRENCY}
                                    validateFromAmount={validateWithdrawFromAmount}
                                    validateToAmount={validateWithdrawToAmount}
                                />
                                <div className='crypto-withdraw-form__submit'>
                                    <Button
                                        is_disabled={
                                            !!validateAddress(values.address) ||
                                            !!converter_from_error ||
                                            !!converter_to_error ||
                                            isSubmitting ||
                                            !blockchain_address
                                        }
                                        type='submit'
                                        primary
                                        large
                                    >
                                        <Localize i18n_default_text='Withdraw' />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>

            {is_wallet && isCryptocurrency(currency) && <RecentTransaction is_wallet={is_wallet} />}
        </div>
    );
});

export default CryptoWithdrawForm;
