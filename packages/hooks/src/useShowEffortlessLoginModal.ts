import React from 'react';
import useGetPasskeysList from './useGetPasskeysList';
import { useStore } from '@deriv/stores';

const useShowEffortlessLoginModal = () => {
    const { client, ui } = useStore();
    const { is_passkey_supported, is_logged_in } = client;
    const { is_mobile } = ui;

    const [show_effortless_modal, setShouldShowEffortlessModal] = React.useState(false);
    const { passkeys_list, is_passkeys_list_loading, passkeys_list_error } = useGetPasskeysList();

    const stored_value = localStorage.getItem('show_effortless_login_modal');

    React.useEffect(() => {
        if (is_passkeys_list_loading || passkeys_list_error) return;

        const show_effortless_login_modal = stored_value === null || JSON.parse(stored_value) === true;
        if (show_effortless_login_modal) {
            localStorage.setItem('show_effortless_login_modal', JSON.stringify(true));
        }

        setShouldShowEffortlessModal(
            is_passkey_supported && !passkeys_list?.length && is_mobile && is_logged_in && show_effortless_login_modal
        );

        if (passkeys_list?.length) {
            localStorage.setItem('show_effortless_login_modal', JSON.stringify(false));
        }
    }, [is_passkey_supported, passkeys_list, is_passkeys_list_loading, is_mobile, is_logged_in, stored_value]);

    return show_effortless_modal;
};

export default useShowEffortlessLoginModal;
