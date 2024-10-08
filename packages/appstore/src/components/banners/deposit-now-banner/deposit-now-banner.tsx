import React from 'react';
import { useHistory } from 'react-router-dom';
import { Analytics } from '@deriv-com/analytics';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv/translations';
import { Button, Text, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import './deposit-now-banner.scss';

const desktopWidth = 368;
const desktopHeight = 154;
const responsiveWidth = 115;
const responsiveHeight = 112;

const DepositNowBanner = observer(() => {
    const { isDesktop } = useDevice();
    const history = useHistory();
    const { traders_hub } = useStore();
    const currency_config = useCurrentCurrencyConfig();
    const is_crypto_account = currency_config?.is_crypto;
    const { is_eu_user } = traders_hub;

    const handleButtonClick = () => {
        Analytics.trackEvent('ce_tradershub_banner', {
            action: 'click_cta',
            banner_name: 'first_deposit',
            banner_type: 'with_cta',
        });
        history.push(`${routes.cashier_deposit}${is_crypto_account ? '#deposit' : ''}`);
    };

    React.useEffect(() => {
        Analytics.trackEvent('ce_tradershub_banner', {
            action: 'open',
            banner_name: 'first_deposit',
            banner_type: 'with_cta',
        });
    }, []);

    return (
        <div className='deposit-now-banner'>
            <div className='deposit-now-banner__content'>
                <div className='deposit-now-banner__description'>
                    <Text size={!isDesktop ? 'xs' : 'm'} color='prominent'>
                        <Localize i18n_default_text='Make your first deposit to start trading' />
                    </Text>
                    <Button className='deposit-now-banner__button' large primary onClick={handleButtonClick}>
                        <Localize i18n_default_text='Deposit now' />
                    </Button>
                </div>
                <Icon
                    icon={`IcAppstoreDepositNow${is_eu_user ? 'Eu' : 'NonEu'}Coins${
                        isDesktop ? 'Desktop' : 'Responsive'
                    }`}
                    width={isDesktop ? desktopWidth : responsiveWidth}
                    height={isDesktop ? desktopHeight : responsiveHeight}
                    className='deposit-now-banner__image'
                    data_testid={`dt_deposit_now_${is_eu_user ? 'eu' : 'non_eu'}_coins_${
                        isDesktop ? 'desktop' : 'responsive'
                    }`}
                />
            </div>
        </div>
    );
});

export default DepositNowBanner;
