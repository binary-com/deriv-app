import React from 'react';
import { Icon, Text, Button } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';

type TIconWithMessage = {
    icon: string;
    has_button?: boolean;
    message: string;
};

const IconWithMessage = observer(({ has_button, icon, message }: TIconWithMessage) => {
    const { client, ui } = useStore();
    const { isDesktop } = useDevice();
    const { has_any_real_account: has_real_account } = client;
    const { toggleAccountsDialog, toggleShouldShowRealAccountsList } = ui;

    return (
        <div className='da-icon-with-message'>
            <Icon icon={icon} size={128} />
            <Text
                className='da-icon-with-message__text'
                as='p'
                color='general'
                size={isDesktop ? 's' : 'xs'}
                line_height='m'
                weight='bold'
            >
                {message}
            </Text>
            {has_button && (
                <Button
                    primary
                    onClick={() => {
                        toggleShouldShowRealAccountsList(true);
                        toggleAccountsDialog();
                    }}
                    className='account__demo-message-button'
                    data-testid='icon-with-message-button'
                >
                    {has_real_account ? localize('Switch to real account') : localize('Add a real account')}
                </Button>
            )}
        </div>
    );
});

export default IconWithMessage;
