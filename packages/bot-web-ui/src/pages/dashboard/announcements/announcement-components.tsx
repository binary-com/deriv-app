import React from 'react';
import { Text } from '@deriv/components';
import { LabelPairedCircleInfoCaptionBoldIcon } from '@deriv/quill-icons';

export const IconAnnounce = ({ announce }: { announce: boolean }) => (
    <>
        <LabelPairedCircleInfoCaptionBoldIcon fill='#0777C4' width='24' height='26' />
        {announce && <div className='notification__icon--indicator' />}
    </>
);

export const TitleAnnounce = ({ title, announce }: { title: string; announce: boolean }) => (
    <Text
        size='xs'
        line_height='l'
        weight={announce ? 'bold' : 'normal'}
        styles={!announce ? { color: 'var(--text-announce-message-disabled)' } : {}}
    >
        {title}
    </Text>
);

export const MessageAnnounce = ({ message, date, announce }: { message: string; date: string; announce: boolean }) => (
    <>
        <Text
            size='xs'
            line_height='l'
            weight={announce ? 'normal' : 'lighter'}
            styles={!announce ? { color: 'var(--text-announce-message-disabled)' } : {}}
        >
            {message}
        </Text>
        <Text size='xxs' styles={{ color: 'var(--text-date)' }}>
            {date}
        </Text>
    </>
);
