import ContentLoader from 'react-content-loader';
import React from 'react';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';

const PlatformLoader = () => (
    <ContentLoader
        height={140}
        primaryColor={'var(--general-section-1)'}
        secondaryColor={'var(--general-hover)'}
        viewBox='0 0 380 70'
    >
        <DesktopWrapper>
            <rect x='5' y='0' rx='5' ry='5' width='50' height='50' />
            <rect x='80' y='10' rx='4' ry='4' width='70' height='10' />
            <rect x='80' y='30' rx='3' ry='3' width='100' height='10' />
            <rect x='300' y='15' rx='5' ry='5' width='50' height='20' />
        </DesktopWrapper>
        <MobileWrapper>
            <rect x='5' y='0' rx='5' ry='5' width='50' height='50' />
            <rect x='80' y='10' rx='4' ry='4' width='70' height='10' />
            <rect x='80' y='30' rx='3' ry='3' width='100' height='10' />
            <rect x='300' y='15' rx='5' ry='5' width='50' height='20' />
        </MobileWrapper>
    </ContentLoader>
);

export default PlatformLoader;
