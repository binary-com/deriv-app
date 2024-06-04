import './cfdToggleSkeleton.scss';

const CFDToggleSkeleton = () => (
    <div className='cfd-toggle-skeleton-loader'>
        <div className='skeleton-loader cfd-toggle-skeleton-loader__switcher' />
        <div className='skeleton-loader cfd-toggle-skeleton-loader__description' />
        <div className='skeleton-loader cfd-toggle-skeleton-loader__description' />
    </div>
);

export default CFDToggleSkeleton;
