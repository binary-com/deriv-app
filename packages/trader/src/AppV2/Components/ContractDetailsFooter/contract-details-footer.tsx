import { Button, TButtonColor, TButtonVariant } from '@deriv-com/quill-ui';
import { RemainingTime } from '@deriv/components';
import { TContractInfo, getCardLabels, isMultiplierContract, isValidToCancel, isValidToSell } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import React from 'react';
import { observer } from 'mobx-react';
import { TRegularSizesWithExtraLarge } from '@deriv-com/quill-ui/dist/types';

type ContractInfoProps = {
    contract_info: TContractInfo;
};

type ButtonProps = {
    variant: TButtonVariant;
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

    const cardLabels = getCardLabels();
    const bidDetails = !is_valid_to_cancel ? `@${bid_price} ${currency}` : '';
    const label = `${cardLabels.CLOSE} ${bidDetails}`;

    const buttonProps: ButtonProps = {
        variant: 'secondary',
        color: 'black',
        size: 'lg',
        fullWidth: true,
    };

    return (
        <div className='contract-details-footer--container'>
            {is_multiplier ? (
                <>
                    <Button
                        label={label}
                        isLoading={is_sell_requested}
                        disabled={is_sell_requested || (Number(profit) < 0 && is_valid_to_cancel)}
                        onClick={() => onClickSell(contract_id)}
                        {...buttonProps}
                    />
                    {is_valid_to_cancel && (
                        <Button
                            onClick={() => onClickCancel(contract_id)}
                            label={
                                <>
                                    {getCardLabels().CANCEL}
                                    {'  '}
                                    <RemainingTime
                                        as='span'
                                        end_time={cancellation_date_expiry}
                                        format='mm:ss'
                                        className='color'
                                        getCardLabels={getCardLabels}
                                        start_time={server_time}
                                    />
                                </>
                            }
                            disabled={Number(profit) >= 0}
                            {...buttonProps}
                        />
                    )}
                </>
            ) : (
                <Button
                    label={
                        is_valid_to_sell
                            ? `${getCardLabels().CLOSE} @ ${bid_price?.toFixed(2)} ${currency}`
                            : getCardLabels().RESALE_NOT_OFFERED
                    }
                    isLoading={is_sell_requested && is_valid_to_sell}
                    onClick={is_valid_to_sell ? () => onClickSell(contract_id) : undefined}
                    disabled={!is_valid_to_sell}
                    {...buttonProps}
                />
            )}
        </div>
    );
});

export default ContractDetailsFooter;
