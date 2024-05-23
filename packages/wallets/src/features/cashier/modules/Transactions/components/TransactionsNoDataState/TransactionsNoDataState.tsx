import React from 'react';
//TODO: replace with quill-icons
import NoRecentTransactions from '../../../../../../public/images/no-recent-transactions.svg';
import './TransactionsNoDataState.scss';

const TransactionsNoDataState = () => {
    return (
        <div className='wallets-transactions-no-data-state'>
            <NoRecentTransactions />
            <p className='wallets-transactions-no-data-state__title'>No transactions found</p>
        </div>
    );
};

export default TransactionsNoDataState;
