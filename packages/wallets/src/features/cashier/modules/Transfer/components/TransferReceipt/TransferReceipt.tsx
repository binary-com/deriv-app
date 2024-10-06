import React from 'react';
import classNames from 'classnames';
import { LegacyArrowLeft2pxIcon, LegacyArrowRight2pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { AppCard, WalletCard, WalletMoney } from '../../../../../../components';
import useIsRtl from '../../../../../../hooks/useIsRtl';
import { TPlatforms } from '../../../../../../types';
import { useTransfer } from '../../provider';
import './TransferReceipt.scss';

type TReceiptCardProps = {
    account: NonNullable<ReturnType<typeof useTransfer>['receipt']>['fromAccount'];
    activeWallet: ReturnType<typeof useTransfer>['activeWallet'];
    balance: JSX.Element | string;
};

const ReceiptCard: React.FC<TReceiptCardProps> = ({ account, activeWallet, balance }) => {
    const { isDesktop } = useDevice();
    const isTradingApp = account?.account_category === 'trading';
    const isWallet = account?.account_category === 'wallet';

    if (isTradingApp)
        return (
            <AppCard
                activeWalletCurrency={activeWallet?.currency}
                appName={account?.accountName}
                balance={balance}
                cardSize='md'
                device={isDesktop ? 'desktop' : 'mobile'}
                isDemoWallet={Boolean(activeWallet?.demo_account)}
                marketType={account?.market_type}
                platform={account?.account_type as TPlatforms.All}
                product={account?.product}
                walletName={activeWallet?.accountName}
            />
        );

    if (isWallet)
        return (
            <WalletCard
                balance={balance}
                currency={account.currency ?? ''}
                iconSize='md'
                isDemo={Boolean(account?.demo_account)}
            />
        );

    return null;
};

const TransferReceipt = () => {
    const { activeWallet, receipt, resetTransfer } = useTransfer();
    const { isDesktop } = useDevice();
    const isRtl = useIsRtl();

    if (!receipt) return null;

    const { feeAmount, fromAccount, fromAmount, toAccount, toAmount } = receipt;

    const isSameCurrency = fromAccount?.currency === toAccount?.currency;

    const feeMessage = feeAmount ? (
        <Localize
            i18n_default_text='Transfer fees: {{feeAmount}} {{displayCode}}'
            values={{
                displayCode: fromAccount?.currencyConfig?.display_code,
                feeAmount,
            }}
        />
    ) : (
        ''
    );

    return (
        <div className='wallets-transfer-receipt'>
            <div className='wallets-transfer-receipt__cards'>
                <ReceiptCard
                    account={fromAccount}
                    activeWallet={activeWallet}
                    balance={<WalletMoney amount={-fromAmount} currency={fromAccount?.currency} hasSign />}
                />
                <div className='wallets-transfer-receipt__arrow-icon'>
                    {isRtl ? <LegacyArrowLeft2pxIcon iconSize='xs' /> : <LegacyArrowRight2pxIcon iconSize='xs' />}
                </div>
                <ReceiptCard
                    account={toAccount}
                    activeWallet={activeWallet}
                    balance={<WalletMoney amount={toAmount} currency={toAccount?.currency} hasSign />}
                />
            </div>
            <div
                className={classNames('wallets-transfer-receipt__info', {
                    'wallets-transfer-receipt__info--with-fee': Boolean(receipt?.feeAmount),
                })}
            >
                <div className='wallets-transfer-receipt__amount'>
                    {isSameCurrency && (
                        <Text size='xl' weight='bold'>
                            <WalletMoney amount={fromAmount} currency={fromAccount?.currency} />
                        </Text>
                    )}
                    {!isSameCurrency && (
                        <div className='wallets-transfer-receipt__amount-conversion'>
                            <Text as='div' size='xl' weight='bold'>
                                <WalletMoney amount={fromAmount} currency={fromAccount?.currency} />
                                {'\u00A0'}
                            </Text>
                            <Text as='div' size='xl' weight='bold'>
                                {'('}
                                <WalletMoney amount={toAmount} currency={toAccount?.currency} />
                                {')'}
                            </Text>
                        </div>
                    )}
                    {Boolean(feeMessage) && (
                        <Text color='less-prominent' size='md'>
                            {feeMessage}
                        </Text>
                    )}
                </div>
                <Text align='center' size='lg' weight='bold'>
                    <Localize i18n_default_text='Your transfer is successful!' />
                </Text>
            </div>
            <div className='wallets-transfer-receipt__button'>
                <Button
                    borderWidth='sm'
                    onClick={() => resetTransfer()}
                    size={isDesktop ? 'lg' : 'md'}
                    textSize={isDesktop ? 'sm' : 'md'}
                >
                    <Localize i18n_default_text='Make a new transfer' />
                </Button>
            </div>
        </div>
    );
};

export default TransferReceipt;
