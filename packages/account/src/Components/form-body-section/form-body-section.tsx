import React from 'react';
import clsx from 'clsx';

import { Text } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv/translations';

export type TFormBodySection = {
    /**
     *  A boolean value indicating whether the section has a side note.
     */
    has_side_note?: boolean;
    /**
     * The side note to display next to the main content.
     */
    side_note?: string | React.ReactElement;
    /**
     * The position of the side note relative to the main content.
     * @default 'left'
     * */
    side_note_position?: 'left' | 'right';
    /**
     * The type of the side note either it can be locaziled string (`localize or Localize`) component or image as JSX element.
     * @default 'text'
     * */
    type?: 'text' | 'image';
};

/**
 *  A component that renders a form body section with an optional side note.
 *
 *  This component renders a section of a form body. It can optionally display a side note
 *  and allows reversing the order of the side note and the main content.
 *  @returns {JSX.Element} A React component that renders a form body section.
 */
const FormBodySection = ({
    children,
    has_side_note,
    side_note,
    side_note_position = 'left',
    type = 'text',
}: React.PropsWithChildren<TFormBodySection>): JSX.Element => {
    const { isDesktop } = useDevice();
    if (has_side_note) {
        return (
            <div
                data-testid='dt_side_note_container'
                className={clsx('account-form__section', {
                    'account-form__section--reversed': side_note_position === 'right',
                })}
            >
                <div
                    className={clsx('account-form__section-side-note', {
                        'account-form__section-side-note__example': type !== 'text',
                    })}
                >
                    {type === 'text' ? (
                        <Text color='less-prominent' size={isDesktop ? 'xs' : 'xxs'} data-testid='dt_side_note_text'>
                            {side_note}
                        </Text>
                    ) : (
                        <React.Fragment>
                            <Text as='p' size={isDesktop ? 'xs' : 'xxs'} weight='bold'>
                                <Localize i18n_default_text='Example :' />
                            </Text>
                            <div className='account-form__section-side-note__example-image'>{side_note}</div>
                        </React.Fragment>
                    )}
                </div>
                <div className='account-form__section-content'>{children}</div>
            </div>
        );
    }
    return children as JSX.Element;
};

export default FormBodySection;
