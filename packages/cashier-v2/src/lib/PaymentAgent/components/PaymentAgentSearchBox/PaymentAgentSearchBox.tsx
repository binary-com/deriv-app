import React from 'react';
import { SearchBox } from '../../../../components';
import { usePaymentAgentContext } from '../../provider';
import styles from './PaymentAgentSearchBox.module.scss';

const PaymentAgentSearchBox = () => {
    const { onChangeSearchTermHandler } = usePaymentAgentContext();

    return (
        <div className={styles.container}>
            <SearchBox onSearch={onChangeSearchTermHandler} />
        </div>
    );
};

export default PaymentAgentSearchBox;
