import React, { ChangeEvent } from 'react';
import DxtradePasswordIcon from '@/assets/svgs/ic-derivx-password-updated.svg';
import MT5PasswordIcon from '@/assets/svgs/ic-mt5-password.svg';
import { useCFDContext } from '@/providers';
import { CFDPlatforms, PlatformDetails } from '@cfd/constants';
import { Modal, PasswordInput, Text } from '@deriv-com/ui';
import DxtradePasswordFooter from '../../modals/DxtradePasswordModal/DxtradePasswordFooter';
import MT5PasswordFooter from '../../modals/MT5PasswordModal/MT5PasswordFooter';

type TCreatePasswordProps = {
    onPasswordChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    password: string;
};

/**
 * Component to create a password for the platform
 * @param onPasswordChange
 * @param password
 */
const CreatePassword = ({ onPasswordChange, password }: TCreatePasswordProps) => {
    const { cfdState } = useCFDContext();

    const { platform = CFDPlatforms.MT5 } = cfdState;
    const { title } = PlatformDetails[platform];

    return (
        <React.Fragment>
            <Modal.Body className='lg:pt-24 lg:px-24 lg:space-y-16'>
                <div className='justify-center w-full lg:flex d-none lg:gap-8'>
                    {platform === CFDPlatforms.MT5 ? <MT5PasswordIcon /> : <DxtradePasswordIcon />}
                </div>

                <div className='flex flex-col items-center justify-center text-center lg:gap-8'>
                    <Text weight='bold'>Create a {title} password</Text>
                    <Text size='sm'>You can use this password for all your {title} accounts.</Text>
                </div>
                <PasswordInput isFullWidth label={`${title} password`} onChange={onPasswordChange} value={password} />
            </Modal.Body>
            <Modal.Footer className='flex justify-center' hideBorder>
                {platform === CFDPlatforms.DXTRADE ? (
                    <DxtradePasswordFooter password={password} />
                ) : (
                    <MT5PasswordFooter password={password} />
                )}
            </Modal.Footer>
        </React.Fragment>
    );
};

export default CreatePassword;
