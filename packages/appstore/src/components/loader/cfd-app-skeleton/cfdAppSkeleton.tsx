import './cfdAppskeleton.scss';

const CfdAppSkeleton = () => (
    <div className='cfd-app-skeleton-loader'>
        <div className='cfd-app-skeleton-loader__header'>
            <div className=' skeleton-loader cfd-app-skeleton-loader__header__icon' />
            <div className='skeleton-loader cfd-app-skeleton-loader__header__title' />
        </div>
        <div className='skeleton-loader cfd-app-skeleton-loader__body' />
    </div>
);

export default CfdAppSkeleton;
