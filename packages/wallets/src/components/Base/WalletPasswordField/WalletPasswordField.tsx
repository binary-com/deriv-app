import React, { useMemo, useState } from 'react';
import { zxcvbn } from '@zxcvbn-ts/core';
import { WalletTextField } from '../WalletTextField';
import { WalletTextFieldProps } from '../WalletTextField/WalletTextField';
import PasswordMeter, { PasswordMeterProps } from './PasswordMeter';
import PasswordViewerIcon from './PasswordViewerIcon';
import './WalletPasswordField.scss';

type StrengthMessage = Record<1 | 2 | 3 | 4, string>;

interface WalletPasswordFieldProps extends WalletTextFieldProps, PasswordMeterProps {
    messageObj?: StrengthMessage;
    password: string;
    showPasswordMeter?: boolean;
}

const WalletPasswordField: React.FC<WalletPasswordFieldProps> = ({
    messageObj,
    password,
    showPasswordMeter = true,
    ...rest
}) => {
    const [viewPassword, setViewPassword] = useState(false);
    const hasMessage = !!messageObj;

    const passwordStrength = zxcvbn(password).score;
    const progressText = useMemo(() => {
        return messageObj ? messageObj[passwordStrength as keyof StrengthMessage] : '';
    }, [messageObj, passwordStrength]);

    return (
        <div className='wallets-password'>
            <WalletTextField
                helperMessage={progressText}
                inputClassName='wallets-password__input'
                renderRightIcon={() => (
                    <PasswordViewerIcon setViewPassword={setViewPassword} viewPassword={viewPassword} />
                )}
                showMessage={hasMessage}
                type={viewPassword ? 'text' : 'password'}
                value={password}
                {...rest}
            />
            {showPasswordMeter && <PasswordMeter strength={passwordStrength} />}
        </div>
    );
};

export default WalletPasswordField;
