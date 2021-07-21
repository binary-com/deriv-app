import * as React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Text } from '@deriv/components';
import { isDesktop, isMobile, PlatformContext, redirectToLogin, redirectToSignUp, routes } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import DerivLogo from 'Assets/SvgComponents/header/deriv-logo.svg';
import DerivLogoDark from 'Assets/SvgComponents/header/deriv-logo-dark.svg';
import DerivLogoDarkMobile from 'Assets/SvgComponents/header/deriv-logo-dark-mobile.svg';
import DerivLogoLight from 'Assets/SvgComponents/header/deriv-logo-light.svg';
import DerivLogoLightMobile from 'Assets/SvgComponents/header/deriv-logo-light-mobile.svg';
import DerivLogoText from 'Assets/SvgComponents/header/deriv-logo-text.svg';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import HeaderDropdown from './dashboard-header-dropdown.jsx';
import HeaderItemsLoader from '../../../Components/Layout/Header/Components/Preloader/header-items.jsx';

const getDerivLogo = is_dark_mode => {
    if (isDesktop()) {
        return is_dark_mode ? <DerivLogoDark /> : <DerivLogoLight />;
    }
    return is_dark_mode ? <DerivLogoDarkMobile /> : <DerivLogoLightMobile />;
};

const LoggedInHeader = ({ is_dark_mode }) => {
    const history = useHistory();

    return (
        <header className='dashboard-header dashboard-header--logged-in'>
            <div className='dashboard-header__left'>
                <div onClick={() => history.push(routes.dashboard)}>{getDerivLogo(is_dark_mode)}</div>
            </div>
            <div className='dashboard-header__right--logged-in'>
                {isDesktop() ? (
                    <React.Fragment>
                        <Icon icon={'IcProfile'} size={32} className='dashboard-header__right--logged-in-icon' />
                        <Icon icon={'IcNotification'} size={32} />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Icon icon={'IcNotificationClear'} height={20} width={17} />
                        <div className='dashboard-header__right--logged-in-separator' />
                        <ToggleMenuDrawer alignment={'right'} is_logged_in should_allow_authentication title={''} />
                    </React.Fragment>
                )}
            </div>
        </header>
    );
};

const LoggedOutHeader = () => {
    const history = useHistory();
    const { is_dashboard } = React.useContext(PlatformContext);
    const [active_dropdown, setCurrentDropdown] = React.useState('');
    const [active_link_ref, setActiveLinkRef] = React.useState(null);
    const [active_dropdown_ref, setActiveDropdownRef] = React.useState(null);
    const nav_dropdown_ref = React.useRef(null);

    const handleDropdownClick = (dropdown, target) => {
        setCurrentDropdown(dropdown);
        if (target) {
            setActiveLinkRef(target);
        }
    };

    const handleOutsideClick = React.useCallback(
        e => {
            if (nav_dropdown_ref?.current && !nav_dropdown_ref.current.contains(e.target)) {
                if (active_dropdown_ref?.current && active_dropdown_ref.current.contains(e.target)) return;
                setCurrentDropdown('');
            }
        },
        [active_dropdown_ref]
    );

    const setDropdown = new_ref => setActiveDropdownRef(new_ref);

    React.useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [handleOutsideClick]);

    return (
        <React.Fragment>
            <header className='dashboard-header dashboard-header--logged-out'>
                <div className='dashboard-header__left'>
                    <div onClick={() => history.push(routes.dashboard)}>
                        {isDesktop() ? (
                            <DerivLogo className='dashboard-header__left--desktop-logo' />
                        ) : (
                            <DerivLogoText />
                        )}
                    </div>
                </div>
                <div ref={nav_dropdown_ref} className='dashboard-header__middle--logged-out'>
                    <Text color='colored-background' size='s' onClick={() => history.push(routes.explore)}>
                        {localize('Explore')}
                    </Text>
                    <Text color='colored-background' size='s' onClick={e => handleDropdownClick('about', e.target)}>
                        {localize('About us')}
                    </Text>
                    <Text color='colored-background' size='s' onClick={e => handleDropdownClick('resources', e.target)}>
                        {localize('Resources')}
                    </Text>
                </div>
                <div className='dashboard-header__right--logged-out'>
                    <Button.Group>
                        <Button
                            alternate
                            has_effect
                            text={localize('Log in')}
                            onClick={() => redirectToLogin(false, getLanguage())}
                        />
                        <Button
                            className='dashboard-header__right--create-button'
                            primary
                            text={localize('Create free demo account')}
                            onClick={() => redirectToSignUp({ is_dashboard })}
                        />
                    </Button.Group>
                    {isMobile() && (
                        <React.Fragment>
                            <div className='dashboard-header__right--logged-out-separator' />
                            <ToggleMenuDrawer alignment={'right'} should_allow_authentication title={''} />
                        </React.Fragment>
                    )}
                </div>
            </header>
            {active_dropdown && (
                <HeaderDropdown
                    key={active_dropdown}
                    current_ref={active_link_ref}
                    parent={active_dropdown}
                    setRef={setDropdown}
                />
            )}
        </React.Fragment>
    );
};

const HeaderPreloader = () => (
    <div className={'dashboard-header__preloader'}>
        <HeaderItemsLoader speed={3} />
    </div>
);

const DashboardHeader = ({ is_dark_mode, is_logged_in, is_logging_in }) => {
    if (is_logging_in) return <HeaderPreloader />;
    if (is_logged_in) return <LoggedInHeader is_dark_mode={is_dark_mode} />;
    return <LoggedOutHeader />;
};

DashboardHeader.propTypes = {
    is_dark_mode: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
};

export default connect(({ client, ui }) => ({
    is_dark_mode: ui.is_dark_mode_on,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
}))(DashboardHeader);
