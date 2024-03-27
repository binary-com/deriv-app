import classNames from 'classnames';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Div100vhContainer, PageOverlay, SwipeableWrapper, FadeWrapper } from '@deriv/components';
import {
    getContractTypeFeatureFlag,
    isAccumulatorContract,
    isEmptyObject,
    isHighLow,
    isMultiplierContract,
    isTurbosContract,
    isVanillaContract,
    isResetContract,
    isLookBacksContract,
} from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useDevice, useFeatureFlags } from '@deriv/hooks';
import ChartLoader from 'App/Components/Elements/chart-loader';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import { DigitsWidget, InfoBoxWidget } from './contract-replay-widget';
import ReplayChart from './replay-chart';
import { observer, useStore } from '@deriv/stores';

type TLocationState = { from_table_row: boolean };

const ContractReplay = observer(({ contract_id }: { contract_id: number }) => {
    const { state } = useLocation<TLocationState>();
    const { common, contract_replay, ui } = useStore();
    const [swipe_index, setSwipeIndex] = React.useState(0);
    const { contract_store } = contract_replay;
    const { is_market_closed, is_sell_requested, onClickCancel, onClickSell, onMount, onUnmount, is_chart_loading } =
        contract_replay;
    const { contract_info, contract_update, contract_update_history, is_digit_contract } = contract_store;
    const { routeBackInApp } = common;
    const {
        is_dark_mode_on: is_dark_theme,
        is_mobile,
        notification_messages_ui: NotificationMessages,
        toggleHistoryTab,
    } = ui;
    const trade_type_feature_flag =
        contract_info.shortcode &&
        getContractTypeFeatureFlag(contract_info.contract_type ?? '', isHighLow(contract_info));
    const is_trade_type_disabled =
        useFeatureFlags()[`is_${trade_type_feature_flag}_enabled` as keyof ReturnType<typeof useFeatureFlags>] ===
        false;
    const [is_visible, setIsVisible] = React.useState(false);
    const history = useHistory();
    const { isMobile } = useDevice();

    React.useEffect(() => {
        const url_array = /[^/]*$/.exec(location.pathname);
        const url_contract_id = url_array ? +url_array[0] : undefined;
        onMount(contract_id || url_contract_id);
        setIsVisible(true);

        return () => {
            setIsVisible(false);
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract_id, location, onMount, onUnmount]);

    const onClickClose = React.useCallback(() => {
        setIsVisible(false);
        const is_from_table_row = !isEmptyObject(state) ? state.from_table_row : false;
        return is_from_table_row ? history.goBack() : routeBackInApp(history);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, routeBackInApp]);

    React.useEffect(() => {
        // don't open Contract details page for trade types with disabled feature flag:
        if (is_trade_type_disabled && is_visible) {
            onClickClose();
        }
    }, [is_trade_type_disabled, is_visible, onClickClose]);

    const onChangeSwipeableIndex = (index: number) => {
        setSwipeIndex(index);
    };

    if (!contract_info.underlying) return null;

    const is_accumulator = isAccumulatorContract(contract_info.contract_type);
    const is_multiplier = isMultiplierContract(contract_info.contract_type);
    const is_turbos = isTurbosContract(contract_info.contract_type);
    const is_vanilla = isVanillaContract(contract_info.contract_type);
    const is_reset_contract = isResetContract(contract_info.contract_type);
    const is_lookbacks = isLookBacksContract(contract_info.contract_type);

    const contract_drawer_el = (
        <ContractDrawer
            contract_info={contract_info}
            contract_update={contract_update}
            contract_update_history={contract_update_history}
            is_accumulator={is_accumulator}
            is_dark_theme={is_dark_theme}
            is_market_closed={is_market_closed}
            is_multiplier={is_multiplier}
            is_turbos={is_turbos}
            is_sell_requested={is_sell_requested}
            is_vanilla={is_vanilla}
            is_lookbacks={is_lookbacks}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            toggleHistoryTab={toggleHistoryTab}
        />
    );

    // TODO: Uncomment and update this when DTrader 2.0 development starts:
    // if (useFeatureFlags().is_dtrader_v2_enabled) return <Text size='xl'>Hello! I am Contract Details page for DTrader 2.0.</Text>;

    if (isMobile) {
        return (
            <FadeWrapper
                is_visible={is_visible}
                className='contract-details-wrapper'
                keyname='contract-details-wrapper'
            >
                <NotificationMessages />
                <PageOverlay
                    id='dt_contract_replay_container'
                    header={<Localize i18n_default_text='Contract details' />}
                    onClickClose={onClickClose}
                >
                    <Div100vhContainer
                        className='trade-container__replay'
                        height_offset='80px' // * 80px = header + contract details header heights in mobile
                    >
                        <div
                            className={classNames('contract-drawer__mobile-wrapper', {
                                'contract-drawer__mobile-wrapper--is-multiplier': is_mobile && is_multiplier,
                            })}
                            data-testid='dt_contract_drawer_mobile_wrapper'
                        >
                            {contract_drawer_el}
                        </div>
                        <React.Suspense fallback={<div />}>
                            <div
                                className={classNames('replay-chart__container', {
                                    'replay-chart__container--is-multiplier': is_mobile && is_multiplier,
                                    'vanilla-trade-chart': is_vanilla,
                                })}
                                data-testid='dt_replay_chart_container'
                            >
                                <ChartLoader is_dark={is_dark_theme} is_visible={is_chart_loading} />
                                {is_digit_contract ? (
                                    <React.Fragment>
                                        <InfoBoxWidget />
                                        <SwipeableWrapper
                                            className='replay-chart__container-swipeable-wrapper'
                                            data-testid='dt_replay_chart_swipeable_wrapper'
                                            is_swipe_disabled={swipe_index === 1}
                                            onChange={
                                                onChangeSwipeableIndex as React.ComponentProps<
                                                    typeof SwipeableWrapper
                                                >['onChange']
                                            }
                                        >
                                            <DigitsWidget />
                                            <ReplayChart />
                                        </SwipeableWrapper>
                                    </React.Fragment>
                                ) : (
                                    <ReplayChart
                                        is_dark_theme_prop={is_dark_theme}
                                        is_accumulator_contract={is_accumulator}
                                        is_reset_contract={is_reset_contract}
                                    />
                                )}
                            </div>
                        </React.Suspense>
                    </Div100vhContainer>
                </PageOverlay>
            </FadeWrapper>
        );
    }

    return (
        <FadeWrapper is_visible={is_visible} className='contract-details-wrapper' keyname='contract-details-wrapper'>
            <PageOverlay
                id='dt_contract_replay_container'
                header={<Localize i18n_default_text='Contract details' />}
                onClickClose={onClickClose}
            >
                <div className='trade-container__replay'>
                    {contract_drawer_el}
                    <React.Suspense fallback={<div />}>
                        <div
                            className={classNames('replay-chart__container', {
                                'replay-chart__container--is-multiplier': is_mobile && is_multiplier,
                                'vanilla-trade-chart': is_vanilla,
                            })}
                            data-testid='dt_replay_chart_container'
                        >
                            <NotificationMessages />
                            <ChartLoader is_dark={is_dark_theme} is_visible={is_chart_loading} />
                            <ReplayChart
                                is_dark_theme_prop={is_dark_theme}
                                is_accumulator_contract={is_accumulator}
                                is_reset_contract={is_reset_contract}
                            />
                        </div>
                    </React.Suspense>
                </div>
            </PageOverlay>
        </FadeWrapper>
    );
});

export default ContractReplay;
