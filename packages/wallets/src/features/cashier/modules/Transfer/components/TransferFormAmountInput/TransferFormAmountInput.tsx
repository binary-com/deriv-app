import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFormikContext } from 'formik';
import { useDebounce } from 'usehooks-ts';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { ATMAmountInput, Timer } from '../../../../../../components';
import useInputDecimalFormatter from '../../../../../../hooks/useInputDecimalFormatter';
import { useTransfer } from '../../provider';
import type { TInitialTransferFormValues } from '../../types';
import './TransferFormAmountInput.scss';

type TProps = {
    fieldName: 'fromAmount' | 'toAmount';
};

const MAX_DIGITS = 12;
const USD_MAX_POSSIBLE_TRANSFER_AMOUNT = 100_000;
const DEBOUNCE_DELAY_MS = 500;

const TransferFormAmountInput: React.FC<TProps> = ({ fieldName }) => {
    const { setFieldValue, setValues, values } = useFormikContext<TInitialTransferFormValues>();
    const { fromAccount, fromAmount, toAccount, toAmount } = values;
    const { localize } = useTranslations();

    const { USDExchangeRates, activeWallet, activeWalletExchangeRates, refetchAccountLimits, refetchExchangeRates } =
        useTransfer();

    const refetchExchangeRatesAndLimits = useCallback(() => {
        refetchAccountLimits();
        const newRates = refetchExchangeRates();

        return newRates;
    }, [refetchAccountLimits, refetchExchangeRates]);

    const hasFunds = Number(fromAccount?.balance) > 0;
    const isFromAmountField = fieldName === 'fromAmount';
    const isSameCurrency = fromAccount?.currency === toAccount?.currency;
    const isAmountInputDisabled = !hasFunds || (fieldName === 'toAmount' && !toAccount);
    const isAmountFieldActive = fieldName === values.activeAmountFieldName;
    const isTimerVisible = !isFromAmountField && toAccount && !isSameCurrency && fromAmount > 0 && toAmount > 0;
    const prevTimerVisible = useRef(isTimerVisible);
    const isMaxBtnVisible = isFromAmountField && activeWallet?.account_type === 'crypto';

    const amountValue = isFromAmountField ? fromAmount : toAmount;
    const debouncedAmountValue = useDebounce(amountValue, DEBOUNCE_DELAY_MS);

    const toAmountLabel = isSameCurrency || !toAccount ? localize('Amount you receive') : localize('Estimated amount');
    const amountLabel = isFromAmountField ? localize('Amount you send') : toAmountLabel;

    const currency = isFromAmountField ? fromAccount?.currency : toAccount?.currency;
    const fractionDigits = isFromAmountField
        ? fromAccount?.currencyConfig?.fractional_digits
        : toAccount?.currencyConfig?.fractional_digits;

    const convertedMaxPossibleAmount = useMemo(
        () => USD_MAX_POSSIBLE_TRANSFER_AMOUNT * (USDExchangeRates?.rates?.[currency ?? 'USD'] ?? 1),
        [USDExchangeRates?.rates, currency]
    );
    const { value: formattedConvertedMaxPossibleAmount } = useInputDecimalFormatter(convertedMaxPossibleAmount, {
        fractionDigits,
    });
    const maxDigits = formattedConvertedMaxPossibleAmount.match(/\d/g)?.length ?? MAX_DIGITS;

    const amountConverterHandler = useCallback(
        (value: number) => {
            if (
                !toAccount?.currency ||
                !fromAccount?.currency ||
                !activeWalletExchangeRates?.rates ||
                !isAmountFieldActive
            )
                return;

            const fromRate = activeWalletExchangeRates.rates[fromAccount.currency];
            const toRate = activeWalletExchangeRates.rates[toAccount.currency];

            if (isFromAmountField) {
                const convertedToAmount = Number(
                    (toRate ? value * toRate : value / fromRate).toFixed(toAccount?.currencyConfig?.fractional_digits)
                );
                setFieldValue('toAmount', convertedToAmount);
            } else {
                const convertedFromAmount = Number(
                    (toRate ? value / toRate : value * fromRate).toFixed(fromAccount?.currencyConfig?.fractional_digits)
                );
                setFieldValue('fromAmount', convertedFromAmount);
            }
        },
        [
            activeWalletExchangeRates?.rates,
            fromAccount?.currency,
            fromAccount?.currencyConfig?.fractional_digits,
            isAmountFieldActive,
            isFromAmountField,
            setFieldValue,
            toAccount?.currency,
            toAccount?.currencyConfig?.fractional_digits,
        ]
    );

    // Refetch exchange rates and limits when the target account (toAccount) changes or the timer becomes visible
    useEffect(() => {
        const shouldRefetchExchangeRatesAndLimits =
            (!isSameCurrency && !isFromAmountField && toAccount?.currency && !prevTimerVisible.current) ||
            isTimerVisible;

        if (shouldRefetchExchangeRatesAndLimits) {
            refetchExchangeRatesAndLimits();
        }

        prevTimerVisible.current = isTimerVisible;
    }, [isFromAmountField, isSameCurrency, isTimerVisible, refetchExchangeRatesAndLimits, toAccount?.currency]);

    useEffect(() => {
        if (debouncedAmountValue && !isSameCurrency) {
            amountConverterHandler(debouncedAmountValue);
        }
    }, [amountConverterHandler, debouncedAmountValue, isSameCurrency]);

    const onBlurHandler = useCallback(() => {
        if (!isSameCurrency) {
            amountConverterHandler(amountValue);
        }
        setFieldValue('activeAmountFieldName', undefined);
    }, [amountConverterHandler, amountValue, isSameCurrency, setFieldValue]);

    const onChangeHandler = useCallback(
        (value: number) => {
            if (!isAmountFieldActive) return;

            if (isSameCurrency) {
                setValues(prev => ({ ...prev, fromAmount: value, toAmount: value }));
            } else {
                if (value === 0) {
                    setValues(prev => ({ ...prev, fromAmount: 0, toAmount: 0 }));
                    return;
                }
                setFieldValue(fieldName, value);
            }
        },
        [fieldName, isAmountFieldActive, isSameCurrency, setFieldValue, setValues]
    );

    const onTimerCompleteHandler = useCallback(() => {
        refetchExchangeRatesAndLimits().then(res => {
            const newRates = res.data?.exchange_rates;
            if (!newRates?.rates || !fromAccount?.currency || !toAccount?.currency) return;

            const fromRate = newRates.rates[fromAccount.currency];
            const toRate = newRates.rates[toAccount.currency];

            const convertedFromAmount = Number(
                (fromRate ? toAmount * fromRate : toAmount / toRate).toFixed(
                    fromAccount?.currencyConfig?.fractional_digits
                )
            );
            const convertedToAmount = Number(
                (toRate ? fromAmount * toRate : fromAmount / fromRate).toFixed(
                    toAccount?.currencyConfig?.fractional_digits
                )
            );

            // if focused into the receiving account amount field, change the other ("from") field value
            if (values.activeAmountFieldName === 'toAmount') {
                setFieldValue('fromAmount', convertedFromAmount);
            } else {
                setFieldValue('toAmount', convertedToAmount);
            }
        });
    }, [
        refetchExchangeRatesAndLimits,
        fromAccount?.currency,
        fromAccount?.currencyConfig?.fractional_digits,
        toAccount?.currency,
        toAccount?.currencyConfig?.fractional_digits,
        toAmount,
        fromAmount,
        values.activeAmountFieldName,
        setFieldValue,
    ]);

    const onMaxBtnClickHandler = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            const walletBalance = Number(fromAccount?.balance);
            e.preventDefault();
            await setFieldValue('activeAmountFieldName', 'fromAmount');
            setFieldValue('fromAmount', walletBalance);
        },
        [fromAccount?.balance, setFieldValue]
    );

    return (
        <div className='wallets-transfer-form-amount-input'>
            <ATMAmountInput
                currency={currency}
                disabled={isAmountInputDisabled}
                fractionDigits={fractionDigits}
                isError={values.isError}
                label={amountLabel}
                maxDigits={maxDigits}
                onBlur={onBlurHandler}
                onChange={onChangeHandler}
                onFocus={() => setFieldValue('activeAmountFieldName', fieldName)}
                value={amountValue}
            />
            {isTimerVisible && (
                <div className='wallets-transfer-form-amount-input__timer'>
                    <Timer onComplete={onTimerCompleteHandler} />
                </div>
            )}
            {isMaxBtnVisible && (
                <Button
                    className='wallets-transfer-form-amount-input__max-btn'
                    color='black'
                    disabled={!hasFunds}
                    onClick={onMaxBtnClickHandler}
                    size='sm'
                    variant='outlined'
                >
                    <Localize i18n_default_text='Max' />
                </Button>
            )}
        </div>
    );
};

export default TransferFormAmountInput;
