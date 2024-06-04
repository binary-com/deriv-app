import clsx from 'clsx';
import { Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import './balance-text.scss';

// Todo: this definitely needs to be somewhere else
type Size = 'xxxxs' | 'xxxs' | 'xxs' | 'xs' | 's' | 'xsm' | 'sm' | 'm' | 'l' | 'xl' | 'xxl';

type BalanceTextProps = {
    balance: number;
    currency: string;
    size?: Size;
    underline_style?: 'dotted' | 'solid' | 'none';
};

const BalanceText = observer(({ balance, currency, size = 'm', underline_style = 'none' }: BalanceTextProps) => {
    const { traders_hub } = useStore();
    const { selected_account_type } = traders_hub;

    const getTextClassName = () => {
        if (selected_account_type === 'demo') {
            return 'balance-text__text--demo';
        }
        if (selected_account_type === 'real') {
            return 'balance-text__text--real';
        }
        return '';
    };

    return (
        <div
            className={clsx('balance-text__container', { 'balance-text--dotted': underline_style === 'dotted' })}
            data-testid='dt_balance_text_container'
        >
            <Text weight='bold' size={size} className={getTextClassName()}>
                {formatMoney(currency, balance, true)}
            </Text>
            <Text weight='bold' size={size} color='prominent' className={getTextClassName()}>
                {currency}
            </Text>
        </div>
    );
});

export default BalanceText;
