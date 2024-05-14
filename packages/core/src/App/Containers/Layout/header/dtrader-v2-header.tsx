import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import AccountInfoIcon from 'App/Components/Layout/Header/account-info-icon';
import { Text } from '@deriv-com/quill-ui';

const DTraderV2Header = observer(() => {
    const { client } = useStore();
    const { balance, currency, is_virtual, loginid } = client;

    const currency_lower = currency?.toLowerCase();

    return (
        <header className='header header-v2'>
            <React.Suspense fallback={<div />}>
                <div className='header-v2__acc-info'>
                    <div className='header-v2__acc-info--top'>
                        <span className='header-v2__acc-info--logo'>
                            {(is_virtual || currency) && (
                                <AccountInfoIcon is_virtual={is_virtual} currency={currency_lower} />
                            )}
                        </span>
                        <Text size='sm'>{loginid}</Text>
                    </div>
                    <div className='header-v2__acc-info--bottom'>
                        <Text size='sm' bold>{`${balance} ${getCurrencyDisplayCode(currency)}`}</Text>
                    </div>
                </div>
            </React.Suspense>
        </header>
    );
});

export default DTraderV2Header;
