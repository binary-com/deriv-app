import * as React from 'react';
import { Icon, Money, PopoverMobile, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useUpdatingAvailableBalance } from 'Components/hooks';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';
import MyProfileSeparatorContainer from '../my-profile-separator-container';

const MyProfileBalance = () => {
    const { general_store, my_profile_store } = useStores();
    const [is_balance_tooltip_open, setIsBalanceTooltipOpen] = React.useState(false);
    const available_balance = useUpdatingAvailableBalance(my_profile_store.advertiser_info.balance_available);

    return (
        <div className='my-profile-balance'>
            <MyProfileSeparatorContainer>
                <Text color='less-prominent' line_height='m' size='xs'>
                    <Localize i18n_default_text='Available Deriv P2P balance' />
                </Text>
                <MyProfileSeparatorContainer.Line is_invisible={isMobile()} />
                <Text
                    className='my-profile-balance__amount'
                    color='prominent'
                    line_height='m'
                    size={isMobile() ? 'xs' : 's'}
                    weight='bold'
                >
                    <Money amount={available_balance} currency={general_store.client.currency} show_currency />
                </Text>
                <PopoverMobile
                    button_text={localize('Got it')}
                    is_open={is_balance_tooltip_open}
                    message={localize(
                        'Deriv P2P balance = deposits that can’t be reversed (bank transfers, etc.) + a portion of deposits that might be reversed (credit card payments, etc.)'
                    )}
                    setIsOpen={setIsBalanceTooltipOpen}
                    title={localize('Available balance')}
                >
                    <Icon icon='IcInfoOutline' size={16} />
                </PopoverMobile>
            </MyProfileSeparatorContainer>
        </div>
    );
};

export default observer(MyProfileBalance);
