import React from 'react';
import ContractCardLoader from './contract-card-loader';
import { Skeleton } from '../../skeleton';

const ContractDetailsLoader = () => {
    return (
        <div className='contract-details-loader' data-testid='dt_contract_details_loader'>
            <ContractCardLoader />
            <div className='skeleton-box__chart'>
                <Skeleton />
            </div>
            <div className='skeleton-box__details'>
                <Skeleton width={136} height={24} />
                <div>
                    {Array.from(new Array(4)).map((_, idx) => {
                        return (
                            <div key={idx} className='skeleton-box__details-row'>
                                <Skeleton width={88} height={22} />
                                <Skeleton width={128} height={22} />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className='skeleton-box__details'>
                <Skeleton width={136} height={24} />
                <Skeleton paragraph={{ rows: 2 }} height={18} />
            </div>
            <div className='skeleton-box__details'>
                <Skeleton width={136} height={24} />
                <div>
                    {Array.from(new Array(2)).map((_, idx) => {
                        return (
                            <div key={idx} className='skeleton-box__details-row'>
                                <Skeleton width={88} height={18} />
                                <div className='skeleton-box__details-column'>
                                    <Skeleton width={88} height={22} />
                                    {Array.from(new Array(idx === 0 ? 1 : 2)).map((_, idx) => (
                                        <Skeleton key={idx} width={72} height={16} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ContractDetailsLoader;
