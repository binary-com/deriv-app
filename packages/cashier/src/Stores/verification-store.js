import { action, observable } from 'mobx';
import ErrorStore from './error-store';

export default class VerificationStore {
    is_button_clicked = false;
    timeout_button = '';

    @observable error = new ErrorStore();
    @observable is_email_sent = false;
    @observable is_resend_clicked = false;
    @observable resend_timeout = 60;

    @action.bound
    setIsEmailSent(value) {
        this.is_email_sent = value;
    }

    @action.bound
    setIsResendClicked(value) {
        this.is_resend_clicked = value;
    }

    @action.bound
    setResendTimeout(value) {
        this.resend_timeout = value;
    }
}
