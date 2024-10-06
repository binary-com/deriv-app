import React from 'react';
import { Button, TButtonColor } from '@deriv-com/quill-ui';
import { RemainingTime } from '@deriv/components';
import { TContractInfo, getCardLabelsV2, isMultiplierContract, isValidToCancel, isValidToSell } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react';
import { TRegularSizesWithExtraLarge } from '@deriv-com/quill-ui/dist/types';
import { FormatUtils } from '@deriv-com/utils';

type ContractInfoProps = {
    contract_info: TContractInfo;
};

type ButtonProps = {
    color: TButtonColor;
    size: TRegularSizesWithExtraLarge;
    fullWidth: boolean;
};

const ContractDetailsFooter = observer(({ contract_info }: ContractInfoProps) => {
    const {
        bid_price,
        currency,
        contract_id,
        cancellation: { date_expiry: cancellation_date_expiry } = {},
        profit,
        contract_type,
    } = contract_info;

    const { contract_replay, common } = useStore();
    const { server_time } = common;
    const { onClickCancel, onClickSell, is_sell_requested } = contract_replay;
    const is_valid_to_sell = isValidToSell(contract_info);
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_multiplier = isMultiplierContract(contract_type);

    const cardLabels = getCardLabelsV2();
    const formatted_bid_price = FormatUtils.formatMoney(bid_price || 0, {
        currency: currency as 'USD', // currency types mismatched between utils and shared
    });
    const bidDetails = !is_valid_to_cancel ? `${formatted_bid_price} ${currency}` : '';
    const label = `${cardLabels.CLOSE} ${bidDetails}`;

    const buttonProps: ButtonProps = {
        color: 'black-white',
        size: 'lg',
        fullWidth: true,
    };

    return (
        <div className='contract-details-footer--container'>
            {is_multiplier ? (
                <>
                    <span className='contract-details-footer-button__wrapper'>
                        <Button
                            label={label}
                            isLoading={is_sell_requested}
                            disabled={Number(profit) < 0 && is_valid_to_cancel}
                            onClick={() => onClickSell(contract_id)}
                            {...buttonProps}
                        />
                    </span>
                    {is_valid_to_cancel && (
                        <span className='contract-details-footer-button__wrapper'>
                            <Button
                                onClick={() => onClickCancel(contract_id)}
                                label={
                                    <>
                                        {cardLabels.CANCEL}{' '}
                                        <RemainingTime
                                            as='span'
                                            end_time={cancellation_date_expiry}
                                            format='mm:ss'
                                            getCardLabels={getCardLabelsV2}
                                            start_time={server_time}
                                        />
                                    </>
                                }
                                disabled={Number(profit) >= 0}
                                variant='secondary'
                                {...buttonProps}
                            />
                        </span>
                    )}
                </>
            ) : (
                <span className='contract-details-footer-button__wrapper'>
                    <Button
                        label={
                            is_valid_to_sell
                                ? `${cardLabels.CLOSE} ${formatted_bid_price} ${currency}`
                                : cardLabels.RESALE_NOT_OFFERED
                        }
                        isLoading={is_sell_requested && is_valid_to_sell}
                        isOpaque
                        onClick={is_valid_to_sell ? () => onClickSell(contract_id) : undefined}
                        disabled={!is_valid_to_sell}
                        variant='primary'
                        {...buttonProps}
                    />
                </span>
            )}
        </div>
    );
});

export default ContractDetailsFooter;
