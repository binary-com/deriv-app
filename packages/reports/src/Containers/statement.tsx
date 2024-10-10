import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { DataList, DataTable, Text, Clipboard, usePrevious } from '@deriv/components';
import {
    capitalizeFirstLetter,
    extractInfoFromShortcode,
    formatDate,
    getContractPath,
    getUnsupportedContracts,
    isForwardStarting,
    hasForwardContractStarted,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';
import { getStatementTableColumnsTemplate } from '../Constants/data-table-constants';
import PlaceholderComponent from '../Components/placeholder-component';
import FilterComponent from '../Components/filter-component';
import { ReportsMeta } from '../Components/reports-meta';
import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message';
import { observer, useStore } from '@deriv/stores';
import { useReportsStore } from 'Stores/useReportsStores';
import { TUnsupportedContractType } from 'Types';
import { TSource } from '@deriv/components/src/components/data-table/table-row';
import { TRow } from '@deriv/components/src/components/types/common.types';

type TGetStatementTableColumnsTemplate = ReturnType<typeof getStatementTableColumnsTemplate>;
type TColIndex = 'icon' | 'refid' | 'currency' | 'date' | 'action_type' | 'amount' | 'balance';

type TAction =
    | {
          message?: string;
          component?: React.ReactElement;
      }
    | string;

type TStatement = RouteComponentProps & {
    component_icon: string;
};

type TDetailsComponent = {
    message: string;
    action_type: string;
};

type TDataList = React.ComponentProps<typeof DataList>;
type TDataListCell = React.ComponentProps<typeof DataList.Cell>;

const DetailsComponent = ({ message = '', action_type = '' }: TDetailsComponent) => {
    const address_hash_match = /:\s([0-9a-zA-Z]+.{25,28})/gm.exec(message.split(/,\s/)[0]);
    const address_hash = address_hash_match?.[1];
    const blockchain_hash_match = /:\s([0-9a-zA-Z]+.{25,34})/gm.exec(message.split(/,\s/)[1]);
    const blockchain_hash = blockchain_hash_match?.[1];

    let messages = [message];

    if (address_hash || blockchain_hash) {
        const lines = message.split(/,\s/);
        messages = lines.map((text, index) => {
            return capitalizeFirstLetter(index !== lines.length - 1 ? `${text}, ` : text);
        });
    }

    return (
        <Text as='div' size='xs' className='statement__row--detail-text' align='center'>
            {messages.map((text, index) => {
                return (
                    <div key={text}>
                        {text}
                        {blockchain_hash && index === messages.length - 1 && (
                            <Clipboard text_copy={blockchain_hash} popoverAlignment='top' />
                        )}
                        {address_hash && action_type === 'withdrawal' && index === messages.length - 1 && (
                            <Clipboard text_copy={address_hash} popoverAlignment='top' />
                        )}
                    </div>
                );
            })}
        </Text>
    );
};

export const getRowAction = (row_obj: TSource | TRow): TAction => {
    let action: TAction = {};
    const { action_type, desc, id, is_sold, longcode, purchase_time, shortcode, transaction_time, withdrawal_details } =
        row_obj;
    if (id && ['buy', 'sell'].includes(action_type)) {
        const contract_type = extractInfoFromShortcode(shortcode)?.category?.toUpperCase();
        const unsupportedContractConfig = getUnsupportedContracts()[contract_type as TUnsupportedContractType];
        const shouldShowForwardStartingNotification =
            isForwardStarting(shortcode, purchase_time || transaction_time) &&
            !hasForwardContractStarted(shortcode) &&
            action_type !== 'sell' &&
            !is_sold;
        action = unsupportedContractConfig
            ? {
                  message: '',
                  component: (
                      <Localize
                          i18n_default_text="The {{trade_type_name}} contract details aren't currently available. We're working on making them available soon."
                          values={{
                              trade_type_name: unsupportedContractConfig?.name,
                          }}
                      />
                  ),
              }
            : getContractPath(id);
        if (shouldShowForwardStartingNotification)
            action = {
                message: '',
                component: <Localize i18n_default_text="You'll see these details once the contract starts." />,
            };
    } else if (action_type === 'withdrawal') {
        if (withdrawal_details && longcode) {
            action = {
                message: `${withdrawal_details} ${longcode}`,
            };
        } else {
            action = {
                message: desc,
            };
        }
    } else if (desc && ['deposit', 'transfer', 'adjustment', 'hold', 'release'].includes(action_type)) {
        action = {
            message: desc,
        };
    }

    // add typeof check because action can be object or string
    if (typeof action === 'object' && action?.message) {
        action.component = <DetailsComponent message={action.message} action_type={action_type} />;
    }

    return action;
};

const Statement = observer(({ component_icon }: TStatement) => {
    const { client, common } = useStore();
    const { current_language } = common;
    const { statement } = useReportsStore();
    const { currency, is_switching, is_virtual } = client;
    const {
        action_type,
        data,
        date_from,
        date_to,
        error,
        handleScroll,
        has_selected_date,
        is_empty,
        is_loading,
        onMount,
        onUnmount,
    } = statement;
    const prev_action_type = usePrevious(action_type);
    const prev_date_from = usePrevious(date_from);
    const prev_date_to = usePrevious(date_to);
    const { isDesktop } = useDevice();

    React.useEffect(() => {
        onMount();
        Analytics.trackEvent('ce_reports_form', {
            action: 'choose_report_type',
            form_name: 'default',
            subform_name: 'statement_form',
            transaction_type_filter: action_type,
            start_date_filter: formatDate(date_from, 'DD/MM/YYYY', false),
            end_date_filter: formatDate(date_to, 'DD/MM/YYYY', false),
        });
        return () => {
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (prev_action_type) {
            Analytics.trackEvent('ce_reports_form', {
                action: 'filter_transaction_type',
                form_name: 'default',
                subform_name: 'statement_form',
                transaction_type_filter: action_type,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action_type]);

    React.useEffect(() => {
        if (prev_date_from !== undefined && prev_date_to !== undefined) {
            Analytics.trackEvent('ce_reports_form', {
                action: 'filter_dates',
                form_name: 'default',
                subform_name: 'statement_form',
                start_date_filter: formatDate(date_from, 'DD/MM/YYYY', false),
                end_date_filter: formatDate(date_to, 'DD/MM/YYYY', false),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date_to, date_from]);

    if (error) return <p>{error}</p>;

    const columns: TGetStatementTableColumnsTemplate = getStatementTableColumnsTemplate(currency, isDesktop);
    const columns_map = columns.reduce((map, item) => {
        map[item.col_index as TColIndex] = item;
        return map;
    }, {} as Record<TColIndex, typeof columns[number]>);

    const mobileRowRenderer = ({
        row,
        passthrough,
    }: Pick<Parameters<TDataList['rowRenderer']>[0], 'row' | 'passthrough'>) => (
        <React.Fragment>
            <div className='data-list__row'>
                <DataList.Cell
                    row={row}
                    column={columns_map.icon as TDataListCell['column']}
                    passthrough={passthrough}
                />
                <DataList.Cell
                    row={row}
                    column={columns_map.action_type as TDataListCell['column']}
                    passthrough={passthrough}
                />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.refid as TDataListCell['column']} />
                <DataList.Cell
                    className='data-list__row-cell--amount'
                    row={row}
                    column={columns_map.currency as TDataListCell['column']}
                />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.date as TDataListCell['column']} />
                <DataList.Cell
                    className='data-list__row-cell--amount'
                    row={row}
                    column={columns_map.amount as TDataListCell['column']}
                />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.balance as TDataListCell['column']} />
            </div>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <ReportsMeta
                className='reports__meta--statement'
                filter_component={<FilterComponent />}
                is_statement
                // key param is needed to force rerendering of the ReportsMeta component on language change
                key={current_language}
            />
            {is_switching ? (
                <PlaceholderComponent is_loading />
            ) : (
                <React.Fragment>
                    {data?.length === 0 || is_empty ? (
                        <PlaceholderComponent
                            is_loading={is_loading}
                            has_selected_date={has_selected_date}
                            is_empty={is_empty}
                            empty_message_component={EmptyTradeHistoryMessage}
                            component_icon={component_icon}
                            localized_message={localize('You have no transactions yet.')}
                            localized_period_message={localize(
                                "You've made no transactions of this type during this period."
                            )}
                        />
                    ) : (
                        <div className='reports__content'>
                            {isDesktop ? (
                                <DataTable
                                    className='statement'
                                    columns={columns}
                                    content_loader={ReportsTableRowLoader}
                                    data_source={data}
                                    getRowAction={getRowAction}
                                    onScroll={handleScroll}
                                    passthrough={{
                                        isTopUp: (item: { action?: string }) => is_virtual && item.action === 'Deposit',
                                    }}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataTable>
                            ) : (
                                <DataList
                                    className='statement'
                                    data_source={data}
                                    getRowAction={getRowAction}
                                    onScroll={handleScroll}
                                    rowRenderer={mobileRowRenderer}
                                    row_gap={8}
                                    passthrough={{
                                        isTopUp: (item: { action?: string }) => is_virtual && item.action === 'Deposit',
                                    }}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataList>
                            )}
                        </div>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

export default withRouter(Statement);
