import React from 'react';
import { FormatUtils } from '@deriv-com/utils';
import { TransferConfirmScreen } from '../../../../components';
import type { TActiveAccount, TPaymentAgentTransfer } from '../../types';

type TProps = {
    activeAccount?: TActiveAccount;
    isTransferRequestSubmitting: boolean;
    requestPaymentAgentTransfer: TPaymentAgentTransfer['requestPaymentAgentTransfer'];
    setIsTryTransferSuccessful: TPaymentAgentTransfer['setIsTryTransferSuccessful'];
    transferConfirm: TPaymentAgentTransfer['transferConfirm'];
};

const PaymentAgentTransferConfirm: React.FC<TProps> = ({
    activeAccount,
    isTransferRequestSubmitting,
    requestPaymentAgentTransfer,
    setIsTryTransferSuccessful,
    transferConfirm,
}) => {
    const { amount, clientID, clientName, currency, description } = transferConfirm;
    const confirmData = [
        { itemKey: 'transfer_from', label: 'From account number', value: activeAccount?.loginid ?? '' },
        {
            itemKey: 'transfer_to',
            label: ['To account number', 'Account holder name'],
            value: [clientID.toUpperCase(), clientName],
        },
        {
            itemKey: 'amount',
            label: 'Amount',
            value: `${FormatUtils.formatMoney(Number(amount), { currency })} ${currency}`,
        },
        { itemKey: 'description', label: 'Description', value: description },
    ];

    const onConfirmHandler = () =>
        requestPaymentAgentTransfer({
            amount: Number(amount),
            description,
            transfer_to: clientID,
        });

    return (
        <TransferConfirmScreen
            checkboxLabel='I confirm that I have verified the client’s transfer information.'
            data={confirmData}
            isSubmitting={isTransferRequestSubmitting}
            onClickBack={() => setIsTryTransferSuccessful(false)}
            onClickConfirm={onConfirmHandler}
            title='Check transfer information'
        />
    );
};

export default PaymentAgentTransferConfirm;
