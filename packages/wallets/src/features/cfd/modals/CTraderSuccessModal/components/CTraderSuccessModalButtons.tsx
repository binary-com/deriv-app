import React from 'react';
import { useHistory } from 'react-router-dom';
import { WalletButton, WalletButtonGroup } from '../../../../../components';
import useDevice from '../../../../../hooks/useDevice';
import { THooks } from '../../../../../types';

type TCTraderSuccessModalButtons = {
    createdAccount?: THooks.CreateOtherCFDAccount;
    hide: () => void;
    isDemo: boolean;
};

const CTraderSuccessModalButtons = ({ createdAccount, hide, isDemo }: TCTraderSuccessModalButtons) => {
    const history = useHistory();
    const { isMobile } = useDevice();

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <WalletButton isFullWidth onClick={hide} size={isMobile ? 'lg' : 'md'}>
                    OK
                </WalletButton>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <WalletButton onClick={hide} size={isMobile ? 'lg' : 'md'} variant='outlined'>
                Maybe later
            </WalletButton>
            <WalletButton
                onClick={() => {
                    hide();
                    history.push('/wallets/cashier/transfer', { toAccountLoginId: createdAccount?.account_id });
                }}
                size={isMobile ? 'lg' : 'md'}
            >
                Transfer funds
            </WalletButton>
        </WalletButtonGroup>
    );
};

export default CTraderSuccessModalButtons;
