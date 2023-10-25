import React from 'react';
import DerivApps from '../../public/images/deriv-apps.svg';
import { THooks } from '../../types';
import { WalletButton, WalletText } from '../Base';

type TProps = {
    isMaltaWallet?: THooks.ActiveWalletAccount['is_malta_wallet'];
};

const DerivAppsGetAccount: React.FC<TProps> = ({ isMaltaWallet }) => {
    return (
        <div className='wallets-deriv-apps-section'>
            <DerivApps />
            <div className='wallets-deriv-apps-section__details'>
                <WalletText size='sm' weight='bold'>
                    Deriv Apps
                </WalletText>
                <WalletText lineHeight='2xs' size='2xs'>
                    {isMaltaWallet
                        ? 'Get a Deriv Apps trading account regulated by MFSA to trade multipliers on Deriv Trader.'
                        : 'Get a Deriv Apps trading account to trade options and multipliers on these apps.'}
                </WalletText>
            </div>
            <WalletButton color='primary-light' text='Get' />
        </div>
    );
};

export { DerivAppsGetAccount };
