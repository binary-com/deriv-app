import React from 'react';
import { Skeleton } from '../../skeleton';

type TPositionsLoaderProps = {
    initial_app_loading?: boolean;
    is_closed_tab?: boolean;
};

const PositionsLoader = ({ initial_app_loading, is_closed_tab }: TPositionsLoaderProps) => {
    return (
        <div className='positions-loader' data-testid='dt_positions_loader'>
            {initial_app_loading && (
                <div className='skeleton-box__tabs'>
                    {Array.from(new Array(2)).map((_, idx) => {
                        return <Skeleton key={idx} width={56} height={22} />;
                    })}
                </div>
            )}
            <div className='skeleton-box__filters'>
                {Array.from(new Array(is_closed_tab ? 2 : 1)).map((_, idx) => {
                    return <Skeleton key={idx} width={144} height={32} />;
                })}
            </div>
            <div className='skeleton-box__total-pnl-or-date'>
                {Array.from(new Array(is_closed_tab ? 1 : 2)).map((_, idx) => {
                    return <Skeleton key={idx} width={idx === 0 ? 112 : 68} height={22} />;
                })}
            </div>
            <div className='skeleton-box__contract-cards'>
                {Array.from(new Array(7)).map((_, idx) => (
                    <Skeleton key={idx} height={104} />
                ))}
            </div>
        </div>
    );
};

export default PositionsLoader;
