import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { ButtonLink, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const GoToPersonalDetailsButton = ({ anchor, from, text }) => (
    <ButtonLink to={`/account/personal-details${from ? `?from=${from}` : ''}${anchor ? `#${anchor}` : ''}`}>
        <Text className='dc-btn__text' weight='bold' as='p'>
            {text || localize('Go to personal details')}
        </Text>
    </ButtonLink>
);

export const MissingPersonalDetails = ({ has_invalid_postal_code, from }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    if (has_invalid_postal_code)
        return (
            <IconMessageContent
                message={localize('Your postal code is invalid')}
                text={localize('Please check and update your postal code before submitting proof of identity.')}
                icon={<Icon icon='IcAccountMissingDetails' size={128} />}
            >
                <GoToPersonalDetailsButton
                    anchor='address_postcode'
                    from={from}
                    text={localize('Update postal code')}
                />
            </IconMessageContent>
        );
    return (
        <IconMessageContent
            message={localize('Your personal details are missing')}
            text={localize('Please complete your personal details before you verify your identity.')}
            icon={
                <Icon icon={is_dashboard ? 'IcAccountMissingDetailsDashboard' : 'IcAccountMissingDetails'} size={128} />
            }
        >
            <GoToPersonalDetailsButton from={from} />
        </IconMessageContent>
    );
};
