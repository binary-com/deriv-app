import classNames from 'classnames';
import React from 'react';
import { addComma, getLimitOrderAmount, isCryptocurrency, isValidToSell } from '@deriv/shared';
import ContractCardItem from './contract-card-item';
import ToggleCardDialog from './toggle-card-dialog';
import MobileOrTabletWrapper from '../../mobile-wrapper';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay';
import { TGeneralContractCardBodyProps } from './contract-update-form';
import ArrowIndicator from '../../arrow-indicator';

type TTurbosCardBody = Pick<
    TGeneralContractCardBodyProps,
    | 'addToast'
    | 'contract_info'
    | 'contract_update'
    | 'currency'
    | 'current_focus'
    | 'error_message_alignment'
    | 'getCardLabels'
    | 'getContractById'
    | 'is_sold'
    | 'onMouseLeave'
    | 'removeToast'
    | 'setCurrentFocus'
> & {
    progress_slider_mobile_el: React.ReactNode;
    totalProfit: number;
};

const TurbosCardBody = ({
    contract_info,
    contract_update,
    currency,
    getCardLabels,
    is_sold,
    progress_slider_mobile_el,
    ...toggle_card_dialog_props
}: TTurbosCardBody) => {
    const {
        bid_price,
        buy_price,
        profit,
        barrier,
        entry_spot_display_value,
        limit_order = {},
        sell_price,
    } = contract_info;
    const { take_profit } = getLimitOrderAmount(contract_update || limit_order);
    const is_valid_to_sell = isValidToSell(contract_info);
    const contract_value = is_sold ? sell_price : bid_price;
    const { BARRIER, CONTRACT_VALUE, ENTRY_SPOT, TAKE_PROFIT, TOTAL_PROFIT_LOSS, STAKE } = getCardLabels();

    return (
        <React.Fragment>
            <div className={classNames('dc-contract-card-items-wrapper dc-contract-card--turbos')}>
                <ContractCardItem
                    className='dc-contract-card__buy-price'
                    is_crypto={isCryptocurrency(currency)}
                    header={STAKE}
                >
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={CONTRACT_VALUE} className='dc-contract-card__contract-value'>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': Number(profit) > 0,
                            'dc-contract-card--loss': Number(profit) < 0,
                        })}
                    >
                        <Money amount={contract_value} currency={currency} />
                    </div>
                    {!is_sold && (
                        <ArrowIndicator
                            className='dc-contract-card__indicative--movement'
                            value={sell_price || contract_value}
                        />
                    )}
                </ContractCardItem>
                <ContractCardItem
                    header={ENTRY_SPOT}
                    is_crypto={isCryptocurrency(currency)}
                    className='dc-contract-card__entry-spot'
                >
                    {addComma(entry_spot_display_value)}
                </ContractCardItem>

                <div className='dc-contract-card__limit-order-info'>
                    <ContractCardItem header={TAKE_PROFIT} className='dc-contract-card__take-profit'>
                        {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                        {is_valid_to_sell && (
                            <ToggleCardDialog
                                contract_id={contract_info.contract_id}
                                getCardLabels={getCardLabels}
                                is_turbos
                                {...toggle_card_dialog_props}
                            />
                        )}
                    </ContractCardItem>
                </div>
                <ContractCardItem header={BARRIER} className='dc-contract-card__barrier-level'>
                    {addComma(barrier)}
                </ContractCardItem>
                <MobileOrTabletWrapper>
                    <div className='dc-contract-card__status'>
                        {is_sold ? (
                            <ResultStatusIcon getCardLabels={getCardLabels} is_contract_won={!!profit && profit > 0} />
                        ) : (
                            progress_slider_mobile_el
                        )}
                    </div>
                </MobileOrTabletWrapper>
            </div>
            <ContractCardItem
                className='dc-contract-card-item__total-profit-loss'
                header={TOTAL_PROFIT_LOSS}
                is_crypto={isCryptocurrency(currency)}
                is_loss={Number(profit) < 0}
                is_won={Number(profit) > 0}
            >
                <Money amount={profit} currency={currency} />
                {!is_sold && <ArrowIndicator className='dc-contract-card__indicative--movement' value={profit} />}
            </ContractCardItem>
        </React.Fragment>
    );
};

export default React.memo(TurbosCardBody);
