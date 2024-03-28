import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import {
    isHighLow,
    getCurrentTick,
    getGrowthRatePercentage,
    isAccumulatorContract,
    isSmartTraderContract,
    isBot,
    isMobile,
    isTurbosContract,
    isMultiplierContract,
    getLocalizedTurbosSubtype,
} from '@deriv/shared';
import ContractTypeCell from './contract-type-cell';
import Button from '../../button';
import Icon from '../../icon';
import Text from '../../text';
import ProgressSlider from '../../progress-slider';
import DesktopWrapper from '../../desktop-wrapper';
import MobileWrapper from '../../mobile-wrapper';
import TickCounterBar from './tick-counter-bar';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';
import { TGetCardLables, TGetContractTypeDisplay } from '../../types/common.types';

export type TContractCardHeaderProps = {
    contract_info: TContractInfo;
    display_name: string;
    getCardLabels: TGetCardLables;
    getContractTypeDisplay: TGetContractTypeDisplay;
    has_progress_slider: boolean;
    is_mobile: boolean;
    is_sell_requested: boolean;
    is_valid_to_sell?: boolean;
    onClickSell: (contract_id?: number) => void;
    server_time: moment.Moment;
    id?: number;
    is_sold?: boolean;
};

const ContractCardHeader = ({
    contract_info,
    display_name,
    getCardLabels,
    getContractTypeDisplay,
    has_progress_slider,
    id,
    is_sell_requested,
    is_sold: is_contract_sold,
    is_valid_to_sell,
    onClickSell,
    server_time,
}: TContractCardHeaderProps) => {
    const current_tick = contract_info.tick_count ? getCurrentTick(contract_info) : null;
    const {
        growth_rate,
        underlying,
        multiplier,
        contract_type,
        shortcode,
        purchase_time,
        date_expiry,
        tick_count,
        tick_passed,
    } = contract_info;
    const is_bot = isBot();
    const is_sold = !!contract_info.is_sold || is_contract_sold;
    const is_accumulator = isAccumulatorContract(contract_type);
    const is_smarttrader_contract = isSmartTraderContract(contract_type);
    const is_mobile = isMobile();
    const is_turbos = isTurbosContract(contract_type);
    const is_multipliers = isMultiplierContract(contract_type);
    const is_high_low = isHighLow({ shortcode });

    const contract_type_list_info = React.useMemo(
        () => [
            {
                is_param_displayed: is_multipliers,
                displayed_param: `${getContractTypeDisplay(contract_type ?? '', {
                    isHighLow: is_high_low,
                })} x${multiplier}`.trim(),
            },
            {
                is_param_displayed: is_accumulator,
                displayed_param: `${getGrowthRatePercentage(growth_rate || 0)}%`,
            },
            {
                is_param_displayed: is_turbos,
                displayed_param: getLocalizedTurbosSubtype(contract_type),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [contract_type, growth_rate, multiplier, is_accumulator, is_multipliers, is_turbos, is_high_low]
    );

    const displayed_trade_param =
        contract_type_list_info.find(contract_type_item_info => contract_type_item_info.is_param_displayed)
            ?.displayed_param || '';

    return (
        <React.Fragment>
            <div
                className={classNames('dc-contract-card__grid', 'dc-contract-card__grid-underlying-trade', {
                    'dc-contract-card__grid-underlying-trade--trader': !is_bot,
                    'dc-contract-card__grid-underlying-trade--trader--accumulator': !is_mobile && is_accumulator,
                    [`dc-contract-card__grid-underlying-trade--trader--${
                        is_accumulator ? 'accumulator' : 'turbos'
                    }-sold`]: (is_accumulator || is_turbos) && is_sold,
                })}
            >
                <div
                    id='dc-contract_card_underlying_label'
                    className={classNames('dc-contract-card__underlying-name', {
                        'dc-contract-card__underlying-name--accumulator': is_accumulator,
                    })}
                >
                    <Icon
                        icon={underlying ? `IcUnderlying${underlying}` : 'IcUnknown'}
                        width={is_accumulator ? 46 : 40}
                        size={32}
                    />
                    <Text
                        size='xxs'
                        className={classNames('dc-contract-card__symbol', {
                            'dc-contract-card__symbol--smarttrader-contract': is_smarttrader_contract,
                        })}
                        weight='bold'
                    >
                        {display_name || contract_info.display_name}
                    </Text>
                </div>
                <div
                    id='dc-contract_card_type_label'
                    className={classNames('dc-contract-card__type', {
                        'dc-contract-card__type--accumulators': is_accumulator,
                    })}
                >
                    <ContractTypeCell
                        displayed_trade_param={displayed_trade_param}
                        getContractTypeDisplay={getContractTypeDisplay}
                        is_high_low={is_high_low}
                        is_multipliers={is_multipliers}
                        is_turbos={is_turbos}
                        type={contract_type}
                    />
                </div>
                <MobileWrapper>
                    {is_valid_to_sell ? (
                        <CSSTransition
                            in={!!is_valid_to_sell}
                            timeout={250}
                            classNames={{
                                enter: 'dc-contract-card__sell-button--enter',
                                enterDone: 'dc-contract-card__sell-button--enter-done',
                                exit: 'dc-contract-card__sell-button--exit',
                            }}
                            unmountOnExit
                        >
                            <div className='dc-contract-card__sell-button-mobile'>
                                <Button
                                    id={`dc_contract_card_${id}_button`}
                                    className={classNames('dc-btn--sell', {
                                        'dc-btn--loading': is_sell_requested,
                                    })}
                                    is_disabled={!is_valid_to_sell || is_sell_requested}
                                    text={getCardLabels().SELL}
                                    onClick={() => onClickSell(id)}
                                    secondary
                                />
                            </div>
                        </CSSTransition>
                    ) : null}
                </MobileWrapper>
            </div>
            {!is_sold && is_accumulator && (
                <TickCounterBar
                    current_tick={tick_passed}
                    max_ticks_duration={tick_count}
                    label={getCardLabels().TICKS}
                />
            )}
            <MobileWrapper>
                <div className='dc-progress-slider--completed' />
            </MobileWrapper>
            <DesktopWrapper>
                {(!has_progress_slider || !!is_sold) && <div className='dc-progress-slider--completed' />}
                {has_progress_slider && !is_sold && !is_accumulator && (
                    <ProgressSlider
                        current_tick={current_tick}
                        expiry_time={date_expiry}
                        getCardLabels={getCardLabels}
                        is_loading={false}
                        server_time={server_time}
                        start_time={purchase_time}
                        ticks_count={tick_count}
                    />
                )}
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default ContractCardHeader;
