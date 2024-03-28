import 'Sass/app/modules/trading-mobile.scss';
import { Div100vhContainer, Modal, Money, Tabs, ThemedScrollbars, usePreventIOSZoom } from '@deriv/components';
import AmountMobile from 'Modules/Trading/Components/Form/TradeParams/amount-mobile';
import Barrier from 'Modules/Trading/Components/Form/TradeParams/barrier';
import DurationMobile from 'Modules/Trading/Components/Form/TradeParams/Duration/duration-mobile';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last-digit';
import { TTextValueStrings } from 'Types';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';

type TTradeParamsModal = {
    is_open: boolean;
    tab_index: number;
    toggleModal: () => void;
};

export type TTradeParamsMobile = {
    currency: string;
    toggleModal: () => void;
    isVisible: (component_key: string) => boolean;
    setAmountTabIdx: (amount_tab_idx?: number) => void;
    amount_tab_idx?: number;
    setTradeParamTabIdx: (trade_param_tab_idx: number) => void;
    trade_param_tab_idx: number;
    setDurationTabIdx: (duration_tab_idx?: number) => void;
    duration_unit: string;
    duration_units_list: TTextValueStrings[];
    duration_value: number;
    duration_tab_idx?: number;
    has_amount_error: boolean;
    has_duration_error: boolean;
    // amount
    setAmountError: (has_error: boolean) => void;
    setSelectedAmount: (basis: string, selected_basis_value: string | number) => void;
    stake_value: number;
    payout_value: number;
    // duration
    setDurationError: (has_error: boolean) => void;
    setSelectedDuration: (selected_duration_unit: string, selected_duration: number) => void;
    t_duration: number;
    s_duration: number;
    m_duration: number;
    h_duration: number;
    d_duration: number;
};

type TReducer = Pick<
    TTradeParamsMobile,
    | 'trade_param_tab_idx'
    | 'duration_tab_idx'
    | 'amount_tab_idx'
    | 'has_amount_error'
    | 'has_duration_error'
    | 't_duration'
    | 's_duration'
    | 'm_duration'
    | 'h_duration'
    | 'd_duration'
    | 'stake_value'
    | 'payout_value'
> & { curr_duration_unit: string; curr_duration_value: number };

const DEFAULT_DURATION = Object.freeze({
    t: 5,
    s: 15,
    m: 3,
    h: 1,
    d: 1,
});

const reducer = (state: TReducer, payload: Partial<TReducer>) => {
    return {
        ...state,
        ...payload,
    };
};

const getDefaultDuration = (duration_unit: string) => DEFAULT_DURATION[duration_unit as keyof typeof DEFAULT_DURATION];

