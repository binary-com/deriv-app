import classNames from 'classnames';
import React from 'react';
import { DesktopWrapper, MobileOrTabletWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobileOrTablet } from '@deriv/shared';
import './side-note.scss';

type TSideNoteTitle = {
    children_length?: number;
    side_notes_length?: number;
    title?: string | JSX.Element;
};

type TSideNoteBullet = React.PropsWithChildren<{
    id: number;
}>;

type TSideNoteProps = React.PropsWithChildren<{
    className?: string;
    has_bullets?: boolean;
    has_title?: boolean;
    is_mobile_or_tablet?: boolean;
    side_notes?: React.ReactNode[];
    title?: string | JSX.Element;
}>;

const SideNoteTitle = ({ children_length, side_notes_length, title }: TSideNoteTitle) => {
    const length_of_notes = children_length || side_notes_length || 0;

    return (
        <Text className='side-note-legacy__title' weight='bold' as='p'>
            {title ||
                (length_of_notes > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />)}
        </Text>
    );
};

const SideNoteBullet = ({ children, id }: TSideNoteBullet) => (
    <div className='side-note-legacy__bullet-wrapper' data-testid={`dt_side_note_bullet_wrapper_${id}`}>
        <div className='side-note-legacy__bullet' data-testid={`dt_side_note_bullet_${id}`} />
        <div>{children}</div>
    </div>
);

/** @deprecated Use `SideNote` from `@deriv/components` package instead. */
const SideNote = ({
    children,
    className,
    has_bullets = true,
    has_title = true,
    is_mobile_or_tablet,
    side_notes,
    title,
}: TSideNoteProps) => {
    const Wrapper = is_mobile_or_tablet ? MobileOrTabletWrapper : DesktopWrapper;

    return (
        <>
            {(children || side_notes?.length) && (
                <Wrapper>
                    <div
                        className={classNames(
                            'side-note-legacy',
                            { 'side-note-legacy--mobile': isMobileOrTablet() },
                            className
                        )}
                    >
                        {has_title && (
                            <SideNoteTitle
                                title={title}
                                children_length={Array.isArray(children) ? children?.length : 1}
                                side_notes_length={side_notes?.length}
                            />
                        )}

                        {children && <>{children}</>}

                        {!children &&
                            side_notes?.map((note, i) =>
                                has_bullets ? (
                                    <SideNoteBullet id={i} key={i}>
                                        {note}
                                    </SideNoteBullet>
                                ) : (
                                    <Text key={i} className='side-note-legacy__text' size='xxs' as='p'>
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

export default SideNote;
