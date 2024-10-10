import React from 'react';
import { useHistory } from 'react-router-dom';
import { ActionScreen, Button } from '@deriv-com/ui';
import { ModalWrapper, WalletButtonGroup } from '../../../../components';
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
                <ActionScreen
                    actionButtons={
                        <WalletButtonGroup>
                            <Button onClick={() => hide()} size='lg' variant='outlined'>
                                Maybe later
                            </Button>
                            <Button onClick={onClickTransferNow} size='lg' variant='contained'>
                                Transfer now
                            </Button>
                        </WalletButtonGroup>
                    }
                    description='Congratulations, you have successfully created your real Deriv cTrader account. To start trading,transfer funds from your Deriv account into this account.'
                    descriptionSize='sm'
                    icon={<SuccessIcon />}
                    title='Success!'
                />
            </div>
        </ModalWrapper>
    );
};

export default CTraderAddAccountSuccessModal;
