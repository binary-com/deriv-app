import React from 'react';
import classNames from 'classnames';
import Text from '../text';
import { isMobile } from '@deriv/shared';
import { AppLinkedWithWalletIcon } from '../app-linked-with-wallet-icon';
import { TWalletCFDCard } from './wallet-cfd-success-dialog';
import './wallet-cfd-card.scss';

const WalletCFDCard = ({ wallet }: { wallet: TWalletCFDCard }) => {
    const { currency, gradient_header_class, icon, is_demo, type } = wallet;

    // TODO: Update with other platform and CFDs
    let app_icon = '';
    switch (type) {
        case 'synthetic':
            app_icon = 'Derived';
            break;
        case 'all':
            app_icon = 'SwapFree';
            break;
        case 'financial':
            app_icon = 'Financial';
            break;
        default:
            app_icon = '';
            break;
    }

    let account_title = '';
    switch (type) {
        case 'synthetic':
            account_title = 'MT5 Derived';
            break;
        case 'all':
            account_title = 'MT5 SwapFree';
            break;
        case 'financial':
            account_title = 'MT5 Financial';
            break;
        default:
            account_title = '';
            break;
    }

    return (
        <div className='wallet-cfd-card'>
            <div className='wallet-cfd-card__bg'>
                <div className='wallet-cfd-card__shine' />
                <div className='wallet-cfd-card__icon'>
                    <AppLinkedWithWalletIcon
                        app_icon={app_icon}
                        app_type='cfd'
                        gradient_class={gradient_header_class}
                        hide_watermark
                        type={is_demo ? 'demo' : 'fiat'}
                        wallet_icon={icon}
                    />
                </div>
                <div
                    className={classNames('wallet-cfd-card__badge', {
                        'wallet-cfd-card__badge--demo': is_demo,
                        'wallet-cfd-card__badge--real': !is_demo,
                    })}
                >
                    <Text
                        color='colored-background'
                        line_height='xxs'
                        weight='bold'
                        size={isMobile() ? 'xxxxs' : 'xxxs'}
                    >
                        {is_demo ? 'Demo' : 'Real'}
                    </Text>
                </div>
                <div className='wallet-cfd-card__details'>
                    {/* account title */}
                    <Text color='prominent' weight='light' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                        {account_title}
                    </Text>
                    {/* wallet currency */}
                    <Text color='less-prominent' weight='light' size={isMobile() ? 'xxxxs' : 'xxxs'}>
                        {currency} Wallet
                    </Text>
                    {/* total balance */}
                    <Text color='prominent' weight='bold' size={isMobile() ? 'xxxs' : 'xxs'}>
                        {is_demo ? `10,000.00 ${currency}` : `0.00 ${currency}`}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default WalletCFDCard;
