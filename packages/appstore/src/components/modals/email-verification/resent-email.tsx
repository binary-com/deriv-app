import React, { useEffect, useState } from 'react';
import { Button } from '@deriv/components';

type TResendEmail = {
    disabled: boolean;
    onClick: () => void;
};
const ResendEmail = ({ disabled, onClick }: TResendEmail) => {
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isCountingDown, setIsCountingDown] = useState(false);
    useEffect(() => {
        if (isCountingDown && countdown && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setIsCountingDown(false);
        }
    }, [countdown, isCountingDown]);

    const handleClick = () => {
        setCountdown(59);
        setIsCountingDown(true);
        onClick();
    };
    return (
        <Button
            is_disabled={disabled || isCountingDown}
            large
            primary
            type='button'
            className='email-verification-modal_mobile--submit-btn'
            onClick={handleClick}
        >
            {isCountingDown && countdown !== null ? `Resend email in ${countdown}s` : 'Resend email'}
        </Button>
    );
};

export default ResendEmail;
