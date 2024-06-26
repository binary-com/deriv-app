import React from 'react';
import { useHistory } from 'react-router-dom';
import { DesktopWrapper, Loading, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import Verification from 'Components/verification';
import { document_status_codes, identity_status_codes } from 'Constants/account-status-codes';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import MyProfileContent from './my-profile-content';
import MyProfileDetailsContainer from './my-profile-stats/my-profile-details-container';
import MyProfileHeader from './my-profile-header';

const MyProfile = () => {
    const { general_store, my_profile_store } = useStores();
    const { showModal } = useModalManagerContext();
    const history = useHistory();
    const is_poi_poa_verified =
        general_store.poi_status === identity_status_codes.VERIFIED &&
        (!general_store.p2p_poa_required ||
            (general_store.poa_status === document_status_codes.VERIFIED && !general_store.poa_authenticated_with_idv));

    React.useEffect(() => {
        if (general_store.active_index !== 3) general_store.setActiveIndex(3);
        my_profile_store.getSettings();

        return () => {
            // leave this in the return otherwise the default isn't set to my stats
            my_profile_store.setActiveTab(my_profile_tabs.MY_STATS);
            my_profile_store.setShouldShowAddPaymentMethodForm(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_poi_poa_verified && !general_store.is_advertiser && !general_store.is_loading) {
            showModal({
                key: 'NicknameModal',
                props: {
                    onCancel: () => {
                        history.push(routes.p2p_buy_sell);
                    },
                },
            });
        }
    }, [is_poi_poa_verified, general_store.is_advertiser, general_store.is_loading]);

    if (general_store.is_p2p_user === null) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_profile_store.error_message) {
        return (
            <div className='my-profile__error'>
                <Text align='center' as='p' className='dp2p-table-error' color='loss-danger' size='xs'>
                    {my_profile_store.error_message}
                </Text>
            </div>
        );
    }

    if (general_store.is_advertiser || is_poi_poa_verified || general_store.is_p2p_user) {
        return (
            <div className='my-profile'>
                <div className='my-profile__content'>
                    <MyProfileDetailsContainer />
                    <DesktopWrapper>
                        <MyProfileHeader />
                    </DesktopWrapper>
                    <MyProfileContent />
                </div>
            </div>
        );
    }

    return <Verification />;
};

export default observer(MyProfile);
