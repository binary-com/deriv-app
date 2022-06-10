import React from 'react';
import PropTypes from 'prop-types';
import { localize, Localize } from '@deriv/translations';
import { Div100vhContainer, Icon, MobileDialog, Modal, SendEmailTemplate, Text, Popover } from '@deriv/components';
import { getPlatformSettings, CFD_PLATFORMS, isMobile, isDesktop } from '@deriv/shared';

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
            key: 'wrong_typo',
            icon: 'IcEmailTypo',
            content: localize('The email address you entered had a mistake or typo (happens to the best of us).'),
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

const SentEmailModal = ({
    identifier_title,
    is_open,
    onClose,
    onClickSendEmail,
    has_live_chat = false,
    is_modal_when_mobile = false,
}) => {
    const getSubtitle = () => {
        let subtitle = '';
        switch (identifier_title) {
            case CFD_PLATFORMS.DXTRADE:
                subtitle = (
                    <Localize
                        i18n_default_text='Please click on the link in the email to change your <0>{{platform_name_dxtrade}}</0> password.'
                        components={[<span className='send-email-template__subtitle-platform' key={0} />]}
                        values={{ platform_name_dxtrade: getPlatformSettings('dxtrade').name }}
                    />
                );
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
            case 'Change_Email':
                subtitle = localize('Check your email and click the link in the email to proceed.');
                break;
            default:
                subtitle = localize('Please click on the link in the email to reset your password.');
                break;
        }
        return subtitle;
    };

    const onLiveChatClick = () => {
        onClose();
        window.LiveChatWidget?.call('maximize');
    };

    const live_chat = has_live_chat ? (
        <Localize
            i18n_default_text="Still didn't get the email? Please contact us via <0>live chat.</0>"
            components={[
                <span className='send-email-template__footer-live-chat' key={0} onClick={onLiveChatClick}>
                    <Popover
                        className='send-email-template__footer-live-chat__link'
                        classNameBubble='help-centre__tooltip'
                        alignment='top'
                        message={localize('Live chat')}
                        zIndex={9999}
                    />
                </span>,
            ]}
        />
    ) : null;

    const sent_email_template = (
        <SendEmailTemplate
            className='sent-email'
            subtitle={getSubtitle()}
            title={localize('We’ve sent you an email')}
            lbl_no_receive={localize("Didn't receive the email?")}
            txt_resend={localize('Resend email')}
            txt_resend_in={localize('Resend email in')}
            onClickSendEmail={onClickSendEmail}
            closeEmailModal={onClose}
            live_chat={live_chat}
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

    if (isMobile() && !is_modal_when_mobile) {
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
    has_live_chat: PropTypes.bool,
    is_modal_when_mobile: PropTypes.bool,
};

export default SentEmailModal;
