import React from 'react';
import Icon from '../icon';
import Text from '../text';
import { WalletTile } from '../wallet-tile';
import type { TTransferAccount } from './transfer-account-selector';

type TTransferTile = {
    is_mobile?: boolean;
    label?: string;
    selected_account?: TTransferAccount;
    placeholder?: string;
};

const ChevronIcon = () => {
    return (
        <div className='transfer-account-selector__chevron-icon'>
            <Icon icon='IcChevronDown' />
        </div>
    );
};

const TransferTile = React.memo(({ is_mobile, label, placeholder, selected_account }: TTransferTile) => {
    return (
        <React.Fragment>
            <div className='transfer-account-selector__content'>
                <div className='transfer-account-selector__heading-with-chevron'>
                    <div className='transfer-account-selector__heading'>
                        <Text size={is_mobile ? 'xxs' : 'xs'}>{label}</Text>
                    </div>

                    {is_mobile && <ChevronIcon />}
                </div>

                {selected_account ? (
                    <WalletTile
                        account={selected_account}
                        className='transfer-account-selector__value'
                        is_mobile={is_mobile}
                        is_value
                    />
                ) : (
                    <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                        {placeholder}
                    </Text>
                )}
            </div>

            {!is_mobile && (
                <React.Fragment>
                    {selected_account?.jurisdiction}
                    <ChevronIcon />
                </React.Fragment>
            )}
        </React.Fragment>
    );
});

TransferTile.displayName = 'TransferTile';

export default TransferTile;
