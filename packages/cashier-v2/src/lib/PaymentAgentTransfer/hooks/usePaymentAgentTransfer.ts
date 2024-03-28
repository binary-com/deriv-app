import { useState } from 'react';
import { useActiveAccount } from '@deriv/api-v2';
import type { TCurrency } from '../../../types';
import type { TConfirm, TReceipt } from '../types';
import { getPaymentAgentTransferValidationSchema } from '../utils';
import { usePaymentAgentDetails } from './usePaymentAgentDetails';
import { usePaymentAgentTransferRequest } from './usePaymentAgentTransferRequest';

export const usePaymentAgentTransfer = () => {
    const { data: paymentAgentDetails, isLoading: isPaymentAgentDetailsLoading } = usePaymentAgentDetails();
    const { data: activeAccount, isLoading: isActiveAccountLoading } = useActiveAccount();
    const { isLoading: isTransferRequestSubmitting, mutateAsync } = usePaymentAgentTransferRequest();
    const [isTryTransferSuccessful, setIsTryTransferSuccessful] = useState(false);
    const [isTransferSuccessful, setIsTransferSuccessful] = useState(false);
    const isLoading = isPaymentAgentDetailsLoading || isActiveAccountLoading;
    const currency = activeAccount?.currency as TCurrency;

    const initialTransferConfirmValues: TConfirm = {
        amount: '',
        clientID: '',
        clientName: '',
        currency,
        description: '',
    };
    const initialReceiptValues: TReceipt = {
        amount: '',
        clientID: '',
        clientName: '',
        currency,
    };
    const [transferConfirm, setTransferConfirm] = useState(initialTransferConfirmValues);
    const [transferReceipt, setTransferReceipt] = useState(initialReceiptValues);

    const validationSchema = getPaymentAgentTransferValidationSchema({
        balance: Number(activeAccount?.balance),
        currency,
        fractionalDigits: activeAccount?.currency_config?.fractional_digits ?? 2,
        limits: {
            max: paymentAgentDetails?.max_withdrawal,
            min: paymentAgentDetails?.min_withdrawal,
        },
    });

    const requestTryPaymentAgentTransfer = ({
        amount,
        description,
        transfer_to: transferTo,
    }: Omit<Parameters<typeof mutateAsync>[0]['payload'], 'currency'>) => {
        mutateAsync({
            payload: {
                amount,
                currency,
                description,
                dry_run: 1,
                transfer_to: transferTo,
            },
        }).then(
            ({
                client_to_full_name: clientName = '',
                client_to_loginid: clientID = '',
                paymentagent_transfer: paymentAgentTransfer,
            }) => {
                if (paymentAgentTransfer === 2) {
                    setTransferConfirm({
                        amount: String(amount),
                        clientID,
                        clientName,
                        currency,
                        description: description ?? '',
                    });
                    setIsTryTransferSuccessful(true);
                }
            }
        );
    };

    const requestPaymentAgentTransfer = ({
        amount,
        description,
        transfer_to: transferTo,
    }: Omit<Parameters<typeof mutateAsync>[0]['payload'], 'currency'>) => {
        mutateAsync({
            payload: {
                amount,
                currency,
                description,
                dry_run: 0,
                transfer_to: transferTo,
            },
        }).then(
            ({
                client_to_full_name: clientName = '',
                client_to_loginid: clientID = '',
                paymentagent_transfer: paymentAgentTransfer,
            }) => {
                if (paymentAgentTransfer === 1) {
                    setTransferReceipt({
                        amount: String(amount),
                        clientID,
                        clientName,
                        currency,
                    });
                    setIsTryTransferSuccessful(false);
                    setIsTransferSuccessful(true);
                }
            }
        );
    };

    const resetPaymentAgentTransfer = () => {
        setTransferConfirm(initialTransferConfirmValues);
        setTransferReceipt(initialReceiptValues);
        setIsTransferSuccessful(false);
    };

    return {
        activeAccount,
        isLoading,
        isTransferRequestSubmitting,
        isTransferSuccessful,
        isTryTransferSuccessful,
        paymentAgentDetails,
        requestPaymentAgentTransfer,
        requestTryPaymentAgentTransfer,
        resetPaymentAgentTransfer,
        setIsTryTransferSuccessful,
        transferConfirm,
        transferReceipt,
        validationSchema,
    };
};
