import React from 'react';
import { Text } from '@deriv/components';
import { PRODUCT } from '../../Helpers/cfd-config';
import { Localize } from '@deriv/translations';
import { TCompareAccountsCard } from 'Components/props.types';
import CFDCompareAccountsTitleIcon from './cfd-compare-accounts-title-icon';
import CFDCompareAccountsDescription from './cfd-compare-accounts-description';
import CFDInstrumentsLabelHighlighted from './cfd-instruments-label-highlighted';
import CFDCompareAccountsPlatformLabel from './cfd-compare-accounts-platform-label';

const CFDCompareAccountsCard = ({ trading_platforms, is_eu_user, is_demo }: TCompareAccountsCard) => {
    return (
        <div className='compare-cfd-account-main-container'>
            <div className='compare-cfd-account-card-container'>
                <CFDCompareAccountsPlatformLabel trading_platforms={trading_platforms} />
                {trading_platforms.product === PRODUCT.ZEROSPREAD && (
                    <Text
                        className='compare-cfd-account-card-container__banner'
                        weight='bold'
                        size='xs'
                        color='colored-background'
                    >
                        <Localize i18n_default_text='NEW' />
                    </Text>
                )}
                <CFDCompareAccountsTitleIcon
                    trading_platforms={trading_platforms}
                    is_eu_user={is_eu_user}
                    is_demo={is_demo}
                />
                <CFDCompareAccountsDescription trading_platforms={trading_platforms} is_demo={is_demo} />
                <CFDInstrumentsLabelHighlighted trading_platforms={trading_platforms} is_demo={is_demo} />
            </div>
        </div>
    );
};

export default CFDCompareAccountsCard;
