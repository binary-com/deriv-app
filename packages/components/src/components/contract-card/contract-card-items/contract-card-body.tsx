import React from 'react';
import classNames from 'classnames';
import { isCryptocurrency, getIndicativePrice, getCurrentTick, getDisplayStatus, getTotalProfit } from '@deriv/shared';
import ContractCardItem from './contract-card-item';
import CurrencyBadge from '../../currency-badge';
import DesktopWrapper from '../../desktop-wrapper';
import MobileOrTabletWrapper from '../../mobile-wrapper';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay';
import ProgressSliderMobile from '../../progress-slider-mobile';
import AccumulatorCardBody from './accumulator-card-body';
import MultiplierCardBody from './multiplier-card-body';
import TurbosCardBody from './turbos-card-body';
import VanillaOptionsCardBody from './vanilla-options-card-body';
import LookBacksCardBody from './lookbacks-card-body';
import { TGeneralContractCardBodyProps } from './contract-update-form';
import ArrowIndicator from '../../arrow-indicator';

export type TContractCardBodyProps = {
    is_accumulator?: boolean;
    is_lookbacks?: boolean;
    is_multiplier: boolean;
    is_turbos?: boolean;
    is_vanilla?: boolean;
    server_time: moment.Moment;
} & TGeneralContractCardBodyProps;

const ContractCardBody = ({
    addToast,
    contract_info,
    contract_update,
    currency,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    has_progress_slider,
    is_accumulator,
    is_mobile,
    is_multiplier,
    is_positions,
    is_sold,
    is_turbos,
    is_vanilla,
    is_lookbacks,
    onMouseLeave,
    removeToast,
    server_time,
    setCurrentFocus,
    should_show_cancellation_warning,
    toggleCancellationWarning,
}: TContractCardBodyProps) => {
    const indicative = getIndicativePrice(contract_info);
    const { buy_price, sell_price, payout, profit, tick_count, date_expiry, purchase_time } = contract_info;
    const current_tick = tick_count ? getCurrentTick(contract_info) : null;
    const { CONTRACT_VALUE, POTENTIAL_PAYOUT, TOTAL_PROFIT_LOSS, STAKE } = getCardLabels();

    const progress_slider_mobile_el = (
        <ProgressSliderMobile
            current_tick={current_tick}
            expiry_time={date_expiry}
            getCardLabels={getCardLabels}
            is_loading={false}
            server_time={server_time}
            start_time={purchase_time}
            ticks_count={tick_count}
        />
    );

    const toggle_card_dialog_props = {
        addToast,
        current_focus,
        error_message_alignment,
        getContractById,
        onMouseLeave,
        removeToast,
        setCurrentFocus,
        totalProfit: is_multiplier && !isNaN(Number(profit)) ? getTotalProfit(contract_info) : Number(profit),
    };

    let card_body;

    if (is_multiplier) {
        card_body = (
            <MultiplierCardBody
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                getCardLabels={getCardLabels}
                has_progress_slider={has_progress_slider}
                progress_slider={progress_slider_mobile_el}
                is_mobile={is_mobile}
                is_sold={is_sold}
                should_show_cancellation_warning={should_show_cancellation_warning}
                toggleCancellationWarning={toggleCancellationWarning}
                {...toggle_card_dialog_props}
            />
        );
    } else if (is_accumulator) {
        card_body = (
            <AccumulatorCardBody
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                getCardLabels={getCardLabels}
                indicative={indicative}
                is_sold={is_sold}
                is_positions={is_positions}
                {...toggle_card_dialog_props}
            />
        );
    } else if (is_turbos) {
        card_body = (
            <TurbosCardBody
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                getCardLabels={getCardLabels}
                is_sold={is_sold}
                progress_slider_mobile_el={progress_slider_mobile_el}
                {...toggle_card_dialog_props}
            />
        );
    } else if (is_vanilla) {
        card_body = (
            <VanillaOptionsCardBody
                contract_info={contract_info}
                currency={currency}
                getCardLabels={getCardLabels}
                is_sold={is_sold}
                progress_slider={progress_slider_mobile_el}
            />
        );
    } else if (is_lookbacks) {
        card_body = (
            <LookBacksCardBody
                contract_info={contract_info}
                currency={currency}
                is_sold={is_sold}
                indicative={indicative}
                progress_slider_mobile_el={progress_slider_mobile_el}
            />
        );
    } else {
        card_body = (
            <React.Fragment>
                <div className='dc-contract-card-items-wrapper'>
                    <ContractCardItem
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
                    <ContractCardItem header={CONTRACT_VALUE}>
                        <div
                            className={classNames({
                                'dc-contract-card--profit': Number(profit) > 0,
                                'dc-contract-card--loss': Number(profit) < 0,
                            })}
                        >
                            <Money currency={currency} amount={Number(sell_price || indicative)} />
                        </div>
                        {!is_sold && (
                            <ArrowIndicator
                                className='dc-contract-card__indicative--movement'
                                value={Number(sell_price || indicative)}
                            />
                        )}
                    </ContractCardItem>
                    <ContractCardItem header={STAKE}>
                        <Money amount={buy_price} currency={currency} />
                    </ContractCardItem>
                    <ContractCardItem header={POTENTIAL_PAYOUT}>
                        <Money currency={currency} amount={payout} />
                    </ContractCardItem>
                </div>
                <MobileOrTabletWrapper>
                    <div className='dc-contract-card__status'>
                        {is_sold ? (
                            <ResultStatusIcon
                                getCardLabels={getCardLabels}
                                is_contract_won={getDisplayStatus(contract_info) === 'won'}
                            />
                        ) : (
                            progress_slider_mobile_el
                        )}
                    </div>
                </MobileOrTabletWrapper>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <CurrencyBadge currency={currency} />
            <DesktopWrapper>{card_body}</DesktopWrapper>
            <MobileOrTabletWrapper>
                <div
                    className={classNames('dc-contract-card__separatorclass', {
                        'dc-contract-card__body-wrapper': !is_multiplier && !is_turbos && !is_lookbacks,
                    })}
                >
                    {card_body}
                </div>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
};

export default ContractCardBody;
