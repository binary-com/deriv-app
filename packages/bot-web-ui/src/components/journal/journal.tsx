import React from 'react';
import classnames from 'classnames';
import { DataList, Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { contract_stages } from 'Constants/contract-stage';
import { useDBotStore } from 'Stores/useDBotStore';
import { TCheckedFilters, TFilterMessageValues, TJournalDataListArgs } from './journal.types';
import { JournalItem, JournalLoader, JournalTools } from './journal-components';

const Journal = observer(() => {
    const { ui } = useStore();
    const { journal, run_panel } = useDBotStore();
    const {
        checked_filters,
        filterMessage,
        filters,
        filtered_messages,
        is_filter_dialog_visible,
        toggleFilterDialog,
        unfiltered_messages,
    } = journal;
    const { is_stop_button_visible, contract_stage } = run_panel;

    const filtered_messages_length = Array.isArray(filtered_messages) && filtered_messages.length;
    const unfiltered_messages_length = Array.isArray(unfiltered_messages) && unfiltered_messages.length;
    const { is_desktop } = ui;

    return (
        <div
            className={classnames('journal run-panel-tab__content--no-stat', {
                'run-panel-tab__content': is_desktop,
            })}
            data-testid='dt_mock_journal'
        >
            <JournalTools
                checked_filters={checked_filters}
                filters={filters}
                filterMessage={filterMessage}
                is_filter_dialog_visible={is_filter_dialog_visible}
                toggleFilterDialog={toggleFilterDialog}
            />
            <div className='journal__item-list'>
                {filtered_messages_length ? (
                    <DataList
                        className='journal'
                        data_source={filtered_messages}
                        rowRenderer={(args: TJournalDataListArgs) => <JournalItem {...args} />}
                        keyMapper={(row: TFilterMessageValues) => row.unique_id}
                    />
                ) : (
                    <>
                        {contract_stage >= contract_stages.STARTING &&
                        !!Object.keys(checked_filters as TCheckedFilters).length &&
                        !unfiltered_messages_length &&
                        is_stop_button_visible ? (
                            <JournalLoader is_mobile={!is_desktop} />
                        ) : (
                            <div className='journal-empty'>
                                <Icon icon='IcBox' className='journal-empty__icon' size={64} color='secondary' />
                                <Text
                                    as='h4'
                                    size='xs'
                                    weight='bold'
                                    align='center'
                                    color='less-prominent'
                                    line_height='xxs'
                                    className='journal-empty__header'
                                >
                                    {localize('There are no messages to display')}
                                </Text>
                                <div className='journal-empty__message'>
                                    <Text size='xxs' color='less-prominent'>
                                        {localize('Here are the possible reasons:')}
                                    </Text>
                                    <ul className='journal-empty__list'>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('The bot is not running')}
                                            </Text>
                                        </li>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('The stats are cleared')}
                                            </Text>
                                        </li>
                                        <li>
                                            <Text size='xxs' color='less-prominent'>
                                                {localize('All messages are filtered out')}
                                            </Text>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

export default Journal;
