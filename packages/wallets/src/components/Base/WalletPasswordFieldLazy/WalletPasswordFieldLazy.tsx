import React, { lazy, Suspense } from 'react';
import { Loader } from '@deriv-com/ui';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';

export interface WalletPasswordFieldProps extends WalletTextFieldProps {
    mt5Policy?: boolean; // This prop is used to utilize the new password validation for MT5.
    password: string;
    passwordError?: boolean;
    serverErrorMessage?: string;
    shouldDisablePasswordMeter?: boolean;
}

const WalletPasswordFieldLazyContainer = lazy(
    () => import('../WalletPasswordField/WalletPasswordField')
) as React.FC<WalletPasswordFieldProps>;

const WalletPasswordFieldLazy: React.FC<WalletPasswordFieldProps> = props => (
    <Suspense fallback={<Loader isFullScreen={false} />}>
        <WalletPasswordFieldLazyContainer {...props} />
    </Suspense>
);

export default WalletPasswordFieldLazy;
