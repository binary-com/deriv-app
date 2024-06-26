import { Div100vhContainer, InlineMessage, Modal, PageOverlay, Text, UILoader } from '@deriv/components';
import { getPlatformSettings } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import React from 'react';
import AdditionalKycInfoForm from './additional-kyc-info-form';

type TAdditionalKycInfoFormWithHintBox = {
    error?: unknown;
    setError?: React.Dispatch<React.SetStateAction<unknown>>;
};

const AdditionalKycInfoFormWithHintBox = ({ error, setError }: TAdditionalKycInfoFormWithHintBox) => {
    return (
        <React.Fragment>
            {!!error && (
                <InlineMessage
                    size='sm'
                    message={
                        error &&
                        typeof error === 'object' &&
                        'message' in error &&
                        typeof error.message === 'string' &&
                        error.message
                    }
                    type='error'
                />
            )}
            <AdditionalKycInfoForm setError={setError} />
        </React.Fragment>
    );
};

export const AdditionalKycInfoModal = observer(() => {
    const {
        ui: { is_additional_kyc_info_modal_open: is_open, toggleAdditionalKycInfoModal },
    } = useStore();
    const { isDesktop } = useDevice();
    const [error, setError] = React.useState<unknown>('');

    const toggleModal = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        // if e.target is anchor tag, don't close modal for link click within modal
        const target = e?.target as HTMLElement;
        if (target.tagName === 'A') e?.stopPropagation();
        toggleAdditionalKycInfoModal();
    };

    const mt5_platform_settings = getPlatformSettings('mt5');

    const ModalTitle = () => (
        <Localize
            i18n_default_text='Additional information required for {{platform}} account(s)'
            values={{
                platform: mt5_platform_settings.name,
            }}
        />
    );

    return (
        <React.Suspense fallback={<UILoader />}>
            <div className='additional-kyc-info-modal__container'>
                {isDesktop ? (
                    <Modal
                        has_close_icon
                        is_open={is_open}
                        title={<ModalTitle />}
                        toggleModal={toggleModal}
                        className='additional-kyc-info'
                        width='90.4rem'
                        height={error ? '54.4rem' : '49.6rem'}
                    >
                        <Modal.Body className='additional-kyc-info-modal__form'>
                            <AdditionalKycInfoFormWithHintBox setError={setError} error={error} />
                        </Modal.Body>
                    </Modal>
                ) : (
                    <PageOverlay
                        is_open
                        portal_id='deriv_app'
                        header={
                            <Text as='p' size='xs' weight='bold'>
                                <ModalTitle />
                            </Text>
                        }
                        onClickClose={toggleAdditionalKycInfoModal}
                        header_classname='additional-kyc-info-modal__portal-header'
                    >
                        <Div100vhContainer className='additional-kyc-info-modal__form' height_offset='100px'>
                            <AdditionalKycInfoFormWithHintBox />
                        </Div100vhContainer>
                    </PageOverlay>
                )}
            </div>
        </React.Suspense>
    );
});

AdditionalKycInfoModal.displayName = 'AdditionalKycInfoModal';
