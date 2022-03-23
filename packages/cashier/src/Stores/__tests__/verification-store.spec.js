import VerificationStore from '../verification-store';

let WS;
let root_store;
let verification_store;

beforeEach(() => {
    WS = {
        verifyEmail: jest.fn(),
    };
    root_store = {
        client: {
            email: 'george@gmail.com',
            setVerificationCode: jest.fn(),
        },
        modules: {
            cashier: {
                general_store: {
                    active_container: 'payment_agent',
                },
                payment_agent: jest.fn(),
            },
        },
    };
    verification_store = new VerificationStore({ WS, root_store });
    jest.useFakeTimers();
});

describe('VerificationStore', () => {
    it('should change value of the variable is_button_clicked', () => {
        verification_store.setIsButtonClicked(false);

        expect(verification_store.is_button_clicked).toBeFalse();

        verification_store.setIsButtonClicked(true);

        expect(verification_store.is_button_clicked).toBeTrue();
    });
    it('should change value of the variable timeout_button', () => {
        verification_store.setTimeoutButton('100');

        expect(verification_store.timeout_button).toBe('100');
    });
    it('should change value of the variable is_email_sent', () => {
        verification_store.setIsEmailSent(false);

        expect(verification_store.is_email_sent).toBeFalse();

        verification_store.setIsEmailSent(true);

        expect(verification_store.is_email_sent).toBeTrue();
    });
    it('should change value of the variable is_resend_clicked', () => {
        verification_store.setIsResendClicked(false);

        expect(verification_store.is_resend_clicked).toBeFalse();

        verification_store.setIsResendClicked(true);

        expect(verification_store.is_resend_clicked).toBeTrue();
    });
    it('should change value of the variable resend_timeout', () => {
        verification_store.setResendTimeout('20');

        expect(verification_store.resend_timeout).toBe('20');
    });
    it('should clear verification timeout', () => {
        jest.spyOn(global, 'clearTimeout');
        verification_store.setTimeoutButton('123');
        verification_store.clearTimeoutVerification();

        expect(clearTimeout).toHaveBeenCalledTimes(1);
        expect(clearTimeout).toHaveBeenCalledWith('123');
    });
    it('should set verification timeout', () => {
        const spyClearTimeoutVerification = jest.spyOn(verification_store, 'clearTimeoutVerification');
        const spyClearVerification = jest.spyOn(verification_store, 'clearVerification');
        verification_store.setTimeoutVerification();
        jest.runAllTimers();

        expect(spyClearTimeoutVerification).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3600000);
        expect(spyClearVerification).toHaveBeenCalledTimes(1);
    });
    it('should not send an email if is_button_clicked="true"', async () => {
        verification_store.WS.verifyEmail.mockResolvedValue({});
        verification_store.setIsButtonClicked(true);
        await verification_store.sendVerificationEmail();

        expect(verification_store.is_email_sent).toBeFalse();
    });
    it('should not send an email if there is no client email', async () => {
        verification_store.root_store.client.email = '';
        verification_store.WS.verifyEmail.mockResolvedValue({});
        await verification_store.sendVerificationEmail();

        expect(verification_store.is_email_sent).toBeFalse();
    });
    it('should send an email if there is no error in response_verify_email', async () => {
        verification_store.WS.verifyEmail.mockResolvedValue({});
        await verification_store.sendVerificationEmail();

        expect(verification_store.is_email_sent).toBeTrue();
    });
    it('should set an error message when there is an error in response_verify_email with code="PaymentAgentWithdrawError"', async () => {
        verification_store.WS.verifyEmail.mockResolvedValue({
            error: { code: 'PaymentAgentWithdrawError', message: 'ERROR' },
        });
        await verification_store.sendVerificationEmail();

        expect(verification_store.error.message).toBe('ERROR');
    });
    it('should set an error message when there is an error in response_verify_email with custom error code', async () => {
        verification_store.WS.verifyEmail.mockResolvedValue({
            error: { code: 'error_code', message: 'ERROR' },
        });
        await verification_store.sendVerificationEmail();

        expect(verification_store.error.message).toBe('ERROR');
    });
    it('should resend verification email', () => {
        verification_store.WS.verifyEmail.mockResolvedValue({});
        const spySendVerificationEmail = jest.spyOn(verification_store, 'sendVerificationEmail');
        verification_store.resendVerificationEmail();

        expect(spySendVerificationEmail).toHaveBeenCalled();
    });
    it('should not resend verification email, if resend_timeout less then 60', () => {
        verification_store.setResendTimeout(1);
        const spySendVerificationEmail = jest.spyOn(verification_store, 'sendVerificationEmail');
        verification_store.resendVerificationEmail();

        expect(spySendVerificationEmail).not.toHaveBeenCalled();
    });
    it('should run clearInterval in setCountDownResendVerification function when resend_timeout === 1 ', () => {
        verification_store.setCountDownResendVerification();
        jest.runAllTimers();

        expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        expect(verification_store.resend_timeout).toBe(60);
        expect(clearInterval).toHaveBeenCalled();
    });
    it('should clear verification', () => {
        verification_store.clearVerification();

        expect(verification_store.is_button_clicked).toBeFalse();
        expect(verification_store.is_email_sent).toBeFalse();
        expect(verification_store.is_resend_clicked).toBeFalse();
        expect(verification_store.root_store.client.setVerificationCode).toHaveBeenCalledWith(
            '',
            'payment_agent_withdraw'
        );
    });
});
