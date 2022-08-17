import React from 'react';
import { Localize, localize } from '@deriv/translations';

const paymentMethodConfig = {
    AdvCash: {
        icon: 'IcOtherPaymentMethod',
        instructions: [
            localize(
                'Upload a screenshot of "Personal Info". Please be sure to capture your full name and your e-mail'
            ),
        ],
        input_label: localize('Email Address'),
        title: 'AdvCash',
        documents_required: 1,
    },
    AstroPay: {
        icon: 'IcOtherPaymentMethod',
        instructions: [
            <Localize
                key={1}
                i18n_default_text='Upload screenshots from the "personal details" page and the "account" page <0>via</0>'
                components={[<a key={0} target='_blank' rel='noreferrer' href='https://app.astropay.com/profile' />]}
            />,
        ],
        input_label: localize('Account Number'),
        title: 'AstroPay',
        documents_required: 2,
    },
    Beyonic: {
        icon: 'IcBeyonic',
        instructions: [
            localize(
                'Upload your monthly mobile bill statement or mobile money statement showing your name and mobile number.'
            ),
        ],
        input_label: localize('Mobile number'),
        title: 'Beyonic',
        documents_required: 1,
    },
    'Boleto (D24 Voucher)': {
        icon: 'IcOtherPaymentMethod',
        instructions: [
            localize('Upload your bank statement that shows your name and account details for the transaction.'),
        ],
        input_label: localize('Bank account number'),
        title: 'Boleto (D24 Voucher)',
        documents_required: 1,
    },
    VISA: {
        icon: 'IcStockVisa',
        instructions: [
            localize(
                'Upload a photo of your card showing your name and card number. Your card number must only show the first 6 and last 4 digits. If your card does not have your name embossed on it, we will require a bank statement that shows your name and card number.'
            ),
        ],
        input_label: localize('Card number'),
        title: 'VISA',
        documents_required: 1,
    },
    MasterCard: {
        icon: 'IcStockMasterCard',
        instructions: [
            localize(
                'Upload a photo of your card showing your name and card number. Your card number must only show the first 6 and last 4 digits. If your card does not have your name embossed on it, we will require a bank statement that shows your name and card number.'
            ),
        ],
        input_label: localize('Card number'),
        title: 'MasterCard',
        documents_required: 1,
    },
    PIX: {
        icon: 'IcOtherPaymentMethod',
        instructions: [
            localize(
                `Upload a screenshot of your "Personal Account' page on your computer or "Account Information" page on your mobile. You may also provide a screenshot of your bank details linked to your Pix account.`
            ),
        ],
        input_label: localize(''),
        title: 'PIX',
        documents_required: 1,
    },
    Skrill: {
        icon: 'IcWalletSkrillLight',
        instructions: [
            localize(
                'Upload a screenshot of "Your profile" or "Personal details". It should show your name, email and account number'
            ),
        ],
        input_label: localize('Email address'),
        title: 'Skrill',
        documents_required: 1,
    },
    NETeller: {
        icon: 'IcWalletNetellerLight',
        instructions: [
            localize(
                'Upload a screenshot of "Your profile" or "Personal details". It should show your name, email and account number'
            ),
        ],
        input_label: localize('Email address'),
        title: 'Neteller',
        documents_required: 1,
    },
    OnlineNaira: {
        icon: 'IcOnlineNaira',
        instructions: [
            localize('Upload the following documents:'),
            localize(''),
            localize(''),
            <Localize
                key={1}
                i18n_default_text='1. Upload a screenshot of the General Information page <0>via</0>'
                components={[
                    <a key={0} target='_blank' rel='noreferrer' href='https://onlinenaira.com/members/index.htm' />,
                ]}
            />,
            <Localize
                key={1}
                i18n_default_text='2. Upload a screenshot of the Settings page showing your Account/Mobile Money details <0>via</0>'
                components={[
                    <a key={0} target='_blank' rel='noreferrer' href='https://onlinenaira.com/members/bank.htm' />,
                ]}
            />,
        ],
        input_label: localize('Account ID'),
        title: 'OnlineNaira',
        documents_required: 2,
    },
    WebMoney: {
        icon: 'IcWalletWebmoneyLight',
        instructions: [
            localize(
                'Upload a screenshot of the "Account" or "Personal details" page. It should show your name, account number, phone, and email'
            ),
        ],
        input_label: localize('Account number'),
        title: 'WebMoney',
        documents_required: 1,
    },
    ZingPay: {
        icon: 'IcZingpay',
        instructions: [localize('Upload your Zingpay bank statement showing your name and bank account number.')],
        input_label: localize('Bank Account Number'),
        title: 'ZingPay',
        documents_required: 1,
    },
    SticPay: {
        icon: 'IcWalletSticpayLight',
        instructions: [localize('Upload a screenshot of your "Personal details". It should show your name and email')],
        input_label: localize('Email address'),
        title: 'SticPay',
        documents_required: 1,
    },
    Jeton: {
        icon: 'IcWalletJetonLight',
        instructions: [
            localize('Upload a screenshot of your "Personal details". It should show your name and account number'),
        ],
        input_label: localize('Account number'),
        title: 'Jeton',
        documents_required: 1,
    },
    other: {
        icon: 'IcOtherPaymentMethod',
        instructions: [localize('Upload a document showing your name and bank account number or account details.')],
        input_label: null,
        title: '[Payment Method Name]',
        documents_required: 1,
    },
};

export default paymentMethodConfig;
