import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveLinkedToTradingAccount, useActiveWalletAccount, useBalance } from '@deriv/api-v2';
import useDevice from '../../hooks/useDevice';
import { WalletButton, WalletText } from '../Base';
import { WalletListCardBadge } from '../WalletListCardBadge';
import { WalletResponsiveSvg } from '../WalletResponsiveSvg';

const DerivAppsTradingAccount: React.FC = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { isLoading } = useBalance();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return (
        <div className='wallets-deriv-apps-section wallets-deriv-apps-section__border'>
            <div className={isMobile ? 'wallets-deriv-apps-section__icon-small' : 'wallets-deriv-apps-section__icon'}>
                <WalletResponsiveSvg icon='IcWalletOptionsLight' />
            </div>
            <div className='wallets-deriv-apps-section__details'>
                <div className='wallets-deriv-apps-section__title-and-badge'>
                    <WalletText size='sm'>Options</WalletText>
                    <WalletListCardBadge isDemo={activeWallet?.is_virtual} label={activeWallet?.landing_company_name} />
                </div>
                {isLoading ? (
                    <div className='wallets-skeleton wallets-deriv-apps-balance-loader' />
                ) : (
                    <WalletText size='sm' weight='bold'>
                        {activeLinkedToTradingAccount?.display_balance}
                    </WalletText>
                )}
                <WalletText color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                    {activeLinkedToTradingAccount?.loginid}
                </WalletText>
            </div>
            <WalletButton
                color='white'
                onClick={() => {
                    history.push('/wallets/cashier/transfer', {
                        toAccountLoginId: activeLinkedToTradingAccount?.loginid,
                    });
                }}
                variant='outlined'
            >
                Transfer
            </WalletButton>
        </div>
    );
};

export { DerivAppsTradingAccount };
