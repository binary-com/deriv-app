import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    ProgressBar,
    ProgressSliderMobile,
    DataList,
    DataTable,
    ContractCard,
    usePrevious,
    PositionsDrawerCard,
    SelectNative,
    Dropdown,
} from '@deriv/components';
import {
    isAccumulatorContract,
    isMultiplierContract,
    isVanillaContract,
    isTurbosContract,
    getContractDurationType,
    getTimePercentage,
    getUnsupportedContracts,
    getTotalProfit,
    getContractPath,
    getCurrentTick,
    getDurationPeriod,
    getDurationUnitText,
    getGrowthRatePercentage,
    getCardLabels,
    toMoment,
    hasContractStarted,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';

import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message';
import {
    getOpenPositionsColumnsTemplate,
    getAccumulatorOpenPositionsColumnsTemplate,
    getMultiplierOpenPositionsColumnsTemplate,
} from 'Constants/data-table-constants';
import PlaceholderComponent from '../Components/placeholder-component';
import { observer, useStore } from '@deriv/stores';
import { TColIndex, TUnsupportedContractType } from 'Types';
import moment from 'moment';
import { useDevice } from '@deriv-com/ui';

type TRangeFloatZeroToOne = React.ComponentProps<typeof ProgressBar>['value'];
type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];
type TDataList = React.ComponentProps<typeof DataList>;
type TDataListCell = React.ComponentProps<typeof DataList.Cell>;
type TRowRenderer = TDataList['rowRenderer'];

type TEmptyPlaceholderWrapper = React.PropsWithChildren<{
    is_empty: boolean;
    component_icon: string;
}>;

type TUiStore = Pick<
    ReturnType<typeof useStore>['ui'],
    | 'addToast'
    | 'current_focus'
    | 'removeToast'
    | 'setCurrentFocus'
    | 'should_show_cancellation_warning'
    | 'toggleCancellationWarning'
>;

type TMobileRowRenderer = TUiStore & {
    row?: TDataList['data_source'][0];
    is_footer?: boolean;
    columns_map: Record<TColIndex, TDataListCell['column']>;
    getContractById: ReturnType<typeof useStore>['contract_trade']['getContractById'];
    server_time: moment.Moment;
    onClickCancel: (contract_id?: number) => void;
    onClickRemove: TPortfolioStore['removePositionById'];
    onClickSell: (contract_id?: number) => void;
    measure?: () => void;
};

type TOpenPositionsTable = {
    accumulator_rate: string;
    active_positions: TPortfolioStore['active_positions'];
    className: string;
    columns: Record<string, unknown>[];
    component_icon: string;
    contract_type_value: string;
    currency: string;
    is_empty: boolean;
    is_loading: boolean;
    getRowAction: TDataList['getRowAction'];
    mobileRowRenderer: TRowRenderer;
    preloaderCheck: (item: TTotals) => boolean;
    row_size: number;
    totals: TTotals;
};

type TTotals = {
    contract_info?: {
        profit?: number;
        buy_price?: number;
        bid_price?: number;
        cancellation?: {
            ask_price?: number;
        };
        limit_order?: {
            take_profit?: {
                order_amount?: number | null;
            };
        };
    };
    indicative?: number;
    purchase?: number;
    profit_loss?: number;
    payout?: number;
};

type TOpenPositions = RouteComponentProps & {
    component_icon: string;
};

const EmptyPlaceholderWrapper = ({ is_empty, component_icon, children }: TEmptyPlaceholderWrapper) => (
    <React.Fragment>
        {is_empty ? (
            <PlaceholderComponent
                is_empty={is_empty}
                empty_message_component={EmptyTradeHistoryMessage}
                component_icon={component_icon}
                localized_message={localize('You have no open positions yet.')}
            />
        ) : (
            children
        )}
    </React.Fragment>
);

