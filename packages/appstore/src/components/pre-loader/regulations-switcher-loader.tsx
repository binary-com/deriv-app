import ContentLoader from 'react-content-loader';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';

const RegulationsSwitcherLoader = () => (
    <ContentLoader
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
        width={300}
        height={60}
    >
        <DesktopWrapper>
            <rect x='10' y='10' rx='6' ry='6' width='190' height='40' />
        </DesktopWrapper>
        <MobileWrapper>
            <rect x='60' y='10' rx='6' ry='6' width='80' height='30' />
        </MobileWrapper>
    </ContentLoader>
);

export default RegulationsSwitcherLoader;
