import React from 'react';
import classNames from 'classnames';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import './WalletListCardBadge.scss';

type TProps = {
    isDemo?: THooks.WalletAccountsList['is_virtual'];
    label?: THooks.WalletAccountsList['landing_company_name'];
};

const WalletListCardBadge: React.FC<TProps> = ({ isDemo, label }) => {
    const className = classNames('wallets-list-card__badge', {
        'wallets-list-card__badge--demo': isDemo,
    });

    const formattedLabel = label === 'virtual' ? 'Demo' : label?.toUpperCase();

    return (
        <div className={className} data-testid='dt_wallet_list_card_badge'>
            <WalletText color={isDemo ? 'white' : 'general'} size='2xs' weight='bold'>
                {formattedLabel}
            </WalletText>
        </div>
    );
};

export default WalletListCardBadge;
