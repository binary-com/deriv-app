import * as React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { response } from 'Components/my-apps/constants';
import AccountsButtonToggle from 'Components/template/accounts-toggle-button';
import TotalBalance from 'Components/total-balance';
import Real from 'Components/my-apps/real';
import Demo from 'Components/my-apps/demo';

const MyApps: React.FC<TMyAppsProps> = ({}) => {
    const [account_type, setAccountType] = React.useState<string>('DEMO');

    return (
        <ThemedScrollbars className='dw-my-apps'>
            <div className='dw-my-apps__header'>
                <AccountsButtonToggle onChangeAccount={account_type => setAccountType(account_type)} />
                <TotalBalance amount={response.authorize.balance} currency={response.authorize.currency} />
            </div>
            <div className='dw-my-apps__content'>{account_type === 'REAL' ? <Real /> : <Demo />}</div>
        </ThemedScrollbars>
    );
};

type TMyAppsProps = {};

export default MyApps;
