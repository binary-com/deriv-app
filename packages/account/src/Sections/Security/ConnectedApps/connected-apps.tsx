import React from 'react';
import { OauthApps } from '@deriv/api-types';
import { Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import { WS } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import ErrorComponent from '../../../Components/error-component';
import ConnectedAppsKnowMore from './connected-apps-know-more';
import ConnectedAppsInfo from './connected-apps-info';
import ConnectedAppsEarnMore from './connected-apps-earn-more';
import ConnectedAppsEmpty from './connected-apps-empty';
import DataListTemplate from './data-list-template';
import DataTableTemplate from './data-table-template';
import ConnectedAppsRevokeModal from './connected-apps-revoke-modal';
import './connected-apps.scss';

const ConnectedApps = observer(() => {
    const { isDesktop } = useDevice();
    const [is_loading, setLoading] = React.useState(true);
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [selected_app_id, setSelectedAppId] = React.useState<number | null>(null);
    const [is_error, setError] = React.useState(false);
    const [connected_apps, setConnectedApps] = React.useState<OauthApps>([]);

    React.useEffect(() => {
        /* eslint-disable no-console */
        fetchConnectedApps().catch(error => console.error('error: ', error));
    }, []);

    const fetchConnectedApps = async () => {
        const response_connected_apps = await WS.authorized.send({ oauth_apps: 1 });

        if (!response_connected_apps.error) {
            setLoading(false);
            setConnectedApps(response_connected_apps.oauth_apps);
        }
    };

    const handleToggleModal = React.useCallback((app_id: number | null = null) => {
        setIsModalOpen(is_modal_open => !is_modal_open);
        setSelectedAppId(app_id);
    }, []);

    const revokeConnectedApp = React.useCallback(async (app_id: number | null) => {
        setLoading(true);
        const response = await WS.authorized.send({ revoke_oauth_app: app_id });
        if (!response.error) {
            /* eslint-disable no-console */
            fetchConnectedApps().catch(error => console.error('error: ', error));
        } else {
            setLoading(false);
            setError(true);
        }
    }, []);

    const handleRevokeAccess = React.useCallback(() => {
        setIsModalOpen(false);
        revokeConnectedApp(selected_app_id);
    }, [revokeConnectedApp, selected_app_id]);

    return is_loading ? (
        <Loading is_fullscreen={false} />
    ) : (
        <div className='connected-apps__wrapper'>
            <section>
                {is_error && <ErrorComponent />}
                {connected_apps.length ? (
                    <div className='connected-apps__content--wrapper'>
                        <ConnectedAppsInfo />
                        {!isDesktop ? (
                            <DataListTemplate connected_apps={connected_apps} handleToggleModal={handleToggleModal} />
                        ) : (
                            <DataTableTemplate connected_apps={connected_apps} handleToggleModal={handleToggleModal} />
                        )}
                    </div>
                ) : (
                    <ConnectedAppsEmpty />
                )}
            </section>
            <section className='connected-apps__articles--wrapper'>
                <ConnectedAppsKnowMore />
                <ConnectedAppsEarnMore />
            </section>
            <ConnectedAppsRevokeModal
                handleRevokeAccess={handleRevokeAccess}
                handleToggleModal={handleToggleModal}
                is_modal_open={is_modal_open}
            />
        </div>
    );
});

export default ConnectedApps;
