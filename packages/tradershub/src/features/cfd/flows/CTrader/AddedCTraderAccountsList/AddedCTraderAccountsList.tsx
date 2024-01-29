import React, { Fragment } from 'react';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components';
import { getStaticUrl } from '../../../../../helpers/urls';
import CTrader from '../../../../../public/images/cfd/ctrader.svg';
import { CFDPlatforms, PlatformDetails } from '../../../constants';
import { TopUpModal, TradeModal } from '../../../modals';

const AddedCTraderAccountsList = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { data: activeTrading } = useActiveTradingAccount();
    const { show } = Provider.useModal();
    const account = cTraderAccounts?.find(account => account.is_virtual === activeTrading?.is_virtual);
    const isVirtual = account?.is_virtual;

    const leading = () => (
        <div
            className='cursor-pointer'
            onClick={() => {
                window.open(getStaticUrl('/deriv-ctrader'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/deriv-ctrader'));
                }
            }}
        >
            <CTrader />
        </div>
    );

    const trailing = () => (
        <div className='flex flex-col gap-y-200'>
            <Button
                // todo: open transfer modal
                className='border-opacity-black-400 rounded-200 px-800'
                colorStyle='black'
                onClick={() => {
                    if (isVirtual) show(<TopUpModal account={account} platform={CFDPlatforms.CTRADER} />);
                    // else transferModal;
                }}
                variant='secondary'
            >
                {isVirtual ? 'Top up' : 'Transfer'}
            </Button>
            <Button
                className='rounded-200 px-800'
                onClick={() =>
                    account &&
                    show(
                        <TradeModal
                            account={account}
                            marketType={account?.market_type}
                            platform={CFDPlatforms.CTRADER}
                        />
                    )
                }
            >
                Open
            </Button>
        </div>
    );

    return (
        <div>
            <TradingAccountCard leading={leading} trailing={trailing}>
                <div className='flex flex-col flex-grow'>
                    {account && (
                        <Fragment key={`added-ctrader-${account.login}`}>
                            <Text size='sm'>{PlatformDetails.ctrader.title}</Text>
                            <Text bold size='sm'>
                                {account?.formatted_balance}
                            </Text>
                            <Text color='primary' size='sm'>
                                {account.login}
                            </Text>
                        </Fragment>
                    )}
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AddedCTraderAccountsList;
