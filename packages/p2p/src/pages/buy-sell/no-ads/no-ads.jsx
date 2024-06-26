import React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Text } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { document_status_codes, identity_status_codes } from 'Constants/account-status-codes';
import { useStores } from 'Stores';
import './no-ads.scss';

const NoAds = ({ is_ads_page = false }) => {
    const { buy_sell_store, general_store, my_ads_store } = useStores();
    const { showModal } = useModalManagerContext();
    const { handleTabClick, is_barred } = general_store;
    const { is_buy, selected_local_currency, setCreateSellAdFromNoAds } = buy_sell_store;
    const { setShowAdForm } = my_ads_store;
    const history = useHistory();
    const { p2p_settings } = useP2PSettings();

    const is_default_currency = p2p_settings.currency_list.filter(
        currency => currency.text.toLowerCase() === selected_local_currency?.toLowerCase() && currency.is_default
    ).length;

    const is_poi_poa_verified =
        general_store.poi_status === identity_status_codes.VERIFIED &&
        (!general_store.p2p_poa_required ||
            (general_store.poa_status === document_status_codes.VERIFIED && !general_store.poa_authenticated_with_idv));

    const onClickButton = () => {
        if (!is_ads_page) handleTabClick(2);
        if (is_buy && !is_ads_page) setCreateSellAdFromNoAds(true);
        setShowAdForm(true);
        history.push(routes.p2p_my_ads);
    };

    return (
        <div className={classNames('no-ads', { 'ads-page': is_ads_page })}>
            <Icon icon='IcCashierNoAds' size={128} />
            {is_default_currency || is_ads_page ? (
                <React.Fragment>
                    <Text align='center' className='no-ads__title' weight='bold'>
                        {is_ads_page ? (
                            <Localize i18n_default_text='You have no ads 😞' />
                        ) : (
                            <Localize i18n_default_text='No ads for this currency 😞' />
                        )}
                    </Text>
                    <Text className='no-ads__message' align='center'>
                        <Localize i18n_default_text='Looking to buy or sell USD? You can post your own ad for others to respond.' />
                    </Text>
                    <Button
                        className='no-ads__button'
                        disabled={is_barred}
                        primary
                        large
                        onClick={() => {
                            if (general_store.is_advertiser || !is_poi_poa_verified) {
                                onClickButton();
                            } else {
                                showModal({
                                    key: 'NicknameModal',
                                    props: {
                                        onConfirm: onClickButton,
                                    },
                                });
                            }
                        }}
                    >
                        {is_ads_page ? (
                            <Localize i18n_default_text='Create new ad' />
                        ) : (
                            <Localize i18n_default_text='Create ad' />
                        )}
                    </Button>
                </React.Fragment>
            ) : (
                <Text align='center' className='no-ads__title' weight='bold'>
                    <Localize i18n_default_text='No ads for this currency at the moment 😞' />
                </Text>
            )}
        </div>
    );
};

export default observer(NoAds);
