import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { TableError } from 'Components/table/table-error.jsx';
import CreateAd from './create-ad.jsx';
import MyAdsTable from './my-ads-table.jsx';
import Verification from '../verification/verification.jsx';
import './my-ads.scss';

const MyAdsState = ({ message }) => (
    <div className='p2p-my-ads__state'>
        <TableError message={message} />
    </div>
);

const MyAds = () => {
    const { general_store, my_ads_store } = useStores();

    React.useEffect(() => {
        my_ads_store.setIsLoading(true);
        my_ads_store.getAccountStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_ads_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (general_store.is_restricted) {
        return <MyAdsState message={localize('Deriv P2P cashier is unavailable in your country.')} />;
    }

    if (my_ads_store.error_message) {
        return <MyAdsState message={my_ads_store.error_message} />;
    }

    if (general_store.is_advertiser) {
        return <div className='p2p-my-ads'>{my_ads_store.show_ad_form ? <CreateAd /> : <MyAdsTable />}</div>;
    }

    return <Verification />;
};

MyAds.propTypes = {
    error_message: PropTypes.string,
    getAccountStatus: PropTypes.func,
    is_advertiser: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_restricted: PropTypes.bool,
    setIsLoading: PropTypes.func,
    show_ad_form: PropTypes.bool,
};

export default observer(MyAds);
