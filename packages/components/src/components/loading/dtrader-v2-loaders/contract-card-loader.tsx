import React from 'react';
import { Skeleton, VARIANT } from '../../skeleton';

const ContractCardLoader = () => (
    <div className='contract-card-loader' data-testid='dt_contract_card_loader'>
        <div className='details'>
            <Skeleton variant={VARIANT.ICON} />
            <div className='title'>
                <Skeleton width={88} height={18} />
                <Skeleton width={128} height={18} />
            </div>
            <Skeleton className='stake' width={56} height={18} />
        </div>
        <div className='status-and-profit'>
            <Skeleton width={96} height={24} />
            <Skeleton width={72} height={22} />
        </div>
    </div>
);

export default ContractCardLoader;
