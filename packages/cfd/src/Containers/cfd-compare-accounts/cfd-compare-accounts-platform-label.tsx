import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { TCompareAccountsCard } from 'Components/props.types';
import { getPlatformLabel, getHeaderColor, platformsHeaderLabel } from '../../Helpers/compare-accounts-config';

const CFDCompareAccountsPlatformLabel = ({ trading_platforms }: TCompareAccountsCard) => {
    const platform_label = getPlatformLabel(trading_platforms.platform);
    const header_color = getHeaderColor(platform_label);

    return (
        <div
            className={classNames('compare-cfd-account-platform-label', {
                'compare-cfd-account-platform-label--other-cfds':
                    platform_label === platformsHeaderLabel.other_cfds ||
                    platform_label === platformsHeaderLabel.ctrader,
                'compare-cfd-account-platform-label--derivx': platform_label === platformsHeaderLabel.derivx,
                'compare-cfd-account-platform-label--ctrader': platform_label === platformsHeaderLabel.ctrader,
            })}
        >
            <Text as='p' weight='bold' size='xxxs' align='center' color={header_color}>
                {platform_label}
            </Text>
        </div>
    );
};

export default CFDCompareAccountsPlatformLabel;
