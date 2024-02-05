import React from 'react';
import { Provider } from '@deriv/library';
import { Button } from '@deriv-com/ui';
import useMT5AccountHandler from '../../../../hooks/useMT5AccountHandler';
import { validPassword } from '../../../../utils/password';
import { MarketType, TTM5FilterLandingCompany } from '../../constants';

type TCreateAccountButtonProps = {
    buttonText: string;
    password: string;
};

const MT5CreateAccountButton = ({ buttonText, password }: TCreateAccountButtonProps) => {
    const { getCFDState } = Provider.useCFDContext();
    const marketType = getCFDState('marketType') ?? MarketType.ALL;
    const selectedJurisdiction = getCFDState('selectedJurisdiction') as TTM5FilterLandingCompany;
    const { createMT5AccountLoading, handleSubmit, tradingPlatformPasswordChangeLoading } = useMT5AccountHandler({
        marketType,
        selectedJurisdiction,
    });
    const isLoading = tradingPlatformPasswordChangeLoading || createMT5AccountLoading;
    const isDisabled = !password || isLoading || !validPassword(password);

    return (
        <Button
            disabled={isDisabled}
            isFullWidth
            isLoading={isLoading}
            onClick={() => handleSubmit(password)}
            size='lg'
        >
            {buttonText}
        </Button>
    );
};

export default MT5CreateAccountButton;