const MobileRowRenderer = ({
    row = {},
    is_footer,
    columns_map = {},
    server_time = toMoment(),
    onClickCancel,
    onClickSell,
    measure,
    ...props
}: TMobileRowRenderer) => {
    React.useEffect(() => {
        if (!is_footer) {
            measure?.();
        }
    }, [row.contract_info?.underlying, measure, is_footer]);

    if (is_footer) {
        return (
            <>
                <div className='open-positions__data-list-footer--content'>
                    <div>
                        <DataList.Cell row={row} column={columns_map.purchase} />
                        <DataList.Cell row={row} column={columns_map.payout} />
                    </div>
                    <div>
                        <DataList.Cell
                            className='data-list__row-cell--amount'
                            row={row}
                            column={columns_map.indicative}
                        />
                        <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.profit} />
                    </div>
                </div>
            </>
        );
    }

    const { contract_info, contract_update, type, is_sell_requested } = row as TPortfolioStore['active_positions'][0];
    const { currency, date_expiry, date_start, tick_count, purchase_time } = contract_info;
    const current_tick = tick_count ? getCurrentTick(contract_info) : null;
    const turbos_duration_unit = tick_count ? 'ticks' : getDurationUnitText(getDurationPeriod(contract_info), true);
    const duration_type = getContractDurationType(
        (isTurbosContract(contract_info.contract_type) ? turbos_duration_unit : contract_info.longcode) || ''
    );
    const progress_value = (getTimePercentage(server_time, date_start ?? 0, date_expiry ?? 0) /
        100) as TRangeFloatZeroToOne;

    if (isMultiplierContract(type) || isAccumulatorContract(type)) {
        return (
            <PositionsDrawerCard
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency ?? ''}
                is_link_disabled
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
                server_time={server_time}
                {...props}
            />
        );
    }

    return (
        <>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.type} />
                {isVanillaContract(type) || (isTurbosContract(type) && !tick_count) ? (
                    <ProgressSliderMobile
                        current_tick={current_tick}
                        className='data-list__row--timer'
                        expiry_time={date_expiry}
                        getCardLabels={getCardLabels}
                        is_loading={false}
                        server_time={server_time}
                        start_time={purchase_time}
                        ticks_count={tick_count}
                    />
                ) : (
                    <ProgressBar label={duration_type ?? ''} value={progress_value} />
                )}
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.reference} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.currency} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.purchase} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.indicative} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.payout} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.profit} />
            </div>
            <div className='data-list__row-divider' />
            <div className='data-list__row'>
                <ContractCard.Sell
                    contract_info={contract_info}
                    is_sell_requested={is_sell_requested}
                    getCardLabels={getCardLabels}
                    onClickSell={onClickSell}
                />
            </div>
        </>
    );
};

export const OpenPositionsTable = ({
    accumulator_rate,
    active_positions,
    className,
    columns,
    component_icon,
    contract_type_value,
    currency,
    getRowAction,
    is_empty,
    is_loading,
    mobileRowRenderer,
    preloaderCheck,
    row_size,
    totals,
}: TOpenPositionsTable) => {
    const { isDesktop } = useDevice();
    React.useEffect(() => {
        Analytics.trackEvent('ce_reports_form', {
            action: 'choose_report_type',
            form_name: 'default',
            subform_name: 'open_positions_form',
            trade_type_filter: contract_type_value,
            growth_type_filter: accumulator_rate,
        });
    }, []);

    return (
        <React.Fragment>
            {is_loading ? (
                <PlaceholderComponent
                    is_loading={is_loading}
                    empty_message_component={EmptyTradeHistoryMessage}
                    component_icon={component_icon}
                    localized_message={localize('You have no open positions yet.')}
                />
            ) : (
                currency && (
                    <div className='reports__content'>
                        <EmptyPlaceholderWrapper component_icon={component_icon} is_empty={is_empty}>
                            {isDesktop ? (
                                <DataTable
                                    className={className}
                                    columns={columns}
                                    preloaderCheck={preloaderCheck}
                                    footer={totals}
                                    data_source={active_positions}
                                    getRowAction={getRowAction}
                                    getRowSize={() => row_size}
                                    content_loader={ReportsTableRowLoader}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataTable>
                            ) : (
                                <DataList
                                    className={className}
                                    data_source={active_positions}
                                    footer={totals}
                                    rowRenderer={mobileRowRenderer}
                                    getRowAction={getRowAction}
                                    row_gap={8}
                                    keyMapper={item => item?.id}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataList>
                            )}
                        </EmptyPlaceholderWrapper>
                    </div>
                )
            )}
        </React.Fragment>
    );
};

