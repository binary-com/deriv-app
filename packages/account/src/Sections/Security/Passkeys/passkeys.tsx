import React from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useGetPasskeysList, useRegisterPasskey } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import PasskeysStatusContainer from './components/passkeys-status-container';
import PasskeysList from './components/passkeys-list';
import PasskeyModal from './components/passkey-modal';
import { getModalContent, PASSKEY_STATUS_CODES, TPasskeysStatus } from './passkeys-configs';
import './passkeys.scss';

const Passkeys = observer(() => {
    const { ui, client, common } = useStore();
    const { is_mobile } = ui;
    const { is_passkey_supported } = client;
    let timeout: ReturnType<typeof setTimeout>;

    const [passkey_status, setPasskeyStatus] = React.useState<TPasskeysStatus>(PASSKEY_STATUS_CODES.NONE);
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const { passkeys_list, is_passkeys_list_loading, passkeys_list_error, reloadPasskeysList } = useGetPasskeysList();
    const {
        cancelPasskeyRegistration,
        createPasskey,
        clearPasskeyRegistrationError,
        startPasskeyRegistration,
        is_passkey_registration_started,
        is_passkey_registered,
        passkey_registration_error,
    } = useRegisterPasskey();

    const should_show_passkeys = is_passkey_supported && is_mobile;
    const error = passkeys_list_error || passkey_registration_error;
    const modal_content = getModalContent({
        error,
        is_passkey_registration_started,
    });

    React.useEffect(() => {
        if (!passkeys_list?.length && !is_passkey_registered) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NO_PASSKEY);
        } else if (is_passkey_registered) {
            setPasskeyStatus(PASSKEY_STATUS_CODES.CREATED);
        } else {
            setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
        }
    }, [is_passkey_registered, passkeys_list]);

    React.useEffect(() => {
        if (!!error || is_passkey_registration_started) {
            setIsModalOpen(true);
        }
        return () => {
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, is_passkey_registration_started]);

    if (is_passkeys_list_loading || common.network_status.class !== 'online') {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }
    if (!should_show_passkeys) {
        return <Redirect to={routes.traders_hub} />;
    }

    // to avoid flickering with blank Modal we need first close it, then clear content
    const onCloseModal = (delayed_action: () => void) => {
        setIsModalOpen(false);
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(delayed_action, 300);
    };

    const onCloseError = () => {
        if (passkeys_list_error) {
            reloadPasskeysList();
        }
        if (passkey_registration_error) {
            clearPasskeyRegistrationError();
        }
    };
    const onModalButtonClick = () => {
        if (error) {
            onCloseModal(onCloseError);
        } else {
            createPasskey();
            setIsModalOpen(false);
        }
    };

    const onCloseRegistration = () => {
        onCloseModal(cancelPasskeyRegistration);
    };

    return (
        <div className='passkeys'>
            {passkey_status ? (
                <PasskeysStatusContainer
                    createPasskey={startPasskeyRegistration}
                    passkey_status={passkey_status}
                    setPasskeyStatus={setPasskeyStatus}
                />
            ) : (
                <PasskeysList
                    passkeys_list={passkeys_list || []}
                    onPrimaryButtonClick={startPasskeyRegistration}
                    onSecondaryButtonClick={() => setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE)}
                />
            )}
            <PasskeyModal
                toggleModal={is_passkey_registration_started ? onCloseRegistration : undefined}
                has_close_icon={!!modal_content.header}
                header={modal_content.header}
                className='passkeys-modal'
                is_modal_open={is_modal_open}
                description={modal_content.description}
                button_text={modal_content.button_text}
                onButtonClick={onModalButtonClick}
            />
        </div>
    );
});

export default Passkeys;
