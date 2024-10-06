import React from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import StatsRow from './accumulator-stats-row';
import { Localize } from '@deriv/translations';

const AccumulatorStatsModal = ({
    rows,
    animation_class,
    is_moving_transaction,
}: {
    rows: number[][];
    animation_class?: string;
    is_moving_transaction: boolean;
}) => {
    return (
        <ActionSheet.Portal shouldCloseOnDrag>
            <div className='stats-sheet'>
                <div className='stats-sheet__title'>
                    <Text size='lg' bold color='quill-typography__color--prominent'>
                        <Localize i18n_default_text='Stats' />
                    </Text>
                </div>
                <div className='stats-sheet__caption'>
                    <Text>
                        <Localize i18n_default_text='History of tick counts' />
                    </Text>
                </div>
                <div className='stats-sheet__stats'>
                    <StatsRow
                        rows={rows[0]}
                        animation_class={animation_class}
                        is_moving_transaction={is_moving_transaction}
                        className='stats-sheet__stats'
                    />
                </div>
                {rows.slice(1).map((item: number[], index: number) => (
                    <div key={index} className='stats-sheet__stats'>
                        {item.map((item: number, innerIndex: number) => (
                            <div key={`${index}-${innerIndex}`} className='stats-sheet__stats__number'>
                                <Text size='sm'>{item}</Text>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </ActionSheet.Portal>
    );
};

export default AccumulatorStatsModal;
