import ContentLoader from 'react-content-loader';
import React from 'react';

const PlatformSwitcherLoader = ({ is_mobile_or_tablet, speed }) => {
    const container_margin = 16;
    const element_spacing = is_mobile_or_tablet ? 16 : 8;
    const logo_size = is_mobile_or_tablet ? 40 : 32;
    const name_height = 16;
    const name_width = 90;
    const name_x = container_margin + logo_size + element_spacing;
    const name_y = is_mobile_or_tablet ? 12 : 8;
    const container_width = container_margin * 2 + logo_size + element_spacing + name_width;
    return (
        <ContentLoader
            height={logo_size}
            width={container_width}
            speed={speed}
            backgroundColor={'var(--general-section-1)'}
            foregroundColor={'var(--general-hover)'}
        >
            <rect x={container_margin} y='0' rx='4' ry='4' width={logo_size} height={logo_size} />
            <rect x={name_x} y={name_y} rx='4' ry='4' width={name_width} height={name_height} />
        </ContentLoader>
    );
};

export { PlatformSwitcherLoader };
