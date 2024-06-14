import classNames from 'classnames';
import React from 'react';
import { isCryptocurrency, getLimitOrderAmount, isValidToSell } from '@deriv/shared';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';
import ContractCardItem from './contract-card-item';
import ToggleCardDialog from './toggle-card-dialog';
import MobileOrTabletWrapper from '../../mobile-wrapper';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay';
import { ContractUpdate } from '@deriv/api-types';
import { TToastConfig } from '../../types/contract.types';
import { TGetCardLables } from '../../types/common.types';
import ArrowIndicator from '../../arrow-indicator';

type TAccumulatorCardBody = {
    addToast: (toast_config: TToastConfig) => void;
    contract_info: TContractInfo;
    contract_update?: ContractUpdate;
    currency: Required<TContractInfo>['currency'];
    current_focus?: string | null;
    error_message_alignment?: string;
    getCardLabels: TGetCardLables;
    getContractById: React.ComponentProps<typeof ToggleCardDialog>['getContractById'];
    indicative?: number;
    is_sold: boolean;
    onMouseLeave?: () => void;
    removeToast: (toast_id: string) => void;
    setCurrentFocus: (value: string | null) => void;
    totalProfit: number;
    is_positions?: boolean;
};

const AccumulatorCardBody = ({
    contract_info,
    contract_update,
    currency,
    getCardLabels,
    indicative,
    is_sold,
    is_positions,
    ...toggle_card_dialog_props
}: TAccumulatorCardBody) => {
    const { buy_price, profit, limit_order, sell_price } = contract_info;
    const { take_profit } = getLimitOrderAmount(contract_update || limit_order);
    const is_valid_to_sell = isValidToSell(contract_info);
    const { CONTRACT_VALUE, STAKE, TAKE_PROFIT, TOTAL_PROFIT_LOSS } = getCardLabels();
    let is_won, is_loss;
    if (profit) {
        is_won = +profit > 0;
        is_loss = +profit < 0;
    }

    return (
        <React.Fragment>
            <div className='dc-contract-card-items-wrapper'>
                <ContractCardItem header={STAKE} className='dc-contract-card__stake'>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={CONTRACT_VALUE} className='dc-contract-card__current-stake'>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': is_won,
                            'dc-contract-card--loss': is_loss,
                        })}
                    >
                        <Money amount={sell_price || indicative} currency={currency} />
                    </div>
                    {!is_sold && (
                        <ArrowIndicator
                            className='dc-contract-card__indicative--movement'
                            value={sell_price || indicative}
                        />
                    )}
                </ContractCardItem>
                <ContractCardItem
                    header={TOTAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={is_loss}
                    is_won={is_won}
                >
                    <Money amount={profit} currency={currency} />
                    {!is_sold && <ArrowIndicator className='dc-contract-card__indicative--movement' value={profit} />}
                </ContractCardItem>
                <ContractCardItem header={TAKE_PROFIT} className='dc-contract-card__take-profit'>
                    {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                    {is_valid_to_sell && (
                        <ToggleCardDialog
                            contract_id={contract_info.contract_id}
                            getCardLabels={getCardLabels}
                            is_accumulator
                            {...toggle_card_dialog_props}
                        />
                    )}
                </ContractCardItem>
            </div>
            {!!is_sold && (
                <MobileOrTabletWrapper>
                    <div
                        className={classNames('dc-contract-card__status', {
                            'dc-contract-card__status--accumulator-mobile-positions': is_positions,
                        })}
                    >
                        <ResultStatusIcon getCardLabels={getCardLabels} is_contract_won={is_won} />
                    </div>
                </MobileOrTabletWrapper>
            )}
        </React.Fragment>
    );
};

export default React.memo(AccumulatorCardBody);