const TradeParamsModal = observer(({ is_open, toggleModal, tab_index }: TTradeParamsModal) => {
    const { client } = useStore();
    const { currency } = client;
    const { amount, form_components, duration, duration_unit, duration_units_list } = useTraderStore();

    const initial_duration_tab_idx = duration_units_list.findIndex(d => d.value === duration_unit);
    const [state, dispatch] = React.useReducer(reducer, {
        trade_param_tab_idx: tab_index,
        duration_tab_idx: initial_duration_tab_idx,
        amount_tab_idx: undefined,
        has_amount_error: false,
        has_duration_error: false,
        // duration unit values
        curr_duration_unit: duration_unit,
        curr_duration_value: duration,
        t_duration: getDefaultDuration('t'),
        s_duration: getDefaultDuration('s'),
        m_duration: getDefaultDuration('m'),
        h_duration: getDefaultDuration('h'),
        d_duration: getDefaultDuration('d'),
        // amount values
        stake_value: amount,
        payout_value: amount,
    });

    usePreventIOSZoom();

    React.useEffect(() => {
        setSelectedDuration(duration_unit, duration);
    }, [duration, duration_unit]);

    const setTradeParamTabIdx = (trade_param_tab_idx: number) => dispatch({ trade_param_tab_idx });

    const setDurationTabIdx = (duration_tab_idx?: number) => dispatch({ duration_tab_idx });

    const setAmountTabIdx = (amount_tab_idx?: number) => dispatch({ amount_tab_idx });

    const setSelectedAmount = (basis: string, selected_basis_value: string | number) =>
        dispatch({ [`${basis}_value`]: selected_basis_value });

    const setSelectedDuration = (selected_duration_unit: string, selected_duration: number) => {
        dispatch({
            [`${selected_duration_unit}_duration`]: selected_duration,
            curr_duration_unit: selected_duration_unit,
            curr_duration_value: selected_duration,
        });
    };

    const setAmountError = (has_error: boolean) => {
        dispatch({ has_amount_error: has_error });
    };
    const setDurationError = (has_error: boolean) => {
        dispatch({ has_duration_error: has_error });
    };

    const isVisible = (component_key: string): boolean => form_components.includes(component_key);
    return (
        <React.Fragment>
            <Modal
                id='dt_trade_parameters_mobile'
                className='trade-params'
                is_open={is_open}
                header={<div />}
                toggleModal={toggleModal}
                height='53.8rem'
                width='calc(100vw - 32px)'
            >
                <ThemedScrollbars>
                    <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='120px'>
                        <TradeParamsMobile
                            currency={currency}
                            toggleModal={toggleModal}
                            isVisible={isVisible}
                            setTradeParamTabIdx={setTradeParamTabIdx}
                            trade_param_tab_idx={tab_index}
                            setDurationTabIdx={setDurationTabIdx}
                            duration_tab_idx={state.duration_tab_idx}
                            setAmountTabIdx={setAmountTabIdx}
                            amount_tab_idx={state.amount_tab_idx}
                            // amount
                            setSelectedAmount={setSelectedAmount}
                            stake_value={state.stake_value}
                            payout_value={state.payout_value}
                            duration_unit={state.curr_duration_unit}
                            duration_value={state.curr_duration_value}
                            duration_units_list={duration_units_list}
                            has_amount_error={state.has_amount_error}
                            setAmountError={setAmountError}
                            // duration
                            setSelectedDuration={setSelectedDuration}
                            has_duration_error={state.has_duration_error}
                            setDurationError={setDurationError}
                            t_duration={state.t_duration}
                            s_duration={state.s_duration}
                            m_duration={state.m_duration}
                            h_duration={state.h_duration}
                            d_duration={state.d_duration}
                        />
                    </Div100vhContainer>
                </ThemedScrollbars>
            </Modal>
        </React.Fragment>
    );
});

export default TradeParamsModal;

