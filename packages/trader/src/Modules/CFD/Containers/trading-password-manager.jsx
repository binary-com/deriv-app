import React from 'react';
import PropTypes from 'prop-types';
import { Text, Button, Icon, MultiStep, SendEmailTemplate } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCFDPlatformLabel, CFD_PLATFORMS, WS } from '@deriv/shared';
import ChangePasswordConfirmation from './cfd-change-password-confirmation.jsx';

const ChangePassword = ({ platform, onConfirm }) => (
    <div className='cfd-change-password'>
        <Icon
            className='cfd-change-password__icon'
            icon={platform === CFD_PLATFORMS.MT5 ? 'IcMt5OnePassword' : 'IcDxtradeOnePassword'}
            width='122'
            height='108'
        />
        <Text as='p' align='center' size='s' weight='bold'>
            <Localize
                i18n_default_text='{{platform}} password'
                values={{
                    platform: getCFDPlatformLabel(platform),
                }}
            />
        </Text>
        <Text as='p' align='center' className='cfd-change-password__description' size='xs'>
            {platform === CFD_PLATFORMS.MT5 ? (
                <Localize i18n_default_text='Use this password to log in to your DMT5 accounts on the desktop, web, and mobile apps.' />
            ) : (
                <Localize i18n_default_text='Use this password to log in to your Deriv X accounts on the web and mobile apps.' />
            )}
        </Text>
        <Button
            className='dc-btn dc-btn--primary dc-btn__large dc-modal__container_cfd-reset-password-modal__button'
            onClick={onConfirm}
        >
            <Text size='xs' weight='bold' color='colored-background'>
                <Localize
                    i18n_default_text='Change {{platform}} password'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                    }}
                />
            </Text>
        </Button>
    </div>
);

ChangePassword.propTypes = {
    onConfirm: PropTypes.func,
    platform: PropTypes.string,
};

const PasswordReset = ({ email, platform }) => {
    const onClickSendEmail = React.useCallback(() => {
        const redirect_to = platform === CFD_PLATFORMS.MT5 ? CFD_PLATFORMS.MT5 : CFD_PLATFORMS.DERIVX;
        WS.verifyEmail(email, 'trading_platform_password_reset', {
            url_parameters: {
                platform,
                redirect_to,
            },
        });
    }, [email, platform]);

    React.useEffect(() => {
        onClickSendEmail();
    }, [onClickSendEmail]);

    return (
        <SendEmailTemplate
            className='sent-email'
            subtitle={localize('Please click on the link in the email to change your {{platform}} password.', {
                platform: getCFDPlatformLabel(platform),
            })}
            lbl_no_receive={localize("Didn't receive the email?")}
            txt_resend={localize('Resend email')}
            onClickSendEmail={onClickSendEmail}
        />
    );
};

PasswordReset.propTypes = {
    email: PropTypes.string,
    platform: PropTypes.string,
};

const TradingPasswordManager = ({ platform, email }) => {
    const multi_step_ref = React.useRef();

    const steps = [
        {
            component: <ChangePassword platform={platform} onConfirm={() => multi_step_ref.current?.goNextStep()} />,
        },
        {
            component: (
                <ChangePasswordConfirmation
                    platform={platform}
                    onConfirm={() => multi_step_ref.current?.goNextStep()}
                    onCancel={() => multi_step_ref.current?.goPrevStep()}
                />
            ),
        },
        {
            component: <PasswordReset platform={platform} email={email} />,
        },
    ];

    return (
        <div className='cfd-trading-password'>
            <MultiStep ref={multi_step_ref} steps={steps} />
        </div>
    );
};

TradingPasswordManager.propTypes = {
    platform: PropTypes.string,
    email: PropTypes.string,
};

export default TradingPasswordManager;
