import * as React from 'react';
import { Loading } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import PageReturn from 'Components/page-return';
import CopyAdvertForm from 'Pages/my-ads/copy-advert-form';
import { useStores } from 'Stores';
import CreateAdForm from './create-ad-form.jsx';

const CreateAd = () => {
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
            <PageReturn onClick={onClickBack} page_title={localize('Create new ad')} />
            {should_copy_advert ? (
                <CopyAdvertForm advert={p2p_advert_information} onCancel={onClickBack} />
            ) : (
                <CreateAdForm />
            )}
        </React.Fragment>
    );
};

export default observer(CreateAd);
