import React from 'react';
import { MobileFullPageModal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { StatisticsSummary } from 'Components/run-panel/run-panel';
import { transaction_elements } from 'Constants/transactions';
import { useDBotStore } from 'Stores/useDBotStore';
import MobileTransactionCards from './mobile-transaction-card';
import { TRunPanelStore } from './transaction-details.types';
import './transaction-details-mobile.scss';

const TransactionDetailsMobile = observer(() => {
    const { client } = useStore();
    const { transactions, run_panel } = useDBotStore();
    const {
        toggleTransactionDetailsModal,
        is_transaction_details_modal_open,
        transactions: transaction_list,
        statistics,
    } = transactions;

    const { toggleStatisticsInfoModal }: Partial<TRunPanelStore> = run_panel;

    return (
        <MobileFullPageModal
            is_modal_open={is_transaction_details_modal_open}
            className='transaction-details-modal-mobile'
            header={localize('Transactions detailed summary')}
            onClickClose={() => {
                toggleTransactionDetailsModal(false);
            }}
            height_offset='80px'
        >
            <div className='transaction-details-modal-mobile__wrapper' data-testid='transaction_details_cards'>
                {transaction_list?.map(({ data, type }) => {
                    if (type === transaction_elements.CONTRACT)
                        return <MobileTransactionCards transaction={data} key={data?.transaction_ids?.buy} />;
                    return (
                        <div
                            className='transaction-details-modal-mobile__divider'
                            key={`transaction-row-divider-${data}`}
                        >
                            <div className='transactions__divider-line' />
                        </div>
                    );
                })}
            </div>
            <div className='transaction-details-modal-mobile__card__footer'>
                <StatisticsSummary
                    is_mobile_or_tablet
                    currency={client?.currency}
                    lost_contracts={statistics?.lost_contracts ?? 0}
                    number_of_runs={statistics?.number_of_runs ?? 0}
                    total_payout={statistics?.total_payout ?? 0}
                    total_profit={statistics?.total_profit ?? 0}
                    total_stake={statistics?.total_stake ?? 0}
                    won_contracts={statistics?.won_contracts ?? 0}
                    toggleStatisticsInfoModal={toggleStatisticsInfoModal}
                />
            </div>
        </MobileFullPageModal>
    );
});

export default TransactionDetailsMobile;