const getRowAction: TDataList['getRowAction'] = row_obj => {
    const unsupportedContractConfig = getUnsupportedContracts()[row_obj.type as TUnsupportedContractType];
    let action = unsupportedContractConfig
        ? {
              component: (
                  <Localize
                      i18n_default_text="The {{trade_type_name}} contract details aren't currently available. We're working on making them available soon."
                      values={{
                          trade_type_name: unsupportedContractConfig?.name,
                      }}
                  />
              ),
          }
        : getContractPath(row_obj.id || 0);
    if (!hasContractStarted(row_obj?.contract_info))
        action = {
            component: <Localize i18n_default_text="You'll see these details once the contract starts." />,
        };

    return action;
};

/*
 * After refactoring transactionHandler for creating positions,
 * purchase property in contract positions object is somehow NaN or undefined in the first few responses.
 * So we set it to true in these cases to show a preloader for the data-table-row until the correct value is set.
 */
const isPurchaseReceived: TOpenPositionsTable['preloaderCheck'] = (item: { purchase?: number }) =>
    isNaN(Number(item.purchase)) || !item.purchase;

const getOpenPositionsTotals = (
    active_positions_filtered: TPortfolioStore['active_positions'],
    is_multiplier_selected: boolean,
    is_accumulator_selected: boolean
) => {
    let totals: TTotals;

    if (is_multiplier_selected) {
        let ask_price = 0;
        let profit = 0;
        let buy_price = 0;
        let bid_price = 0;
        let purchase = 0;

        active_positions_filtered.forEach(portfolio_pos => {
            buy_price += Number(portfolio_pos.contract_info.buy_price);
            bid_price += Number(portfolio_pos.contract_info.bid_price);
            purchase += Number(portfolio_pos.purchase);
            if (portfolio_pos.contract_info) {
                const prices = {
                    bid_price: portfolio_pos.contract_info.bid_price ?? 0,
                    buy_price: portfolio_pos.contract_info.buy_price ?? 0,
                };
                profit += getTotalProfit(prices);

                if (portfolio_pos.contract_info.cancellation) {
                    ask_price += portfolio_pos.contract_info.cancellation.ask_price || 0;
                }
            }
        });
        totals = {
            contract_info: {
                profit,
                buy_price,
                bid_price,
            },
            purchase,
        };

        if (ask_price > 0) {
            if (totals.contract_info)
                totals.contract_info.cancellation = {
                    ask_price,
                };
        }
    } else if (is_accumulator_selected) {
        let buy_price = 0;
        let bid_price = 0;
        let take_profit = 0;
        let profit = 0;

        active_positions_filtered?.forEach(({ contract_info }) => {
            buy_price += Number(contract_info.buy_price);
            bid_price += Number(contract_info.bid_price);
            if (contract_info.limit_order?.take_profit?.order_amount)
                take_profit += contract_info.limit_order.take_profit.order_amount;
            if (contract_info) {
                profit += getTotalProfit(contract_info);
            }
        });
        totals = {
            contract_info: {
                buy_price,
                bid_price,
                profit,
                limit_order: {
                    take_profit: {
                        order_amount: take_profit,
                    },
                },
            },
            purchase: buy_price,
        };
    } else {
        let indicative = 0;
        let purchase = 0;
        let profit_loss = 0;
        let payout = 0;

        active_positions_filtered?.forEach(portfolio_pos => {
            indicative += +portfolio_pos.indicative;
            purchase += Number(portfolio_pos.purchase);
            profit_loss += Number(portfolio_pos.profit_loss);
            payout += Number(portfolio_pos.payout);
        });
        totals = {
            indicative,
            purchase,
            profit_loss,
            payout,
        };
    }
    return totals;
};

