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
    const { is_mobile_or_tablet } = ui;
    return (
        <div
            className={classnames({
                'run-panel-tab__content': !is_mobile_or_tablet,
                'run-panel-tab__content--mobile': is_mobile_or_tablet && is_drawer_open,
                'run-panel-tab__content--summary-tab': (!is_mobile_or_tablet && is_drawer_open) || active_tour,
            })}
            data-testid='mock-summary'
        >
            <ThemedScrollbars
                className={classnames({
                    summary: !is_contract_loading && !contract_info,
                    'summary--loading':
                        (is_mobile_or_tablet && is_contract_loading) ||
                        (is_mobile_or_tablet && !is_contract_loading && contract_info),
                })}
            >
                <SummaryCard is_contract_loading={is_contract_loading} contract_info={contract_info} />
            </ThemedScrollbars>
        </div>
    );
});

export default Summary;