const TradeParamsMobile = observer(
    ({
        currency,
        toggleModal,
        isVisible,
        setAmountTabIdx,
        amount_tab_idx,
        setTradeParamTabIdx,
        trade_param_tab_idx,
        setDurationTabIdx,
        duration_unit,
        duration_units_list,
        duration_value,
        duration_tab_idx,
        has_amount_error,
        has_duration_error,
        // amount
        setAmountError,
        setSelectedAmount,
        stake_value,
        payout_value,
        // duration
        setDurationError,
        setSelectedDuration,
        t_duration,
        s_duration,
        m_duration,
        h_duration,
        d_duration,
    }: TTradeParamsMobile) => {
        const {
            basis_list,
            basis,
            expiry_epoch,
            is_turbos,
            is_vanilla,
            duration_unit: store_duration_unit,
        } = useTraderStore();

        const resetToDefaultDuration = () => {
            const default_store_duration = getDefaultDuration(store_duration_unit);
            setSelectedDuration(store_duration_unit, default_store_duration);
        };

        React.useEffect(() => {
            const toggled_duration_tab_idx = duration_units_list.findIndex(d => d.value === duration_unit);
            const default_duration_tab_idx = duration_units_list.findIndex(d => d.value === store_duration_unit);
            const default_duration = getDefaultDuration(duration_unit);

            // reset to default value and timeframe when previously chosen timeframe doesnt exist in new trade type
            if (toggled_duration_tab_idx === -1) resetToDefaultDuration();

            setSelectedDuration(duration_unit, has_duration_error ? default_duration : duration_value);
            setDurationTabIdx(toggled_duration_tab_idx === -1 ? default_duration_tab_idx : toggled_duration_tab_idx);

            return () => {
                setSelectedDuration(duration_unit, has_duration_error ? default_duration : duration_value);
            };
        }, [duration_unit]);

        React.useEffect(() => {
            const default_duration = getDefaultDuration(duration_unit);
            const toggled_duration_tab_idx = duration_units_list.findIndex(d => d.value === duration_unit);

            if (toggled_duration_tab_idx === -1) resetToDefaultDuration();

            return () => {
                setSelectedDuration(duration_unit, has_duration_error ? default_duration : duration_value);
            };
        }, [duration_value]);

        const getDurationText = () => {
            const default_duration_obj = duration_units_list.find(d => d.value === store_duration_unit);
            const toggled_duration_obj = duration_units_list.find(d => d.value === duration_unit);
            const toggled_duration_tab_idx = duration_units_list.findIndex(d => d.value === duration_unit);
            const default_store_duration = getDefaultDuration(store_duration_unit);
            const default_timeframe =
                default_duration_obj &&
                (default_store_duration > 1
                    ? localize(default_duration_obj.text)
                    : localize(default_duration_obj.text.slice(0, -1)));
            const toggled_duration_text =
                toggled_duration_obj &&
                (duration_value > 1
                    ? localize(toggled_duration_obj.text)
                    : localize(toggled_duration_obj.text.slice(0, -1)));

            return toggled_duration_tab_idx === -1
                ? `${default_store_duration} ${default_timeframe}`
                : `${duration_value} ${toggled_duration_text}`;
        };

        const getAmountText = () => {
            const has_selected_tab_idx = typeof amount_tab_idx !== 'undefined';
            const active_index = has_selected_tab_idx ? amount_tab_idx : basis_list.findIndex(b => b.value === basis);

            return <Money currency={currency} show_currency amount={active_index === 1 ? payout_value : stake_value} />;
        };

        const getHeaderContent = (tab_key: string) => {
            switch (tab_key) {
                case 'duration':
                    return (
                        <div className='trade-params__header'>
                            <div className='trade-params__header-label'>{localize('Duration')}</div>
                            <div
                                className={classNames('trade-params__header-value', {
                                    'trade-params__header-value--has-error': has_duration_error,
                                })}
                            >
                                {has_duration_error ? localize('Error') : getDurationText()}
                            </div>
                        </div>
                    );
                case 'amount':
                    return (
                        <div className='trade-params__header'>
                            <div className='trade-params__header-label'>
                                {is_turbos || is_vanilla ? localize('Stake') : localize('Amount')}
                            </div>
                            <div
                                className={classNames('trade-params__header-value', {
                                    'trade-params__header-value--has-error': has_amount_error,
                                })}
                            >
                                {has_amount_error ? localize('Error') : getAmountText()}
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        };
        return (
            <Tabs
                active_index={trade_param_tab_idx}
                className='trade-params-duration-amount'
                onTabItemClick={setTradeParamTabIdx}
                top
            >
                {isVisible('duration') ? (
                    <div data-header-content={getHeaderContent('duration')}>
                        <DurationMobile
                            toggleModal={toggleModal}
                            amount_tab_idx={amount_tab_idx}
                            duration_tab_idx={duration_tab_idx}
                            setDurationTabIdx={setDurationTabIdx}
                            setSelectedDuration={setSelectedDuration}
                            setDurationError={setDurationError}
                            has_amount_error={has_amount_error}
                            t_duration={t_duration}
                            s_duration={s_duration}
                            m_duration={m_duration}
                            h_duration={h_duration}
                            d_duration={d_duration}
                            stake_value={stake_value}
                            payout_value={payout_value}
                            expiry_epoch={expiry_epoch}
                        />
                    </div>
                ) : null}
                {isVisible('amount') ? (
                    <div data-header-content={getHeaderContent('amount')}>
                        <AmountMobile
                            duration_unit={duration_unit}
                            duration_value={duration_value}
                            toggleModal={toggleModal}
                            amount_tab_idx={amount_tab_idx}
                            setAmountTabIdx={setAmountTabIdx}
                            has_duration_error={has_duration_error}
                            setSelectedAmount={setSelectedAmount}
                            setAmountError={setAmountError}
                            stake_value={stake_value}
                            payout_value={payout_value}
                        />
                    </div>
                ) : null}
            </Tabs>
        );
    }
);

export const LastDigitMobile = observer(() => {
    const { form_components } = useTraderStore();
    return form_components.includes('last_digit') ? <LastDigit /> : null;
});

export const BarrierMobile = observer(() => {
    const { form_components } = useTraderStore();
    return form_components.includes('barrier') ? <Barrier /> : null;
});
