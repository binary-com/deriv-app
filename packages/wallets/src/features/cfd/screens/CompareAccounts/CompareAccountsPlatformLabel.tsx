import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { TPlatforms } from '../../../../types';
import { getPlatformType } from './compareAccountsConfig';
import { headerColor, platformLabel } from './constants';
import './CompareAccountsPlatformLabel.scss';

type TCompareAccountsPlatformLabel = {
    platform: TPlatforms.All;
};

const CompareAccountsPlatformLabel = ({ platform }: TCompareAccountsPlatformLabel) => {
    const platformType = getPlatformType(platform);
    const { localize } = useTranslations();

    return (
        <div
            className={`
            wallets-compare-accounts-platform-label
            wallets-compare-accounts-platform-label--${platformType.toLowerCase()}
            `}
            data-testid='dt_wallets_compare_accounts_platform_label'
        >
            <Text align='center' as='p' color={headerColor[platformType]} size='xs' weight='bold'>
                {platformLabel(localize)[platformType]}
            </Text>
        </div>
    );
};

export default CompareAccountsPlatformLabel;
