import './tradingAppSkeleton.scss';
import { HorizontalDivider } from '../divider/divider';

const TradingAppCardSkeleton = () => (
    <div className='trading-app-loader'>
        <div className='skeleton-loader trading-app-loader__icon' />
        <div className='trading-app-loader__container'>
            <div className='trading-app-loader__container__content'>
                <div className='trading-app-loader__container__content--details'>
                    <div className='skeleton-loader trading-app-loader__container__content--details__title' />
                    <div className='skeleton-loader trading-app-loader__container__content--details__description' />
                </div>
                <div className='skeleton-loader trading-app-loader__container__content--button' />
            </div>
            <HorizontalDivider />
        </div>
    </div>
);

export default TradingAppCardSkeleton;
