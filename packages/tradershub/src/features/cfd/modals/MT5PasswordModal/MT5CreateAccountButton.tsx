import React, { useEffect } from 'react';
import { useQueryParams } from '@/hooks';
import { Button } from '@deriv-com/ui';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
};

const MT5CreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const {
        createMT5AccountLoading,
        doesNotMeetPasswordPolicy,
        handleSubmit,
        tradingPlatformPasswordChangeLoading,
        createMT5AccountStatus,
    } = useMT5AccountHandler();
    const { openModal } = useQueryParams();

    const isLoading = tradingPlatformPasswordChangeLoading || createMT5AccountLoading;
    const isDisabled = !password || isLoading;

    useEffect(() => {
        if (doesNotMeetPasswordPolicy) {
            return openModal('MT5ChangePasswordModal');
        }

        if (createMT5AccountStatus === 'success') {
            openModal('MT5SuccessModal');
        }
    }, [doesNotMeetPasswordPolicy, createMT5AccountStatus, openModal]);

    return (
        <Button disabled={isDisabled} isLoading={isLoading} onClick={() => handleSubmit(password)}>
            {buttonText}
        </Button>
    );
};

export default MT5CreateAccountButton;
