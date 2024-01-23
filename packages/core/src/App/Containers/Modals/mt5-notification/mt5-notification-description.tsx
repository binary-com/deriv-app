import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { mt5_community_url } from '@deriv/shared';

type TMT5NotificationDescription = {
    setMT5NotificationModal: (value: boolean) => void;
};
const MT5NotificationDescription = ({ setMT5NotificationModal }: TMT5NotificationDescription) => {
    return (
        <div className={'mt5-notification-modal-description'}>
            <Text as='p' size='xs'>
                <Localize i18n_default_text='We’ve updated the login procedure for your Deriv MT5 account. Please note the following changes:' />
            </Text>
            <ol className='mt5-notification-list-container'>
                <li className='mt5-notification-list'>
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='You’ll now need to choose the correct Deriv company and server name during login as you displayed on Trader’s Hub. '
                            components={[
                                <a
                                    className='mt5-notification-list__link'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href={mt5_community_url}
                                    key={0}
                                    onClick={() => {
                                        setMT5NotificationModal(false);
                                    }}
                                />,
                            ]}
                        />
                    </Text>
                </li>
                <li className='mt5-notification-list'>
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='If you encounter any difficulties logging into your Deriv MT5 account, please follow the provided <0>step-by-step guide</0>.'
                            components={[
                                <a
                                    className='mt5-notification-list__link'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    href={mt5_community_url}
                                    key={0}
                                    onClick={() => {
                                        setMT5NotificationModal(false);
                                    }}
                                />,
                            ]}
                        />
                    </Text>
                </li>
            </ol>
            <Text as='p' size='xs' className='mt5-notification-list-contact'>
                <Localize
                    i18n_default_text='Need help? Contact us via <0>live chat</0> to assist you with any login questions.'
                    components={[
                        <a
                            className='mt5-notification-list__link'
                            onClick={() => {
                                window.LC_API.open_chat_window();
                                setMT5NotificationModal(false);
                            }}
                            key={0}
                        />,
                    ]}
                />
            </Text>
        </div>
    );
};

export default MT5NotificationDescription;
