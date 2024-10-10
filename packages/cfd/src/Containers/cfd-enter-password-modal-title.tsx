import React from 'react';
import { Text } from '@deriv/components';
import { getCFDPlatformLabel } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { CATEGORY, CFD_PLATFORMS } from '../Helpers/cfd-config';

type TCFDEnterPasswordModalTitleProps = { platform: typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS] };

const CFDEnterPasswordModalTitle = observer(({ platform }: TCFDEnterPasswordModalTitleProps) => {
    const {
        modules: { cfd },
    } = useStore();
    const { account_title, account_type } = cfd;

    const getAccountCardTitle = () => {
        switch (platform) {
            case CFD_PLATFORMS.CTRADER:
            case CFD_PLATFORMS.DXTRADE:
                return account_type.category === CATEGORY.REAL ? 'Real' : '';
            default:
                return account_title;
        }
    };

    return (
        <Text size='xs' className='dc-modal__container_cfd-password-modal__account-title'>
            {platform === CFD_PLATFORMS.MT5 ? (
                <Localize
                    i18n_default_text='Enter your {{platform}} password to add an {{platform}} {{account}} account.'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                        account: getAccountCardTitle(),
                    }}
                />
            ) : (
                <Localize
                    i18n_default_text='Enter your {{platform}} password to add a {{platform}} {{account}} account.'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                        account: getAccountCardTitle(),
                    }}
                />
            )}
        </Text>
    );
});

export default CFDEnterPasswordModalTitle;
