import * as React from 'react';
import classNames from 'classnames';
import { Icon, Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
// import TotalBalanceDropdown from './total-balance-dropdown';

const TotalBalance: React.FC<TTotalBalanceProps> = ({ amount, currency }) => {
    const [is_dropdown_visible, setIsDropdownVisible] = React.useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!is_dropdown_visible);
    };

    return (
        <div className='dw-total-balance'>
            <div className='dw-total-balance__wrapper'>
                <Text color='prominent' size='s' weight='bold'>
                    <Localize i18n_default_text='Total balance' />
                </Text>
                <div className='dw-total-balance__row'>
                    <Text size='l' weight='bold'>
                        <Money
                            amount={amount}
                            className='dw-total-balance__row-amount'
                            currency={currency}
                            show_currency
                        />
                    </Text>
                    {/* <Icon
                        icon='IcChevronDownBold'
                        className={classNames('dw-total-balance__arrow', {
                            'dw-total-balance__arrow--show': is_dropdown_visible,
                            'dw-total-balance__arrow--hide': !is_dropdown_visible,
                        })}
                        onClick={toggleDropdown}
                    /> */}
                </div>
            </div>
            {/* <TotalBalanceDropdown is_visible={is_dropdown_visible} /> */}
        </div>
    );
};

interface TTotalBalanceProps {
    amount: number;
    currency: string;
}

export default TotalBalance;
