import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';

type TIconRadio = {
    google_drive_connected?: boolean;
    icon: React.ReactElement<{ className: string }, string>;
    text: string;
    onDriveConnect?: () => void;
};
const IconRadio = ({ icon, text, google_drive_connected, onDriveConnect }: TIconRadio) => {
    const is_drive_radio = text === 'Google Drive';

    return (
        <div className='save-type__container'>
            <div className='save-type__radio'>
                {icon &&
                    React.cloneElement(icon, {
                        className: classNames(
                            'save-type__icon',
                            {
                                'save-type__icon--active': is_drive_radio && google_drive_connected,
                                'save-type__icon--disabled': is_drive_radio && !google_drive_connected,
                            },
                            icon.props.className
                        ),
                    })}
                <Text
                    as='p'
                    align='center'
                    size='xxs'
                    color={is_drive_radio && !google_drive_connected ? 'disabled' : 'prominent'}
                    line_height='s'
                    className='save-type__radio-text'
                >
                    {localize(text)}
                </Text>
            </div>
            {is_drive_radio && (
                <Text
                    as='p'
                    align='center'
                    size='xs'
                    weight='bold'
                    styles={{ color: 'var(--brand-red-coral)' }}
                    className='save-type__drive-status'
                    onClick={onDriveConnect}
                >
                    {localize(google_drive_connected ? localize('Disconnect') : localize('Connect'))}
                </Text>
            )}
        </div>
    );
};

export default IconRadio;
