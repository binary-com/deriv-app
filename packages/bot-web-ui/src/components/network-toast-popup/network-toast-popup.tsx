import React from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { MobileOrTabletWrapper, Toast } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

// TODO: Need to sanitize,
// Same sort of component is being used inside DTrader,
// In Future we might move the `NetworkStatusToastError` to the core packages for resuability.

/**
 * Network status Toast components
 */

const NetworkStatusToastError = observer(({ should_open = false }: { should_open?: boolean }) => {
    const { common } = useStore();
    const { network_status } = common;
    const [is_open, setIsOpen] = React.useState(should_open);
    const { message, status } = network_status;
    const portal_el = document.getElementById('popup_root');

    if (!portal_el || !message) return null;

    if (!is_open && status !== 'online') {
        setIsOpen(true); // open if status === 'blinker' or 'offline'
    } else if (is_open && status === 'online') {
        setTimeout(() => {
            setIsOpen(false);
        }, 1500);
    }

    return ReactDOM.createPortal(
        <MobileOrTabletWrapper>
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
        </MobileOrTabletWrapper>,
        portal_el
    );
});

export default NetworkStatusToastError;
