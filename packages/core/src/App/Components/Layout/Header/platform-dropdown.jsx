import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Div100vhContainer, Icon } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import { BinaryLink } from 'App/Components/Routes';
import routes from 'Constants/routes';
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
class PlatformDropdown extends React.PureComponent {
    handleClickOutside = event => {
        if (!event.target.closest('.platform-dropdown__list') && !event.target.closest('.platform-switcher')) {
            this.props.closeDrawer();
        }
    };

    componentWillMount() {
        window.addEventListener('popstate', this.props.closeDrawer);
        if (isDesktop()) document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.props.closeDrawer);
        if (isDesktop()) document.removeEventListener('click', this.handleClickOutside);
    }

    handleOnClick = platform => {
        // TODO: Find better way of sharing states between Bot and Trader/MT5 without refresh
        const body_el = document.body;
        if (platform.link_to === routes.bot) {
            body_el.classList.remove('theme--dark');
            body_el.classList.add('theme--light');
        } else if (platform.link_to === routes.trade || platform.link_to === routes.mt5) {
            if (this.props.is_dark_mode) {
                body_el.classList.remove('theme--light');
                body_el.classList.add('theme--dark');
            }
        }
        this.props.closeDrawer();
    };

    render() {
        const { platform_config } = this.props;

        const platform_dropdown = (
            <div className='platform-dropdown'>
                <Div100vhContainer className='platform-dropdown__list' height_offset='151px' is_disabled={isDesktop()}>
                    {platform_config.map((platform, idx) => (
                        <div key={idx} onClick={() => this.handleOnClick(platform)}>
                            {platform.link_to !== undefined ? (
                                <BinaryLink
                                    to={platform.link_to}
                                    // This is here because in routes-config it needs to have children, but not in menu
                                    exact={platform.link_to === routes.trade}
                                    className='platform-dropdown__list-platform'
                                >
                                    <PlatformBox platform={platform} />
                                </BinaryLink>
                            ) : (
                                <a href={platform.href} className='platform-dropdown__list-platform'>
                                    <PlatformBox platform={platform} />
                                </a>
                            )}
                        </div>
                    ))}
                </Div100vhContainer>
            </div>
        );

        if (isMobile()) {
            return ReactDOM.createPortal(platform_dropdown, document.getElementById('mobile_platform_switcher'));
        }
        return ReactDOM.createPortal(platform_dropdown, document.getElementById('deriv_app'));
    }
}

PlatformDropdown.propTypes = {
    platform_configs: PropTypes.array,
    is_dark_mode: PropTypes.bool,
};

export { PlatformDropdown };
