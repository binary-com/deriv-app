import React from 'react';
import { Loading, ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { WS, useIsMounted } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import LoadErrorMessage from '../../../Components/load-error-message';
import LoginHistoryContent from './login-history-content';
import { getLoginHistoryFormattedData } from '@deriv/utils';

type TLoginData = { id: number; date: string; action: string; browser: string; ip: string; status: string }[];

const LoginHistory = observer(() => {
    const { client } = useStore();
    const { isDesktop } = useDevice();
    const { is_switching } = client;
    const [is_loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [data, setData] = React.useState<TLoginData>([]);
    const isMounted = useIsMounted();

    React.useEffect(() => {
        const fetchData = async () => {
            if (isMounted()) {
                const api_res = await WS.authorized.fetchLoginHistory(50);
                setLoading(false);
                if (api_res.error) {
                    setError(api_res.error.message);
                } else {
                    const formatted_data = getLoginHistoryFormattedData(api_res.login_history);
                    setData(formatted_data);
                }
            }
        };

        fetchData();
    }, []);

    if (is_switching) return <Loading />;
    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (error) return <LoadErrorMessage error_message={error} />;

    return (
        <ThemedScrollbars is_bypassed={!isDesktop} className='login-history'>
            {data.length > 0 ? <LoginHistoryContent data={data} /> : null}
        </ThemedScrollbars>
    );
});

export default LoginHistory;
