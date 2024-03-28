/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Control, Controller, FieldValues, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { TAdvertType, THooks } from 'types';
import { BASE_URL, BUY_SELL, RATE_TYPE, VALID_SYMBOLS_PATTERN } from '@/constants';
import {
    getPaymentMethodObjects,
    getTextFieldError,
    removeTrailingZeros,
    roundOffDecimal,
    setDecimalPlaces,
} from '@/utils';
import { p2p } from '@deriv/api-v2';
import { InlineMessage, Text, TextArea, useDevice } from '@deriv-com/ui';
import { LightDivider } from '../LightDivider';
import { BuySellAmount } from './BuySellAmount';
import { BuySellData } from './BuySellData';
import BuySellFormDisplayWrapper from './BuySellFormDisplayWrapper';
import { BuySellPaymentSection } from './BuySellPaymentSection';
import './BuySellForm.scss';

type TPayload = Omit<Parameters<ReturnType<typeof p2p.order.useCreate>['mutate']>[0], 'payment_method_ids'> & {
    payment_method_ids?: number[];
};

type TBuySellFormProps = {
    advert: TAdvertType;
    advertiserBuyLimit: number;
    advertiserPaymentMethods: THooks.AdvertiserPaymentMethods.Get;
    advertiserSellLimit: number;
    balanceAvailable: number;
    displayEffectiveRate: string;
    effectiveRate: number;
    isModalOpen: boolean;
    onRequestClose: () => void;
    paymentMethods: THooks.PaymentMethods.Get;
};

const getAdvertiserMaxLimit = (
    isBuy: boolean,
    advertiserBuyLimit: number,
    advertiserSellLimit: number,
    maxOrderAmountLimitDisplay: string
) => {
    if (isBuy) {
        if (advertiserBuyLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserBuyLimit);
    } else if (advertiserSellLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserSellLimit);
    return maxOrderAmountLimitDisplay;
};

