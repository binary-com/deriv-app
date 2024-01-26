import React from 'react';
import Options from '../../public/images/options.svg';
import { TradingAccountCard, TradingAccountCardContent, TradingAccountCardLightButton } from '../TradingAccountCard';

const GetDerivAccount = () => {
    const title = 'Deriv account';

    const description = 'Get a real Deriv account, start trading and manage your funds.';

    return (
        <div className='grid grid-cols-1 gap-200 lg:grid-cols-3 lg:gap-x-1200 lg:gap-y-200'>
            <TradingAccountCard leading={() => <Options />} trailing={() => <TradingAccountCardLightButton />}>
                <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
            </TradingAccountCard>
        </div>
    );
};

export default GetDerivAccount;
