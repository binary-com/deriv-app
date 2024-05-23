import * as React from 'react';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import CopyAdvertForm from 'Pages/my-ads/copy-advert-form';
import CreateAdForm from 'Pages/my-ads/create-ad-form';
import { useStores } from 'Stores';

const CreateAd = ({ country_list }) => {
    const { my_ads_store } = useStores();
    const {
        is_form_loading,
        p2p_advert_information,
        setApiErrorMessage,
        setShouldCopyAdvert,
        setShowAdForm,
        should_copy_advert,
    } = my_ads_store;
    const onClickBack = () => {
        setApiErrorMessage('');
        setShowAdForm(false);
        setShouldCopyAdvert(false);
    };

    if (is_form_loading) {
        return <Loading is_fullscreen={false} />;
    }
    return (
        <React.Fragment>
            {should_copy_advert ? (
                <CopyAdvertForm advert={p2p_advert_information} country_list={country_list} onCancel={onClickBack} />
            ) : (
                <CreateAdForm country_list={country_list} />
            )}
        </React.Fragment>
    );
};

export default observer(CreateAd);
