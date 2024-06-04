import ContentLoader from 'react-content-loader';

const CurrencySwitcherLoader = () => {
    return (
        <ContentLoader
            viewBox='0 0 332 72'
            backgroundColor={'var(--general-section-1)'}
            foregroundColor={'var(--general-hover)'}
        >
            <circle cx='34' cy='36' r='20' />
            <rect x='80' y='18' rx='4' ry='4' width='70' height='12' />
            <rect x='80' y='36' rx='3' ry='3' width='100' height='14' />
            <rect x='240' y='22' rx='5' ry='5' width='70' height='30' />
        </ContentLoader>
    );
};

export default CurrencySwitcherLoader;
