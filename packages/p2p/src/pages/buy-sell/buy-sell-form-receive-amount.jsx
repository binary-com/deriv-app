import React from 'react';
import { Text } from '@deriv/components';
import { getFormattedText } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { roundOffDecimal } from 'Utils/format-value';
import { useStores } from 'Stores';
import './buy-sell-form-receive-amount.scss';

const BuySellFormReceiveAmount = () => {
    const { buy_sell_store } = useStores();

    return (
        <div className='buy-sell-form-receive-amount'>
            <Text as='p' color='less-prominent' size='xxs'>
                {buy_sell_store?.is_sell_advert ? (
                    <Localize i18n_default_text="You'll receive" />
                ) : (
                    <Localize i18n_default_text="You'll send" />
                )}
            </Text>
            <Text as='p' size='xs' weight='bold'>
                {getFormattedText(
                    roundOffDecimal(buy_sell_store?.receive_amount),
                    buy_sell_store?.advert?.local_currency
                )}
            </Text>
        </div>
    );
};

export default observer(BuySellFormReceiveAmount);
