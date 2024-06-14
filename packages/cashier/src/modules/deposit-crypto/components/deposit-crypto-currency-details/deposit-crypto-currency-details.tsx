import React from 'react';
import { Text } from '@deriv/components';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';

const DepositCryptoCurrencyDetails: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile_or_tablet } = ui;
    const currency_config = useCurrentCurrencyConfig();

    return (
        <Text align='center' size={is_mobile_or_tablet ? 'xs' : 's'} weight='bold'>
            {localize('Send only {{currency_name}} ({{currency_code}}) to this address.', {
                currency_name: currency_config?.name || '',
                currency_code: currency_config?.display_code || '',
            })}
        </Text>
    );
});

export default DepositCryptoCurrencyDetails;
