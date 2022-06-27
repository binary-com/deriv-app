import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import './side-note.scss';

const SideNoteTitle = ({ side_notes_length, children_length, title }) => {
    const length_of_notes = children_length || side_notes_length;

    return (
        <Text className='side-note__title' weight='bold' as='p'>
            {title ||
                (length_of_notes > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />)}
        </Text>
    );
};

const SideNoteBullet = ({ children }) => (
    <div className='side-note__bullet-wrapper'>
        <div className='side-note__bullet' />
        <div>{children}</div>
    </div>
);

const SideNote = ({ children, side_notes, title, has_title = true, has_bullets = true, is_mobile, className }) => {
    const Wrapper = is_mobile ? MobileWrapper : DesktopWrapper;

    return (
        <>
            {(children || side_notes?.length) && (
                <Wrapper>
                    <div className={classNames('side-note', { 'side-note--mobile': isMobile() }, className)}>
                        {has_title && (
                            <SideNoteTitle
                                title={title}
                                children_length={children?.length}
                                side_notes_length={side_notes?.length}
                            />
                        )}

                        {children && <>{children}</>}

                        {!children &&
                            side_notes.map((note, i) =>
                                has_bullets ? (
                                    <SideNoteBullet key={i}>{note}</SideNoteBullet>
                                ) : (
                                    <Text key={i} className='side-note__text' size='xxs' as='p'>
                                        {note}
                                    </Text>
                                )
                            )}
                    </div>
                </Wrapper>
            )}
        </>
    );
};

SideNote.propTypes = {
    children: PropTypes.any,
    side_notes: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
    is_mobile: PropTypes.bool,
    has_title: PropTypes.bool,
    className: PropTypes.string,
};

export default SideNote;
