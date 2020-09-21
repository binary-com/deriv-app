import React from 'react';
import QRCode from 'qrcode.react';
import { Timeline, DesktopWrapper, MobileWrapper, ThemedScrollbars, Clipboard, Icon, Loading } from '@deriv/components';
import { getPropertyValue, isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
import LoadErrorMessage from 'Components/load-error-message';
import DigitForm from './digit-form.jsx';
import Article from './article.jsx';

class TwoFactorAuthentication extends React.Component {
    state = {
        is_two_factor_enabled: 0,
        is_loading: true,
        is_qr_loading: false,
        error_message: '',
        secret_key: '',
        qr_secret_key: '',
    };

    generateQrCode = async () => {
        this.setState({ is_qr_loading: true });
        const generate_response = await WS.authorized.accountSecurity({
            account_security: 1,
            totp_action: 'generate',
        });

        if (generate_response.error) {
            this.setState({ is_loading: false, error_message: generate_response.error.message });
            return;
        }
        const secret_key = getPropertyValue(generate_response, ['account_security', 'totp', 'secret_key']);

        const qr_secret_key = `otpauth://totp/${this.props.email_address}?secret=${secret_key}&issuer=Deriv.com`;

        this.setState({ secret_key, qr_secret_key, is_loading: false, is_qr_loading: false });
    };

    setEnabled = (is_enabled) => {
        this.setState({ is_two_factor_enabled: is_enabled });
        if (!is_enabled) {
            this.generateQrCode();
        }
    };

    getDigitStatus = async () => {
        const status_response = await WS.authorized.accountSecurity({ account_security: 1, totp_action: 'status' });

        if (status_response.error) {
            this.setState({ error_message: status_response.error.message });
            return;
        }

        const is_enabled = getPropertyValue(status_response, ['account_security', 'totp', 'is_enabled']);

        if (is_enabled) {
            this.setEnabled(is_enabled);
        } else {
            this.generateQrCode();
        }
        this.setState({ is_loading: false });
    };

    componentDidMount() {
        const { is_virtual } = this.props;
        if (is_virtual) {
            this.setState({ is_loading: false });
        } else {
            this.getDigitStatus();
        }
    }

    render() {
        const {
            is_loading,
            is_qr_loading,
            is_two_factor_enabled,
            error_message,
            secret_key,
            qr_secret_key,
        } = this.state;
        const { is_switching } = this.props;

        if (is_loading || is_switching) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        if (error_message) return <LoadErrorMessage error_message={error_message} />;

        return (
            <section className='two-factor'>
                {is_two_factor_enabled ? (
                    <ThemedScrollbars className='two-factor__scrollbars'>
                        <div className='two-factor__wrapper--enabled'>
                            <Icon icon='IcQrPhone' className='two-factor__icon' />
                            <h3 className='two-factor__qr--title'>{localize('2FA enabled')}</h3>
                            <h4 className='two-factor__qr--message'>
                                {localize('You have enabled 2FA for your Deriv account.')}
                            </h4>
                            <h4 className='two-factor__qr--message'>
                                {localize(
                                    'To disable 2FA, please enter the six-digit authentication code generated by your 2FA app below:'
                                )}
                            </h4>
                            <DigitForm is_enabled={is_two_factor_enabled} setEnabled={this.setEnabled} />
                        </div>
                    </ThemedScrollbars>
                ) : (
                    <div className='two-factor__wrapper'>
                        <ThemedScrollbars
                            is_bypassed={isMobile()}
                            autoHide
                            className='two-factor__scrollbars'
                            hideHorizontal={true}
                        >
                            <MobileWrapper>
                                <Article />
                            </MobileWrapper>
                            <h2 className='two-factor__title'>
                                {localize('How to set up 2FA for your Deriv account')}
                            </h2>
                            <div>
                                <Timeline className='two-factor__timeline'>
                                    <Timeline.Item
                                        title={
                                            <Localize
                                                i18n_default_text='Scan the QR code below with your 2FA app. We recommend <0>Authy</0> or <1>Google Authenticator</1>. We do not support <2>Duo Mobile</2>.'
                                                components={[
                                                    <a
                                                        className='link two-factor__link'
                                                        href='https://authy.com/'
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        key={0}
                                                    />,
                                                    <a
                                                        className='link two-factor__link'
                                                        href='https://github.com/google/google-authenticator/wiki#implementations'
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        key={1}
                                                    />,
                                                    <a
                                                        className='link two-factor__link'
                                                        href='https://help.duo.com/s/article/2112?language=en_US'
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        key={2}
                                                    />,
                                                ]}
                                            />
                                        }
                                    >
                                        <div className='two-factor__qr'>
                                            {is_qr_loading ? (
                                                <Loading is_fullscreen={false} />
                                            ) : (
                                                <>
                                                    <div className='two-factor__qr--wrapper'>
                                                        <QRCode value={qr_secret_key} />
                                                    </div>

                                                    <h4 className='two-factor__qr--message'>
                                                        {localize(
                                                            'If you are unable to scan the QR code, you can manually enter this code instead:'
                                                        )}
                                                    </h4>
                                                    <div className='two-factor__qr--code'>
                                                        <span>{secret_key}</span>
                                                        <Clipboard
                                                            text_copy={secret_key}
                                                            info_message='Click here to copy key'
                                                            success_message='Key copied!'
                                                            className='two-factor__qr--clipboard'
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Timeline.Item>
                                    <Timeline.Item
                                        title={localize('Enter the authentication code generated by your 2FA app:')}
                                    >
                                        <DigitForm is_enabled={is_two_factor_enabled} setEnabled={this.setEnabled} />
                                    </Timeline.Item>
                                </Timeline>
                            </div>
                        </ThemedScrollbars>
                        <DesktopWrapper>
                            <Article />
                        </DesktopWrapper>
                    </div>
                )}
            </section>
        );
    }
}

export default connect(({ client }) => ({
    is_switching: client.is_switching,
    email_address: client.email_address,
}))(TwoFactorAuthentication);
