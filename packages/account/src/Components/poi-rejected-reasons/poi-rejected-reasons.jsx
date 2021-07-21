import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageList from 'Components/icon-message-list';

export const POIRejectedReasons = ({ handleRequireSubmission, rejected_reasons }) => (
    <IconMessageList
        message={localize('Your proof of identity submission failed because:')}
        icon={<Icon icon='IcPoiFailed' size={128} />}
        message_list={rejected_reasons}
        onContinue={handleRequireSubmission}
    />
);
