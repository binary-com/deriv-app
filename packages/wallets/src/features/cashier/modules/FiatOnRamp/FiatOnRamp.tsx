import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LegacyArrowLeft2pxIcon } from '@deriv/quill-icons';
import { WalletButton, WalletText } from '../../../../components';
import { FiatOnRampDisclaimer, FiatOnRampProviderCard } from './components';
import { fiatOnRampProvider } from './constants';
import './FiatOnRamp.scss';

const FiatOnRamp = () => {
    const history = useHistory();
    const [disclaimer, setDisclaimer] = useState(false);

    const handleDisclaimer = () => setDisclaimer(disclaimer => !disclaimer);

    return (
        <React.Fragment>
            {disclaimer ? (
                <FiatOnRampDisclaimer handleDisclaimer={handleDisclaimer} />
            ) : (
                <div className='wallets-fiat-onramp'>
                    <div className='wallets-fiat-onramp__actions'>
                        <WalletButton
                            color='white'
                            icon={<LegacyArrowLeft2pxIcon iconSize='xs' />}
                            onClick={() => history.push('/wallets/cashier/deposit')}
                        >
                            Back
                        </WalletButton>
                    </div>
                    <div className='wallets-fiat-onramp__content'>
                        <div className='wallets-fiat-onramp__description'>
                            <WalletText align='center' color='primary' size='xs'>
                                Fiat onramp is a cashier service that allows you to convert fiat currencies to
                                cryptocurrencies to top up your Deriv crypto Wallet(s). Listed here are third-party
                                cryptocurrency exchanges. You&apos;ll need to create an account with them to use their
                                services.
                            </WalletText>
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
