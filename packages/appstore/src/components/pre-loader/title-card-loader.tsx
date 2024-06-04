import ContentLoader from 'react-content-loader';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';

const TitleCardLoader = () => (
    <ContentLoader
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
        width={500}
        height={70}
    >
        <DesktopWrapper>
            <rect x='0' y='0' rx='4' ry='4' width='200' height='30' />
            <rect x='0' y='40' rx='3' ry='3' width='2000' height='20' />
        </DesktopWrapper>
        <MobileWrapper>
            <rect x='0' y='0' rx='3' ry='3' width='350' height='40' />
        </MobileWrapper>
    </ContentLoader>
);

export default TitleCardLoader;
