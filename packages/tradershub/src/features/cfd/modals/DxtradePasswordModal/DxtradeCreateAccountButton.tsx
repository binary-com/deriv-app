import React, { useEffect } from 'react';
import { useQueryParams } from '@/hooks';
import { Button } from '@deriv-com/ui';
import useDxtradeAccountHandler from '../../../../hooks/useDxtradeAccountHandler';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
};

const DxtradeCreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { createDxtradeAccountLoading, createOtherCFDAccountSuccess, status, handleSubmit } =
        useDxtradeAccountHandler();

    const { openModal } = useQueryParams();

    const isDisabled = !password || createDxtradeAccountLoading;

    useEffect(() => {
        if (status === 'success' || createOtherCFDAccountSuccess) {
            openModal('DxtradeSuccessModal');
        }
    }, [openModal, status, createOtherCFDAccountSuccess]);

    return (
        <Button disabled={isDisabled} isLoading={createDxtradeAccountLoading} onClick={() => handleSubmit(password)}>
            {buttonText}
        </Button>
    );
};

export default DxtradeCreateAccountButton;
