import React from 'react';
import { InlineMessage } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { getInlineTextSize } from 'Utils/responsive';
import { useDevice } from '@deriv-com/ui';

const TemporarilyBarredHint = () => {
    const { general_store } = useStores();
    const { isMobile } = useDevice();

    if (general_store.is_barred) {
        return (
            <div className='temporarily-barred-hint' data-testid='dt_temporarily_barred_hint'>
                <InlineMessage
                    message={localize(
                        "You've been temporarily barred from using our services due to multiple cancellation attempts. Try again after {{date_time}} GMT.",
                        { date_time: general_store.blocked_until_date_time }
                    )}
                    size={getInlineTextSize('sm', 'xs', isMobile)}
                />
            </div>
        );
    }

    if (!general_store.is_schedule_available) {
        return (
            <div className='temporarily-barred-hint' data-testid='dt_temporarily_barred_hint'>
                <InlineMessage
                    message={
                        general_store.active_index === 2
                            ? localize("This ad isn't listed on Buy/Sell because your business hours haven't started.")
                            : localize('Orders are only available during business hours.')
                    }
                    size={getInlineTextSize('sm', 'xs')}
                />
            </div>
        );
    }

    return null;
};

export default observer(TemporarilyBarredHint);
