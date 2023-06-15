import React from 'react';
import { InlineMessage } from '@deriv/components';
import { useCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const CashierOnboardingAccountIdentifierMessage: React.FC = observer(() => {
    const { client } = useStore();
    const { currency, loginid, is_eu, is_low_risk } = client;
    const { getConfig } = useCurrencyConfig();
    const currency_config = getConfig(currency);
    const regulation_text = is_eu ? 'EU ' : 'non-EU ';
    const regulation = currency_config?.is_crypto || is_low_risk ? '' : regulation_text;

    return (
        <InlineMessage
            type='information'
            size='sm'
            message={
                <Localize
                    i18n_default_text='This is your <0>{{regulation}}{{currency}}</0> account {{loginid}}.'
                    values={{ regulation, currency: currency_config?.display_code, loginid }}
                    components={[<strong key={0} />]}
                />
            }
        />
    );
});

export default CashierOnboardingAccountIdentifierMessage;
