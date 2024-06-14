import React from 'react';
import { Button, Icon, NewsTicker, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TOnRampProvider } from '../../../types';
import { observer, useStore } from '@deriv/stores';
import { useCashierStore } from '../../../stores/useCashierStores';

type TOnRampProviderCardProps = {
    provider: TOnRampProvider;
};

const OnRampProviderCard = observer(({ provider }: TOnRampProviderCardProps) => {
    const { ui } = useStore();
    const { is_dark_mode_on, is_mobile_or_tablet } = ui;
    const { onramp } = useCashierStore();
    const { setSelectedProvider } = onramp;

    const payment_icons = provider.getPaymentIcons();
    const gtm_identifier = provider.name.toLowerCase().replace(' ', '-');
    const logo_size = is_mobile_or_tablet ? 56 : 128;

    return (
        <div className='on-ramp__provider'>
            <div className='on-ramp__provider-logo'>
                <Icon
                    data_testid={is_dark_mode_on ? 'dt_provider_icon_dark' : 'dt_provider_icon_light'}
                    icon={is_dark_mode_on ? provider.icon.dark : provider.icon.light}
                    width={logo_size}
                    height={logo_size}
                />
            </div>
            <Text size='s' color='prominent' weight='bold' line_height='l' className='on-ramp__provider-name'>
                {provider.name}
            </Text>
            <Text size='xs' line_height='m' as='p' className='on-ramp__provider-description'>
                {provider.getDescription()}
            </Text>
            <div className='on-ramp__provider-payment-icons'>
                <div className='on-ramp__provider-payment-icons-shadow' />
                <NewsTicker speed={10}>
                    {payment_icons.map(payment_icon => {
                        const icon = is_dark_mode_on ? payment_icon.dark : payment_icon.light;

                        return (
                            <Icon
                                data_testid={is_dark_mode_on ? 'dt_payment_icon_dark' : 'dt_payment_icon_light'}
                                icon={icon}
                                key={icon}
                                size={40}
                            />
                        );
                    })}
                </NewsTicker>
            </div>
            <Button
                id={`gtm-onramp-provider-select--${gtm_identifier}`}
                className='on-ramp__provider-button'
                type='button'
                has_effect
                onClick={() => setSelectedProvider(provider)}
                text={localize('Select')}
                primary
                small={is_mobile_or_tablet}
            />
        </div>
    );
});

export default OnRampProviderCard;
