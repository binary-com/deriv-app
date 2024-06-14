import ContentLoader from 'react-content-loader';
import React from 'react';
import { MobileOrTabletWrapper } from '@deriv/components';

const ButtonToggleLoader = () => (
    <ContentLoader
        height={80}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
        width={500}
    >
        <MobileOrTabletWrapper>
            <rect x='10' y='35' rx='5' ry='5' width='330' height='45' />
        </MobileOrTabletWrapper>
    </ContentLoader>
);

export default ButtonToggleLoader;
