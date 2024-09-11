import React from 'react';
import classNames from 'classnames';
import { useDevice } from '@deriv-com/ui';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import DepositFiatIframe from '@deriv/cashier/src/modules/deposit-fiat/components/deposit-fiat-iframe/deposit-fiat-iframe';
import DepositCrypto from '@deriv/cashier/src/modules/deposit-crypto/components/deposit-crypto-wallet-address/deposit-crypto-wallet-address';

export const OneTimeDepositModalContent = ({ is_crypto_provider = false }: { is_crypto_provider?: boolean }) => {
    const { isDesktop } = useDevice();

    const onLiveChatClick = () => window.LiveChatWidget.call('maximize');

    return (
        <div
            className={classNames('one-time-deposit-modal__content', {
                'one-time-deposit-modal__content-crypto': is_crypto_provider,
            })}
        >
            <div className='one-time-deposit-modal__title'>
                <Text as='h1' size={!isDesktop ? 'm' : 'l'} weight='bold'>
                    <Localize i18n_default_text='Deposit' />
                </Text>
                <Text size={!isDesktop ? 'xs' : 's'} align='center'>
                    {is_crypto_provider ? (
                        <Localize
                            i18n_default_text='Need help? Contact us via <0>live chat</0>'
                            components={[
                                <Text
                                    key={0}
                                    className='one-time-deposit-modal__livechat'
                                    size={!isDesktop ? 'xs' : 's'}
                                    color='loss-danger'
                                    onClick={onLiveChatClick}
                                    data-testid='dt_live_chat'
                                />,
                            ]}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='Select a payment method to make a deposit into your account.<0 />Need help? Contact us via <1>live chat</1>'
                            components={[
                                <br key={0} />,
                                <Text
                                    key={1}
                                    className='one-time-deposit-modal__livechat'
                                    size={!isDesktop ? 'xs' : 's'}
                                    color='loss-danger'
                                    onClick={onLiveChatClick}
                                    data-testid='dt_live_chat'
                                />,
                            ]}
                        />
                    )}
                </Text>
            </div>
            {is_crypto_provider ? <DepositCrypto /> : <DepositFiatIframe />}
        </div>
    );
};
