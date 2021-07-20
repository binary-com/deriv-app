import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const UnsupportedFailed = ({ error }) => (
    <IconMessageContent
        message={localize('Proof of identity documents upload failed')}
        text={error}
        icon={<Icon icon='IcPoiFailed' size={128} />}
        className='account-management-dashboard'
    />
);

UnsupportedFailed.propTypes = {
    error: PropTypes.string,
};

export default UnsupportedFailed;
