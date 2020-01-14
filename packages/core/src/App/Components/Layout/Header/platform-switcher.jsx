import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import { withRouter }       from 'react-router-dom';
import { CSSTransition }    from 'react-transition-group';
import { Icon }             from '@deriv/components';
import { localize }         from '@deriv/translations';
import { isBot, isMT5 }     from 'Utils/PlatformSwitcher';
import { PlatformDropdown } from './platform-dropdown.jsx';
import                           'Sass/app/_common/components/platform-switcher.scss';

class PlatformSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
    }

    toggleDrawer = () => this.setState(state => ({ is_open: !state.is_open }));
    closeDrawer  = () => this.setState({ is_open: false });

    render = () => (
        <React.Fragment>
            <div
                className={classNames(
                    'platform-switcher',
                    { 'platform-switcher--active': this.state.is_open },
                    { 'platform-switcher--is-mobile': this.props.is_mobile },
                )}
                onClick={this.toggleDrawer}
            >
                <Icon
                    className='platform-switcher__icon'
                    icon={ (isBot() ? 'IcBrandDbot' : (isMT5() ? 'IcBrandDmt5' : 'IcBrandDtrader')) }
                    size={32}
                />
                <h1 className='platform-switcher__header'>
                    { (isBot() ? 'DBot' : (isMT5() ? 'DMT5' : 'DTrader')) }
                </h1>
                <p className='platform-switcher__label'>{localize('BETA')}</p>
                <Icon className='platform-switcher__arrow' icon='IcChevronDownBold' />
            </div>
            <CSSTransition
                mountOnEnter
                in={this.state.is_open}
                classNames={{
                    enterDone: 'platform-dropdown--enter-done',
                }}
                timeout={this.state.is_open ? 0 : 250}
                unmountOnExit
            >
                <PlatformDropdown
                    is_mobile={this.props.is_mobile}
                    platform_config={this.props.platform_config}
                    closeDrawer={this.closeDrawer}
                />
            </CSSTransition>
        </React.Fragment>
    );
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export default withRouter(PlatformSwitcher);
