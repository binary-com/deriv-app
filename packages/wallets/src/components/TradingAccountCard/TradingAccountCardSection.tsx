import React, { PropsWithChildren } from 'react';

const TradingAccountCardSection: React.FC<PropsWithChildren> = ({ children }) => (
    <div className='wallets-trading-account-card__section'>{children}</div>
);

export default TradingAccountCardSection;
