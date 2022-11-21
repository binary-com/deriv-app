import React from 'react';
import classNames from 'classnames';
import { PropTypes } from 'prop-types';
import { Icon } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { PoiButton } from 'Components/poi/poi-button/poi-button';
import IconMessageContent from 'Components/icon-message-content';
import { ContinueTradingButton } from 'Components/poa/continue-trading-button/continue-trading-button.jsx';

export const Verified = ({ needs_poi, is_description_enabled = true }) => {
    const { is_appstore } = React.useContext(PlatformContext);

    const message = localize('Your proof of address is verified');
    if (needs_poi) {
        return (
            <div
                className={classNames('account-management__container', {
                    'account-management__container-dashboard': is_appstore,
                })}
            >
                <IconMessageContent
                    message={message}
                    text={localize('To continue trading, you must also submit a proof of identity.')}
                    icon={<Icon icon='IcPoaVerified' size={128} />}
                    className={is_appstore && 'account-management-dashboard'}
                >
                    <PoiButton />
                </IconMessageContent>
            </div>
        );
    }
    return (
        <div
            className={classNames('account-management__container', {
                'account-management__container-dashboard': is_appstore,
            })}
        >
            <IconMessageContent
                message={message}
                icon={
                    <Icon icon='IcPoaVerified' size={128} className={is_appstore && 'account-management-dashboard'} />
                }
            >
                {!is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        </div>
    );
};

Verified.propTypes = {
    needs_poi: PropTypes.bool,
    is_description_disabled: PropTypes.bool,
    is_description_enabled: PropTypes.bool,
};

export default Verified;
