import ContentLoader from 'react-content-loader';
import React from 'react';
import { useDevice } from '@deriv/hooks';

const TradeParamsLoader = ({ speed }: { speed: number }) => {
    const { isMobile } = useDevice();

    if (isMobile) {
        return (
            <ContentLoader
                height={214}
                width={344}
                speed={speed}
                backgroundColor={'var(--general-section-1)'}
                foregroundColor={'var(--general-hover)'}
                viewBox='0 0 344 176'
            >
                <rect x='148' y='24' rx='3' ry='3' width='40' height='4' />
                <rect x='8' y='40' rx='4' ry='4' width='328' height='40' />
                <rect x='8' y='88' rx='4' ry='4' width='328' height='40' />
                <rect x='8' y='136' rx='4' ry='4' width='160' height='70' />
                <rect x='176' y='136' rx='4' ry='4' width='160' height='70' />
            </ContentLoader>
        );
    }

    return (
        <ContentLoader
            height={548}
            width={240}
            speed={speed}
            backgroundColor={'var(--general-section-1)'}
            foregroundColor={'var(--general-hover)'}
        >
            <rect x='0' y='0' rx='4' ry='4' width='240' height='76' />
            <rect x='0' y='84' rx='4' ry='4' width='240' height='132' />
            <rect x='0' y='224' rx='4' ry='4' width='240' height='120' />
            <rect x='0' y='352' rx='4' ry='4' width='240' height='194' />
        </ContentLoader>
    );
};

export { TradeParamsLoader };
