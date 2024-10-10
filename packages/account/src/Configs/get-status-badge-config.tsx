import React from 'react';
import { ACCOUNT_BADGE_STATUS, TAccountBadgeStatus } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';

const getStatusBadgeConfig = (account_status: TAccountBadgeStatus) => {
    switch (account_status) {
        case ACCOUNT_BADGE_STATUS.PENDING:
            return {
                text: <Localize i18n_default_text='In review' />,
                icon: 'IcMt5Pending',
            };
        case ACCOUNT_BADGE_STATUS.FAILED:
            return {
                text: <Localize i18n_default_text='Failed' />,
                icon: 'IcMt5Failed',
                icon_size: '18',
            };
        case ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION: {
            return {
                text: <Localize i18n_default_text='Needs Verification' />,
                icon: 'IcMt5Verification',
                icon_size: '18',
            };
        }
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

export default getStatusBadgeConfig;
