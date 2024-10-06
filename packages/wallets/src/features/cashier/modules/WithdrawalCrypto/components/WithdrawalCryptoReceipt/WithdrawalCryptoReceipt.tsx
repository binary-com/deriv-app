import React from 'react';
import { useHistory } from 'react-router-dom';
import { LegacyArrowDown2pxIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import { WalletCard, WalletMoney } from '../../../../../../components';
import { TWithdrawalReceipt } from '../../types';
import { WithdrawalCryptoDestinationAddress } from './components';
import './WithdrawalCryptoReceipt.scss';

type TProps = {
    onClose: () => void;
    withdrawalReceipt: TWithdrawalReceipt;
};

const WithdrawalCryptoReceipt: React.FC<TProps> = ({ onClose, withdrawalReceipt }) => {
    const history = useHistory();
    const { address, amount = 0, amountReceived, currency, transactionFee } = withdrawalReceipt;

    return (
        <div className='wallets-withdrawal-crypto-receipt'>
            <div className='wallets-withdrawal-crypto-receipt__accounts-info'>
                <WalletCard
                    balance={<WalletMoney amount={-amount} currency={currency} hasSign />}
                    currency={currency ?? ''}
                    iconSize='md'
                />
                <LegacyArrowDown2pxIcon iconSize='xs' />
                <WithdrawalCryptoDestinationAddress address={address} />
            </div>
            <div className='wallets-withdrawal-crypto-receipt__withdrawal-info'>
                <div className='wallets-withdrawal-crypto-receipt__amount-received-info'>
                    <Text align='center' as='p' size='sm'>
                        <Localize i18n_default_text='Amount received' />
                    </Text>
                    <Text align='center' size='xl' weight='bold'>
                        {transactionFee ? amountReceived : amount} {currency}
                    </Text>
                    {transactionFee && (
                        <Text align='center' as='p' size='sm'>
                            <Localize
                                i18n_default_text='(Transaction fee: {{transactionFee}} {{currency}})'
                                values={{ currency, transactionFee }}
                            />
                        </Text>
                    )}
                </div>

                <Text align='center' as='p'>
                    <Localize i18n_default_text="Your withdrawal is currently in review. It will be processed within 24 hours. We'll send you an email once your transaction has been processed." />
                </Text>
            </div>
            <div className='wallets-withdrawal-crypto-receipt__actions'>
                <Button
                    color='black'
                    onClick={() => history.push('/wallet/transactions')}
                    size='lg'
                    textSize='md'
                    variant='outlined'
                >
                    <Localize i18n_default_text='View transactions' />
                </Button>
                <Button onClick={onClose} size='lg' textSize='md'>
                    <Localize i18n_default_text='Close' />
                </Button>
            </div>
        </div>
    );
};

export default WithdrawalCryptoReceipt;
