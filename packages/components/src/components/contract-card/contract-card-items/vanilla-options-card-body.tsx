import React from 'react';
import classNames from 'classnames';
import { addComma, getDisplayStatus, isCryptocurrency } from '@deriv/shared';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';
import DesktopWrapper from '../../desktop-wrapper';
import MobileOrTabletWrapper from '../../mobile-wrapper';
import ContractCardItem from './contract-card-item';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay';
import { TGetCardLables } from '../../types';
import ArrowIndicator from '../../arrow-indicator';

export type TVanillaOptionsCardBodyProps = {
    contract_info: TContractInfo;
    currency: string;
    getCardLabels: TGetCardLables;
    is_sold: boolean;
    progress_slider: React.ReactNode;
};

const VanillaOptionsCardBody: React.FC<TVanillaOptionsCardBodyProps> = ({
    contract_info,
    currency,
    getCardLabels,
    is_sold,
    progress_slider,
}) => {
    const { buy_price, bid_price, entry_spot_display_value, barrier, sell_price, profit }: TContractInfo =
        contract_info;
    const contract_value = is_sold ? sell_price : bid_price;
    const { CONTRACT_VALUE, ENTRY_SPOT, STAKE, STRIKE, TOTAL_PROFIT_LOSS } = getCardLabels();

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='dc-contract-card-items-wrapper'>
                    <ContractCardItem header={STAKE}>
                        <Money amount={buy_price} currency={currency} />
                    </ContractCardItem>

                    <ContractCardItem className='dc-contract-card-item__contract-value' header={CONTRACT_VALUE}>
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

                    <ContractCardItem header={ENTRY_SPOT}>
                        {entry_spot_display_value && addComma(entry_spot_display_value)}
                    </ContractCardItem>

                    <ContractCardItem header={STRIKE}>{barrier && addComma(barrier)}</ContractCardItem>
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
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <div className='dc-contract-card-items-wrapper--mobile'>
                    <div className='dc-contract-card-items-wrapper-group'>
                        <ContractCardItem header={STAKE}>
                            <Money amount={buy_price} currency={currency} />
                        </ContractCardItem>

                        <ContractCardItem header={ENTRY_SPOT}>
                            {entry_spot_display_value && addComma(entry_spot_display_value)}
                        </ContractCardItem>
                    </div>

                    <div className='dc-contract-card-items-wrapper-group'>
                        <ContractCardItem header={CONTRACT_VALUE}>
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

                        <ContractCardItem header={STRIKE}>{barrier && addComma(barrier)}</ContractCardItem>
                    </div>

                    {is_sold ? (
                        <ResultStatusIcon
                            getCardLabels={getCardLabels}
                            is_contract_won={getDisplayStatus(contract_info) === 'won'}
                        />
                    ) : (
                        progress_slider
                    )}
                    <ContractCardItem
                        className='dc-contract-card-item__total-profit-loss'
                        header={TOTAL_PROFIT_LOSS}
                        is_crypto={isCryptocurrency(currency)}
                        is_loss={Number(profit) < 0}
                        is_won={Number(profit) > 0}
                    >
                        <Money amount={profit} currency={currency} />
                        {!is_sold && (
                            <ArrowIndicator className='dc-contract-card__indicative--movement' value={profit} />
                        )}
                    </ContractCardItem>
                </div>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
};

export default React.memo(VanillaOptionsCardBody);
