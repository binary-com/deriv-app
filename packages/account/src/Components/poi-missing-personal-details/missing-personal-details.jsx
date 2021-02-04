import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { ButtonLink, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const GoToPersonalDetailsButton = () => (
    <ButtonLink to='/account/personal-details'>
        <Text className='dc-btn__text' weight='bold' as='p'>
            {localize('Go to personal details')}
        </Text>
    </ButtonLink>
);

export const MissingPersonalDetails = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    return (
        <IconMessageContent
            message={localize('Your personal details are missing')}
            text={localize('Please complete your personal details before you verify your identity.')}
            icon={
                <Icon icon={is_dashboard ? 'IcAccountMissingDetailsDashboard' : 'IcAccountMissingDetails'} size={128} />
            }
        >
            <GoToPersonalDetailsButton />
        </IconMessageContent>
    );
};
