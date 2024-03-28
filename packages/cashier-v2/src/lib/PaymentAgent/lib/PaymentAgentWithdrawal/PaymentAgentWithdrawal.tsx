import React, { useCallback } from 'react';
import { Loader, Text } from '@deriv-com/ui';
import { clickAndKeyEventHandler } from '../../../../utils';
import { PaymentAgentList, PaymentAgentSearchContainer } from '../../components';
import { PaymentAgentProvider, usePaymentAgentContext } from '../../provider';
import {
    PaymentAgentUnlistedWithdrawalForm,
    PaymentAgentWithdrawalConfirm,
    PaymentAgentWithdrawalReceipt,
} from './components';
import { PaymentAgentWithdrawalProvider, usePaymentAgentWithdrawalContext } from './provider';
import type { TPaymentAgentWithdrawalModuleProps } from './types';
import styles from './PaymentAgentWithdrawal.module.scss';

const PaymentAgentWithdrawal = () => {
    const { isPaymentAgentListLoading } = usePaymentAgentContext();
    const { isTryWithdrawalSuccessful, isUnlistedWithdrawal, isWithdrawalSuccessful, setIsUnlistedWithdrawal } =
        usePaymentAgentWithdrawalContext();

    const showUnlistedWithdrawalForm = useCallback(
        (e?: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
            clickAndKeyEventHandler(() => setIsUnlistedWithdrawal(true), e);
        },
        [setIsUnlistedWithdrawal]
    );

    if (isPaymentAgentListLoading) return <Loader />;

    if (isTryWithdrawalSuccessful) return <PaymentAgentWithdrawalConfirm />;

    if (isWithdrawalSuccessful) return <PaymentAgentWithdrawalReceipt />;

    if (isUnlistedWithdrawal) return <PaymentAgentUnlistedWithdrawalForm />;

    return (
        <div className={styles.container}>
            <Text size='sm'>
                Choose your preferred payment agent and enter your withdrawal amount. If your payment agent is not
                listed,{' '}
                <Text className={styles['unlisted-withdrawal-link']} color='red' size='sm' weight='bold'>
                    <span onClick={showUnlistedWithdrawalForm} onKeyDown={showUnlistedWithdrawalForm}>
                        search for them using their account number
                    </span>
                </Text>
                .
            </Text>
            <PaymentAgentSearchContainer>
                <PaymentAgentList />
            </PaymentAgentSearchContainer>
        </div>
    );
};

const PaymentAgentWithdrawalModule: React.FC<TPaymentAgentWithdrawalModuleProps> = ({
    setVerificationCode,
    verificationCode,
}) => {
    return (
        <PaymentAgentProvider>
            <PaymentAgentWithdrawalProvider
                setVerificationCode={setVerificationCode}
                verificationCode={verificationCode}
            >
                <PaymentAgentWithdrawal />
            </PaymentAgentWithdrawalProvider>
        </PaymentAgentProvider>
    );
};

export default PaymentAgentWithdrawalModule;
