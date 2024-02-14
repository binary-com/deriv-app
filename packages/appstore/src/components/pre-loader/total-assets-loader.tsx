import ContentLoader from 'react-content-loader';
import React from 'react';
import { useDevice } from '@deriv-com/ui';

const TotalAssetsLoader = () => {
    const { isDesktop } = useDevice();

    return (
        <ContentLoader
            backgroundColor={'var(--general-section-1)'}
            foregroundColor={'var(--general-hover)'}
            height={50}
        >
            {isDesktop ? (
                <rect x='5' y='5' rx='3' ry='3' width='120' height='50' />
            ) : (
                <rect x='0' y='5' rx='3' ry='3' width='100' height='30' />
            )}
        </ContentLoader>
    );
};

export default TotalAssetsLoader;
