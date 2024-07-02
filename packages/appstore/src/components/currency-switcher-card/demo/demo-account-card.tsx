import React from 'react';
import { Button, Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import './demo-account-card.scss';
import { Localize, useLocalize } from '@deriv/translations';
import { usePlatformAccounts } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';

const DemoAccountCard = observer(() => {
    const { localize } = useLocalize();
    const { client, traders_hub, common } = useStore();
    const { accounts, loginid, resetVirtualBalance, default_currency } = client;
    const { selected_account_type } = traders_hub;
    const { demo: platform_demo_account } = usePlatformAccounts();

    const canResetBalance = () => {
        return loginid && (accounts[loginid]?.balance || 0) !== 10000;
    };

    const { current_language } = common;

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            icon='VIRTUAL'
            title={
                <BalanceText
                    currency={platform_demo_account?.currency || default_currency}
                    balance={platform_demo_account?.balance || 0}
                    size='xs'
                />
            }
            actions={
                canResetBalance() && (
                    <Button
                        key={`currency-switcher__button--key-${current_language}`}
                        secondary
                        onClick={resetVirtualBalance}
                        className='currency-switcher__button'
                    >
                        <Localize i18n_default_text='Reset Balance' />
                    </Button>
                )
            }
        >
            <Text className='demo-account-card__type' color='primary' size='xs' line_height='s'>
                {localize(selected_account_type)}
            </Text>
        </CurrencySwitcherContainer>
    );
});

export default DemoAccountCard;
