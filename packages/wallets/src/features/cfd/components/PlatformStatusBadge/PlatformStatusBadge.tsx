import React, { ComponentProps } from 'react';
import { useTradingPlatformStatus } from '@deriv/api-v2';
import { LegacyWarningIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Badge, Text } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import type { TAccount } from '../../../cashier/modules/Transfer/types';
import { MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../constants';

type TProps = {
    badgeSize: ComponentProps<typeof Badge>['badgeSize'];
    cashierAccount?: TAccount;
    className?: ComponentProps<typeof Badge>['className'];
    mt5Account?: THooks.SortedMT5Accounts;
};

const PlatformStatusBadge: React.FC<TProps> = ({ badgeSize, cashierAccount, className, mt5Account }) => {
    const { getPlatformStatus } = useTradingPlatformStatus();
    const platformStatus = getPlatformStatus(cashierAccount?.account_type ?? mt5Account?.platform ?? '');
    const { localize } = useTranslations();

    const isMaintenance =
        platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE ||
        [mt5Account?.status || cashierAccount?.status].includes(MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE);
    const isUnavailable = [mt5Account?.status, cashierAccount?.status].includes(TRADING_PLATFORM_STATUS.UNAVAILABLE);

    const getBadgeText = () => {
        if (isMaintenance) return localize('Server maintenance');
        if (isUnavailable) return localize('Unavailable');
        return '';
    };

    return (
        <Badge
            badgeSize={badgeSize}
            className={className}
            color='warning'
            isBold
            leftIcon={<LegacyWarningIcon iconSize='xs' />}
            padding='loose'
            rounded='sm'
            variant='bordered'
        >
            <Text color='warning' lineHeight='2xl' size='2xs' weight='bold'>
                <span style={{ color: 'var(--status-warning, #ffad3a)' }}>{getBadgeText()}</span>
            </Text>
        </Badge>
    );
};

export default PlatformStatusBadge;
