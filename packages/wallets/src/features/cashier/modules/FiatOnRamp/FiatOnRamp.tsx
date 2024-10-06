import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LegacyArrowLeft2pxIcon, LegacyArrowRight2pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import useIsRtl from '../../../../hooks/useIsRtl';
import { FiatOnRampDisclaimer, FiatOnRampProviderCard } from './components';
import { fiatOnRampProvider } from './constants';
import './FiatOnRamp.scss';

const FiatOnRamp = () => {
    const history = useHistory();
    const isRtl = useIsRtl();
    const [disclaimer, setDisclaimer] = useState(false);

    const handleDisclaimer = () => setDisclaimer(disclaimer => !disclaimer);

    return (
        <React.Fragment>
            {disclaimer ? (
                <FiatOnRampDisclaimer handleDisclaimer={handleDisclaimer} />
            ) : (
                <div className='wallets-fiat-onramp'>
                    <div className='wallets-fiat-onramp__actions'>
                        <Button
                            color='white'
                            icon={
                                isRtl ? (
                                    <LegacyArrowRight2pxIcon iconSize='xs' />
                                ) : (
                                    <LegacyArrowLeft2pxIcon iconSize='xs' />
                                )
                            }
                            onClick={() => history.push('/wallet/deposit')}
                        >
                            <Localize i18n_default_text='Back' />
                        </Button>
                    </div>
                    <div className='wallets-fiat-onramp__content'>
                        <div className='wallets-fiat-onramp__description'>
                            <Text align='center' color='primary' size='xs'>
                                <Localize i18n_default_text="Fiat onramp is a cashier service that allows you to convert fiat currencies to cryptocurrencies to top up your Deriv crypto Wallet(s). Listed here are third-party cryptocurrency exchanges. You'll need to create an account with them to use their services." />
                            </Text>
                        </div>
                        <FiatOnRampProviderCard
                            description={fiatOnRampProvider.description}
                            getPaymentIcons={fiatOnRampProvider.getPaymentIcons}
                            handleDisclaimer={handleDisclaimer}
                            icon={fiatOnRampProvider.icon}
                            name={fiatOnRampProvider.name}
                        />
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default FiatOnRamp;
