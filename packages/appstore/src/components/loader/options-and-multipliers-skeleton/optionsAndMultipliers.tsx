import './optionsAndMultipliers.scss';

const OptionsAndMultipliersSkeleton = () => (
    <div className='options-multipliers-skeleton-loader'>
        <div className='options-multipliers-skeleton-loader__left'>
            <div className='skeleton-loader options-multipliers-skeleton-loader__left--title' />
            <div className='skeleton-loader options-multipliers-skeleton-loader__left--description' />
        </div>
        <div className='options-multipliers-skeleton-loader__right'>
            <div className='skeleton-loader options-multipliers-skeleton-loader__right--currency-switcher' />
        </div>
    </div>
);

export default OptionsAndMultipliersSkeleton;
