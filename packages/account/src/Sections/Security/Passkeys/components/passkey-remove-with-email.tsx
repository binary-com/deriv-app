import { ChangeEvent, useEffect, useState } from 'react';
import { Icon } from '@deriv/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import { DerivLightIcEmailSentPasskeyIcon } from '@deriv/quill-icons';
import { InputGroupButton } from '@deriv-com/quill-ui';
import { observer, useStore } from '@deriv/stores';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import { ResendCodeButton } from './resend-code-button';

export const PasskeyRemoveWithEmail = observer(
    ({ onBackButtonClick, onPrimaryButtonClick }: TPasskeysButtonOnClicks) => {
        const { client } = useStore();
        const { email_address } = client;
        const { localize } = useTranslations();
        const [code, setCode] = useState('');
        const [error, setError] = useState<string>('');

        const getVerificationCodeToEmail = () => {
            // API call for email verification code
        };

        useEffect(() => {
            getVerificationCodeToEmail();
        }, []);

        const onSubmitValues = () => {
            onPrimaryButtonClick?.(code);
        };

        const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
            setCode(e.target.value);
        };

        const onSetDummyError = () => {
            setError('show here error message');
        };

        const onClearError = () => {
            setError('');
        };

        return (
            <div className='passkeys'>
                <Icon
                    data_testid='dt_learn_more_back_button'
                    icon='IcBackButton'
                    onClick={onBackButtonClick}
                    className='passkeys-status__description-back-button'
                />
                <PasskeysStatusLayout
                    icon={<DerivLightIcEmailSentPasskeyIcon height='96px' width='96px' />}
                    title={
                        <Localize
                            i18n_default_text='We’ve sent a verification code to {{email_address}}'
                            values={{ email_address }}
                        />
                    }
                >
                    <InputGroupButton
                        buttonLabel={localize('Verify')}
                        label={code.length === 6 ? localize('Verification code') : localize('Enter 6-digit code')}
                        placeholder={localize('Enter 6-digit code')}
                        inputMode='numeric'
                        buttonColor='coral'
                        type='number'
                        maxLength={6}
                        onChange={handleOnChange}
                        buttonDisabled={code.length < 6}
                        required
                        value={code}
                        buttonCallback={onSubmitValues}
                        className='passkeys-status__description-code-input'
                        size={16}
                        status={error ? 'error' : undefined}
                        message={error}
                    />
                    <ResendCodeButton onResend={getVerificationCodeToEmail} initialDelay={10} />
                    <button onClick={onSetDummyError}>set error</button>
                    <button onClick={onClearError}>clear error</button>
                </PasskeysStatusLayout>
            </div>
        );
    }
);
