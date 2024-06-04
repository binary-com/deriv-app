import './tradershubMenuSkeleton.scss';

const TradershubMenuSkeleton = () => {
    return (
        <div className='tradershub-skeleton-loader'>
            <div className='skeleton-loader tradershub-skeleton-loader__icon' />
            <div className='skeleton-loader tradershub-skeleton-loader__title' />
        </div>
    );
};

export default TradershubMenuSkeleton;
