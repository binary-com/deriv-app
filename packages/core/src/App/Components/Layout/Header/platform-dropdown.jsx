import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Div100vhContainer, Icon, useOnClickOutside, Text } from '@deriv/components';
import { routes, isDesktop, isMobile, getActivePlatform } from '@deriv/shared';
import { BinaryLink } from 'App/Components/Routes';
import 'Sass/app/_common/components/platform-dropdown.scss';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import { useStore, observer } from '@deriv/stores';

const PlatformBox = ({ platform: { icon, title, description } }) => (
    <React.Fragment>
        <div className='platform-dropdown__list-platform-background' />
        <Icon
            data_testid='dt_platform_box_icon'
            className='platform-dropdown__list-platform-icon'
            icon={icon}
            size={32}
        />

        <div className='platform-dropdown__list-platform-details'>
            <p className='platform-dropdown__list-platform-title'>{title()}</p>
            <p className='platform-dropdown__list-platform-description'>{description()}</p>
        </div>
    </React.Fragment>
);

const PlatformDropdownContent = ({ platform, app_routing_history }) => {
    return (
        (platform.link_to && (
            <BinaryLink
                data-testid='dt_platform_dropdown'
                to={platform.link_to}
                // This is here because in routes-config it needs to have children, but not in menu
                exact={platform.link_to === routes.trade}
                className='platform-dropdown__list-platform'
                isActive={() => getActivePlatform(app_routing_history) === platform.name}
            >
                <PlatformBox platform={platform} />
            </BinaryLink>
        )) || (
            <a
                data-testid='dt_platform_dropdown_link'
                href={platform.href}
                className='platform-dropdown__list-platform'
            >
                <PlatformBox platform={platform} />
            </a>
        )
    );
};

const PlatformDropdown = observer(({ app_routing_history, closeDrawer, platform_config }) => {
    const history = useHistory();
    const { traders_hub } = useStore();
    const { setTogglePlatformType } = traders_hub;
    const TradersHubRedirect = () => {
        return (
            <div className='platform-dropdown__cta'>
                <BinaryLink
                    onClick={() => {
                        if (isMobile()) {
                            history.push(routes.traders_hub);
                            setTogglePlatformType('cfd');
                        }
                        history.push(routes.traders_hub);
                    }}
                >
                    <Text size='xs' weight='bold' align='center' className='platform-dropdown__cta--link'>
                        <Localize i18n_default_text="Looking for CFD accounts? Go to Trader's hub" />
                    </Text>
                </BinaryLink>
            </div>
        );
    };

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

    useOnClickOutside(ref, handleClickOutside, () => isDesktop());

    const platform_dropdown = (
        <div className='platform-dropdown'>
            <Div100vhContainer height_offset='156px' is_disabled={isDesktop()}>
                <div className='platform-dropdown__list'>
                    {platform_config.map(platform => {
                        return (
                            <div key={platform.name} onClick={closeDrawer} ref={ref}>
                                <PlatformDropdownContent
                                    platform={platform}
                                    app_routing_history={app_routing_history}
                                />
                            </div>
                        );
                    })}
                    <TradersHubRedirect />
                </div>
            </Div100vhContainer>
        </div>
    );

    if (isMobile()) {
        return ReactDOM.createPortal(platform_dropdown, document.getElementById('mobile_platform_switcher'));
    }

    return ReactDOM.createPortal(platform_dropdown, document.getElementById('deriv_app'));
});

PlatformDropdown.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformDropdown, PlatformBox };
