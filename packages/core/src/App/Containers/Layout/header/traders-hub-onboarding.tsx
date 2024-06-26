import React from 'react';
import { useHistory } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { Icon, Popover } from '@deriv/components';
import { routes, isTabletOs } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const TradersHubOnboarding = observer(() => {
    const history = useHistory();
    const { ui } = useStore();
    const { is_dark_mode_on, is_mobile } = ui;
    const [, setWalletsOnboarding] = useLocalStorage('walletsOnboarding', '');

    const onClickHandler = () => {
        setWalletsOnboarding('started');
        if (history.location.pathname !== routes.traders_hub) {
            history.push(routes.traders_hub);
        }
    };

    const onboardingIcon = (
        <Icon
            data_testid='dt_traders_hub_onboarding_icon'
            icon={is_dark_mode_on ? 'IcAppstoreTradingHubOnboardingDark' : 'IcAppstoreTradingHubOnboarding'}
            size={20}
            onClick={onClickHandler}
        />
    );

    return (
        <div data-testid='dt_traders_hub_onboarding'>
            <div className='traders-hub-header__tradershub--onboarding--logo'>
                {isTabletOs ? (
                    onboardingIcon
                ) : (
                    <Popover
                        classNameBubble='account-settings-toggle__tooltip'
                        alignment='bottom'
                        message={!is_mobile && <Localize i18n_default_text='View tutorial' />}
                        should_disable_pointer_events
                        zIndex='9999'
                    >
                        {onboardingIcon}
                    </Popover>
                )}
            </div>
        </div>
    );
});

export default TradersHubOnboarding;
