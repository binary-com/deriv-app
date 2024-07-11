import React from 'react';
import { Text } from '@deriv-lib/components';
import { useCurrentCurrencyConfig } from '@deriv-lib/hooks';
import { observer, useStore } from '@deriv-lib/stores';
import { localize } from '@deriv-lib/translations';

const DepositCryptoCurrencyDetails: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const currency_config = useCurrentCurrencyConfig();

    return (
        <Text align='center' size={is_mobile ? 'xs' : 's'} weight='bold'>
            {localize('Send only {{currency_name}} ({{currency_code}}) to this address.', {
                currency_name: currency_config?.name || '',
                currency_code: currency_config?.display_code || '',
            })}
        </Text>
    );
});

export default DepositCryptoCurrencyDetails;
