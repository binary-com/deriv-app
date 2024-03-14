import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { TTransferFormikContext } from 'src/lib/Transfer/types';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { Text } from '@deriv-com/ui';
import { PercentageSelector } from '../../../../../../components';
import styles from './TransferPercentageSelector.module.scss';

const TransferPercentageSelector = () => {
    const { setValues, values } = useFormikContext<TTransferFormikContext>();
    const [percentage, setPercentage] = useState<number>(0);

    const getAmount = () => {
        const amount = parseFloat(values.fromAmount);

        if (!values.fromAmount || Number.isNaN(amount)) return 0;

        return amount;
    };

    useEffect(() => {
        if (values.fromAccount && values.fromAccount.balance)
            setPercentage(Math.floor((getAmount() * 100) / values.fromAccount.balance));
    }, [values.fromAmount]);

    return (
        <div className={styles.container}>
            <PercentageSelector
                amount={getAmount()}
                balance={values.fromAccount ? values.fromAccount.balance : 0}
                onChangePercentage={per => {
                    if (values.fromAccount && values.fromAccount?.balance)
                        setValues(currentValues => ({
                            ...currentValues,
                            fromAmount: ((values.fromAccount.balance * per) / 100).toFixed(
                                values.fromAccount.currencyConfig.fractional_digits
                            ),
                        }));
                    setPercentage(per);
                }}
            />

            <Text align='center' color='less-prominent' size='xs'>
                {`${percentage}% of available balance (
                    ${
                        values.fromAccount && values.fromAccount.balance
                            ? displayMoney(values.fromAccount.balance, values.fromAccount.currency, {
                                  fractional_digits: values.fromAccount.currencyConfig
                                      ? values.fromAccount.currencyConfig.fractional_digits
                                      : 2,
                              })
                            : ''
                    }
                    )`}
            </Text>
        </div>
    );
};

export default TransferPercentageSelector;
