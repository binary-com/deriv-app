import { Icon, Text } from '@deriv/components';
import './wallet-account.scss';

type TWalletAccount = {
    balance: number;
    currency: string;
    name: string;
    icon: string;
};

const WalletAccount = ({ balance, name, currency, icon }: TWalletAccount) => (
    <div className='wallet-account'>
        <Icon className='wallet-account__icon' icon={icon} size={24} />
        <div className='wallet-account__details'>
            <Text as='div' color='prominent' size='xxs'>
                {name}
            </Text>
            <Text as='div' color='prominent' size='xxxs' weight='bold'>
                {balance} {currency}
            </Text>
        </div>
    </div>
);

export default WalletAccount;
