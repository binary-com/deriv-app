import React, { MouseEventHandler, useCallback, useEffect } from 'react';
import { useMutation } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import './FiatOnRampDisclaimer.scss';

type TFiatOnRampDisclaimer = {
    handleDisclaimer: MouseEventHandler<HTMLButtonElement>;
};

const FiatOnRampDisclaimer: React.FC<TFiatOnRampDisclaimer> = ({ handleDisclaimer }) => {
    const { data: provider, isLoading, mutate } = useMutation('service_token');

    const redirectToBanxa = useCallback(() => {
        const banxaUrl = provider?.service_token?.banxa?.url ?? '';
        if (banxaUrl) {
            window.open(banxaUrl, '_blank');
        }
    }, [provider?.service_token?.banxa?.url]);

    useEffect(() => {
        mutate({ payload: { referrer: window.location.href, service: 'banxa' } });
    }, [mutate]);

    return (
        <div className='wallets-fiat-onramp-disclaimer'>
            <Text align='start' color='prominent' size='xs' weight='bold'>
                <Localize i18n_default_text='Disclaimer' />
            </Text>
            <Text align='start' size='xs'>
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text="By clicking <0>Continue</0>, you'll be redirected to Banxa, a third-party payment service provider. Please note that Deriv is not responsible for the content or services provided by Banxa. If you encounter any issues related to Banxa services, you should contact Banxa directly."
                />
            </Text>
            <div className='wallets-fiat-onramp-disclaimer__buttons'>
                <Button borderWidth='sm' color='black' onClick={handleDisclaimer} size='md' variant='outlined'>
                    <Localize i18n_default_text='Back' />
                </Button>
                <Button isLoading={isLoading} onClick={() => redirectToBanxa()} size='md'>
                    <Localize i18n_default_text='Continue' />
                </Button>
            </div>
        </div>
    );
};

export default FiatOnRampDisclaimer;
