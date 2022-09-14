import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Div100vhContainer, Icon, useOnClickOutside } from '@deriv/components';
import { routes, isDesktop, isMobile, getActivePlatform, PlatformContext, getPlatformSettings } from '@deriv/shared';

import { BinaryLink } from 'App/Components/Routes';
import 'Sass/app/_common/components/platform-dropdown.scss';

const PlatformBox = ({ platform: { icon, title, description } }) => (
    <>
        <div className='platform-dropdown__list-platform-background' />
        <Icon className='platform-dropdown__list-platform-icon' icon={icon} size={32} />

        <div className='platform-dropdown__list-platform-details'>
            <p className='platform-dropdown__list-platform-title'>{title()}</p>
            <p className='platform-dropdown__list-platform-description'>{description()}</p>
        </div>
    </>
);

const platformDropdownContent = (platform, app_routing_history, hide_dropdown_items) => {
    let platform_dropdown_content = null;
    if (!hide_dropdown_items) {
        platform_dropdown_content = platform.link_to ? (
            <BinaryLink
                to={platform.link_to}
                // This is here because in routes-config it needs to have children, but not in menu
                exact={platform.link_to === routes.trade}
                className='platform-dropdown__list-platform'
                isActive={() => getActivePlatform(app_routing_history) === platform.name}
            >
                <PlatformBox platform={platform} />
            </BinaryLink>
        ) : (
            <a href={platform.href} className='platform-dropdown__list-platform'>
                <PlatformBox platform={platform} />
            </a>
        );
    }
    return platform_dropdown_content;
};

const PlatformDropdown = ({ app_routing_history, closeDrawer, platform_config }) => {
    React.useEffect(() => {
        window.addEventListener('popstate', closeDrawer);

        return () => {
            window.removeEventListener('popstate', closeDrawer);
        };
    }, [closeDrawer]);

    const ref = React.useRef();

    const handleClickOutside = event => {
        if (!event.target.closest('.platform-dropdown__list') && !event.target.closest('.platform-switcher')) {
            closeDrawer();
        }
    };
    const { is_pre_appstore } = React.useContext(PlatformContext);

    const getPlatformDropdownContent = platform => {
        const platform_dropdown_content = platformDropdownContent(
            platform,
            app_routing_history,
            (platform.name === getPlatformSettings('mt5').name ||
                platform.name === getPlatformSettings('dxtrade').name) &&
                is_pre_appstore
        );

        return platform_dropdown_content;
    };

    useOnClickOutside(ref, handleClickOutside, () => isDesktop());

    const platform_dropdown = (
        <div className='platform-dropdown'>
            <Div100vhContainer className='platform-dropdown__list' height_offset='156px' is_disabled={isDesktop()}>
                {platform_config.map((platform, idx) => (
                    <div key={idx} onClick={closeDrawer} ref={ref}>
                        {getPlatformDropdownContent(platform)}
                    </div>
                ))}
            </Div100vhContainer>
        </div>
    );

    if (isMobile()) {
        return ReactDOM.createPortal(platform_dropdown, document.getElementById('mobile_platform_switcher'));
    }

    return ReactDOM.createPortal(platform_dropdown, document.getElementById('deriv_app'));
};

PlatformDropdown.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformDropdown, PlatformBox };
