import React, { useEffect } from 'react';
import { useContentFlag, useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Jurisdiction } from '@deriv/shared';

const AfterSignupFlow = observer(() => {
    const { client, ui, traders_hub } = useStore();
    const { openRealAccountSignup, is_from_signup_account, setIsFromSignupAccount } = ui;
    const { is_logged_in, has_active_real_account } = client;
    const { setIsSetupRealAccountOrGoToDemoModalVisible } = traders_hub;

    const { is_cr_demo, is_eu_demo } = useContentFlag();

    const [direct_to_real_account_creation] = useGrowthbookGetFeatureValue({
        featureFlag: 'direct-real-account-creation-flow',
        defaultValue: false,
    });

    const [show_setup_real_or_go_demo] = useGrowthbookGetFeatureValue({
        featureFlag: 'show_setup_real_or_go_demo',
        defaultValue: false,
    });

    useEffect(() => {
        if (!has_active_real_account && is_from_signup_account && is_logged_in) {
            // move the user directly to setup real account
            if (direct_to_real_account_creation && !show_setup_real_or_go_demo) {
                if (is_cr_demo) {
                    openRealAccountSignup(Jurisdiction.SVG);
                    setIsFromSignupAccount(false);
                } else if (is_eu_demo) {
                    openRealAccountSignup(Jurisdiction.MALTA_INVEST);
                    setIsFromSignupAccount(false);
                }
            }

            // show setup real or go to demo modal for user
            if (!direct_to_real_account_creation && show_setup_real_or_go_demo) {
                setIsSetupRealAccountOrGoToDemoModalVisible(true);
                setIsFromSignupAccount(false);
            }
        }
    }, [
        is_cr_demo,
        is_eu_demo,
        has_active_real_account,
        is_from_signup_account,
        is_logged_in,
        direct_to_real_account_creation,
        openRealAccountSignup,
        setIsFromSignupAccount,
    ]);

    return null;
});

export default AfterSignupFlow;
