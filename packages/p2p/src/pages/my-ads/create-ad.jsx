import * as React from 'react';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import CreateAdForm from './create-ad-form.jsx';

const CreateAd = () => {
    const { my_ads_store } = useStores();

    return (
        <React.Fragment>
            {my_ads_store.is_form_loading ? <Loading is_fullscreen={false} /> : <CreateAdForm />}
        </React.Fragment>
    );
};

export default observer(CreateAd);
