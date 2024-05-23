import React from 'react';
import { useHistory, useLocation } from 'react-router';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { useFeatureFlags } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const TradersHubHomeButton = observer(() => {
    const { client, ui } = useStore();
    const { has_wallet } = client;
    const { is_dark_mode_on } = ui;
    const history = useHistory();
    const location = useLocation();
    const { pathname } = location;
    const { is_next_tradershub_enabled } = useFeatureFlags();

    let TradersHubIcon;
    if (has_wallet) {
        TradersHubIcon = 'IcAppstoreTradersHubHomeUpdated';
    } else if (is_dark_mode_on) {
        TradersHubIcon = 'IcAppstoreHomeDark';
    } else {
        TradersHubIcon = 'IcAppstoreTradersHubHome';
    }

    const redirectRoutes = () => {
        if (has_wallet) {
            return routes.wallets;
        } else if (is_next_tradershub_enabled) {
            return routes.traders_hub_v2;
        }
        return routes.traders_hub;
    };

    return (
        <div
            data-testid='dt_traders_hub_home_button'
            className={classNames('traders-hub-header__tradershub', {
                'traders-hub-header__tradershub--active':
                    pathname === routes.traders_hub ||
                    pathname === routes.traders_hub_v2 ||
                    pathname === routes.wallets,
            })}
            onClick={() => history.push(redirectRoutes())}
        >
            <div className='traders-hub-header__tradershub--home-logo'>
                <Icon icon={TradersHubIcon} size={is_dark_mode_on ? 15 : 17} />
            </div>
            <Text className='traders-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
});

export default TradersHubHomeButton;
