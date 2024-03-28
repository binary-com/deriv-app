import React, { ChangeEvent, Fragment } from 'react';
import { useQueryParams, useRegulationFlags } from '@/hooks';
import { useCFDContext } from '@/providers';
import { Category, CFDPlatforms, MarketType, MarketTypeDetails, PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Modal, PasswordInput, Text } from '@deriv-com/ui';
import DxtradePasswordFooter from '../../modals/DxtradePasswordModal/DxtradePasswordFooter';
import MT5PasswordFooter from '../../modals/MT5PasswordModal/MT5PasswordFooter';

type TEnterPasswordProps = {
    isLoading?: boolean;
    onPasswordChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    password: string;
    passwordError?: boolean;
};

/**
 * Component to display the enter password screen
 * @param {Function} onPasswordChange - callback to handle password change
 * @param {string} password - password value
 */

const EnterPassword = ({ onPasswordChange, password }: TEnterPasswordProps) => {
    const { isEU } = useRegulationFlags();
    const { cfdState } = useCFDContext();
    const { data } = useActiveTradingAccount();
    const { closeModal } = useQueryParams();

    const marketTypeDetails = MarketTypeDetails(isEU);
    const { marketType = MarketType.ALL, platform = CFDPlatforms.MT5 } = cfdState;
    const { title } = PlatformDetails[platform];
    const accountType = data?.is_virtual ? Category.DEMO : Category.REAL;
    const marketTypeTitle =
        platform === PlatformDetails.dxtrade.platform ? accountType : marketTypeDetails[marketType]?.title;

    return (
        <Fragment>
            <Modal.Header onRequestClose={closeModal}>
                <Text weight='bold'>{`Enter your ${title} password`}</Text>
            </Modal.Header>
            <Modal.Body>
                <div className='flex flex-col gap-16 lg:w-[400px] lg:gap-8 lg:pt-24 lg:px-24'>
                    <Text size='sm'>
                        Enter your {title} password to add a {title} {marketTypeTitle} account.
                    </Text>
                    <PasswordInput
                        isFullWidth
                        label={`${title} password`}
                        onChange={onPasswordChange}
                        value={password}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                {platform === CFDPlatforms.MT5 ? (
                    <MT5PasswordFooter password={password} />
                ) : (
                    <DxtradePasswordFooter password={password} />
                )}
            </Modal.Footer>
        </Fragment>
    );
};

export default EnterPassword;