const BuySellForm = ({
    advert,
    advertiserBuyLimit,
    advertiserPaymentMethods,
    advertiserSellLimit,
    balanceAvailable,
    displayEffectiveRate,
    effectiveRate,
    isModalOpen,
    onRequestClose,
    paymentMethods,
}: TBuySellFormProps) => {
    const { data: orderCreatedInfo, isSuccess, mutate } = p2p.order.useCreate();
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<number[]>([]);

    const {
        account_currency,
        advertiser_details,
        description,
        id,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        order_expiry_period,
        payment_method_names,
        rate_type,
        type,
    } = advert;

    const avertiserPaymentMethodObjects = getPaymentMethodObjects(advertiserPaymentMethods);

    const paymentMethodObjects = getPaymentMethodObjects(paymentMethods);

    const availablePaymentMethods = payment_method_names?.map(paymentMethod => {
        const isAvailable = advertiserPaymentMethods?.some(method => method.display_name === paymentMethod);
        return {
            ...(isAvailable ? avertiserPaymentMethodObjects[paymentMethod] : paymentMethodObjects[paymentMethod]),
            isAvailable,
        };
    });

    const history = useHistory();
    const { isMobile } = useDevice();
    const isBuy = type === BUY_SELL.BUY;

    const shouldDisableField =
        !isBuy &&
        (parseFloat(balanceAvailable.toString()) === 0 ||
            parseFloat(balanceAvailable.toString()) < min_order_amount_limit);

    const {
        control,
        formState: { isValid },
        getValues,
        handleSubmit,
    } = useForm({
        defaultValues: {
            amount: min_order_amount_limit ?? 1,
            bank_details: '',
            contact_details: '',
        },
        mode: 'all',
    });

    const onSubmit = () => {
        //TODO: error handling after implementation of exchange rate
        const rateValue = rate_type === RATE_TYPE.FIXED ? null : effectiveRate;
        const payload: TPayload = {
            advert_id: id,
            amount: Number(getValues('amount')),
        };
        if (rateValue) {
            payload.rate = rateValue;
        }

        if (isBuy && selectedPaymentMethods.length) {
            payload.payment_method_ids = selectedPaymentMethods;
        }

        if (isBuy && !selectedPaymentMethods.length) {
            payload.payment_info = getValues('bank_details');
        }

        mutate(payload);
    };

    const calculatedRate = removeTrailingZeros(roundOffDecimal(effectiveRate, setDecimalPlaces(effectiveRate, 6)));
    const initialAmount = removeTrailingZeros((min_order_amount_limit * Number(calculatedRate)).toString());

    const onSelectPaymentMethodCard = (paymentMethodId: number) => {
        if (selectedPaymentMethods.includes(paymentMethodId)) {
            setSelectedPaymentMethods(selectedPaymentMethods.filter(method => method !== paymentMethodId));
        } else {
            setSelectedPaymentMethods([...selectedPaymentMethods, paymentMethodId]);
        }
    };

    useEffect(() => {
        if (isSuccess && orderCreatedInfo) {
            history.push(`${BASE_URL}/orders?order=${orderCreatedInfo.id}`);
            onRequestClose();
        }
    }, [isSuccess, orderCreatedInfo, history, onRequestClose]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BuySellFormDisplayWrapper
                accountCurrency={account_currency}
                isBuy={isBuy}
                isModalOpen={isModalOpen}
                isValid={isValid}
                onRequestClose={onRequestClose}
                onSubmit={onSubmit}
            >
                {rate_type === RATE_TYPE.FLOAT && !shouldDisableField && (
                    <div className='px-[2.4rem] mt-[2.4rem]'>
                        <InlineMessage variant='info'>
                            <Text size={isMobile ? 'xs' : '2xs'}>
                                If the market rate changes from the rate shown here, we won’t be able to process your
                                order.
                            </Text>
                        </InlineMessage>
                    </div>
                )}
                <BuySellData
                    accountCurrency={account_currency}
                    expiryPeriod={order_expiry_period ?? 3600}
                    instructions={description ?? '-'}
                    isBuy={isBuy}
                    localCurrency={local_currency}
                    name={advertiser_details?.name}
                    paymentMethodNames={payment_method_names}
                    paymentMethods={paymentMethods}
                    rate={displayEffectiveRate}
                />
                <LightDivider />
                {isBuy && payment_method_names?.length > 0 && (
                    <BuySellPaymentSection
                        availablePaymentMethods={availablePaymentMethods}
                        onSelectPaymentMethodCard={onSelectPaymentMethodCard}
                        selectedPaymentMethodIds={selectedPaymentMethods}
                    />
                )}
                <BuySellAmount
                    accountCurrency={account_currency}
                    amount={initialAmount}
                    calculatedRate={calculatedRate}
                    control={control as unknown as Control<FieldValues, unknown, FieldValues>}
                    isBuy={isBuy}
                    isDisabled={shouldDisableField}
                    localCurrency={local_currency}
                    maxLimit={getAdvertiserMaxLimit(
                        isBuy,
                        advertiserBuyLimit,
                        advertiserSellLimit,
                        max_order_amount_limit_display
                    )}
                    minLimit={min_order_amount_limit_display}
                />
                {isBuy && !payment_method_names?.length && (
                    <Controller
                        control={control}
                        name='bank_details'
                        render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => {
                            return (
                                <div className='px-[2.4rem] mb-[3.5rem] pt-[1.8rem]'>
                                    <TextArea
                                        hint={error ? error.message : 'Bank name, account number, beneficiary name'}
                                        isInvalid={!!error}
                                        label='Your bank details'
                                        maxLength={300}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        shouldShowCounter
                                        textSize='sm'
                                        value={value}
                                    />
                                </div>
                            );
                        }}
                        rules={{
                            pattern: {
                                message: getTextFieldError('Bank details'),
                                value: VALID_SYMBOLS_PATTERN,
                            },
                            required: 'Bank details is required',
                        }}
                    />
                )}
                {isBuy && (
                    <>
                        <LightDivider />
                        <Controller
                            control={control}
                            name='contact_details'
                            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                                <div className='px-[2.4rem] mb-[3.5rem] pt-[1.8rem]'>
                                    <TextArea
                                        hint={error ? error.message : ''}
                                        isInvalid={!!error}
                                        label='Your contact details'
                                        maxLength={300}
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        shouldShowCounter
                                        textSize='sm'
                                        value={value}
                                    />
                                </div>
                            )}
                            rules={{
                                pattern: {
                                    message: getTextFieldError('Contact details'),
                                    value: VALID_SYMBOLS_PATTERN,
                                },
                                required: 'Contact details is required',
                            }}
                        />
                    </>
                )}
            </BuySellFormDisplayWrapper>
        </form>
    );
};

export default BuySellForm;
