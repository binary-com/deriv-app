import ContentLoader from 'react-content-loader';
import { MobileWrapper } from '@deriv/components';

const ButtonToggleLoader = () => (
    <ContentLoader
        height={80}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
        width={500}
    >
        <MobileWrapper>
            <rect x='10' y='35' rx='5' ry='5' width='330' height='45' />
        </MobileWrapper>
    </ContentLoader>
);

export default ButtonToggleLoader;
