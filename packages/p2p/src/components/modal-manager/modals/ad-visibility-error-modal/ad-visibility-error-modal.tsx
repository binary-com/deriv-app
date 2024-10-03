import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';
import { useStores } from 'Stores';

type TAdVisibilityErrorModalProps = {
    error_code: string;
};

type TModalContent = {
    title: string;
    body: JSX.Element;
};

const AdVisibilityErrorModal = ({ error_code }: TAdVisibilityErrorModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { my_ads_store } = useStores();
    const { advert_details } = my_ads_store;

    const getModalContent = (): TModalContent => {
        switch (error_code) {
            case api_error_codes.AD_EXCEEDS_BALANCE:
                return {
                    title: localize("Your ad isn't visible to others"),
                    body: (
                        <Localize
                            i18n_default_text='This could be because your account balance is insufficient, your ad amount exceeds your daily limit, or both. You can still see your ad on <0>My ads</0>.'
                            components={[<Text key={0} size='xs' weight='bold' />]}
                        />
                    ),
                };
            case api_error_codes.AD_EXCEEDS_DAILY_LIMIT:
                return {
                    title: localize('Your ad exceeds the daily limit'),
                    body: (
                        <Localize
                            i18n_default_text='Your ad is not listed on <0>Buy/Sell</0> because the amount exceeds your daily limit of {{limit}} {{currency}}.
                            <1 /><1 />You can still see your ad on <0>My ads</0>. If you’d like to increase your daily limit, please contact us via <2>live chat</2>.'
                            values={{
                                limit: advert_details?.max_order_amount_limit_display,
                                currency: advert_details?.account_currency,
                            }}
                            components={[
                                <Text key={0} size='xs' weight='bold' />,
                                <br key={1} />,
                                <a
                                    key={2}
                                    className='link link--orange'
                                    onClick={() => window.LiveChatWidget.call('maximize')}
                                />,
                            ]}
                        />
                    ),
                };
            default:
                return {
                    title: localize("Something's not right"),
                    body: <Localize i18n_default_text="Something's not right" />,
                };
        }
    };

    return (
        <Modal
            className='ad-visibility-error-modal'
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={getModalContent().title}
        >
            <Modal.Body>
                <Text as='p' color='prominent' size='xs'>
                    {getModalContent().body}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Ok')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AdVisibilityErrorModal);
