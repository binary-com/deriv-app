import React from 'react';
import { Localize, localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { THooks } from '../../types';

type TProps = {
    currency: Exclude<THooks.AllWalletAccounts['currency'], undefined>;
};

const getWalletDescriptionMapper = () => ({
    AUD: localize('Deposit and withdraw Australian dollars using credit or debit cards, e-wallets, or bank wires.'),
    BTC: localize(
        'Deposit and withdraw Bitcoin, the world’s most popular cryptocurrency, hosted on the Bitcoin blockchain.'
    ),
    ETH: localize('Deposit and withdraw Ether, the fastest growing cryptocurrency, hosted on the Ethereum blockchain.'),
    EUR: localize(
        'Deposit and withdraw euros into your accounts regulated by MFSA using credit or debit cards and e-wallets.'
    ),
    eUSDT: localize('Deposit and withdraw Tether ERC20, a version of Tether hosted on the Ethereum blockchain.'),
    LTC: localize(
        'Deposit and withdraw Litecoin, the cryptocurrency with low transaction fees, hosted on the Litecoin blockchain.'
    ),
    PaymentAgent: localize('Deposit and withdraw funds via authorised, independent payment agents.'),
    tUSDT: localize('Deposit and withdraw Tether TRC20, a version of Tether hosted on the TRON blockchain.'),
    USD: localize('Deposit and withdraw US dollars using credit or debit cards, e-wallets, or bank wires.'),
    USDC: localize('Deposit and withdraw USD Coin, hosted on the Ethereum blockchain.'),
    UST: localize('Deposit and withdraw Tether Omni, hosted on the Bitcoin blockchain.'),
    XRP: localize(
        'Deposit and withdraw XRP, the cryptocurrency with fast and affordable transactions, hosted on the XRP Ledger blockchain.'
    ),
});

const WalletsAddMoreCardContent: React.FC<TProps> = ({ currency }) => {
    const walletDescriptionMapper = getWalletDescriptionMapper();
    return (
        <div className='wallets-add-more__content'>
            <Text align='start' size='md' weight='bold'>
                <Localize i18n_default_text='{{currency}} Wallet' values={{ currency }} />
            </Text>

            <Text align='start' size='sm'>
                {walletDescriptionMapper[currency as keyof typeof walletDescriptionMapper]}
            </Text>
        </div>
    );
};

export default WalletsAddMoreCardContent;
