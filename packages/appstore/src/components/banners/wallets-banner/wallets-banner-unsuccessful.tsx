import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const trackAnalyticsEvent = (
    action: TEvents['ce_tradershub_banner']['action'],
    account_mode: TEvents['ce_tradershub_banner']['account_mode']
) => {
    Analytics.trackEvent('ce_tradershub_banner', {
        action,
        form_name: 'ce_tradershub_banner',
        account_mode,
        banner_name: 'setup_unsuccessful_wallets',
        banner_type: 'with_cta',
    });
};

const WalletBannerUnsuccessful = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_mobile } = ui;
    const { is_demo, toggleWalletsUpgrade } = traders_hub;
    const account_mode = is_demo ? 'demo' : 'real';

    React.useEffect(() => {
        trackAnalyticsEvent('open', account_mode);
    }, [account_mode]);

    const onWalletsUpgradeHandler = () => {
        toggleWalletsUpgrade(true);
        trackAnalyticsEvent('click_cta', account_mode);
    };

    return (
        <div className='wallets-banner__container wallets-banner-unsuccessful'>
            <div className='wallets-banner__content wallets-banner-unsuccessful__content'>
                <Localize
                    i18n_default_text='<0>Setup unsuccessful</0>'
                    components={[
                        <Text
                            key={0}
                            line_height={is_mobile ? 's' : 'm'}
                            size={is_mobile ? 'xs' : 'sm'}
                            weight='bold'
                        />,
                    ]}
                />
                <div>
                    <Localize
                        i18n_default_text='<0>We’re unable to upgrade you to Wallets at this time and are working to get this fixed as soon as we can. Please </0><1>try again</1><0>.</0>'
                        components={[
                            <Text key={0} line_height='s' size={is_mobile ? 'xxxs' : 'xs'} />,
                            <Text
                                key={1}
                                className='wallets-banner-unsuccessful__clickable-text'
                                color='red'
                                line_height='s'
                                size={is_mobile ? 'xxxs' : 'xs'}
                                weight='bold'
                                onClick={onWalletsUpgradeHandler}
                            />,
                        ]}
                    />
                </div>
            </div>
            <Icon
                icon='IcAppstoreWalletsUpgradeUnsuccessful'
                width={is_mobile ? 192 : 272}
                height='100%'
                className='wallets-banner-unsuccessful__image'
                data_testid='dt_wallets_upgrade_unsuccessful'
            />
        </div>
    );
});

export default WalletBannerUnsuccessful;
