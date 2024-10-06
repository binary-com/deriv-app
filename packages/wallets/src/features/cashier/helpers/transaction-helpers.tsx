import React from 'react';
import { useSubscription } from '@deriv/api-v2';
import { Localize, localize } from '@deriv-com/translations';

type TTransaction = NonNullable<
    NonNullable<ReturnType<typeof useSubscription<'cashier_payments'>>['data']>['cashier_payments']
>['crypto'][number];

type TStatus = TTransaction['status_code'];

type TDepositStatus = 'CONFIRMED' | 'ERROR' | 'PENDING';

type TWithdrawalStatus = Exclude<TStatus, TDepositStatus>;

// Since BE sends the `status_code` for both `deposit` and `withdrawal` in the same field,
// Here we modify the BE type to make `status_code` type more specific to the `transaction_type` field.
export type TModifiedTransaction = Omit<TTransaction, 'status_code' | 'transaction_type'> &
    (
        | { statusCode: TDepositStatus; transactionType: 'deposit' }
        | { statusCode: TWithdrawalStatus; transactionType: 'withdrawal' }
    );

export const getStatusName = (statusCode: TModifiedTransaction['statusCode']) => {
    switch (statusCode) {
        case 'CONFIRMED':
        case 'SENT':
            return <Localize i18n_default_text='Successful' />;
        case 'ERROR':
        case 'REJECTED':
        case 'REVERTED':
            return <Localize i18n_default_text='Unsuccessful' />;
        case 'PENDING':
        case 'PERFORMING_BLOCKCHAIN_TXN':
        case 'PROCESSING':
        case 'REVERTING':
        case 'VERIFIED':
            return <Localize i18n_default_text='In process' />;
        case 'CANCELLED':
            return <Localize i18n_default_text='Cancelled' />;
        case 'LOCKED':
            return <Localize i18n_default_text='In review' />;
        default:
            return '';
    }
};

export const getStatusDescription = (
    transactionType: TModifiedTransaction['transactionType'],
    statusCode: TModifiedTransaction['statusCode']
) => {
    switch (statusCode) {
        // deposit-specific:
        case 'CONFIRMED':
            return <Localize i18n_default_text='Your deposit is successful.' />;
        case 'PENDING':
            return (
                <Localize i18n_default_text="We've received your request and are waiting for more blockchain confirmations." />
            );
        // withdrawal-specific:
        case 'CANCELLED':
            return <Localize i18n_default_text="You've cancelled your withdrawal request." />;
        case 'LOCKED':
            return (
                <Localize i18n_default_text="We're reviewing your withdrawal request. You may still cancel this transaction if you wish. Once we start processing, you won't be able to cancel." />
            );
        case 'PERFORMING_BLOCKCHAIN_TXN':
            return <Localize i18n_default_text="We're sending your request to the blockchain." />;
        case 'PROCESSING':
            return <Localize i18n_default_text="We're awaiting confirmation from the blockchain." />;
        case 'REJECTED':
        case 'REVERTED':
            return (
                <Localize i18n_default_text="Your withdrawal is unsuccessful. We've sent you an email with more information." />
            );
        case 'REVERTING':
        case 'VERIFIED':
            return <Localize i18n_default_text="We're processing your withdrawal." />;
        case 'SENT':
            return <Localize i18n_default_text='Your withdrawal is successful.' />;
        // both:
        case 'ERROR':
            return transactionType === 'deposit' ? (
                <Localize
                    i18n_default_text='Your {{transactionType}} is unsuccessful due to an error on the blockchain. Please contact your crypto wallet service provider for more info.'
                    values={{ transactionType }}
                />
            ) : (
                <Localize
                    i18n_default_text='Your {{transactionType}} is unsuccessful due to an error on the blockchain. Please contact us via live chat for more info.'
                    values={{ transactionType }}
                />
            );
        default:
            return '';
    }
};

export const getFormattedConfirmations = (
    confirmations: TModifiedTransaction['confirmations'],
    statusCode: TModifiedTransaction['statusCode']
) => {
    switch (statusCode) {
        case 'CONFIRMED':
            return localize('Confirmed');
        case 'ERROR':
            return localize('NA');
        default:
            return confirmations?.toString() ?? localize('Pending');
    }
};
