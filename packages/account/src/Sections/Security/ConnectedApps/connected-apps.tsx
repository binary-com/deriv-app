import React from 'react';
import { OauthApps } from '@deriv/api-types';
import { Button, Modal, Icon, DataTable, Loading, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { WS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import ErrorComponent from 'Components/error-component';
import ConnectedAppsKnowMore from './connected-apps-know-more';
import ConnectedAppsInfo from './connected-apps-info';
import ConnectedAppsEarnMore from './connected-apps-earn-more';
import ConnectedAppsEmpty from './connected-apps-empty';
import DataListTemplate from './data-list-template';
import DataTableTemplate from './data-table-template';
import './connected-apps.scss';

type TSource = React.ComponentProps<typeof DataTable>['columns'];

const ConnectedApps = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

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

    const handleToggleModal = React.useCallback(
        (app_id: number | null = null) => {
            setIsModalOpen(!is_modal_open);
            setSelectedAppId(app_id);
        },
        [is_modal_open]
    );

    const revokeConnectedApp = React.useCallback(async (app_id: number | null) => {
        setLoading(true);
        const response = await WS.authorized.send({ revoke_oauth_app: app_id });
        if (!response.error) {
            /* eslint-disable no-console */
            fetchConnectedApps().catch(error => console.error('error: ', error));
        } else {
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
                        {is_mobile ? (
                            <div className='connected-apps__list--wrapper'>
                                {connected_apps.map(connected_app => (
                                    <DataListTemplate
                                        key={connected_app.app_id}
                                        data_source={connected_app}
                                        handleToggleModal={handleToggleModal}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='connected-apps__tabular--wrapper'>
                                <DataTable
                                    className='connected-apps'
                                    data_source={connected_apps as unknown as TSource}
                                    columns={DataTableTemplate(handleToggleModal)}
                                    content_loader='span'
                                />
                            </div>
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
            <Modal is_open={is_modal_open} className='connected-apps' width='44rem'>
                <Modal.Body>
                    <div className='connected-apps-modal--wrapper'>
                        <div className='connected-apps-modal--icon'>
                            <Icon icon='IcAccountTrashCan' size={128} />
                            <Text as='p' color='prominent' weight='bold'>
                                <Localize i18n_default_text='Confirm revoke access?' />
                            </Text>
                        </div>
                        <div className='connected-apps-modal--buttons'>
                            <Button large secondary onClick={() => handleToggleModal()}>
                                <Localize i18n_default_text='Back' />
                            </Button>
                            <Button large primary onClick={handleRevokeAccess}>
                                <Localize i18n_default_text='Confirm' />
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
});

export default ConnectedApps;
