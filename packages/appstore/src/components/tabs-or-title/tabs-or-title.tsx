import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { ButtonToggle, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getPlatformToggleOptions } from 'Helpers';
import './tabs-or-title.scss';

const TabsOrTitle = observer(() => {
    const { traders_hub, client } = useStore();
    const { is_mt5_allowed, is_logged_in } = client;
    const { selected_platform_type, setTogglePlatformType, is_eu_user, has_available_cfd_account } = traders_hub;

    const platform_toggle_options = getPlatformToggleOptions(is_eu_user);
    const platform_toggle_options_eu = getPlatformToggleOptions(is_eu_user).reverse();

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setTogglePlatformType(event.target.value);
    };

    return (is_logged_in && is_mt5_allowed) || (!is_logged_in && has_available_cfd_account) ? (
        <ButtonToggle
            buttons_arr={is_eu_user ? platform_toggle_options_eu : platform_toggle_options}
            className='tabs-or-title__button-toggle'
            has_rounded_button
            is_traders_hub
            name='platform_type'
            onChange={platformTypeChange}
            value={selected_platform_type}
        />
    ) : (
        <div className='tabs-or-title__mt5-not-allowed'>
            <Text size='s' weight='bold' color='prominent'>
                <Localize i18n_default_text='Multipliers' />
            </Text>
        </div>
    );
});

export default TabsOrTitle;
