import React from 'react';
import PropTypes from 'prop-types';
import { localize } from '@deriv/translations';
import { Div100vhContainer, Icon, MobileDialog, Modal, SendEmailTemplate, Text } from '@deriv/components';
import { CFD_PLATFORMS, isMobile, isDesktop } from '@deriv/shared';

const getNoEmailContentStrings = () => {
    return [
        {
            key: 'email_spam',
            icon: 'IcEmailSpam',
            content: localize('The email is in your spam folder (Sometimes things get lost there).'),
        },
        {
            key: 'wrong_email',
            icon: 'IcEmail',
            content: localize(
                'You accidentally gave us another email address (Usually a work or a personal one instead of the one you meant).'
            ),
        },
        {
            key: 'email_firewall',
            icon: 'IcEmailFirewall',
            content: localize(
                'We can’t deliver the email to this address (Usually because of firewalls or filtering).'
            ),
        },
    ];
};

const SentEmailModal = ({ identifier_title, is_open, onClose, onClickSendEmail }) => {
    const getSubtitle = () => {
        let subtitle = '';
        switch (identifier_title) {
            case CFD_PLATFORMS.DXTRADE:
                subtitle = localize('Please click on the link in the email to change your Deriv X password.');
                break;
            case CFD_PLATFORMS.MT5:
                subtitle = localize('Please click on the link in the email to change your DMT5 password.');
                break;
            case 'Google':
            case 'Facebook':
                subtitle = localize(
                    'Check your {{ identifier_title }} account email and click the link in the email to proceed.',
                    { identifier_title }
                );
                break;
            default:
                subtitle = localize('Please click on the link in the email to reset your password.');
                break;
        }
        return subtitle;
    };

    const sent_email_template = (
        <SendEmailTemplate
            className='sent-email'
            subtitle={getSubtitle()}
            title={localize('We’ve sent you an email')}
            lbl_no_receive={localize("Didn't receive the email?")}
            txt_resend={localize('Resend email')}
            txt_resend_in={localize('Resend email in')}
            onClickSendEmail={onClickSendEmail}
        >
            {getNoEmailContentStrings().map(item => (
                <div className='sent-email__content' key={item.key}>
                    <Icon icon={item.icon} size={32} />
                    <Text size='xxs' as='p'>
                        {item.content}
                    </Text>
                </div>
            ))}
        </SendEmailTemplate>
    );

    if (isMobile()) {
        return (
            <MobileDialog
                portal_element_id='modal_root'
                title={localize('We’ve sent you an email')}
                wrapper_classname='mt5-email-sent'
                visible={is_open}
                onClose={onClose}
                has_content_scroll
            >
                {sent_email_template}
            </MobileDialog>
        );
    }

    return (
        <Modal
            className={'sent-email__modal'}
            is_open={is_open}
            has_close_icon
            should_header_stick_body
            title=''
            toggleModal={onClose}
            width='440px'
        >
            <Div100vhContainer
                className='account__scrollbars_container-wrapper'
                is_disabled={isDesktop()}
                height_offset='80px'
            >
                <Modal.Body>
                    <div onClick={onClose} className='send-email-template__close'>
                        <Icon icon='IcCross' />
                    </div>
                    {sent_email_template}
                </Modal.Body>
            </Div100vhContainer>
        </Modal>
    );
};

SentEmailModal.propTypes = {
    identifier_title: PropTypes.string,
    is_open: PropTypes.bool,
    is_unlink_modal: PropTypes.bool,
    onClose: PropTypes.func,
    onClickSendEmail: PropTypes.func,
};

export default SentEmailModal;
