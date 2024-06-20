import React from 'react';
import { useHistory } from 'react-router-dom';
import { ModalWrapper, WalletButton, WalletButtonGroup, WalletsActionScreen } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import SuccessIcon from './SuccessIcon';
import './CTraderAddAccountSuccessModal.scss';

const CTraderAddAccountSuccessModal = () => {
    const history = useHistory();
    const { hide } = useModal();
    const onClickTransferNow = () => {
        hide();
        history.push('/wallet/withdrawal');
    };
    return (
        <ModalWrapper>
            <div className='wallets-ctrader-account-add-success-modal'>
                <WalletsActionScreen
                    description='Congratulations, you have successfully created your real Deriv cTrader account. To start trading,transfer funds from your Deriv account into this account.'
                    descriptionSize='sm'
                    icon={<SuccessIcon />}
                    renderButtons={() => (
                        <WalletButtonGroup>
                            <WalletButton onClick={() => hide()} size='lg' variant='outlined'>
                                Maybe later
                            </WalletButton>
                            <WalletButton onClick={onClickTransferNow} size='lg' variant='contained'>
                                Transfer now
                            </WalletButton>
                        </WalletButtonGroup>
                    )}
                    title='Success!'
                />
            </div>
        </ModalWrapper>
    );
};

export default CTraderAddAccountSuccessModal;
