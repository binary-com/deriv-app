import React from 'react';
import classnames from 'classnames';
import ContentLoader from 'react-content-loader';

const JournalLoader = ({ is_mobile_or_tablet }: { is_mobile_or_tablet: boolean }) => (
    <ContentLoader
        className={classnames('journal__loader', { 'journal__loader--mobile': is_mobile_or_tablet })}
        speed={3}
        width={350}
        height={92}
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
    >
        <rect x='15' y='15' rx='5' ry='5' width='320' height='40' />
        <rect x='15' y='60' rx='5' ry='5' width='180' height='7' />
    </ContentLoader>
);

export default JournalLoader;
