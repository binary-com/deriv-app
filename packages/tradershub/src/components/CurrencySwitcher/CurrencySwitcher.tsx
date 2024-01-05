import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveTradingAccount, useResetVirtualBalance } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, qtMerge, Text } from '@deriv/quill-design';
import { StandaloneChevronDownBoldIcon } from '@deriv/quill-icons';
import { IconToCurrencyMapper } from '../../constants/constants';
import { THooks } from '../../types';
import { ModalStepWrapper } from '../ModalStepWrapper';
import { TradingAccountsList } from '../TradingAccountsList';

type AccountActionButtonProps = {
    balance: THooks.ActiveTradingAccount['balance'];
    isDemo: THooks.ActiveTradingAccount['is_virtual'];
};

const AccountActionButton = ({ balance, isDemo }: AccountActionButtonProps) => {
    const history = useHistory();
    const { mutate: resetVirtualBalance } = useResetVirtualBalance();
    let buttonText = 'Deposit';
    if (isDemo && balance !== 10000) {
        buttonText = 'Reset Balance';
    } else if (isDemo) {
        return null;
    }

    return (
        <Button
            className='flex items-center justify-center border-solid h-1600 py-300 px-800 rounded-200 border-sm border-system-light-less-prominent-text'
            colorStyle='black'
            onClick={() => {
                if (isDemo) {
                    resetVirtualBalance();
                } else {
                    history.push('/cashier/deposit');
                }
            }}
            variant='secondary'
        >
            {buttonText}
        </Button>
    );
};

const Loader = () => (
    <div className='flex items-center justify-between border-solid gap-800 h-3600 p-800 rounded-400 border-sm border-system-light-active-background shrink-0'>
        <div className='flex rounded-full animate-pulse bg-solid-slate-100 w-2000 h-2000 rounded-1500' />
        <div className='flex flex-col justify-center gap-500'>
            <div className='flex animate-pulse bg-solid-slate-100 w-2500 h-500 rounded-200' />
            <div className='flex animate-pulse bg-solid-slate-100 w-5000 h-500 rounded-200' />
        </div>
    </div>
);

const CurrencySwitcher = () => {
    const { data: activeAccount, isSuccess } = useActiveTradingAccount();
    const isDemo = activeAccount?.is_virtual;
    const { show } = Provider.useModal();

    const iconCurrency = isDemo ? 'virtual' : activeAccount?.currency ?? 'virtual';

    const renderButton = () => {
        return (
            <Button
                className='py-900 rounded-200 border-sm border-system-light-less-prominent-text'
                colorStyle='black'
                fullWidth
                variant='secondary'
            >
                Add or manage account
            </Button>
        );
    };

    if (!isSuccess) return <Loader />;

    return (
        <div className='flex items-center justify-between border-solid gap-800 h-3600 p-800 rounded-400 border-sm border-system-light-active-background shrink-0'>
            {IconToCurrencyMapper[iconCurrency].icon}
            <div className='flex items-center justify-between grow gap-800'>
                <div className='flex flex-col justify-center'>
                    <Text bold={!isDemo} className={qtMerge('flex', !isDemo && 'text-status-light-success')} size='sm'>
                        {isDemo ? 'Demo' : activeAccount?.display_balance}
                    </Text>
                    <Text
                        bold={isDemo}
                        className={qtMerge(
                            'flex',
                            isDemo ? 'text-status-light-information' : 'text-system-light-less-prominent-text'
                        )}
                        size='sm'
                    >
                        {isDemo ? activeAccount.display_balance : IconToCurrencyMapper[iconCurrency].text}
                    </Text>
                </div>
                <AccountActionButton balance={activeAccount?.balance ?? 0} isDemo={isDemo ?? false} />
                <div className='cursor-pointer'>
                    {!isDemo && (
                        <StandaloneChevronDownBoldIcon
                            onClick={() => {
                                show(
                                    <ModalStepWrapper renderFooter={renderButton} title='Select account'>
                                        <TradingAccountsList />
                                    </ModalStepWrapper>
                                );
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CurrencySwitcher;
