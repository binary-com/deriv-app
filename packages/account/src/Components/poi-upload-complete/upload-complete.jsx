import React from 'react';
import { PropTypes } from 'prop-types';
import { Icon, Text } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import PoaButton from 'Components/poa-button';
import IconMessageContent from 'Components/icon-message-content';

export const UploadComplete = ({ needs_poa, redirect_button, is_from_external }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const message = localize('Your proof of identity was submitted successfully');
    if (!needs_poa) {
        return (
            <IconMessageContent
                message={message}
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={
                    is_dashboard ? (
                        <Icon icon='IcPoiVerifiedDashboard' width={273} height={128} />
                    ) : (
                        <Icon icon='IcPoiVerified' size={128} />
                    )
                }
                className={is_dashboard && 'account-management-dashboard'}
            >
                {!is_from_external && redirect_button}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={
                is_dashboard ? (
                    <Icon icon='IcPoiVerifiedDashboard' width={273} height={128} />
                ) : (
                    <Icon icon='IcPoiVerified' size={128} />
                )
            }
            className={is_dashboard && 'account-management-dashboard'}
        >
            <React.Fragment>
                <div className='account-management__text-container'>
                    <Text align='center' size='xs' as={is_dashboard ? 'span' : 'p'}>
                        {localize('Your document is being reviewed, please check back in 1-3 days.')}
                    </Text>
                    <Text align='center' size='xs' as={is_dashboard ? 'span' : 'p'}>
                        {localize('You must also submit a proof of address.')}
                    </Text>
                </div>
                <PoaButton />
            </React.Fragment>
            {!is_from_external && redirect_button}
        </IconMessageContent>
    );
};

UploadComplete.protoTypes = {
    is_description_enabled: PropTypes.bool,
    has_poa: PropTypes.bool,
    redirect_button: PropTypes.object,
};

export default UploadComplete;
