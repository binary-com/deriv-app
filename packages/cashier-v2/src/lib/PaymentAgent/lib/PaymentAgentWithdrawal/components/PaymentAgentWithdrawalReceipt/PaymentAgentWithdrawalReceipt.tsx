import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { StandalonePhoneRegularIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import EmailIcon from '../../../../../../assets/images/ic-email-outline-new.svg';
import WebsiteIcon from '../../../../../../assets/images/ic-website.svg';
import type { THooks } from '../../../../../../hooks/types';
import { usePaymentAgentWithdrawalContext } from '../../provider';
import { PaymentAgentReceiptDetail } from './PaymentAgentReceiptDetail';
import styles from './PaymentAgentWithdrawalReceipt.module.scss';

type TPaymentAgentPhoneDetailsProps = {
    phoneNumbers: THooks.PaymentAgentList[number]['phone_numbers'];
};

type TPaymentAgentEmailDetailsProps = {
    email: string;
};

type TPaymentAgentUrlDetailsProps = {
    urls: THooks.PaymentAgentList[number]['urls'];
};

const PaymentAgentPhoneDetails: React.FC<TPaymentAgentPhoneDetailsProps> = ({ phoneNumbers }) => {
    return (
        <PaymentAgentReceiptDetail action='tel' icon={StandalonePhoneRegularIcon}>
            {phoneNumbers.map(phone => phone.phone_number)}
        </PaymentAgentReceiptDetail>
    );
};

const PaymentAgentEmailDetails: React.FC<TPaymentAgentEmailDetailsProps> = ({ email }) => {
    return (
        <PaymentAgentReceiptDetail action='mailto' icon={EmailIcon}>
            {email}
        </PaymentAgentReceiptDetail>
    );
};

const PaymentAgentUrlDetails: React.FC<TPaymentAgentUrlDetailsProps> = ({ urls }) => {
    return (
        <PaymentAgentReceiptDetail icon={WebsiteIcon} shouldOpenInNewTab>
            {urls.map(({ url }) => url)}
        </PaymentAgentReceiptDetail>
    );
};

const PaymentAgentWithdrawalReceipt = () => {
    const { resetPaymentAgentWithdrawal, withdrawalReceipt } = usePaymentAgentWithdrawalContext();
    const { amount, currency, paymentAgentEmail, paymentAgentName, paymentAgentPhoneNumbers, paymentAgentUrls } =
        withdrawalReceipt;

    const history = useHistory();

    const onViewTransactionsHandler = () => {
        history.push('/reports/statement');
        resetPaymentAgentWithdrawal();
    };

    //TODO: implement platform check in cashier-v2
    const isFromDerivgo = false;

    return (
        <div className={styles.container}>
            <Text align='center' as='p' className={styles.title} size='lg' weight='bold'>
                You’ve transferred {FormatUtils.formatMoney(Number(amount), { currency })} {currency}
            </Text>
            <div
                className={clsx(styles.description, {
                    [styles['description--extra-bottom-margin']]: !paymentAgentName,
                })}
            >
                <Text align='center' as='p' size='sm' weight='bold'>
                    Important notice to receive your funds
                </Text>
                <div>
                    <Text align='center' as='p' size='xs'>
                        {paymentAgentName
                            ? 'To receive your funds, contact the payment agent with the details below.'
                            : 'To receive your funds, contact the payment agent'}
                    </Text>
                    <Text align='center' as='p' size='xs'>
                        You can view the summary of this transaction in your email.
                    </Text>
                </div>
            </div>
            {paymentAgentName && (
                <div className={styles['details-wrapper']}>
                    <Text align='center' as='p' size='xs' weight='bold'>{`${paymentAgentName}'s contact details`}</Text>
                    <div className={styles.details}>
                        {paymentAgentPhoneNumbers.length > 0 && (
                            <PaymentAgentPhoneDetails phoneNumbers={paymentAgentPhoneNumbers} />
                        )}
                        {paymentAgentEmail && <PaymentAgentEmailDetails email={paymentAgentEmail} />}
                        {paymentAgentUrls.length > 0 && <PaymentAgentUrlDetails urls={paymentAgentUrls} />}
                    </div>
                </div>
            )}
            <div className={styles['buttons-container']}>
                {!isFromDerivgo && (
                    <Button
                        color='black'
                        onClick={onViewTransactionsHandler}
                        size='lg'
                        textSize='sm'
                        variant='outlined'
                    >
                        View transactions
                    </Button>
                )}
                <Button onClick={resetPaymentAgentWithdrawal} size='lg' textSize='sm'>
                    Make a new withdrawal
                </Button>
            </div>
        </div>
    );
};

export default PaymentAgentWithdrawalReceipt;
