import React, { MouseEventHandler } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import './FiatOnRampProviderCard.scss';

type TFiatOnRampProvider = {
    description: React.ReactNode;
    getPaymentIcons: () => { icon: JSX.Element; name: string }[];
    handleDisclaimer: MouseEventHandler<HTMLButtonElement>;
    icon: React.ReactNode;
    name: React.ReactNode;
};
const FiatOnRampProviderCard: React.FC<TFiatOnRampProvider> = ({
    description,
    getPaymentIcons,
    handleDisclaimer,
    icon,
    name,
}) => {
    const paymentIcons = getPaymentIcons();

    return (
        <div className='wallets-fiat-onramp-provider'>
            <div className='wallets-fiat-onramp-provider__logo'>{icon}</div>
            <div className='wallets-fiat-onramp-provider__content'>
                <Text align='start' color='prominent' size='md' weight='bold'>
                    {name}
                </Text>
                <Text align='start' size='sm'>
                    {description}
                </Text>
                <div className='wallets-fiat-onramp-provider__icons'>
                    {paymentIcons.map(paymentIcon => (
                        <div
                            className='wallets-fiat-onramp-provider__payment-icon'
                            key={`payment-method-icon-${paymentIcon.name}`}
                        >
                            {paymentIcon.icon}
                        </div>
                    ))}
                </div>
            </div>
            <div className='wallets-fiat-onramp-provider__mobile-icons'>
                {paymentIcons.map(paymentIcon => (
                    <div
                        className='wallets-fiat-onramp-provider__payment-icon'
                        key={`payment-method-mobile-icon-${paymentIcon.name}`}
                    >
                        {paymentIcon.icon}
                    </div>
                ))}
            </div>
            <Button onClick={handleDisclaimer} size='md'>
                <Localize i18n_default_text='Select' />
            </Button>
        </div>
    );
};

export default FiatOnRampProviderCard;
