import React from 'react';
import { CFD_PLATFORMS } from '@deriv/shared';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { TMissingRealAccount } from './props.types';

const MissingRealAccount = ({ onClickSignup, platform }: TMissingRealAccount) => (
    <div className='cfd-dashboard__missing-real'>
        <div className='cfd-dashboard__missing-real-wrapper'>
            <Text className='cfd-dashboard__missing-real--heading' as='h1' size='1.6rem' weight='700'>
                {platform === CFD_PLATFORMS.MT5 ? (
                    <Localize i18n_default_text='You need a real account (fiat currency or cryptocurrency) in Deriv to create a real DMT5 account.' />
                ) : (
                    <Localize i18n_default_text='To create a Deriv X real account, create a Deriv real account first.' />
                )}
            </Text>
        </div>
        <div>
            <Button className='cfd-dashboard__missing-real--button' onClick={onClickSignup} type='button' primary>
                <span className='btn__text'>
                    <Localize i18n_default_text='Create a Deriv account' />
                </span>
            </Button>
        </div>
    </div>
);

export default MissingRealAccount;
