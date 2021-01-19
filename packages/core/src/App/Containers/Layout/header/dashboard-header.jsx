import * as React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Button, Icon, Text } from '@deriv/components';
import { PlatformContext, redirectToLogin, redirectToSignUp, routes, isDesktop, isMobile } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import DerivLogo from 'Assets/SvgComponents/header/deriv-logo.svg';
import DerivText from 'Assets/SvgComponents/header/deriv-text.svg';
import DerivLogoText from 'Assets/SvgComponents/header/deriv-logo-text.svg';
import DerivLogoLight from 'Assets/SvgComponents/header/deriv-logo-light.svg';
import DerivLogoLightMobile from 'Assets/SvgComponents/header/deriv-logo-light-mobile.svg';
import HeaderItemsLoader from '../../../Components/Layout/Header/Components/Preloader/header-items.jsx';

const LoggedInHeader = () => {
    const history = useHistory();

    return (
        <header className='dashboard-header dashboard-header--logged-in'>
            <div className='dashboard-header__left'>
                <div onClick={() => history.push(routes.dashboard)}>
                    {isDesktop() ? <DerivLogoLight /> : <DerivLogoLightMobile />}
                </div>
            </div>
            <div className='dashboard-header__right--logged-in'>
                {isDesktop() ? (
                    <React.Fragment>
                        <Icon icon={'IcProfile'} size={32} className='dashboard-header__right--logged-in-icon' />
                        <Icon icon={'IcNotification'} size={32} />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Icon icon={'IcNotification'} height={20} width={17} />
                        <div className='dashboard-header__right--logged-in-separator' />
                        <Icon
                            icon={'IcHamburger'}
                            className='dashboard-header__right-hamburger'
                            width={12}
                            height={10}
                        />
                    </React.Fragment>
                )}
            </div>
        </header>
    );
};

const LoggedOutHeader = () => {
    const history = useHistory();
    const { is_deriv_crypto } = React.useContext(PlatformContext);

    return (
        <header className='dashboard-header dashboard-header--logged-out'>
            <div className='dashboard-header__left'>
                <div onClick={() => history.push(routes.dashboard)}>
                    {isDesktop() ? (
                        <React.Fragment>
                            <DerivLogo style={{ marginRight: '0.684rem' }} />
                            <DerivText />
                        </React.Fragment>
                    ) : (
                        <DerivLogoText />
                    )}
                </div>
            </div>
            <div className='dashboard-header__middle--logged-out'>
                <Text color='colored-background' size='s' onClick={() => history.push(routes.explore)}>
                    {localize('Explore')}
                </Text>
                <Text color='colored-background' size='s' onClick={() => history.push(routes.about_us)}>
                    {localize('About us')}
                </Text>
                <Text color='colored-background' size='s' onClick={() => history.push(routes.resources)}>
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
                        onClick={() => redirectToSignUp({ is_deriv_crypto })}
                    />
                </Button.Group>
                {isMobile() && (
                    <React.Fragment>
                        <div className='dashboard-header__right--logged-out-separator' />
                        <Icon
                            icon={'IcHamburgerWhite'}
                            className='dashboard-header__right-hamburger'
                            width={12}
                            height={10}
                        />
                    </React.Fragment>
                )}
            </div>
        </header>
    );
};

const HeaderPreloader = () => (
    <div className={'dashboard-header__preloader'}>
        <HeaderItemsLoader speed={3} />
    </div>
);

const DashboardHeader = ({ is_logged_in, is_logging_in }) => {
    if (is_logging_in) {
        return <HeaderPreloader />;
    }

    if (is_logged_in) {
        return <LoggedInHeader />;
    }

    return <LoggedOutHeader />;
};

DashboardHeader.propTypes = {
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
};

export default connect(({ client }) => ({
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
}))(DashboardHeader);
