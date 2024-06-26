import React from 'react';
import classnames from 'classnames';
import { ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import SummaryCard from './summary-card';

type TSummary = {
    is_drawer_open: boolean;
};

const Summary = observer(({ is_drawer_open }: TSummary) => {
    const { ui } = useStore();
    const { dashboard, summary_card } = useDBotStore();
    const { is_contract_loading, contract_info } = summary_card;
    const { active_tour } = dashboard;
    const { is_desktop } = ui;
    return (
        <div
            className={classnames({
                'run-panel-tab__content': is_desktop,
                'run-panel-tab__content--mobile': !is_desktop && is_drawer_open,
                'run-panel-tab__content--summary-tab': (is_desktop && is_drawer_open) || active_tour,
            })}
            data-testid='mock-summary'
        >
            <ThemedScrollbars
                className={classnames({
                    summary: !is_contract_loading && !contract_info,
                    'summary--loading':
                        (!is_desktop && is_contract_loading) || (!is_desktop && !is_contract_loading && contract_info),
                })}
            >
                <SummaryCard is_contract_loading={is_contract_loading} contract_info={contract_info} />
            </ThemedScrollbars>
        </div>
    );
});

export default Summary;
