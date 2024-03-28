import React from 'react';
import { useHistory, useLocation } from 'react-router';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useFeatureFlags } from '@deriv/hooks';

const TradersHubHomeButton = observer(() => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;
    const history = useHistory();
    const location = useLocation();
    const { pathname } = location;
    const { is_next_tradershub_enabled } = useFeatureFlags();

    const redirect_routes = () => {
        if (is_next_tradershub_enabled) {
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
            onClick={() => history.push(redirect_routes())}
        >
            <div className='traders-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode_on ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode_on ? 15 : 17}
                />
            </div>
            <Text className='traders-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
});

export default TradersHubHomeButton;
