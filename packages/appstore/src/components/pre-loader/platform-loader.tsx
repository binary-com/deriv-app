import ContentLoader from 'react-content-loader';
import React from 'react';
import { DesktopWrapper, MobileOrTabletWrapper } from '@deriv/components';

const PlatformLoader = () => (
    <ContentLoader
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
        width={600}
        height={140}
    >
        <DesktopWrapper>
            <rect x='0' y='0' rx='5' ry='5' width='50' height='50' />
            <rect x='70' y='10' rx='4' ry='4' width='70' height='10' />
            <rect x='70' y='30' rx='3' ry='3' width='150' height='10' />
            <rect x='350' y='10' rx='5' ry='5' width='70' height='30' />
        </DesktopWrapper>
        <MobileOrTabletWrapper>
            <rect x='5' y='0' rx='5' ry='5' width='50' height='50' />
            <rect x='80' y='10' rx='4' ry='4' width='70' height='10' />
            <rect x='80' y='30' rx='3' ry='3' width='100' height='10' />
            <rect x='300' y='15' rx='5' ry='5' width='50' height='20' />
        </MobileOrTabletWrapper>
    </ContentLoader>
);

export default PlatformLoader;
