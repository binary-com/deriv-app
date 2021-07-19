import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
    isCryptocurrency,
    getCancellationPrice,
    getIndicativePrice,
    getLimitOrderAmount,
    getCurrentTick,
    getDisplayStatus,
    getTotalProfit,
    isValidToCancel,
    isValidToSell,
    shouldShowCancellation,
} from '@deriv/shared';
import ContractCardItem from './contract-card-item.jsx';
import ToggleCardDialog from './toggle-card-dialog.jsx';
import CurrencyBadge from '../../currency-badge';
import DesktopWrapper from '../../desktop-wrapper';
import Icon from '../../icon';
import MobileWrapper from '../../mobile-wrapper';
import Money from '../../money';
import { ResultStatusIcon } from '../result-overlay/result-overlay.jsx';
import ProgressSliderMobile from '../../progress-slider-mobile';

const MultiplierCardBody = ({
    addToast,
    contract_info,
    contract_update,
    connectWithContractUpdate,
    currency,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    has_progress_slider,
    progress_slider,
    is_mobile,
    is_sold,
    onMouseLeave,
    removeToast,
    setCurrentFocus,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
}) => {
    const { buy_price, bid_price, profit, limit_order, underlying } = contract_info;

    const total_profit = getTotalProfit(contract_info);
    const { take_profit, stop_loss } = getLimitOrderAmount(contract_update || limit_order);
    const cancellation_price = getCancellationPrice(contract_info);
    const is_valid_to_cancel = isValidToCancel(contract_info);
    const is_valid_to_sell = isValidToSell(contract_info);

    return (
        <React.Fragment>
            <div
                className={classNames({
                    'dc-contract-card-items-wrapper--mobile': is_mobile,
                    'dc-contract-card-items-wrapper': !is_mobile,
                    'dc-contract-card-items-wrapper--has-progress-slider': has_progress_slider && !is_sold,
                })}
            >
                <ContractCardItem header={getCardLabels().STAKE} className='dc-contract-card__stake'>
                    <Money amount={buy_price - cancellation_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().CURRENT_STAKE} className='dc-contract-card__current-stake'>
                    <div
                        className={classNames({
                            'dc-contract-card--profit': +profit > 0,
                            'dc-contract-card--loss': +profit < 0,
                        })}
                    >
                        <Money amount={bid_price} currency={currency} />
                    </div>
                </ContractCardItem>
                <ContractCardItem
                    header={getCardLabels().DEAL_CANCEL_FEE}
                    className='dc-contract-card__deal-cancel-fee'
                >
                    {cancellation_price ? (
                        <Money amount={cancellation_price} currency={currency} />
                    ) : (
                        <React.Fragment>
                            {shouldShowCancellation(underlying) ? <strong>-</strong> : getCardLabels().NOT_AVAILABLE}
                        </React.Fragment>
                    )}
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().BUY_PRICE} className='dc-contract-card__buy-price'>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                {has_progress_slider && is_mobile && !is_sold && (
                    <ContractCardItem className='dc-contract-card__date-expiry'>{progress_slider}</ContractCardItem>
                )}
                <div className='dc-contract-card__limit-order-info'>
                    <ContractCardItem header={getCardLabels().TAKE_PROFIT} className='dc-contract-card__take-profit'>
                        {take_profit ? <Money amount={take_profit} currency={currency} /> : <strong>-</strong>}
                    </ContractCardItem>
                    <ContractCardItem header={getCardLabels().STOP_LOSS} className='dc-contract-card__stop-loss'>
                        {stop_loss ? (
                            <React.Fragment>
                                <strong>-</strong>
                                <Money amount={stop_loss} currency={currency} />
                            </React.Fragment>
                        ) : (
                            <strong>-</strong>
                        )}
                    </ContractCardItem>
                    {(is_valid_to_sell || is_valid_to_cancel) && (
                        <ToggleCardDialog
                            addToast={addToast}
                            connectWithContractUpdate={connectWithContractUpdate}
                            contract_id={contract_info.contract_id}
                            current_focus={current_focus}
                            error_message_alignment={error_message_alignment}
                            getCardLabels={getCardLabels}
                            getContractById={getContractById}
                            is_valid_to_cancel={is_valid_to_cancel}
                            onMouseLeave={onMouseLeave}
                            removeToast={removeToast}
                            setCurrentFocus={setCurrentFocus}
                            should_show_cancellation_warning={should_show_cancellation_warning}
                            status={status}
                            toggleCancellationWarning={toggleCancellationWarning}
                        />
                    )}
                </div>
            </div>
            <ContractCardItem
                className='dc-contract-card-item__total-profit-loss'
                header={getCardLabels().TOTAL_PROFIT_LOSS}
                is_crypto={isCryptocurrency(currency)}
                is_loss={+total_profit < 0}
                is_won={+total_profit > 0}
            >
                <Money amount={total_profit} currency={currency} />
                <div
                    className={classNames('dc-contract-card__indicative--movement', {
                        'dc-contract-card__indicative--movement-complete': is_sold,
                    })}
                >
                    {status === 'profit' && <Icon icon='IcProfit' />}
                    {status === 'loss' && <Icon icon='IcLoss' />}
                </div>
            </ContractCardItem>
        </React.Fragment>
    );
};

