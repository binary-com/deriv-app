import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';

type ServiceErrorProps = {
    is_insufficient_balance: boolean;
    is_authorization_required: boolean;
    is_account_verification_required: boolean;
    is_mf_verification_pending_modal_visible: boolean;
    services_error_message?: string;
};

const ServiceErrorDescription: React.FC<ServiceErrorProps> = ({
    is_insufficient_balance,
    is_authorization_required,
    is_account_verification_required,
    is_mf_verification_pending_modal_visible,
    services_error_message,
}) => {
    const getContent = () => {
        if (is_insufficient_balance)
            return {
                title: <Localize i18n_default_text='Insufficient balance' />,
                text: services_error_message || <Localize i18n_default_text='An error occurred.' />,
            };
        if (is_authorization_required)
            return {
                title: <Localize i18n_default_text='Start trading with us' />,
                text: <Localize i18n_default_text='Log in or create a free account to place a trade.' />,
            };
        if (is_account_verification_required)
            return {
                title: <Localize i18n_default_text='Account verification required' />,
                text: (
                    <Localize i18n_default_text='Please submit your proof of identity and proof of address to verify your account and continue trading.' />
                ),
            };
        if (is_mf_verification_pending_modal_visible)
            return {
                title: <Localize i18n_default_text='Pending verification' />,
                text: (
                    <Localize i18n_default_text='You cannot trade as your documents are still under review. We will notify you by email once your verification is approved.' />
                ),
            };
    };
    const { title, text } = getContent() || {};

    return (
        <>
            <Text size='lg' bold className='service-error-sheet__body__heading'>
                {title}
            </Text>
            <Text>{text}</Text>
        </>
    );
};

export default ServiceErrorDescription;
