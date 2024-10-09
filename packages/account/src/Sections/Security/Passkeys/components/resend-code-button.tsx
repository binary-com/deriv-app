import { useCallback } from 'react';
import { useTimeout } from '@deriv/hooks';
import { Button } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';

type TResendCodeButton = {
    initialDelay: number;
    onResend: () => void;
};

export const ResendCodeButton = ({ initialDelay, onResend }: TResendCodeButton) => {
    const { isTimeout, timeRemaining } = useTimeout(initialDelay);

    const handleClick = useCallback(() => {
        if (!isTimeout) return;
        onResend();
    }, [isTimeout, onResend]);

    return (
        <Button
            className='passkeys-status__description-resend-code-button'
            variant='tertiary'
            onClick={handleClick}
            disabled={!isTimeout}
            type='button'
            color='black'
            label={
                isTimeout ? (
                    <Localize i18n_default_text='Resend Code' />
                ) : (
                    <Localize i18n_default_text='Resend Code in {{timeRemaining}}s' values={{ timeRemaining }} />
                )
            }
        />
    );
};
