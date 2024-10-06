import React from 'react';
import { TPortfolioPosition } from '@deriv/stores/types';
import { Tag } from '@deriv-com/quill-ui';
import { LabelPairedStopwatchCaptionRegularIcon } from '@deriv/quill-icons';
import { getCardLabels } from '@deriv/shared';
import { RemainingTime } from '@deriv/components';
import { TRootStore } from 'Types';

export type TContractCardStatusTimerProps = Pick<TPortfolioPosition['contract_info'], 'date_expiry' | 'tick_count'> & {
    currentTick?: number | null;
    isSold?: boolean;
    serverTime?: TRootStore['common']['server_time'];
};

export const ContractCardStatusTimer = ({
    currentTick,
    date_expiry,
    isSold,
    serverTime,
    tick_count,
}: TContractCardStatusTimerProps) => {
    const getDisplayedDuration = () => {
        if (tick_count) {
            return `${currentTick ?? 0}/${tick_count} ${getCardLabels().TICKS.toLowerCase()}`;
        }
        if (date_expiry && serverTime) {
            return (
                <RemainingTime
                    as='span'
                    end_time={date_expiry}
                    getCardLabels={getCardLabels}
                    start_time={serverTime as moment.Moment}
                    key='remaining-time'
                />
            );
        }
        return null;
    };
    const displayedDuration = getDisplayedDuration();

    if (!date_expiry || (serverTime as moment.Moment)?.unix() > +date_expiry || isSold) {
        return <Tag className='status' label={getCardLabels().CLOSED} variant='custom' color='custom' size='sm' />;
    }
    return displayedDuration ? (
        <Tag
            className='timer'
            icon={
                <LabelPairedStopwatchCaptionRegularIcon
                    key='open-contract-card'
                    fill='var(--component-tag-label-color-default)'
                />
            }
            label={displayedDuration}
            variant='custom'
            size='sm'
        />
    ) : null;
};
