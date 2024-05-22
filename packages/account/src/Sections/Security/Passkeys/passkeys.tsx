import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useGetPasskeysList, useRegisterPasskey } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { PASSKEY_STATUS_CODES, TPasskeysStatus, passkeysMenuActionEventTrack } from './passkeys-configs';
import { PasskeyErrorModal } from './components/passkey-error-modal';
import { PasskeyReminderModal } from './components/passkey-reminder-modal';
import { PasskeysStatusContainer } from './components/passkeys-status-container';
import './passkeys.scss';

const Passkeys = observer(() => {
    const { client, ui, common } = useStore();
    const { is_passkey_supported } = client;
    const { is_mobile } = ui;
    const is_network_on = common.network_status.class === 'online';

    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const history = useHistory();

    const { passkeys_list, is_passkeys_list_loading, passkeys_list_error, reloadPasskeysList } = useGetPasskeysList();
    const {
        createPasskey,
        clearPasskeyRegistrationError,
        startPasskeyRegistration,
        is_passkey_registered,
        passkey_registration_error,
    } = useRegisterPasskey();
    const [passkey_status, setPasskeyStatus] = useState<TPasskeysStatus>(PASSKEY_STATUS_CODES.LIST);
    const [is_reminder_modal_open, setIsReminderModalOpen] = useState(false);
    const [is_error_modal_open, setIsErrorModalOpen] = useState(false);

    const prev_passkey_status = React.useRef<TPasskeysStatus>(PASSKEY_STATUS_CODES.LIST);

    const should_show_passkeys = is_passkey_supported && is_mobile;
    const error = passkeys_list_error || passkey_registration_error;

    useEffect(() => {
        if (is_passkeys_list_loading || passkey_status === PASSKEY_STATUS_CODES.CREATED) return;

        if (!passkeys_list?.length) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NO_PASSKEY);
        } else {
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }
    }, [is_passkeys_list_loading, passkeys_list?.length]);

    useEffect(() => {
        if (is_passkey_registered) {
            passkeysMenuActionEventTrack('create_passkey_finished');
            setPasskeyStatus(PASSKEY_STATUS_CODES.CREATED);
        }
    }, [is_passkey_registered]);

    useEffect(() => {
        const clearTimeOut = () => {
            if (timeout.current) clearTimeout(timeout.current);
        };
        if (error) {
            is_reminder_modal_open && setIsReminderModalOpen(false);
            clearTimeOut();
            timeout.current = setTimeout(() => setIsErrorModalOpen(true), 500);
        }
        return () => clearTimeOut();
    }, [error, is_reminder_modal_open]);

    if (should_show_passkeys && (is_passkeys_list_loading || !is_network_on)) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    const onCloseErrorModal = () => {
        if (passkey_registration_error) {
            clearPasskeyRegistrationError();
        }
        history.push(routes.traders_hub);
    };

    const onCloseReminderModal = () => {
        setIsReminderModalOpen(false);
    };

    const onContinueReminderModal = () => {
        createPasskey();
        if (!error) {
            passkeysMenuActionEventTrack('create_passkey_reminder_passed');
        }
        setIsReminderModalOpen(false);
    };

    const onPrimaryButtonClick = () => {
        if (
            passkey_status === PASSKEY_STATUS_CODES.NO_PASSKEY ||
            passkey_status === PASSKEY_STATUS_CODES.LIST ||
            passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE
        ) {
            const subform_name = passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE ? 'passkey_info' : 'passkey_main';
            passkeysMenuActionEventTrack('create_passkey_started', { subform_name });
            startPasskeyRegistration();
            setIsReminderModalOpen(true);
        }

        if (passkey_status === PASSKEY_STATUS_CODES.CREATED) {
            passkeysMenuActionEventTrack('create_passkey_continue_trading');
            history.push(routes.traders_hub);
        }

        if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
            // TODO: call API to rename passkey
            // TODO: track event when renaming is done
        }

        if (passkey_status === PASSKEY_STATUS_CODES.REMOVED) {
            // TODO: continue after removing
            // TODO: tracking event
        }
    };

    const onSecondaryButtonClick = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.NO_PASSKEY || passkey_status === PASSKEY_STATUS_CODES.LIST) {
            passkeysMenuActionEventTrack('info_open');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE);
        }

        if (passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE) {
            passkeysMenuActionEventTrack('info_back');
            setPasskeyStatus(prev_passkey_status.current);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.CREATED) {
            passkeysMenuActionEventTrack('add_more_passkeys');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }

        if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
            passkeysMenuActionEventTrack('passkey_rename_back');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }
        prev_passkey_status.current = passkey_status;
    };

    const onCardMenuClick = () => {
        //TODO: add the logic to open proper component for rename and revoke
        //TODO: add tracking event for renaming
    };

    return (
        <Fragment>
            <PasskeysStatusContainer
                onCardMenuClick={onCardMenuClick}
                onPrimaryButtonClick={onPrimaryButtonClick}
                onSecondaryButtonClick={onSecondaryButtonClick}
                passkey_status={passkey_status}
                passkeys_list={passkeys_list || []}
            />
            <PasskeyReminderModal
                is_modal_open={is_reminder_modal_open}
                onButtonClick={onContinueReminderModal}
                toggleModal={onCloseReminderModal}
            />
            <PasskeyErrorModal error={error} is_modal_open={is_error_modal_open} onButtonClick={onCloseErrorModal} />
        </Fragment>
    );
});

export default Passkeys;
