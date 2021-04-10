import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const GetWallet: React.FC<TGetWalletProps> = ({ onClickGetWallet, label }) => {
    return (
        <div className='dw-get-wallet'>
            <div className='dw-get-wallet__column'>
                <Button className='dw-get-wallet__button' onClick={onClickGetWallet}>
                    <Icon icon='IcAddRounded' custom_color='var(--icon-dark-background)' size={24} />
                </Button>
                <Text color='prominent' size='xs' weight='bold'>
                    <Localize i18n_default_text={label} />
                </Text>
            </div>
        </div>
    );
};

type TGetWalletProps = {
    onClickGetWallet: React.MouseEventHandler<HTMLButtonElement>;
    label: String;
};

export default GetWallet;
