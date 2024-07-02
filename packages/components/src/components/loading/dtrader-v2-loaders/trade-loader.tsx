import React from 'react';
import { Skeleton, VARIANT } from '../../skeleton';

const TradeLoader = () => {
    return (
        <div className='trade-loader'>
            <div className='skeleton-box__trade-types' data-testid='dt_trade_loader'>
                {Array.from(new Array(6)).map((_, idx) => (
                    <Skeleton key={idx} width={88} height={32} />
                ))}
            </div>
            <div className='skeleton-box__market'>
                <Skeleton width={200} height={42} />
            </div>
            <div className='skeleton-box__trade-params'>
                <div className='skeleton-box__trade-params-row'>
                    <Skeleton variant={VARIANT.TEXT} width={96} height={24} />
                    <Skeleton width={96} height={32} />
                </div>
                <div className='skeleton-box__trade-params-column'>
                    {Array.from(new Array(3)).map((_, idx) => (
                        <Skeleton key={idx} height={56} />
                    ))}
                </div>
            </div>
            <div className='skeleton-box__chart'>
                <Skeleton />
            </div>
        </div>
    );
};

export default TradeLoader;
