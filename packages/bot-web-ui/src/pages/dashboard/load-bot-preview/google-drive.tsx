import React from 'react';
import classnames from 'classnames';
import { Button, Icon, StaticUrl } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import {
    rudderStackSendGoogleDriveConnectEvent,
    rudderStackSendGoogleDriveDisconnectEvent,
} from '../../../analytics/rudderstack-common-events';

const GoogleDrive = observer(() => {
    const { ui } = useStore();
    const { google_drive, load_modal } = useDBotStore();
    const { is_authorised } = google_drive;
    const { is_open_button_loading, onDriveConnect, onDriveOpen } = load_modal;
    const { is_desktop } = ui;

    return (
        <div className='load-strategy__container' data-testid='dt_google_drive'>
            <div className='load-strategy__google-drive'>
                <Icon
                    icon={'IcGoogleDrive'}
                    className={classnames('load-strategy__google-drive-icon', {
                        'load-strategy__google-drive-icon--disabled': !is_authorised,
                    })}
                    size={is_desktop ? 128 : 96}
                />
                <div className='load-strategy__google-drive-connected-text'>
                    {is_authorised ? (
                        <Localize i18n_default_text='You are connected to Google Drive' />
                    ) : (
                        'Google Drive'
                    )}
                </div>
                {is_authorised ? (
                    <Button.Group>
                        <Button
                            text={localize('Disconnect')}
                            onClick={() => {
                                onDriveConnect();
                                rudderStackSendGoogleDriveDisconnectEvent();
                            }}
                            has_effect
                            secondary
                            large
                        />
                        <Button
                            text={localize('Open')}
                            onClick={() => {
                                onDriveOpen();
                            }}
                            is_loading={is_open_button_loading}
                            has_effect
                            primary
                            large
                        />
                    </Button.Group>
                ) : (
                    <React.Fragment>
                        <div className='load-strategy__google-drive-terms'>
                            <div className='load-strategy__google-drive-text'>
                                <Localize i18n_default_text="To import your bot from your Google Drive, you'll need to sign in to your Google account." />
                            </div>
                            <div className='load-strategy__google-drive-text'>
                                <Localize
                                    i18n_default_text='To know how Google Drive handles your data, please review Deriv’s <0>Privacy policy.</0>'
                                    components={[
                                        <StaticUrl
                                            key={0}
                                            className='link'
                                            href='tnc/security-and-privacy.pdf'
                                            is_document
                                        />,
                                    ]}
                                />
                            </div>
                        </div>
                        <Button
                            text={localize('Sign in')}
                            onClick={() => {
                                onDriveConnect();
                                rudderStackSendGoogleDriveConnectEvent();
                            }}
                            has_effect
                            primary
                            large
                        />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
});

export default GoogleDrive;
