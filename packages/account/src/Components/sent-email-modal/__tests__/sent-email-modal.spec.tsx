import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SentEmailModal from '../sent-email-modal';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

describe('<SentEmailModal/>', () => {
    const onClose = jest.fn();
    const onClickSendEmail = jest.fn();

    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render SentEmailModal component to change dmt5 password', () => {
        render(<SentEmailModal identifier_title='mt5' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />);

        expect(
            screen.getByText(/please click on the link in the email to change your deriv mt5 password./i)
        ).toBeInTheDocument();
    });

    it('should render SentEmailModal component to change deriv x password', () => {
        render(
            <SentEmailModal identifier_title='dxtrade' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />
        );

        expect(screen.getByText(/deriv x/i)).toBeInTheDocument();
    });

    it('should render SentEmailModal component to change password through google account', () => {
        render(
            <SentEmailModal identifier_title='Google' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />
        );

        expect(
            screen.getByText(/check your google account email and click the link in the email to proceed./i)
        ).toBeInTheDocument();
    });

    it('should render SentEmailModal component to change email', () => {
        render(
            <SentEmailModal
                identifier_title='Change_Email'
                is_open
                onClose={onClose}
                onClickSendEmail={onClickSendEmail}
            />
        );

        expect(screen.getByText(/check your email and click the link in the email to proceed./i)).toBeInTheDocument();
    });

    it('should display default message when no appropriate identifier_title is passed', () => {
        render(<SentEmailModal identifier_title='' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />);

        expect(screen.getByText(/please click on the link in the email to reset your password/i)).toBeInTheDocument();
    });

    it('should trigger onClose function when modal close button is clicked', () => {
        render(<SentEmailModal identifier_title='mt5' is_open onClose={onClose} onClickSendEmail={onClickSendEmail} />);

        const btn: HTMLElement = screen.getByTestId('dt_send_email_template_close');
        fireEvent.click(btn);

        expect(onClose).toBeCalledTimes(1);
    });

    it('should render SentEmailModal component when isMobile is true', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        render(
            <SentEmailModal
                identifier_title='Change_Email'
                is_open
                onClose={onClose}
                onClickSendEmail={onClickSendEmail}
            />
        );

        expect(screen.getByText(/check your email and click the link in the email to proceed./i)).toBeInTheDocument();
    });

    it('should not have model content when is_open is false', () => {
        render(
            <SentEmailModal
                identifier_title='mt5'
                is_open={false}
                onClose={onClose}
                onClickSendEmail={onClickSendEmail}
            />
        );

        expect(
            screen.queryByText(/please click on the link in the email to change your deriv mt5 password./i)
        ).not.toBeInTheDocument();
    });

    it('should have live chat displayed when live chat is enabled', () => {
        render(
            <SentEmailModal
                identifier_title='mt5'
                is_open
                has_live_chat
                onClose={onClose}
                onClickSendEmail={onClickSendEmail}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /didn't receive the email?/i }));

        expect(screen.getByText(/live chat/i)).toBeInTheDocument();
    });

    it('should have onClose called when live chat option is clicked', () => {
        render(
            <SentEmailModal
                identifier_title='mt5'
                is_open
                has_live_chat
                onClose={onClose}
                onClickSendEmail={onClickSendEmail}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /didn't receive the email?/i }));
        fireEvent.click(screen.getByText(/live chat/i));

        expect(onClose).toBeCalledTimes(1);
    });

    it('should have onClickSendEmail called when resend email is clicked', () => {
        render(
            <SentEmailModal
                identifier_title='mt5'
                is_open
                has_live_chat
                onClose={onClose}
                onClickSendEmail={onClickSendEmail}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /didn't receive the email?/i }));
        fireEvent.click(screen.getByRole('button', { name: /resend email/i }));

        expect(onClickSendEmail).toBeCalledTimes(1);
    });
});
