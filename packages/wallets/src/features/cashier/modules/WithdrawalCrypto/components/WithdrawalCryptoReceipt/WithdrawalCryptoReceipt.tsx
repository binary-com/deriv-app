import React from 'react';
import { useHistory } from 'react-router-dom';
import { LegacyArrowDown2pxIcon } from '@deriv/quill-icons';
import { WalletButton, WalletCard, WalletText } from '../../../../../../components';
import { LandingCompanyDetails } from '../../../../constants';
import { TWithdrawalReceipt } from '../../types';
import { WithdrawalCryptoDestinationAddress } from './components';
import './WithdrawalCryptoReceipt.scss';

type TProps = {
    onClose: () => void;
    withdrawalReceipt: TWithdrawalReceipt;
};

const WithdrawalCryptoReceipt: React.FC<TProps> = ({ onClose, withdrawalReceipt }) => {
    const history = useHistory();
    const { address, amount, currency } = withdrawalReceipt;

    return (
        <div className='wallets-withdrawal-crypto-receipt'>
            <div className='wallets-withdrawal-crypto-receipt__accounts-info'>
                <WalletCard
                    balance={`-${amount} ${currency}`}
                    currency={currency ?? ''}
                    iconSize='md'
                    landingCompanyName={LandingCompanyDetails.svg.shortcode}
                />
                <LegacyArrowDown2pxIcon iconSize='xs' />
                <WithdrawalCryptoDestinationAddress address={address} />
            </div>
            <div className='wallets-withdrawal-crypto-receipt__withdrawal-info'>
                <WalletText align='center' size='xl' weight='bold'>
                    {amount} {currency}
                </WalletText>
                <WalletText align='center' as='p'>
                    Your withdrawal is currently in review. It will be processed within 24 hours. We&rsquo;ll send you
                    an email once your transaction has been processed.
                </WalletText>
            </div>
            <div className='wallets-withdrawal-crypto-receipt__actions'>
                <WalletButton
                    color='white'
                    onClick={() => history.push('/wallets/cashier/transactions')}
                    size='lg'
                    variant='outlined'
                >
                    View transactions
                </WalletButton>
                <WalletButton onClick={onClose} size='lg'>
                    Close
                </WalletButton>
            </div>
        </div>
    );
};

export default WithdrawalCryptoReceipt;
