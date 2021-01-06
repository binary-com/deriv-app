import * as React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { ButtonToggle } from '@deriv/components';

type TAccountsButtonToggleProps = {
    onChangeAccount: (item: string) => void;
    className?: string;
};

const AccountsButtonToggle: React.FC<TAccountsButtonToggleProps> = ({ onChangeAccount, className }) => {
    const [selected, setSelected] = React.useState<string>('DEMO');
    const getAccountTypes = () => {
        return [
            {
                text: localize('Demo'),
                value: 'DEMO',
            },
            {
                text: localize('Real'),
                value: 'REAL',
            },
        ];
    };

    return (
        <div className='button-toggle__container'>
            <ButtonToggle
                buttons_arr={getAccountTypes()}
                className={classNames('button-toggle__items', className)}
                is_animated
                has_rounded_button
                name='account types'
                onChange={(item: React.ChangeEvent<HTMLInputElement>) => {
                    setSelected(() => {
                        onChangeAccount(item.target.value);
                        return item.target.value;
                    });
                }}
                value={selected}
            />
        </div>
    );
};

export default AccountsButtonToggle;
