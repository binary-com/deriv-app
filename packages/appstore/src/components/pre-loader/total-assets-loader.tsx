import ContentLoader from 'react-content-loader';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';

const TotalAssetsLoader = () => (
    <ContentLoader backgroundColor={'var(--general-section-1)'} foregroundColor={'var(--general-hover)'} height={50}>
        <DesktopWrapper>
            <rect x='5' y='5' rx='3' ry='3' width='120' height='50' />
        </DesktopWrapper>
        <MobileWrapper>
            <rect x='0' y='5' rx='3' ry='3' width='100' height='30' />
        </MobileWrapper>
    </ContentLoader>
);

export default TotalAssetsLoader;
