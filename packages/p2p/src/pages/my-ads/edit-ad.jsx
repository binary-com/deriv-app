import React from 'react';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import EditAdForm from './edit-ad-form.jsx';

const EditAd = ({ country_list }) => {
    const { my_ads_store } = useStores();

    return (
        <React.Fragment>
            {my_ads_store.is_form_loading ? (
                <Loading is_fullscreen={false} />
            ) : (
                <EditAdForm country_list={country_list} />
            )}
        </React.Fragment>
    );
};

export default observer(EditAd);
