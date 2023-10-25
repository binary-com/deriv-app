import React from 'react';
import { useActiveWalletAccount, useCreateOtherCFDAccount, useCtraderAccountsList } from '@deriv/api';
import { TradingAccountCard } from '../../../../../components';
import { ModalWrapper, WalletButton, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import CTrader from '../../../../../public/images/ctrader.svg';
import { Success } from '../../../screens';
import './AvailableCTraderAccountsList.scss';

const ctraderMapper = [
    {
        description: 'This account offers CFDs on a feature-rich trading platform.',
        icon: <CTrader />,
        title: 'Deriv cTrader',
    },
];

const AvailableCTraderAccountsList: React.FC = () => {
    const { hide, show } = useModal();
    const { isSuccess, mutate } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: cTraderAccounts } = useCtraderAccountsList();

    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                platform: 'ctrader',
            },
        });
    };

    const onClickHandler = () => {
        onSubmit();
        show(
            isSuccess && (
                <ModalWrapper>
                    <Success
                        description={`Transfer your virtual funds from your ${accountType} wallet to your ${ctraderMapper[0].title} ${accountType} account to practice trading.`}
                        displayBalance={cTraderAccounts?.find(account => account.login)?.display_balance}
                        marketType='all'
                        platform='cTrader'
                        renderButton={() => <WalletButton isFullWidth onClick={hide} size='lg' text='Continue' />}
                        title={`Your ${ctraderMapper[0].title} ${accountType} account is ready`}
                    />
                </ModalWrapper>
            )
        );
    };

    return (
        <div className='wallets-available-ctrader-accounts'>
            {ctraderMapper.map(account => (
                <TradingAccountCard
                    {...account}
                    key={`wallets-available-ctrader-accounts--${account.title}`}
                    leading={() => <div>{account.icon}</div>}
                    trailing={() => (
                        <WalletButton
                            color='primary-light'
                            onClick={() => {
                                onClickHandler();
                            }}
                            text='Get'
                        />
                    )}
                >
                    <div className='wallets-available-ctrader-accounts__details'>
                        <WalletText size='sm' weight='bold'>
                            {account.title}
                        </WalletText>
                        <WalletText size='xs'>{account.description}</WalletText>
                    </div>
                </TradingAccountCard>
            ))}
        </div>
    );
};

export default AvailableCTraderAccountsList;
