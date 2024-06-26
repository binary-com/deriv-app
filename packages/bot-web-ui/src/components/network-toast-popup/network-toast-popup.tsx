import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { Toast } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

// TODO: Need to sanitize,
// Same sort of component is being used inside DTrader,
// In Future we might move the `NetworkStatusToastError` to the core packages for resuability.

/**
 * Network status Toast components
 */

const NetworkStatusToastError = observer(({ should_open = false }: { should_open?: boolean }) => {
    const { common, ui } = useStore();
    const { network_status } = common;
    const [is_open, setIsOpen] = React.useState(should_open);
    const { message, status } = network_status;
    const portal_el = document.getElementById('popup_root');
    const { is_desktop } = ui;

    if (!portal_el || !message) return null;

    if (!is_open && status !== 'online') {
        setIsOpen(true); // open if status === 'blinker' or 'offline'
    } else if (is_open && status === 'online') {
        setTimeout(() => {
            setIsOpen(false);
        }, 1500);
    }

    return ReactDOM.createPortal(
        !is_desktop && (
            <Toast
                className={classNames({
                    'dc-toast--blinker': status === 'blinker',
                })}
                is_open={is_open}
                timeout={0}
                type='error'
            >
                {message}
            </Toast>
        ),
        portal_el
    );
});

export default NetworkStatusToastError;