const ContractCardBody = ({
    addToast,
    connectWithContractUpdate,
    contract_info,
    contract_update,
    currency,
    current_focus,
    error_message_alignment,
    getCardLabels,
    getContractById,
    has_progress_slider,
    is_mobile,
    is_multiplier,
    is_sold,
    onMouseLeave,
    removeToast,
    server_time,
    setCurrentFocus,
    should_show_cancellation_warning,
    status,
    toggleCancellationWarning,
}) => {
    const indicative = getIndicativePrice(contract_info);
    const { buy_price, sell_price, payout, profit, tick_count, date_expiry, purchase_time } = contract_info;
    const current_tick = tick_count ? getCurrentTick(contract_info) : null;

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

    const card_body = is_multiplier ? (
        <MultiplierCardBody
            addToast={addToast}
            connectWithContractUpdate={connectWithContractUpdate}
            contract_info={contract_info}
            contract_update={contract_update}
            currency={currency}
            current_focus={current_focus}
            error_message_alignment={error_message_alignment}
            getCardLabels={getCardLabels}
            getContractById={getContractById}
            has_progress_slider={has_progress_slider}
            progress_slider={progress_slider_mobile_el}
            is_mobile={is_mobile}
            is_sold={is_sold}
            onMouseLeave={onMouseLeave}
            status={status}
            removeToast={removeToast}
            setCurrentFocus={setCurrentFocus}
            should_show_cancellation_warning={should_show_cancellation_warning}
            toggleCancellationWarning={toggleCancellationWarning}
        />
    ) : (
        <React.Fragment>
            <div className='dc-contract-card-items-wrapper'>
                <ContractCardItem
                    header={is_sold ? getCardLabels().PROFIT_LOSS : getCardLabels().POTENTIAL_PROFIT_LOSS}
                    is_crypto={isCryptocurrency(currency)}
                    is_loss={+profit < 0}
                    is_won={+profit > 0}
                >
                    <Money amount={profit} currency={currency} />
                    <div
                        className={classNames('dc-contract-card__indicative--movement', {
                            'dc-contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </ContractCardItem>
                <ContractCardItem header={is_sold ? getCardLabels().PAYOUT : getCardLabels().INDICATIVE_PRICE}>
                    <Money currency={currency} amount={sell_price || indicative} />
                    <div
                        className={classNames('dc-contract-card__indicative--movement', {
                            'dc-contract-card__indicative--movement-complete': is_sold,
                        })}
                    >
                        {status === 'profit' && <Icon icon='IcProfit' />}
                        {status === 'loss' && <Icon icon='IcLoss' />}
                    </div>
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().PURCHASE_PRICE}>
                    <Money amount={buy_price} currency={currency} />
                </ContractCardItem>
                <ContractCardItem header={getCardLabels().POTENTIAL_PAYOUT}>
                    <Money currency={currency} amount={payout} />
                </ContractCardItem>
            </div>
            <MobileWrapper>
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
            </MobileWrapper>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <CurrencyBadge currency={currency} />
            <DesktopWrapper>{card_body}</DesktopWrapper>
            <MobileWrapper>
                <div
                    className={
                        ('dc-contract-card__separatorclass',
                        classNames({
                            'dc-contract-card__body-wrapper': !is_multiplier,
                        }))
                    }
                >
                    {card_body}
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

ContractCardBody.propTypes = {
    addToast: PropTypes.func,
    connectWithContractUpdate: PropTypes.func,
    contract_info: PropTypes.object,
    contract_update: PropTypes.object,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    error_message_alignment: PropTypes.string,
    getCardLabels: PropTypes.func,
    getContractById: PropTypes.func,
    is_mobile: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_sold: PropTypes.bool,
    onMouseLeave: PropTypes.func,
    removeToast: PropTypes.func,
    server_time: PropTypes.object,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    status: PropTypes.string,
    toggleCancellationWarning: PropTypes.func,
};

export default ContractCardBody;
