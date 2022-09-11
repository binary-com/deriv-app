import * as React from 'react';
import CFDAccounts from 'Components/CFDs';

const TradingHub = () => {
    return (
        <div className='trading-hub'>
            Trading Hub
            <CFDAccounts is_demo={false} />
        </div>
    );
};

export default TradingHub;
