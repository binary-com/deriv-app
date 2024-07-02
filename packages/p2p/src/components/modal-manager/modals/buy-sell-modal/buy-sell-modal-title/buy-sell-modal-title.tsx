import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';

type TBuySellModalTitleProps = {
    is_buy?: boolean;
    onReturn: () => void;
};

const BuySellModalTitle = ({ is_buy = false, onReturn }: TBuySellModalTitleProps) => {
    const { isDesktop } = useDevice();
    const { buy_sell_store, my_profile_store } = useStores();
    const { selected_ad_state } = buy_sell_store;

    const { account_currency } = selected_ad_state;

    const getModalTitle = () => {
        if (my_profile_store.should_show_add_payment_method_form) {
            if (isDesktop) {
                return (
                    <div className='buy-sell-modal-title'>
                        <Icon
                            icon='IcArrowLeftBold'
                            data_testid='dt_buy_sell_modal_back_icon'
                            onClick={onReturn}
                            className='buy-sell-modal-title__icon'
                        />
                        <Localize i18n_default_text='Add payment method' />
                    </div>
                );
            }
            return <Localize i18n_default_text='Add payment method' />;
        }
        if (is_buy) {
            return <Localize i18n_default_text='Buy {{ currency }}' values={{ currency: account_currency }} />;
        }
        return <Localize i18n_default_text='Sell {{ currency }}' values={{ currency: account_currency }} />;
    };

    return (
        <Text as='p' color='prominent' weight='bold'>
            {getModalTitle()}
        </Text>
    );
};

export default observer(BuySellModalTitle);
