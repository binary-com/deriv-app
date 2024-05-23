import React from 'react';
import { Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { getStaticUrl } from '@deriv/shared';

const AccountClosed = observer(() => {
    const { client } = useStore();
    const { logout } = client;
    const [is_modal_open, setModalState] = React.useState(true);
    const [timer, setTimer] = React.useState(10);

    const counter = React.useCallback(() => {
        if (timer > 0) {
            setTimer(timer - 1);
        } else {
            window.location.href = getStaticUrl('/');
        }
    }, [timer]);

    React.useEffect(() => {
        window.history.pushState(null, '', '/');
        logout();
        const handleInterval = setInterval(() => counter(), 1000);
        return () => {
            if (handleInterval) clearInterval(handleInterval);
        };
    }, [timer, is_modal_open, logout, counter]);

    return (
        <Modal
            is_open={is_modal_open}
            toggleModal={() => {
                setModalState(!is_modal_open);
            }}
        >
            <Text as='p' className='account-closed'>
                <Localize i18n_default_text='We’re sorry to see you leave. Your account is now closed.' /> {timer}
            </Text>
        </Modal>
    );
});

export default AccountClosed;
