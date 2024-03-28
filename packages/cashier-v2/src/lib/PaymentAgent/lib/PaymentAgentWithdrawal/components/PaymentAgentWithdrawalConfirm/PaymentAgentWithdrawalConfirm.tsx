import React from 'react';
import { FormatUtils } from '@deriv-com/utils';
import { TransferConfirmScreen } from '../../../../../../components';
import { usePaymentAgentContext } from '../../../../provider';
import { usePaymentAgentWithdrawalContext } from '../../provider';

const PaymentAgentWithdrawalConfirm = () => {
    const { paymentAgentList } = usePaymentAgentContext();
    const {
        isWithdrawalRequestSubmitting,
        requestPaymentAgentWithdrawal,
        setIsTryWithdrawalSuccessful,
        withdrawalConfirm,
    } = usePaymentAgentWithdrawalContext();
    const { amount, clientID, currency, paymentAgentID, paymentAgentName } = withdrawalConfirm;
    const selectedPaymentAgent = paymentAgentList?.find(
        paymentAgent => paymentAgent.paymentagent_loginid === paymentAgentID
    );
    const confirmData = [
        { itemKey: 'transfer_from', label: 'From account number', value: clientID },
        {
            itemKey: 'transfer_to',
            label: ['To account number', 'Account holder name'],
            value: [paymentAgentID.toUpperCase(), paymentAgentName],
        },
        {
            itemKey: 'amount',
            label: 'Amount',
            value: `${FormatUtils.formatMoney(Number(amount), { currency })} ${currency}`,
        },
    ];

    const onConfirmHandler = () =>
        requestPaymentAgentWithdrawal({
            amount: Number(amount),
            paymentagent_loginid: paymentAgentID,
            paymentAgentEmail: selectedPaymentAgent?.email ?? '',
            paymentAgentPhoneNumbers: selectedPaymentAgent?.phone_numbers ?? [],
            paymentAgentUrls: selectedPaymentAgent?.urls ?? [],
        });

    return (
        <TransferConfirmScreen
            checkboxLabel='I confirm that I have verified the client’s transfer information.'
            data={confirmData}
            isSubmitting={isWithdrawalRequestSubmitting}
            onClickBack={() => setIsTryWithdrawalSuccessful(false)}
            onClickConfirm={onConfirmHandler}
            title='Check transfer information'
        />
    );
};

export default PaymentAgentWithdrawalConfirm;
