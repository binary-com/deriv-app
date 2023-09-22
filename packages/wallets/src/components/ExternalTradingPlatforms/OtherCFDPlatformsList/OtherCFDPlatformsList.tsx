import React from 'react';
import { useDxtradeAccountsList } from '@deriv/api';
import { AddedDxtradeAccountsList } from '../AddedDxtradeAccountsList';
import { AvailableDxtradeAccountsList } from '../AvailableDxtradeAccountsList';
import './OtherCFDPlatformsList.scss';

const OtherCFDPlatformsList: React.FC = () => {
    const { data } = useDxtradeAccountsList();
    const has_dxtrade_account = !!data?.length;

    return (
        <div className='wallets-other-cfd'>
            <div className='wallets-other-cfd__title'>
                <h1>Other CFD Platforms</h1>
            </div>
            <div className='wallets-other-cfd__content'>
                {has_dxtrade_account ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />}
            </div>
        </div>
    );
};

export default OtherCFDPlatformsList;
