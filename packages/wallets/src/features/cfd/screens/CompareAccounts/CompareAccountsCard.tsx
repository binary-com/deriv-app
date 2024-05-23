import React from 'react';
import { WalletText } from '../../../../components';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS } from '../../constants';
import CompareAccountsDescription from './CompareAccountsDescription';
import CompareAccountsPlatformLabel from './CompareAccountsPlatformLabel';
import CompareAccountsTitleIcon from './CompareAccountsTitleIcon';
import InstrumentsLabelHighlighted from './InstrumentsLabelHighlighted';
import './CompareAccountsCard.scss';

type TCompareAccountsCard = {
    isDemo: boolean;
    isEuRegion: boolean;
    isEuUser: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsCard = ({
    isDemo,
    isEuRegion,
    isEuUser,
    marketType,
    platform,
    shortCode,
}: TCompareAccountsCard) => {
    return (
        <div>
            <div className='wallets-compare-accounts-card'>
                <CompareAccountsPlatformLabel platform={platform} />
                {platform === CFD_PLATFORMS.CTRADER && (
                    <div className='wallets-compare-accounts-card__banner'>
                        <WalletText color='white' size='xs' weight='bold'>
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
                    isDemo={isDemo}
                    isEuRegion={isEuRegion}
                    marketType={marketType}
                    platform={platform}
                    shortCode={shortCode}
                />
                {isEuUser && (
                    <div className='wallets-compare-accounts-card__eu-clients'>
                        <WalletText color='red' size='2xs' weight='bold'>
                            *Boom 300 and Crash 300 Index
                        </WalletText>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompareAccountsCard;
