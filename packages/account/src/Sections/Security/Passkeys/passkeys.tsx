import { Fragment, useEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { InlineMessage, Loading } from '@deriv/components';
import { useGetPasskeysList, useRegisterPasskey, useRemovePasskey, useRenamePasskey } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv-com/translations';
import { PasskeyErrorModal } from './components/passkey-error-modal';
import { PasskeyReminderModal } from './components/passkey-reminder-modal';
import { PasskeysStatusContainer } from './components/passkeys-status-container';
import {
    clearRefTimeOut,
    excluded_error_codes,
    excluded_error_names,
    PASSKEY_STATUS_CODES,
    passkeysMenuActionEventTrack,
    TPasskeysStatus,
} from './passkeys-configs';
import { TServerError } from '../../../Types';
import './passkeys.scss';

export type TPasskey = {
    id: number;
    name: string;
    last_used: number;
    created_at?: number;
    stored_on?: string;
    passkey_id: string;
    icon?: string;
};
export type TOnPasskeyMenuClick = (
    passkey_managing_status: TPasskeysStatus,
    passkey_data: TCurrentManagedPasskey
) => void;
export type TCurrentManagedPasskey = {
    id: TPasskey['id'];
    passkey_id: TPasskey['passkey_id'];
    name: TPasskey['name'];
};

const Passkeys = observer(() => {
    const { client, common, notifications } = useStore();
    const { isMobile } = useDevice();
    const { is_passkey_supported, setShouldShowPasskeyNotification, setPasskeysStatusToCookie } = client;
    const { removeNotificationByKey } = notifications;
    const is_network_on = common.network_status.class === 'online';

    const error_modal_timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const snackbar_timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const history = useHistory();

    const [passkey_status, setPasskeyStatus] = useState<TPasskeysStatus>(PASSKEY_STATUS_CODES.LIST);
    const [is_reminder_modal_open, setIsReminderModalOpen] = useState(false);
    const [is_error_modal_open, setIsErrorModalOpen] = useState(false);
    const [is_snackbar_open, setIsSnackbarOpen] = useState(false);
    const [current_managed_passkey, setCurrentManagedPasskey] = useState<TCurrentManagedPasskey>({
        id: 0,
        passkey_id: '',
        name: '',
    });

    const onSuccessPasskeyRegister = () => {
        setShouldShowPasskeyNotification(false);
        removeNotificationByKey({ key: 'enable_passkey' });
        refetchPasskeysList();
        passkeysMenuActionEventTrack('create_passkey_finished');
        setPasskeyStatus(PASSKEY_STATUS_CODES.CREATED);
        setPasskeysStatusToCookie('available');
    };

    const onSuccessPasskeyRemove = () => {
        refetchPasskeysList();
        setPasskeyStatus(PASSKEY_STATUS_CODES.REMOVED);
        passkeysMenuActionEventTrack('passkey_remove_success');
    };

    const onSuccessPasskeyRename = () => {
        refetchPasskeysList();
        setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        setIsSnackbarOpen(true);
        passkeysMenuActionEventTrack('passkey_rename_success');
        clearRefTimeOut(snackbar_timeout);
        snackbar_timeout.current = setTimeout(() => {
            setIsSnackbarOpen(false);
        }, 5000);
    };

    const { passkeys_list, is_passkeys_list_loading, passkeys_list_error, refetchPasskeysList } = useGetPasskeysList();
    const { is_removing_in_progress, passkey_removing_error, removePasskey, removePasskeyWithEmailCode } =
        useRemovePasskey({
            onSuccess: onSuccessPasskeyRemove,
        });
    const { passkey_renaming_error, renamePasskey } = useRenamePasskey({ onSuccess: onSuccessPasskeyRename });
    const { createPasskey, startPasskeyRegistration, passkey_registration_error } = useRegisterPasskey({
        onSuccess: onSuccessPasskeyRegister,
    });

    const should_show_passkeys = is_passkey_supported && isMobile;
    const error = passkeys_list_error || passkey_registration_error || passkey_renaming_error || passkey_removing_error;

    const main_screen_status_code = passkeys_list?.length ? PASSKEY_STATUS_CODES.LIST : PASSKEY_STATUS_CODES.NO_PASSKEY;

    useEffect(() => {
        const should_not_render_main_page =
            is_passkeys_list_loading ||
            passkey_status === PASSKEY_STATUS_CODES.CREATED ||
            passkey_status === PASSKEY_STATUS_CODES.REMOVED;

        if (should_not_render_main_page) return;

        if (!passkeys_list?.length) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NO_PASSKEY);
            setPasskeysStatusToCookie('not_available');
        } else {
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }
        return () => clearRefTimeOut(snackbar_timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_passkeys_list_loading, passkeys_list?.length]);

    useEffect(() => {
        if (error) {
            passkeysMenuActionEventTrack('error', { error_message: (error as TServerError)?.message });

            if (passkey_status === PASSKEY_STATUS_CODES.REMOVING) {
                setPasskeyStatus(PASSKEY_STATUS_CODES.REMOVING_RETRY);
                return;
            }

            const should_hide_error =
                excluded_error_names.some(name => name === (error as TServerError).name) ||
                excluded_error_codes.some(code => code === (error as TServerError).code);

            if (should_hide_error) return;

            is_reminder_modal_open && setIsReminderModalOpen(false);
            clearRefTimeOut(error_modal_timeout);
            error_modal_timeout.current = setTimeout(() => setIsErrorModalOpen(true), 500);
        }
        return () => clearRefTimeOut(error_modal_timeout);
    }, [error, is_reminder_modal_open]);

    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    if (
        (is_passkeys_list_loading && passkey_status === PASSKEY_STATUS_CODES.LIST) ||
        !is_network_on ||
        is_removing_in_progress
    ) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    const onCloseErrorModal = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.REMOVING) {
            setIsErrorModalOpen(false);
            return;
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

    const onBackButtonClick = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE) {
            passkeysMenuActionEventTrack('info_back');
            setPasskeyStatus(main_screen_status_code);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.REMOVING_WITH_EMAIL) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.REMOVING);
        }
        if (
            passkey_status === PASSKEY_STATUS_CODES.REMOVING ||
            passkey_status === PASSKEY_STATUS_CODES.REMOVING_RETRY
        ) {
            setPasskeyStatus(main_screen_status_code);
        }
    };

    const onPasskeyMenuClick = (passkey_managing_status: TPasskeysStatus, passkey_data: TCurrentManagedPasskey) => {
        if (passkey_managing_status !== PASSKEY_STATUS_CODES.LIST && is_snackbar_open) {
            setIsSnackbarOpen(false);
        }
        setCurrentManagedPasskey(passkey_data);
        setPasskeyStatus(passkey_managing_status);
    };

    // value is either passkey new name or email code
    const onPrimaryButtonClick = (value?: string) => {
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
            renamePasskey(current_managed_passkey.id, value);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.REMOVED) {
            setPasskeyStatus(main_screen_status_code);
        }
        if (
            passkey_status === PASSKEY_STATUS_CODES.REMOVING ||
            passkey_status === PASSKEY_STATUS_CODES.REMOVING_RETRY
        ) {
            removePasskey(current_managed_passkey?.id, current_managed_passkey?.passkey_id);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.REMOVING_WITH_EMAIL) {
            removePasskeyWithEmailCode(current_managed_passkey.id, Number(value));
        }
    };

    const onSecondaryButtonClick = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.NO_PASSKEY || passkey_status === PASSKEY_STATUS_CODES.LIST) {
            passkeysMenuActionEventTrack('info_open');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE);
        }

        if (passkey_status === PASSKEY_STATUS_CODES.CREATED) {
            passkeysMenuActionEventTrack('add_more_passkeys');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }
        if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
            passkeysMenuActionEventTrack('passkey_rename_back');
            setPasskeyStatus(PASSKEY_STATUS_CODES.LIST);
        }
        if (
            passkey_status === PASSKEY_STATUS_CODES.REMOVING ||
            passkey_status === PASSKEY_STATUS_CODES.REMOVING_RETRY
        ) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.REMOVING_WITH_EMAIL);
        }
    };

    return (
        <Fragment>
            <PasskeysStatusContainer
                onBackButtonClick={onBackButtonClick}
                current_managed_passkey={current_managed_passkey}
                onPasskeyMenuClick={onPasskeyMenuClick}
                onPrimaryButtonClick={onPrimaryButtonClick}
                onSecondaryButtonClick={onSecondaryButtonClick}
                passkey_status={passkey_status}
                passkeys_list={passkeys_list || []}
            />
            {is_snackbar_open && (
                <div className='passkeys-snackbar__container'>
                    <InlineMessage
                        size='sm'
                        message={<Localize i18n_default_text='Changes saved.' />}
                        type='information'
                    />
                </div>
            )}
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