const OpenPositions = observer(({ component_icon, ...props }: TOpenPositions) => {
    const { portfolio, client, ui, common, contract_trade } = useStore();
    const {
        active_positions,
        error,
        getPositionById,
        is_accumulator,
        is_loading,
        is_multiplier,
        onClickCancel,
        onClickSell,
        onMount,
        removePositionById: onClickRemove,
    } = portfolio;
    const { currency, is_eu: hide_accu_in_dropdown } = client;
    const {
        notification_messages_ui: NotificationMessages,
        addToast,
        current_focus,
        is_mobile_or_tablet,
        removeToast,
        setCurrentFocus,
        should_show_cancellation_warning,
        toggleCancellationWarning,
    } = ui;
    const { server_time } = common;
    const { getContractById } = contract_trade;

    const store_props = {
        onClickRemove,
        NotificationMessages,
        addToast,
        current_focus,
        is_mobile_or_tablet,
        removeToast,
        setCurrentFocus,
        should_show_cancellation_warning,
        toggleCancellationWarning,
        getContractById,
    };

    const [has_accumulator_contract, setHasAccumulatorContract] = React.useState(false);
    const [has_multiplier_contract, setHasMultiplierContract] = React.useState(false);
    const { isDesktop } = useDevice();
    const previous_active_positions = usePrevious(active_positions);
    const contract_types = [
        { text: localize('Options'), is_default: !is_multiplier && !is_accumulator },
        { text: localize('Multipliers'), is_default: is_multiplier },
        { text: localize('Accumulators'), is_default: is_accumulator },
    ];
    const [contract_type_value, setContractTypeValue] = React.useState(
        contract_types.find(type => type.is_default)?.text || localize('Options')
    );
    const prev_contract_type_value = usePrevious(contract_type_value);
    const accumulator_rates = [localize('All growth rates'), '1%', '2%', '3%', '4%', '5%'];
    const [accumulator_rate, setAccumulatorRate] = React.useState(accumulator_rates[0]);
    const prev_accumulator_rate = usePrevious(accumulator_rate);
    const is_accumulator_selected = contract_type_value === contract_types[2].text;
    const is_multiplier_selected = contract_type_value === contract_types[1].text;
    const contract_types_list = contract_types
        .filter(contract_type => contract_type.text !== localize('Accumulators') || !hide_accu_in_dropdown)
        .map(({ text }) => ({ text, value: text }));
    const accumulators_rates_list = accumulator_rates.map(value => ({ text: value, value }));
    const active_positions_filtered = active_positions?.filter(({ contract_info }) => {
        if (contract_info) {
            if (is_multiplier_selected) return isMultiplierContract(contract_info.contract_type || '');
            if (is_accumulator_selected)
                return (
                    isAccumulatorContract(contract_info.contract_type) &&
                    (`${getGrowthRatePercentage(Number(contract_info.growth_rate))}%` === accumulator_rate ||
                        !accumulator_rate.includes('%'))
                );
            return (
                !isMultiplierContract(contract_info.contract_type || '') &&
                !isAccumulatorContract(contract_info.contract_type)
            );
        }
        return true;
    });
    const active_positions_filtered_totals = getOpenPositionsTotals(
        active_positions_filtered,
        is_multiplier_selected,
        is_accumulator_selected
    );

    React.useEffect(() => {
        /*
         * For mobile, we show portfolio stepper in header even for reports pages.
         * `onMount` in portfolio store will be invoked from portfolio stepper component in `trade-header-extensions.jsx`
         */

        onMount();
        checkForAccuAndMultContracts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        checkForAccuAndMultContracts(previous_active_positions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previous_active_positions]);

    React.useEffect(() => {
        if (prev_contract_type_value) {
            Analytics.trackEvent('ce_reports_form', {
                action: 'filter_trade_type',
                form_name: 'default',
                subform_name: 'open_positions_form',
                trade_type_filter: contract_type_value,
            });
        }
    }, [contract_type_value]);

    React.useEffect(() => {
        if (prev_accumulator_rate) {
            Analytics.trackEvent('ce_reports_form', {
                action: 'filter_growth_rate',
                form_name: 'default',
                subform_name: 'open_positions_form',
                growth_type_filter: accumulator_rate,
            });
        }
    }, [accumulator_rate]);

    const checkForAccuAndMultContracts = (prev_active_positions: TPortfolioStore['active_positions'] = []) => {
        if (active_positions === prev_active_positions) return;
        if (!has_accumulator_contract) {
            setHasAccumulatorContract(
                active_positions.some(({ contract_info }) => isAccumulatorContract(contract_info?.contract_type))
            );
        }
        if (!has_multiplier_contract) {
            setHasMultiplierContract(
                active_positions.some(({ contract_info }) => isMultiplierContract(contract_info?.contract_type || ''))
            );
        }
    };

    if (error) return <p>{error}</p>;

    const getColumns = () => {
        if (is_multiplier_selected && server_time) {
            return getMultiplierOpenPositionsColumnsTemplate({
                currency,
                onClickCancel,
                onClickSell,
                getPositionById,
                server_time,
                isDesktop,
            });
        }
        if (is_accumulator_selected) {
            return getAccumulatorOpenPositionsColumnsTemplate({
                currency,
                onClickSell,
                getPositionById,
                isDesktop,
            });
        }
        return getOpenPositionsColumnsTemplate(currency, isDesktop);
    };

    const columns = getColumns();

    const columns_map = {} as Record<TColIndex, TDataListCell['column']>;
    columns.forEach(e => {
        columns_map[e.col_index as TColIndex] = e as TDataListCell['column'];
    });

    const mobileRowRenderer: TRowRenderer = args => (
        <MobileRowRenderer
            {...args}
            columns_map={columns_map}
            server_time={server_time || toMoment()}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            {...props}
            {...store_props}
        />
    );

    const shared_props = {
        accumulator_rate,
        active_positions: active_positions_filtered,
        component_icon,
        contract_type_value,
        currency,
        getRowAction,
        is_loading,
        mobileRowRenderer,
        preloaderCheck: isPurchaseReceived,
        totals: active_positions_filtered_totals,
    };

    const getOpenPositionsTable = () => {
        let classname = 'open-positions';
        let row_size = isDesktop ? 63 : 5;

        if (is_accumulator_selected) {
            classname = 'open-positions-accumulator open-positions';
            row_size = isDesktop ? 68 : 3;
        } else if (is_multiplier_selected) {
            classname = 'open-positions-multiplier open-positions';
            row_size = isDesktop ? 68 : 3;
        }

        return (
            <OpenPositionsTable
                className={classname}
                columns={columns}
                is_empty={active_positions_filtered.length === 0}
                row_size={row_size}
                {...shared_props}
            />
        );
    };

    return (
        <React.Fragment>
            <NotificationMessages />
            {active_positions.length !== 0 &&
                (isDesktop ? (
                    <div
                        className={
                            is_accumulator_selected
                                ? 'open-positions__accumulator-container'
                                : 'open-positions__contract-types-selector-container'
                        }
                    >
                        <div className='open-positions__accumulator-container__contract-dropdown'>
                            <Dropdown
                                is_align_text_left
                                name='contract_types'
                                list={contract_types_list}
                                value={contract_type_value}
                                onChange={e => setContractTypeValue(e.target.value)}
                            />
                        </div>
                        {is_accumulator_selected && !hide_accu_in_dropdown && (
                            <div className='open-positions__accumulator-container__rates-dropdown'>
                                <Dropdown
                                    is_align_text_left
                                    name='accumulator_rates'
                                    list={accumulators_rates_list}
                                    value={accumulator_rate}
                                    onChange={e => setAccumulatorRate(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className={
                            is_accumulator_selected
                                ? 'open-positions__accumulator-container--mobile'
                                : 'open-positions__contract-types-selector-container--mobile'
                        }
                    >
                        <SelectNative
                            className='open-positions__accumulator-container-mobile__contract-dropdown'
                            list_items={contract_types_list}
                            value={contract_type_value}
                            should_show_empty_option={false}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement> & { target: { value: string } }) =>
                                setContractTypeValue(e.target.value)
                            }
                        />
                        {is_accumulator_selected && !hide_accu_in_dropdown && (
                            <SelectNative
                                className='open-positions__accumulator-container--mobile__rates-dropdown'
                                list_items={accumulators_rates_list}
                                value={accumulator_rate}
                                should_show_empty_option={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement> & { target: { value: string } }) =>
                                    setAccumulatorRate(e.target.value)
                                }
                            />
                        )}
                    </div>
                ))}
            {getOpenPositionsTable()}
        </React.Fragment>
    );
});

export default withRouter(OpenPositions);
