import React from 'react';
import {
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5DerivedIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    IconTypes,
} from '@deriv/quill-icons';

const iconMapper: Record<string, IconTypes> = {
    DerivX: AccountsDerivXIcon,
    Dmt5Cfds: AccountsDmt5CfdsIcon,
    Dmt5Derived: AccountsDmt5DerivedIcon,
    Dmt5Financial: AccountsDmt5FinancialIcon,
    Dmt5Swf: AccountsDmt5SwfIcon,
};

type TProps = {
    accountName: keyof typeof iconMapper;
    size?: 'lg' | 'md' | 'sm' | 'xl';
};

const AccountIcon: React.FC<TProps> = ({ accountName, size = 'md' }) => {
    const Icon = iconMapper[accountName];

    return <Icon iconSize={size} />;
};

export default AccountIcon;
