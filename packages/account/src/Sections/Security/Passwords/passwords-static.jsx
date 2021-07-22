import React from 'react';
import PropTypes from 'prop-types';
import { Localize, localize } from '@deriv/translations';
import { Icon, Popover, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import DerivComLogo from '../../../Assets/ic-brand-deriv-red.svg';
import DerivGoLight from '../../../Assets/ic-brand-deriv-go-light.svg';
import DerivGoDark from '../../../Assets/ic-brand-deriv-go-dark.svg';

const PasswordsStatic = ({ is_dark_mode_on, is_deriv_password, is_mt5_password_not_set, is_dxtrade_allowed }) => (
    <React.Fragment>
        {is_deriv_password ? (
            <div className='account__passwords-item-left'>
                <Text className='passwords-static__text' color='prominent' size='xs' weight='lighter'>
                    <Localize
                        i18n_default_text='Use this to log in to Deriv.com, Deriv Go, DTrader,<0 /> SmartTrader, and DBot.'
                        components={[<br key={0} />]}
                    />
                </Text>
                <Text className='passwords-static__text' color='prominent' size='xs' weight='lighter'>
                    {localize('Apps you have linked to this password:')}
                </Text>
                <div className='passwords-static__logo-container'>
                    <DerivComLogo className='passwords-static__single-icon' />
                    <Text line_height='l' size='xs' weight='bold'>
                        Deriv.com
                    </Text>
                </div>
                <div className='passwords-static__icons'>
                    <Popover alignment='bottom' message='DTrader'>
                        <Icon icon='IcBrandDtrader' size={32} />
                    </Popover>
                    <Popover alignment='bottom' message='DBot'>
                        <Icon icon='IcBrandDbot' size={32} />
                    </Popover>
                    <Popover alignment='bottom' message='SmartTrader'>
                        <Icon icon='IcBrandSmarttrader' size={32} />
                    </Popover>
                    <Popover alignment='bottom' message='Deriv Go'>
                        {is_dark_mode_on ? <DerivGoDark /> : <DerivGoLight />}
                    </Popover>
                </div>
            </div>
        ) : (
            <div className='account__passwords-item-left'>
                <Text className='passwords-static__text' color='prominent' size='xs' weight='lighter'>
                    {is_dxtrade_allowed
                        ? localize('Use this to log in and trade with DMT5 and Deriv X.')
                        : localize('Use this to log in and trade with DMT5.')}
                </Text>
                {!is_mt5_password_not_set && (
                    <React.Fragment>
                        <Text className='passwords-static__text' color='prominent' size='xs' weight='lighter'>
                            {localize('Apps you have linked to this password:')}
                        </Text>
                        <div className='passwords-static__icons'>
                            <Popover alignment='bottom' message='DMT5'>
                                <Icon icon='IcBrandDmt5' size={32} />
                            </Popover>
                            {is_dxtrade_allowed && (
                                <Popover alignment='bottom' message='Deriv X'>
                                    <Icon icon='IcBrandDxtrade' size={32} />
                                </Popover>
                            )}
                        </div>
                    </React.Fragment>
                )}
            </div>
        )}
    </React.Fragment>
);

PasswordsStatic.PropTypes = {
    is_dark_mode_on: PropTypes.bool,
    is_deriv_password: PropTypes.bool,
    is_mt5_password_not_set: PropTypes.bool,
    is_dxtrade_allowed: PropTypes.bool,
};

export default connect(({ ui, client }) => ({
    is_dark_mode_on: ui.is_dark_mode_on,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
}))(PasswordsStatic);
