import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';

const SideNoteBullet = ({ children }) => (
    <div className='cashier-side-note__bullet-wrapper'>
        <div className='cashier-side-note__bullet' />
        <Text className='cashier-side-note__text' size='xxs'>
            {children}
        </Text>
    </div>
);

const SideNote = ({ notes, title, has_bullets }) => (
    <div className='cashier-side-note'>
        {title && (
            <DesktopWrapper>
                <Text className='cashier-side-note__text' weight='bold' as='p'>
                    {title}
                </Text>
            </DesktopWrapper>
        )}

        {notes.map((note, i) =>
            has_bullets ? (
                <SideNoteBullet key={i}>{note}</SideNoteBullet>
            ) : (
                <Text key={i} className='cashier-side-note__text' size='xxs' as='p'>
                    {note}
                </Text>
            )
        )}
    </div>
);

SideNote.propTypes = {
    notes: PropTypes.array.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
};

export default SideNote;
