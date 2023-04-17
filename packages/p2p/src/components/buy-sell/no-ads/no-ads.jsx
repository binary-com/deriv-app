import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './no-ads.scss';
import classNames from 'classnames';

const NoAds = ({ is_ads_page = false }) => {
    const { buy_sell_store, general_store, my_ads_store } = useStores();

    const is_default_currency = buy_sell_store.local_currencies.filter(
        currency =>
            currency.text.toLowerCase() === buy_sell_store.selected_local_currency.toLowerCase() && currency.is_default
    ).length;

    const onClickButton = () => {
        if (!is_ads_page) general_store.handleTabClick(2);
        if (!buy_sell_store.is_buy) buy_sell_store.setCreateSellAdFromNoAds(true);
        my_ads_store.setShowAdForm(true);
    };

    return (
        <div className={classNames('no-ads', { 'ads-page': is_ads_page })}>
            <Icon icon='IcCashierNoAds' size={128} />
            {is_default_currency || is_ads_page ? (
                <React.Fragment>
                    <Text
                        align='center'
                        className='no-ads__title'
                        color='general'
                        line_height='m'
                        size='s'
                        weight='bold'
                    >
                        <Localize
                            i18n_default_text={is_ads_page ? 'You have no ads.' : 'No ads for this currency 😞'}
                        />
                    </Text>
                    <Text className='no-ads__message' align='center' color='general' line_height='m' size='s'>
                        <Localize i18n_default_text='Looking to buy or sell USD? You can post your own ad for others to respond.' />
                    </Text>
                    <Button
                        className='no-ads__button'
                        disabled={general_store.is_barred}
                        primary
                        large
                        onClick={onClickButton}
                    >
                        <Localize i18n_default_text={is_ads_page ? 'Create new ad' : 'Create ad'} />
                    </Button>
                </React.Fragment>
            ) : (
                <Text align='center' className='no-ads__title' color='general' line_height='m' size='s' weight='bold'>
                    <Localize i18n_default_text='No ads for this currency at the moment 😞' />
                </Text>
            )}
        </div>
    );
};

export default observer(NoAds);
