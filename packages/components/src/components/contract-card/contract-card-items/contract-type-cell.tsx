import React from 'react';
import classNames from 'classnames';
import { TGetContractTypeDisplay } from '../../types';
import IconTradeTypes from '../../icon-trade-types';
import { isVanillaContract, isSmartTraderContract, isLookBacksContract } from '@deriv/shared';

export type TContractTypeCellProps = {
    getContractTypeDisplay: TGetContractTypeDisplay;
    is_high_low: boolean;
    is_multipliers?: boolean;
    is_turbos?: boolean;
    type?: string;
    displayed_trade_param?: React.ReactNode;
};

const ContractTypeCell = ({
    displayed_trade_param,
    getContractTypeDisplay,
    is_high_low,
    is_multipliers,
    is_turbos,
    type = '',
}: TContractTypeCellProps) => (
    <div className='dc-contract-type'>
        <div className='dc-contract-type__type-wrapper'>
            <IconTradeTypes
                type={is_high_low && !isVanillaContract(type) ? `${type.toLowerCase()}_barrier` : type.toLowerCase()}
                className='category-type'
                size={24}
            />
        </div>
        <div
            className={classNames('dc-contract-type__type-label', {
                'dc-contract-type__type-label--smarttrader-contract': isSmartTraderContract(type),
                'dc-contract-type__type-label--lookbacks-contract': isLookBacksContract(type),
                'dc-contract-type__type-label--multipliers': is_multipliers,
            })}
        >
            <div>
                {getContractTypeDisplay(type, { isHighLow: is_high_low, showMainTitle: is_multipliers || is_turbos }) ||
                    ''}
            </div>
            {displayed_trade_param && (
                <div className='dc-contract-type__type-label-trade-param'>{displayed_trade_param}</div>
            )}
        </div>
    </div>
);

export default ContractTypeCell;
