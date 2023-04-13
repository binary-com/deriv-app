// TODO: Once everything is merged place this in main component at the last step
import React from 'react';
import {
    Button,
    Checkbox,
    Modal,
    DesktopWrapper,
    MobileWrapper,
    MobileDialog,
    Div100vhContainer,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import ReadyToUpgradeForm from './ready-to-upgrade-form';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react-lite';

const ReadyToUpdateWallets = () => {
    const [is_disabled, setIsDisabled] = React.useState(false);

    const { client, traders_hub } = useStore();
    const { is_eu } = client;
    const { show_wallet_consent_popup, setShouldShowWalletConsentPopup } = traders_hub;

    const toggleModal = () => {
        setShouldShowWalletConsentPopup(!show_wallet_consent_popup);
    };

    const toggleCheckbox = () => {
        setIsDisabled(!is_disabled);
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    is_open={show_wallet_consent_popup}
                    title=' '
                    width='1200px'
                    height='734px'
                    toggleModal={toggleModal}
                >
                    <Modal.Body className='wallet-wrapper'>
                        <div className='wallet-wrapper--body'>
                            <ReadyToUpgradeForm is_eu={is_eu} />
                            <Checkbox
                                onChange={toggleCheckbox}
                                className='wallet-wrapper--checkbox'
                                label={localize('I understand and agree to upgrade to Wallets.')}
                            />
                        </div>
                    </Modal.Body>
                    {/* TODO: Once merged with the main component the button will not be needed as it will be handled on the main component */}
                    <Modal.Footer has_separator>
                        <Button
                            secondary
                            text={localize('Back')}
                            large
                            onClick={() => setShouldShowWalletConsentPopup(false)}
                        />
                        <Button
                            primary
                            text={localize('Upgrade to Wallets')}
                            large
                            onClick={() => setShouldShowWalletConsentPopup(false)}
                            is_disabled={!is_disabled}
                        />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    wrapper_classname='wallet-wrapper'
                    visible={show_wallet_consent_popup}
                    has_full_height
                    onClose={() => setShouldShowWalletConsentPopup(false)}
                >
                    <Div100vhContainer className='wallet-wrapper--body' height_offset='15rem'>
                        <ReadyToUpgradeForm is_eu={is_eu} />
                        <Checkbox
                            onChange={toggleCheckbox}
                            className='wallet-wrapper--checkbox'
                            label={localize('I understand and agree to upgrade to Wallets.')}
                        />
                    </Div100vhContainer>
                    {/* TODO: Once merged with the main component the button will not be needed as it will be handled on the main component */}
                    <div className='wallet-wrapper--footer'>
                        <Button
                            secondary
                            text={localize('Back')}
                            large
                            className='wallet-wrapper--footer__btn'
                            onClick={() => setShouldShowWalletConsentPopup(false)}
                        />
                        <Button
                            primary
                            text={localize('Upgrade to Wallets')}
                            large
                            className='wallet-wrapper--footer__btn'
                            is_disabled={!is_disabled}
                            onClick={() => setShouldShowWalletConsentPopup(false)}
                        />
                    </div>
                </MobileDialog>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(ReadyToUpdateWallets);
