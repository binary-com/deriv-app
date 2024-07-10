import React from 'react';
import QRCodeSVG from 'qrcode.react';
import { ThemedScrollbars, Text, Timeline, Loading, Clipboard } from '@deriv-app/components';
import TwoFactorAuthenticationArticle from './two-factor-authentication-article';
import { Localize, localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import DigitForm from './digit-form';

type TTwoFactorDisabled = {
    secret_key: string;
    qr_secret_key: string;
    is_qr_loading: boolean;
};

const TwoFactorDisabled = ({ secret_key, qr_secret_key, is_qr_loading }: TTwoFactorDisabled) => {
    const { isDesktop } = useDevice();
    return (
        <React.Fragment>
            <ThemedScrollbars is_bypassed={!isDesktop} autohide className='two-factor__scrollbars'>
                {!isDesktop && <TwoFactorAuthenticationArticle />}
                <Text as='h2' color='prominent' weight='bold' className='two-factor__title'>
                    <Localize i18n_default_text='How to set up 2FA for your Deriv account' />
                </Text>
                <Timeline className='two-factor__timeline' line_height='xs'>
                    <Timeline.Item
                        item_title={
                            <Localize
                                i18n_default_text='Scan the QR code below with your 2FA app. We recommend <0>Authy</0> or <1>Google Authenticator</1>.'
                                components={[
                                    <a
                                        className='link two-factor__link'
                                        href='https://authy.com/'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        key={0}
                                        aria-label={localize('Authy')}
                                    />,
                                    <a
                                        className='link two-factor__link'
                                        href='https://github.com/google/google-authenticator/wiki#implementations'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        key={1}
                                        aria-label={localize('Google Authenticator')}
                                    />,
                                ]}
                            />
                        }
                    >
                        <div className='two-factor__qr'>
                            {is_qr_loading ? (
                                <Loading is_fullscreen={false} />
                            ) : (
                                <React.Fragment>
                                    {qr_secret_key && (
                                        <div className='two-factor__qr--wrapper'>
                                            <QRCodeSVG value={qr_secret_key} />
                                        </div>
                                    )}

                                    {secret_key && (
                                        <React.Fragment>
                                            <Text as='h4' size='xs' align='center' className='two-factor__qr--message'>
                                                <Localize i18n_default_text='If you are unable to scan the QR code, you can manually enter this code instead:' />
                                            </Text>
                                            <div className='two-factor__qr--code' data-testid='dt_2fa_clipboard'>
                                                <Text size='xs'>{secret_key}</Text>
                                                <Clipboard
                                                    text_copy={secret_key}
                                                    info_message={localize('Click here to copy key')}
                                                    success_message={localize('Key copied!')}
                                                    className='two-factor__qr--clipboard'
                                                />
                                            </div>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </Timeline.Item>
                    <Timeline.Item
                        item_title={
                            <Localize i18n_default_text='Enter the authentication code generated by your 2FA app:' />
                        }
                    >
                        <DigitForm />
                    </Timeline.Item>
                </Timeline>
            </ThemedScrollbars>
            {isDesktop && <TwoFactorAuthenticationArticle />}
        </React.Fragment>
    );
};

export default TwoFactorDisabled;
