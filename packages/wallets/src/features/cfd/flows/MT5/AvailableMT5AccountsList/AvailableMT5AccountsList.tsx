import React from 'react';
import { useSortedMT5Accounts } from '@deriv/api';
import { TradingAccountCard, WalletButton } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import DerivedMT5 from '../../../../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../../../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../../../../public/images/mt5-swap-free.svg';
import { MT5PasswordModal } from '../../../modals';
import './AvailableMT5AccountsList.scss';

const marketTypeToDescriptionMapper = {
    all: 'Trade swap-free CFDs on MT5 with synthetics, forex, stocks, stock indices, cryptocurrencies and ETFs',
    financial: 'This account offers CFDs on financial instruments.',
    synthetic: 'This account offers CFDs on derived instruments.',
};

const marketTypeToNameMapper = {
    all: 'Swap-Free',
    financial: 'Financial',
    synthetic: 'Derived',
};

const marketTypeToIconMapper = {
    all: <SwapFreeMT5 />,
    financial: <FinancialMT5 />,
    synthetic: <DerivedMT5 />,
};

type TProps = {
    account: NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number];
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { show } = useModal();
    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-mt5__icon'>
                    {marketTypeToIconMapper[account.market_type || 'all']}
                </div>
            )}
            trailing={() => (
                <WalletButton
                    color='primary-light'
                    onClick={() =>
                        show(
                            <MT5PasswordModal
                                marketType={account?.market_type || 'synthetic'}
                                platform={account.platform}
                            />
                        )
                    }
                    text='Get'
                />
            )}
        >
            <div className='wallets-available-mt5__details'>
                <p className='wallets-available-mt5__details-title'>
                    {marketTypeToNameMapper[account.market_type || 'all']}
                </p>
                <p className='wallets-available-mt5__details-description'>
                    {marketTypeToDescriptionMapper[account.market_type || 'all']}
                </p>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
