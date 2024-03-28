import React from 'react';
import { Icon } from '@deriv/components';
import { getStatusContent, PASSKEY_STATUS_CODES, TPasskeysStatus } from 'Sections/Security/Passkeys/passkeys-configs';
import PasskeysFooterButtons from './passkeys-footer-buttons';
import PasskeysStatus from './passkeys-status';

type TPasskeysStatusContainer = {
    createPasskey: () => void;
    passkey_status: TPasskeysStatus;
    setPasskeyStatus: (status: TPasskeysStatus) => void;
};

const PasskeysStatusContainer = ({ createPasskey, passkey_status, setPasskeyStatus }: TPasskeysStatusContainer) => {
    const prev_passkey_status = React.useRef<TPasskeysStatus>(PASSKEY_STATUS_CODES.NONE);

    if (passkey_status === PASSKEY_STATUS_CODES.NONE) return null;

    const onPrimaryButtonClick = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.CREATED || passkey_status === PASSKEY_STATUS_CODES.REMOVED) {
            // set status to 'NONE'  means 'continue' button is clicked
            setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
            return;
        }
        // if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
        //     // TODO: implement renaming flow & add 'Save changes' action for onPrimaryButtonClick
        //     return;
        // }
        // if (passkey_status === PASSKEY_STATUS_CODES.VERIFYING) {
        //     // TODO: implement verifying flow and onPrimaryButtonClick action (send email)
        //     return;
        // }
        createPasskey();
    };

    const onSecondaryButtonClick = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE) {
            setPasskeyStatus(prev_passkey_status.current);
            return;
        }
        // if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
        //     setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
        //     return;
        // }
        prev_passkey_status.current = passkey_status;
        setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE);
    };

    const content = getStatusContent(passkey_status);
    const is_learn_more_opened = passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE;

    return (
        <div className='passkeys'>
            {is_learn_more_opened && (
                <Icon
                    icon='IcBackButton'
                    onClick={onSecondaryButtonClick}
                    className='passkeys-status__description-back-button'
                />
            )}
            <PasskeysStatus
                className={is_learn_more_opened ? 'passkeys-status__wrapper--expanded' : ''}
                icon={content.icon}
                title={content.title}
                description={content.description}
            >
                <PasskeysFooterButtons
                    primary_button_text={content.primary_button_text}
                    onPrimaryButtonClick={onPrimaryButtonClick}
                    secondary_button_text={content.secondary_button_text}
                    onSecondaryButtonClick={onSecondaryButtonClick}
                />
            </PasskeysStatus>
        </div>
    );
};

export default PasskeysStatusContainer;
