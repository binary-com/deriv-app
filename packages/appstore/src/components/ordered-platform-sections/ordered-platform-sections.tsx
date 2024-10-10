import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import OptionsAndMultipliersListingLoggedOut from 'Components/options-multipliers-listing-logged-out';
import CFDsListingLoggedOut from 'Components/cfds-listing-logged-out';
import './ordered-platform-sections.scss';

type TGetOrderedPlatformSections = {
    is_cfd_visible?: boolean;
    is_options_and_multipliers_visible?: boolean;
};

type TOrderedPlatformSections = {
    isDesktop?: boolean;
};

const GetOrderedPlatformSections = observer(
    ({ is_cfd_visible = true, is_options_and_multipliers_visible = true }: TGetOrderedPlatformSections) => {
        const { traders_hub } = useStore();
        const { is_eu_user } = traders_hub;

        return (
            <div
                className={classNames('ordered-platform-sections', {
                    'ordered-platform-sections__reversed': is_eu_user,
                })}
            >
                {is_options_and_multipliers_visible && <OptionsAndMultipliersListingLoggedOut />}
                {is_cfd_visible && <CFDsListingLoggedOut />}
            </div>
        );
    }
);

const OrderedPlatformSections = observer(({ isDesktop = false }: TOrderedPlatformSections) => {
    const { traders_hub, client } = useStore();
    const { is_mt5_allowed, is_logged_in } = client;
    const { selected_platform_type, has_available_cfd_account } = traders_hub;

    if ((is_logged_in && is_mt5_allowed) || !is_logged_in) {
        return isDesktop ? (
            <GetOrderedPlatformSections is_cfd_visible={has_available_cfd_account} />
        ) : (
            <GetOrderedPlatformSections
                is_cfd_visible={has_available_cfd_account && selected_platform_type === 'cfd'}
                is_options_and_multipliers_visible={selected_platform_type === 'options'}
            />
        );
    }
    return <GetOrderedPlatformSections is_cfd_visible={false} is_options_and_multipliers_visible />;
});

export default OrderedPlatformSections;
