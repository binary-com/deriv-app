import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LightDivider } from '@/components';
import { floatingPointValidator } from '@/utils';
import { Input, Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import './BuySellAmount.scss';

type TBuySellAmountProps = {
    accountCurrency: string;
    amount: string;
    calculatedRate: string;
    control: ReturnType<typeof useForm>['control'];
    isBuy: boolean;
    isDisabled: boolean;
    localCurrency: string;
    maxLimit: string;
    minLimit: string;
};
const BuySellAmount = ({
    accountCurrency,
    amount,
    calculatedRate,
    control,
    isBuy,
    isDisabled,
    localCurrency,
    maxLimit,
    minLimit,
}: TBuySellAmountProps) => {
    const { isMobile } = useDevice();
    const labelSize = isMobile ? 'sm' : 'xs';
    const [inputValue, setInputValue] = useState(minLimit);
    const [buySellAmount, setBuySellAmount] = useState(amount);

    useEffect(() => {
        setBuySellAmount(
            FormatUtils.formatMoney(Number(inputValue) * Number(calculatedRate), {
                currency: localCurrency,
            })
        );
    }, [calculatedRate, inputValue, localCurrency]);

    return (
        <div className='flex flex-col gap-[2rem] py-[2.4rem]'>
            <Text className='px-[2.4rem]' color='less-prominent' size='sm'>
                {`Enter ${isBuy ? 'sell' : 'buy'} amount`}
            </Text>
            <div className='p2p-v2-buy-sell-amount__input-wrapper'>
                <Controller
                    control={control}
                    name='amount'
                    render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
                        <div className='px-[2.4rem] pr-6 '>
                            <Input
                                data-lpignore='true'
                                disabled={isDisabled}
                                error={!!error?.message}
                                isFullWidth
                                label={`${isBuy ? 'Sell' : 'Buy'} amount`}
                                message={error ? error?.message : `Limit: ${minLimit}-${maxLimit}${accountCurrency}`}
                                min={0}
                                name='amount'
                                onBlur={onBlur}
                                onChange={event => {
                                    setInputValue(event.target.value);
                                    onChange(event);
                                }}
                                onKeyDown={event => {
                                    if (!floatingPointValidator(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                rightPlaceholder={
                                    <Text color='less-prominent' size='sm'>
                                        {accountCurrency}
                                    </Text>
                                }
                                step='any'
                                type='number'
                                value={value}
                            />
                        </div>
                    )}
                    rules={{
                        max: {
                            message: `Maximum is ${maxLimit}${accountCurrency}`,
                            value: maxLimit,
                        },
                        min: {
                            message: `Minimum is ${minLimit}${accountCurrency}`,
                            value: minLimit,
                        },
                        required: 'Enter a valid amount',
                    }}
                />
                {isMobile && <LightDivider />}
                <div className='flex flex-col w-full px-[2.4rem]'>
                    <Text color='less-prominent' size={labelSize}>{`You'll ${isBuy ? 'receive' : 'send'}`}</Text>
                    <Text size={isMobile ? 'md' : 'sm'} weight='bold'>
                        {buySellAmount} {localCurrency}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default BuySellAmount;
