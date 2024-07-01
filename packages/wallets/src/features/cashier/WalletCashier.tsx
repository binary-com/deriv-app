import React, { useCallback, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { WalletCashierContent, WalletCashierHeader } from './components';
import { CashierScrollContext } from './context';
import './WalletCashier.scss';

const WalletCashier = () => {
    const { isLoading } = useActiveWalletAccount();

    const [onCashierScroll, setOnCashierScroll] = useState<React.UIEventHandler<HTMLDivElement> | null>(null);

    const [isContentScrolled, setIsContentScrolled] = useState(false);

    const onContentScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            const target = e.currentTarget as HTMLDivElement;
            setIsContentScrolled(target.scrollTop > 0);
            onCashierScroll?.(e);
        },
        [onCashierScroll]
    );

    if (isLoading) return <Loader />;

    return (
        <div className='wallets-cashier'>
            <WalletCashierHeader hideWalletDetails={isContentScrolled} />
            <CashierScrollContext.Provider value={{ onCashierScroll, setOnCashierScroll }}>
                <div
                    className='wallets-cashier-content'
                    data-testid='dt_wallets_cashier_content'
                    onScroll={onContentScroll}
                >
                    <WalletCashierContent />
                </div>
            </CashierScrollContext.Provider>
        </div>
    );
};

export default WalletCashier;
