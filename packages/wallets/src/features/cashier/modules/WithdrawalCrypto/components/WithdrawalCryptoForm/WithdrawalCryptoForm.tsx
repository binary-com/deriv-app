import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { useGrowthbookIsOn } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { WalletTextField } from '../../../../../../components';
import { useWithdrawalCryptoContext } from '../../provider';
import { validateCryptoAddress } from '../../utils';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import { WithdrawalCryptoPercentageSelector } from './components/WithdrawalCryptoPercentageSelector';
import { WithdrawalCryptoPriority } from './components/WithdrawalCryptoPriority';
import './WithdrawalCryptoForm.scss';

const WithdrawalCryptoForm: React.FC = () => {
    const { activeWallet, cryptoEstimationsFeeUniqueId, fractionalDigits, requestCryptoWithdrawal } =
        useWithdrawalCryptoContext();
    const { localize } = useTranslations();

    const [isPriorityCryptoWithdrawalEnabled] = useGrowthbookIsOn({
        featureFlag: 'priority_crypto_withdrawal',
    });

    return (
        <Formik
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
                priorityWithdrawal: false,
            }}
            onSubmit={values =>
                requestCryptoWithdrawal({
                    address: values.cryptoAddress,
                    amount: parseFloat(parseFloat(values.cryptoAmount).toFixed(fractionalDigits.crypto)),
                    estimated_fee_unique_id: values.priorityWithdrawal ? cryptoEstimationsFeeUniqueId : undefined,
                })
            }
        >
            {({ errors, handleChange, handleSubmit, isSubmitting, setFieldTouched, setFieldValue, values }) => {
                return (
                    <form autoComplete='off' className='wallets-withdrawal-crypto-form' onSubmit={handleSubmit}>
                        <div className='wallets-withdrawal-crypto-address'>
                            <Field name='cryptoAddress' validate={validateCryptoAddress(localize)}>
                                {({ field, meta }: FieldProps<string>) => (
                                    <WalletTextField
                                        {...field}
                                        data-testid='dt_withdrawal_crypto_address_input'
                                        errorMessage={meta.touched && errors.cryptoAddress}
                                        isInvalid={meta.touched && Boolean(errors?.cryptoAddress)}
                                        label={localize('Your {{currencyName}} cryptocurrency wallet address', {
                                            currencyName: activeWallet?.currency_config?.name,
                                        })}
                                        onChange={event => {
                                            setFieldValue(field.name, event.target.value, true);
                                            setFieldTouched(field.name, true);
                                            handleChange(event);
                                        }}
                                        showMessage
                                    />
                                )}
                            </Field>
                        </div>
                        <WithdrawalCryptoPercentageSelector />
                        <WithdrawalCryptoAmountConverter />
                        {Boolean(isPriorityCryptoWithdrawalEnabled) && <WithdrawalCryptoPriority />}
                        <div className='wallets-withdrawal-crypto-form__submit'>
                            <Button
                                borderWidth='sm'
                                disabled={Object.keys(errors).length !== 0 || !values.cryptoAmount || isSubmitting}
                                isLoading={isSubmitting}
                                size='lg'
                                textSize='md'
                                type='submit'
                            >
                                <Localize i18n_default_text='Withdraw' />
                            </Button>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default WithdrawalCryptoForm;
