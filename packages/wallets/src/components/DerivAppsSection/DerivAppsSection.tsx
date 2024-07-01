import React from 'react';
import { useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { DerivAppsGetAccount } from './DerivAppsGetAccount';
import { DerivAppsTradingAccount } from './DerivAppsTradingAccount';
import './DerivAppsSection.scss';

const DerivAppsSection = () => {
    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    return activeLinkedToTradingAccount?.loginid ? <DerivAppsTradingAccount /> : <DerivAppsGetAccount />;
};

export default DerivAppsSection;
