import React from 'react';
import { WalletText } from '../../../../components';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS } from '../../constants';
import CompareAccountsButton from './CompareAccountsButton';
import CompareAccountsDescription from './CompareAccountsDescription';
import CompareAccountsPlatformLabel from './CompareAccountsPlatformLabel';
import CompareAccountsTitleIcon from './CompareAccountsTitleIcon';
import InstrumentsLabelHighlighted from './InstrumentsLabelHighlighted';
import './CompareAccountsCard.scss';

type TCompareAccountsCard = {
    isAccountAdded: boolean;
    isCrypto: boolean;
    isDemo: boolean;
    isEuRegion: boolean;
    isEuUser: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsCard = ({
    isAccountAdded,
    isCrypto,
    isDemo,
    isEuRegion,
    isEuUser,
    marketType,
    platform,
    shortCode,
}: TCompareAccountsCard) => {
    return (
        <div className='wallets-compare-accounts-main-container'>
            <div className='wallets-compare-accounts-card-container'>
                <CompareAccountsPlatformLabel platform={platform} />
                {platform === CFD_PLATFORMS.CTRADER && (
                    <div className='compare-cfd-account-card-container__banner'>
                        <WalletText size='xs' weight='bold'>
                            New!
                        </WalletText>
                    </div>
                )}
                <CompareAccountsTitleIcon
                    isDemo={isDemo}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
                <CompareAccountsDescription
                    isDemo={isDemo}
                    isEuRegion={isEuRegion}
                    marketType={marketType}
                    shortCode={shortCode}
                />
                <InstrumentsLabelHighlighted
                    isEuRegion={isEuRegion}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
                {isEuUser && (
                    <div className='compare-cfd-account-card-container__eu-clients'>
                        <WalletText color='red' size='2xs' weight='bold'>
                            *Boom 300 and Crash 300 Index
                        </WalletText>
                    </div>
                )}
                <CompareAccountsButton
                    isAccountAdded={isAccountAdded}
                    isCrypto={isCrypto}
                    isDemo={isDemo}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
            </div>
        </div>
    );
};

export default CompareAccountsCard;
