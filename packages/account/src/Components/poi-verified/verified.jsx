import React from 'react';
import { PropTypes } from 'prop-types';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import ContinueTradingButton from 'Components/poa-continue-trading-button';
import PoaButton from 'Components/poa-button';
import IconMessageContent from 'Components/icon-message-content';

const Verified = ({ has_poa, is_dashboard, is_description_enabled, redirect_button }) => {
    const message = localize('Your proof of identity is verified');
    if (has_poa) {
        return (
            <IconMessageContent
                message={message}
                icon={
                    is_dashboard ? (
                        <Icon icon='IcPoaVerifiedDashboard' height={128} width={237} />
                    ) : (
                        <Icon icon='IcPoaVerified' size={128} />
                    )
                }
                className='account-management-dashboard'
            >
                {is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={
                is_dashboard ? (
                    <Icon icon='IcPoaVerifiedDashboard' height={128} width={237} />
                ) : (
                    <Icon icon='IcPoaVerified' size={128} />
                )
            }
            className='account-management-dashboard'
            text={localize('To continue trading, you must also submit a proof of address.')}
        >
            {is_description_enabled && <PoaButton />}
            {redirect_button}
        </IconMessageContent>
    );
};

Verified.propTypes = {
    has_poa: PropTypes.bool,
    is_dashboard: PropTypes.bool,
    is_description_enabled: PropTypes.bool,
    redirect_button: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default Verified;
