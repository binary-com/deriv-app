import React from 'react';
import { Tag } from '@deriv-com/quill-ui';
import { RemainingTime } from '@deriv/components';
import { LabelPairedStopwatchCaptionRegularIcon } from '@deriv/quill-icons';
import { getCardLabelsV2 } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';

type DealCancellationRemainingTimeProps = {
    format?: string;
};

const DealCancellationRemainingTime = observer(({ format = 'mm:ss' }: DealCancellationRemainingTimeProps) => {
    const { common } = useStore();
    const { server_time: start_time } = common;
    const { contract_info } = useContractDetails();

    const { date_expiry: end_time } = contract_info.cancellation || {};
    if (!end_time || start_time.unix() > +end_time) {
        return null;
    }

    return (
        <Tag
            className='deal-cancellation-badge'
            data-testid='dt_deal_cancellation_badge'
            icon={
                <LabelPairedStopwatchCaptionRegularIcon
                    key='open-contract-card'
                    fill='var(--component-tag-label-color-default)'
                />
            }
            label={
                <RemainingTime
                    end_time={end_time}
                    format={format}
                    getCardLabels={getCardLabelsV2}
                    start_time={start_time}
                />
            }
            size='sm'
            variant='custom'
        />
    );
});

export default DealCancellationRemainingTime;
