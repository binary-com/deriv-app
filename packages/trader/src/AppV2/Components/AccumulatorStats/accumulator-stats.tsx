import React, { useEffect, useMemo, useState } from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { LabelPairedChevronUpSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import StatsRow from './accumulator-stats-row';
import AccumulatorStatsDescription from './accumulator-stats-description';
import AccumulatorStatsModal from './accumulator-stats-modal';

const AccumulatorStats = observer(() => {
    const { ticks_history_stats = {} } = useTraderStore();
    const [is_open, setIsOpen] = useState(false);
    const [is_open_description, setIsOpenDescription] = useState(false);
    const [animation_class, setAnimationClass] = useState('');
    const [last_value, setLastValue] = useState<number | null>(null);
    const [is_moving_transaction, setIsMovingTransition] = useState(false);

    const ticks_history = useMemo(() => {
        return ticks_history_stats?.ticks_stayed_in ?? [];
    }, [ticks_history_stats]);

    const rows: number[][] = useMemo(() => {
        const row_size = 5;
        return ticks_history.reduce<number[][]>((acc, _el, index) => {
            if (index % row_size === 0) {
                acc.push(ticks_history.slice(index, index + row_size));
            }
            return acc;
        }, []);
    }, [ticks_history]);

    const onActionSheetClose = () => {
        setIsOpen(false);
        setIsOpenDescription(false);
    };

    useEffect(() => {
        let success_timeout: ReturnType<typeof setTimeout> | undefined,
            error_timeout: ReturnType<typeof setTimeout> | undefined,
            transition_timeout: ReturnType<typeof setTimeout> | undefined;

        if (rows[0] && rows[0].length > 0) {
            setAnimationClass('');
            clearTimeout(success_timeout);
            clearTimeout(error_timeout);
            clearTimeout(transition_timeout);

            const is_same_value = last_value === rows[0][1];

            is_same_value
                ? (error_timeout = setTimeout(() => setAnimationClass('animate-error'), 0))
                : (success_timeout = setTimeout(() => setAnimationClass('animate-success'), 0));

            setIsMovingTransition(is_same_value);
            if (is_same_value) {
                transition_timeout = setTimeout(() => setIsMovingTransition(false), 600);
            }

            setLastValue(rows[0][0]);
        }

        return () => {
            clearTimeout(success_timeout);
            clearTimeout(error_timeout);
            clearTimeout(transition_timeout);
        };
    }, [rows[0]?.[0], ticks_history]);

    if (rows.length === 0) {
        return null;
    }
    return (
        <div>
            <div className='accumulators-stats'>
                <div className='accumulators-stats__container'>
                    <button
                        className='accumulators-stats__container__heading'
                        onClick={() => setIsOpenDescription(true)}
                    >
                        <Text size='sm'>
                            <Localize i18n_default_text='Stats' />
                        </Text>
                    </button>
                    <div className='accumulators-stats__container__divider' />
                    <div className='accumulators-stats__container__stats'>
                        <StatsRow
                            rows={[...rows[0], ...(rows[1] || [])]}
                            animation_class={animation_class}
                            is_moving_transaction={is_moving_transaction}
                            className='accumulators-stats__container__stats'
                        />
                    </div>
                    <button className='accumulators-stats__container__expand' onClick={() => setIsOpen(true)}>
                        <LabelPairedChevronUpSmBoldIcon
                            data-testid='expand-stats-icon'
                            fill='var(--semantic-color-monochrome-textIcon-normal-high)'
                        />
                    </button>
                </div>
            </div>
            <ActionSheet.Root
                isOpen={is_open || is_open_description}
                onClose={onActionSheetClose}
                position='left'
                className='accumulator-stats-sheet-wrapper'
                expandable={false}
            >
                {is_open && (
                    <AccumulatorStatsModal
                        rows={rows}
                        is_moving_transaction={is_moving_transaction}
                        animation_class={animation_class}
                    />
                )}
                {is_open_description && <AccumulatorStatsDescription onActionSheetClose={onActionSheetClose} />}
            </ActionSheet.Root>
        </div>
    );
});

export default AccumulatorStats;
