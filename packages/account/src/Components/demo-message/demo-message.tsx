import React from 'react';
import { localize } from '@deriv/translations';
import IconWithMessage from '../icon-with-message';

type TDemoMessage = {
    has_button?: boolean;
};

const DemoMessage = ({ has_button }: TDemoMessage) => (
    <IconWithMessage
        icon='IcPoaLock'
        message={localize('This feature is not available for demo accounts.')}
        has_button={has_button}
    />
);

export default DemoMessage;
