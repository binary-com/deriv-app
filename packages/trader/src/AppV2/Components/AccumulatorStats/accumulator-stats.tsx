import React, { useEffect, useMemo, useState } from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { LabelPairedChevronDownSmBoldIcon } from '@deriv/quill-icons';
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

    const ticks_history = useMemo(() => {
        return ticks_history_stats?.ticks_stayed_in ?? [];
    }, [ticks_history_stats]);

    const [animationClass, setAnimationClass] = useState('');
    const [lastValue, setLastValue] = useState<number | null>(null);
    const [isMovingTransition, setIsMovingTransition] = useState(false);

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
        let successTimeout: NodeJS.Timeout | undefined;
        let errorTimeout: NodeJS.Timeout | undefined;

        if (rows[0] && rows[0].length > 0) {
            setAnimationClass('');
            clearTimeout(successTimeout);
            clearTimeout(errorTimeout);

            const isSameValue = lastValue === rows[0][1];

            isSameValue
                ? (errorTimeout = setTimeout(() => setAnimationClass('animate-error'), 0))
                : (successTimeout = setTimeout(() => setAnimationClass('animate-success'), 0));

            setIsMovingTransition(isSameValue);
            if (isSameValue) {
                setTimeout(() => setIsMovingTransition(false), 600);
            }

            setLastValue(rows[0][0]);
        }

        return () => {
            clearTimeout(successTimeout);
            clearTimeout(errorTimeout);
        };
    }, [rows[0]?.[0]]);

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
                            animationClass={animationClass}
                            isMovingTransition={isMovingTransition}
                            className='accumulators-stats__container__stats'
                        />
                    </div>
                    <button className='accumulators-stats__container__expand' onClick={() => setIsOpen(true)}>
                        <LabelPairedChevronDownSmBoldIcon data-testid='expand-stats-icon' />
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
                        isMovingTransition={isMovingTransition}
                        animationClass={animationClass}
                    />
                )}
                {is_open_description && <AccumulatorStatsDescription onActionSheetClose={onActionSheetClose} />}
            </ActionSheet.Root>
        </div>
    );
});

export default AccumulatorStats;
