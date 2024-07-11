import React from 'react';
import { Icon } from '@deriv-lib/components';
import { localize } from '@deriv-lib/translations';
import { TPOIStatus } from 'Types';
import IconMessageContent from '../../../icon-message-content';
import PoaButton from '../../../poa/poa-button';

export const Verified = ({ needs_poa, redirect_button, is_from_external }: TPOIStatus) => {
    const message = localize('Your proof of identity is verified');

    if (!needs_poa) {
        return (
            <IconMessageContent
                message={message}
                icon={<Icon icon='IcPoaVerified' size={128} data_testid='dt_IcPoaVerified' />}
                className='account-management-dashboard'
            >
                {!is_from_external && redirect_button}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={<Icon icon='IcPoaVerified' size={128} />}
            className='account-management-dashboard'
            text={localize('To continue trading, you must also submit a proof of address.')}
        >
            {!is_from_external && (
                <React.Fragment>
                    <PoaButton />
                </React.Fragment>
            )}
        </IconMessageContent>
    );
};

export default Verified;
