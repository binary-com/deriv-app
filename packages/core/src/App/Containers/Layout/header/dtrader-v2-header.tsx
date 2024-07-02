import React from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { observer, useStore } from '@deriv/stores';
import { Jurisdiction, routes } from '@deriv/shared';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import HeaderAccountActionsDTraderV2 from 'App/Components/Layout/Header/dtrader-v2/header-account-actions-dtrader-v2';
import RealSignupBannerDTraderV2 from 'App/Components/Layout/Header/dtrader-v2/real-signup-banner-dtrader-v2';

const DTraderV2Header = observer(() => {
    const { ui, client, traders_hub } = useStore();
    const { is_real_acc_signup_on, setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const { has_any_real_account, is_eu, real_account_creation_unlock_date, is_landing_company_loaded } = client;
    const { selectRegion } = traders_hub;
    const { pathname } = useLocation();

    const is_trading_page = pathname === routes.trade;
    const show_banner = !has_any_real_account && is_trading_page && is_landing_company_loaded;

    const openRealAccount = () => {
        if (real_account_creation_unlock_date) {
            setShouldShowCooldownModal(true);
        } else {
            selectRegion(is_eu ? 'EU' : 'Non-EU');
            openRealAccountSignup(is_eu ? Jurisdiction.MALTA_INVEST : Jurisdiction.SVG);
        }
    };

    return (
        <header
            className={classNames('header header-v2', {
                'header-v2--with-banner': show_banner,
            })}
        >
            <React.Suspense fallback={<div />}>
                {show_banner && <RealSignupBannerDTraderV2 openRealAccount={openRealAccount} is_eu={is_eu} />}
                <HeaderAccountActionsDTraderV2 has_notifications_icon={pathname !== routes.trader_positions} />
                {is_real_acc_signup_on && <RealAccountSignup />}
                <SetAccountCurrencyModal />
            </React.Suspense>
        </header>
    );
});

export default DTraderV2Header;
