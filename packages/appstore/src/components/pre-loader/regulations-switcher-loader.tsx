import React from 'react';
import ContentLoader from 'react-content-loader';
import { useDevice } from '@deriv-com/ui';

const RegulationsSwitcherLoader = () => {
    const { isDesktop } = useDevice();

    return (
        <ContentLoader
            backgroundColor={'var(--general-section-1)'}
            foregroundColor={'var(--general-hover)'}
            width={300}
            height={60}
        >
            {isDesktop ? (
                <rect x='10' y='10' rx='6' ry='6' width='190' height='40' />
            ) : (
                <rect x='60' y='10' rx='6' ry='6' width='80' height='30' />
            )}
        </ContentLoader>
    );
};

export default RegulationsSwitcherLoader;
