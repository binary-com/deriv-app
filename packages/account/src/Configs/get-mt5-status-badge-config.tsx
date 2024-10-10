import React from 'react';
import { Text } from '@deriv/components';
import { MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '@deriv/shared';
import { Localize } from '@deriv-com/translations';
import { TMT5AccountStatus } from '../Types/common.type';

const getMT5StatusBadgeConfig = (mt5_account_status: TMT5AccountStatus) => {
    const BadgeTextComponent = <Text key={0} weight='bold' size='xxxs' color='warning' />;

    switch (mt5_account_status) {
        case MT5_ACCOUNT_STATUS.PENDING:
            return {
                text: <Localize i18n_default_text='In review' />,
                icon: 'IcMt5Pending',
            };
        case MT5_ACCOUNT_STATUS.FAILED:
            return {
                text: <Localize i18n_default_text='Failed' />,
                icon: 'IcMt5Failed',
                icon_size: '18',
            };
        case MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION: {
            return {
                text: <Localize i18n_default_text='Needs Verification' />,
                icon: 'IcMt5Verification',
                icon_size: '18',
            };
        }
        case MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION:
            return {
                text: <Localize i18n_default_text='<0>No new positions</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case MT5_ACCOUNT_STATUS.MIGRATED_WITHOUT_POSITION:
            return {
                text: <Localize i18n_default_text='<0>Account closed</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE:
            return {
                text: <Localize i18n_default_text='<0>Server maintenance</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        case TRADING_PLATFORM_STATUS.UNAVAILABLE:
            return {
                text: <Localize i18n_default_text='<0>Unavailable</0>' components={[BadgeTextComponent]} />,
                icon: 'IcAlertWarning',
            };
        default:
            return {
                text: '',
                icon: '',
            };
    }
};

export default getMT5StatusBadgeConfig;
