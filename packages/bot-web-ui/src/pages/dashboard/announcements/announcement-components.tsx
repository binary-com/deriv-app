import React from 'react';
import { Icon, Text } from '@deriv/components';
import { LabelPairedCircleInfoCaptionBoldIcon } from '@deriv/quill-icons';

export const IconAnnounce = ({ announce }: { announce: boolean }) => (
    <>
        <LabelPairedCircleInfoCaptionBoldIcon fill='var(--text-info-blue)' width='24' height='26' />
        {announce && <div className='notification__icon--indicator' />}
    </>
);

export const TitleAnnounce = ({ title, announce }: { title: string; announce: boolean }) => (
    <Text
        size='xs'
        line_height='l'
        weight={announce ? 'bold' : 'normal'}
        styles={!announce ? { color: 'var(--text-general)' } : {}}
    >
        {title}
    </Text>
);

export const MessageAnnounce = ({ message, date, announce }: { message: string; date: string; announce: boolean }) => (
    <>
        <Text
            size='xs'
            line_height='m'
            weight={announce ? 'normal' : 'lighter'}
            styles={!announce ? { color: 'var(--text-general)' } : {}}
        >
            {message}
        </Text>
        <Text size='xxs' line_height='xl' styles={{ color: 'var(--text-primary)' }}>
            {date}
        </Text>
    </>
);

export const IconAnnounceModal = ({ announce_id }: { announce_id: string }) => {
    switch (announce_id) {
        case 'MOVING_STRATEGIES_ANNOUNCE': {
            return <Icon icon='IcMigrateStrategy' className='category-type' color='brand' height='100' width='140' />;
        }
        case 'BLOCKLY_ANNOUNCE': {
            return <Icon icon='IcUpgradeBlockly' className='category-type' color='brand' size='120' />;
        }
        case 'ACCUMULATOR_ANNOUNCE': {
            return <Icon icon='IcTradetypeAccu' className='category-type' color='brand' size='80' />;
        }
        default:
            return null;
    }
};
