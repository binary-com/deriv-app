import { THooks } from '../../../../../hooks/types';
import { TCurrency } from '../../../../../types';

export type TReceipt = {
    amount: string;
    currency?: TCurrency;
    paymentAgentEmail: THooks.PaymentAgentList[number]['email'];
    paymentAgentName: THooks.PaymentAgentList[number]['name'];
    paymentAgentPhoneNumbers: THooks.PaymentAgentList[number]['phone_numbers'];
    paymentAgentUrls: THooks.PaymentAgentList[number]['urls'];
};

export type TConfirm = {
    amount: string;
    clientID: string;
    currency?: TCurrency;
    paymentAgentID: string;
    paymentAgentName: string;
};

export type TPaymentAgentWithdrawalModuleProps = {
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
    verificationCode: string;
};
