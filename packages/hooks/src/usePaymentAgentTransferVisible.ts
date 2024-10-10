import { useFetch } from '@deriv/api';
import { WS } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { useEffect, useState } from 'react';

const usePaymentAgentTransferVisible = () => {
    const { client } = useStore();
    const { is_authorize, is_logged_in } = client;
    const [is_websocket_authorized, setIsWebSocketAuthorized] = useState(false);

    useEffect(() => {
        const checkAuthorize = async () => {
            try {
                const check_websocket_authorized = await WS.wait('authorize');
                if (check_websocket_authorized) setIsWebSocketAuthorized(is_authorize && is_logged_in);
            } catch (error) {
                console.error('Error while authorizing:', error); // eslint-disable-line
            }
        };

        checkAuthorize();
    }, [is_authorize, is_logged_in]);

    const { data, ...rest } = useFetch('get_settings', { options: { enabled: Boolean(is_websocket_authorized) } });
    const is_payment_agent_transfer_visible = Boolean(data?.get_settings?.is_authenticated_payment_agent);

    return {
        data: is_payment_agent_transfer_visible,
        ...rest,
    };
};

export default usePaymentAgentTransferVisible;
