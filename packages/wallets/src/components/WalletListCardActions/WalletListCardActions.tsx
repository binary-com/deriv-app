import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import {
    LabelPairedArrowsRotateMdBoldIcon,
    LabelPairedArrowUpArrowDownMdBoldIcon,
    LabelPairedMinusMdBoldIcon,
    LabelPairedPlusMdBoldIcon,
} from '@deriv/quill-icons';
import useDevice from '../../hooks/useDevice';
import { IconButton, WalletButton, WalletText } from '../Base';
import './WalletListCardActions.scss';

type TProps = {
    accountsActiveTabIndex?: number;
};

const getWalletHeaderButtons = (isDemo?: boolean) => {
    const buttons = [
        {
            className: isDemo ? 'wallets-mobile-actions-content-icon' : 'wallets-mobile-actions-content-icon--primary',
            color: isDemo ? 'white' : 'primary',
            icon: isDemo ? <LabelPairedArrowsRotateMdBoldIcon /> : <LabelPairedPlusMdBoldIcon fill='#FFF' />,
            name: isDemo ? 'reset-balance' : 'deposit',
            text: isDemo ? 'Reset balance' : 'Deposit',
            variant: isDemo ? 'outlined' : 'contained',
        },
        {
            className: 'wallets-mobile-actions-content-icon',
            color: 'white',
            icon: <LabelPairedMinusMdBoldIcon />,
            name: 'withdrawal',
            text: 'Withdraw',
            variant: 'outlined',
        },
        {
            className: 'wallets-mobile-actions-content-icon',
            color: 'white',
            icon: <LabelPairedArrowUpArrowDownMdBoldIcon />,
            name: 'account-transfer',
            text: 'Transfer',
            variant: 'outlined',
        },
    ] as const;

    // Filter out the "Withdraw" button when is_demo is true
    const filteredButtons = isDemo ? buttons.filter(button => button.name !== 'withdrawal') : buttons;

    return filteredButtons;
};

const WalletListCardActions: React.FC<TProps> = ({ accountsActiveTabIndex }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();

    const isActive = activeWallet?.is_active;
    const isDemo = activeWallet?.is_virtual;

    if (isMobile)
        return (
            <div className='wallets-mobile-actions__container'>
                <div className='wallets-mobile-actions'>
                    {getWalletHeaderButtons(isDemo).map(button => (
                        <div className='wallets-mobile-actions-content' key={button.name}>
                            <IconButton
                                aria-label={button.name}
                                className={button.className}
                                color={button.color}
                                icon={button.icon}
                                onClick={() => {
                                    history.push(`/wallet/${button.name}`, { accountsActiveTabIndex });
                                }}
                                size='lg'
                            />
                            <WalletText size='sm' weight={button.text === 'Deposit' ? 'bold' : 'normal'}>
                                {button.text}
                            </WalletText>
                        </div>
                    ))}
                </div>
            </div>
        );

    return (
        <div className='wallets-header__actions'>
            {getWalletHeaderButtons(isDemo).map(button => (
                <WalletButton
                    ariaLabel={button.name}
                    icon={button.icon}
                    key={button.name}
                    onClick={() => {
                        history.push(`/wallet/${button.name}`);
                    }}
                    rounded='lg'
                    variant={button.variant}
                >
                    {isActive ? button.text : ''}
                </WalletButton>
            ))}
        </div>
    );
};

export default WalletListCardActions;
