import React from 'react';
import { Button, Icon, Popover } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { downloadFile, getSuccessJournalMessage, TTransaction } from 'Utils/download';
import { useDBotStore } from 'Stores/useDBotStore';

type TDownloadProps = {
    tab: string;
};

const Download = observer(({ tab }: TDownloadProps) => {
    const { run_panel, transactions, journal } = useDBotStore();
    const { is_clear_stat_disabled, is_running } = run_panel;
    const { filtered_messages } = journal;
    const { transactions: transaction_list } = transactions;
    let disabled = false;
    let clickFunction, popover_message;

    const downloadTransaction = () => {
        const items = [
            [
                localize('Market'),
                localize('Reference ID (buy)'),
                localize('Reference ID (sell)'),
                localize('Barrier'),
                localize('Start Time'),
                localize('Entry Spot'),
                localize('Entry Spot Time'),
                localize('Exit Spot'),
                localize('Exit Spot Time'),
                localize('Buy Price'),
                localize('Profit/Loss'),
            ],
        ];
        transaction_list.forEach(({ data }: { data: TTransaction }) => {
            if (typeof data === 'string') return;
            items.push([
                data.display_name,
                data.transaction_ids.buy,
                data.transaction_ids.sell,
                data.barrier,
                data.date_start,
                data.entry_tick,
                data.entry_tick_time,
                data.exit_tick,
                data.exit_tick_time,
                data.buy_price,
                data.profit,
            ]);
        });

        const content = items.map(e => e.join(',')).join('\n');
        downloadFile(localize('Transactions'), content);
    };

    const downloadJournal = () => {
        const items = [[localize('Date'), localize('Time'), localize('Message')]];

        filtered_messages.map(item => {
            let array_message;
            if (item.message_type !== 'success') {
                array_message = JSON.stringify(item.message);
            } else {
                array_message = getSuccessJournalMessage(item.message.toString(), item.extra);
            }
            const arr = [item.date, item.time, array_message?.replace('&#x2F;', '/')];
            items.push(arr);
        });
        const content = items.map(e => e.join(',')).join('\n');
        downloadFile(localize('Journal'), content);
    };

    if (tab === 'transactions') {
        clickFunction = downloadTransaction;
        disabled = !transaction_list.length || is_running;
        popover_message = localize('Download your transaction history.');
        if (!transaction_list.length) popover_message = localize('No transaction or activity yet.');
    } else if (tab === 'journal') {
        clickFunction = downloadJournal;
        popover_message = localize('Download your journal.');
        disabled = is_clear_stat_disabled;
        if (disabled) popover_message = localize('No transaction or activity yet.');
    }
    if (is_running) popover_message = localize('Download is unavailable while your bot is running.');

    return (
        <Popover
            className='run-panel__info'
            classNameBubble='run-panel__info--bubble'
            alignment='bottom'
            message={popover_message}
            zIndex='5'
        >
            <Button
                id='download-button'
                is_disabled={disabled}
                className='download__button'
                text={localize('Download')}
                onClick={clickFunction}
                secondary
            />
        </Popover>
    );
});

export default Download;
