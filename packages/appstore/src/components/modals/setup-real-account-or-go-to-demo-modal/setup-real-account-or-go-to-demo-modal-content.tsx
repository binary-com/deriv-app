import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { Button, Icon, Text } from '@deriv/components';
import { useContentFlag } from '@deriv/hooks';
import { Jurisdiction } from '@deriv/shared';

type TModalContent = {
    is_responsive?: boolean;
};

export const SetupRealAccountOrGoToDemoModalContent = observer(({ is_responsive = false }: TModalContent) => {
    const { ui, traders_hub } = useStore();
    const { openRealAccountSignup, setIsFromSignupAccount } = ui;
    const { setIsSetupRealAccountOrGoToDemoModalVisible } = traders_hub;

    const { is_cr_demo, is_eu_demo } = useContentFlag();

    const onSetupRealAccountButtonClick = () => {
        Analytics.trackEvent('ce_tradershub_popup', {
            action: 'click_download',
            form_name: 'traders_hub_default',
            account_mode: 'demo',
            popup_name: 'setup_real_or_go_demo',
            popup_type: 'with_cta',
            // @ts-expect-error 'cta_name' property type will be added later
            cta_name: 'setup_real',
        });

        setIsSetupRealAccountOrGoToDemoModalVisible(false);

        if (is_cr_demo) {
            openRealAccountSignup(Jurisdiction.SVG);
            setIsFromSignupAccount(false);
        } else if (is_eu_demo) {
            openRealAccountSignup(Jurisdiction.MALTA_INVEST);
            setIsFromSignupAccount(false);
        }
    };

    const onToDemoButtonClick = () => {
        Analytics.trackEvent('ce_tradershub_popup', {
            action: 'click_download',
            form_name: 'traders_hub_default',
            account_mode: 'demo',
            popup_name: 'setup_real_or_go_demo',
            popup_type: 'with_cta',
            // @ts-expect-error 'cta_name' property type will be added later
            cta_name: 'go_demo',
        });

        setIsFromSignupAccount(false);
        setIsSetupRealAccountOrGoToDemoModalVisible(false);
    };

    return (
        <div className='setup-real-account-or-go-to-demo-modal'>
            <Icon icon='IcAppstoreAccount' width={120} height={152} />
            <Text
                size={is_responsive ? 'sm' : 'm'}
                weight='bold'
                className='setup-real-account-or-go-to-demo-modal__title'
            >
                <Localize i18n_default_text='Start your trading journey' />
            </Text>
            <div className='setup-real-account-or-go-to-demo-modal__buttons'>
                <Button primary large onClick={onSetupRealAccountButtonClick}>
                    <Localize i18n_default_text='Set up your real account' />
                </Button>
                <Button secondary large onClick={onToDemoButtonClick}>
                    <Localize i18n_default_text='Take me to demo' />
                </Button>
            </div>
        </div>
    );
});
