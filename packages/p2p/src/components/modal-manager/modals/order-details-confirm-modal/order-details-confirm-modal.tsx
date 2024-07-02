import React from 'react';
import { Button, InlineMessage, Modal, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import FormError from 'Components/section-error';
import FileUploaderComponent from 'Components/file-uploader-component';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { TFile } from 'Types';
import { getErrorMessage, max_pot_file_size } from 'Utils/file-uploader';
import { removeTrailingZeros, roundOffDecimal, setDecimalPlaces } from 'Utils/format-value';
import { getInlineTextSize } from 'Utils/responsive';

type TDocumentFile = {
    files: TFile[];
    error_message: string | null;
};

const OrderDetailsConfirmModal = () => {
    const { isDesktop } = useDevice();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { order_details_store, order_store, sendbird_store } = useStores();
    const { error_message } = order_details_store;
    const { confirmOrderRequest, order_information } = order_store;
    const { sendFile } = sendbird_store;
    const { amount_display, local_currency, other_user_details, rate, id } = order_information ?? {};
    const [document_file, setDocumentFile] = React.useState<TDocumentFile>({ files: [], error_message: null });

    const handleAcceptedFiles = (files: TFile[]) => {
        if (files.length > 0) {
            setDocumentFile({ files, error_message: null });
        }
    };

    const removeFile = () => {
        setDocumentFile({ files: [], error_message: null });
    };

    const handleRejectedFiles = (files: TFile[]) => {
        setDocumentFile({ files, error_message: getErrorMessage(files) });
    };

    const display_payment_amount = removeTrailingZeros(
        formatMoney(local_currency, amount_display * Number(roundOffDecimal(rate, setDecimalPlaces(rate, 6))), true)
    );

    return (
        <React.Fragment>
            <Modal
                className='order-details-confirm-modal'
                is_open={is_modal_open}
                toggleModal={() => hideModal()}
                renderTitle={() => (
                    <Text
                        color='prominent'
                        line-height={isDesktop ? 'xxl' : 'xl'}
                        size={isDesktop ? 's' : 'xs'}
                        weight='bold'
                    >
                        <Localize i18n_default_text='Payment confirmation' />
                    </Text>
                )}
                width='44rem'
            >
                <Modal.Body className='order-details-confirm-modal__body'>
                    <Text color='general' line-height='xl' size={isDesktop ? 'xs' : 'xxs'}>
                        <Localize
                            i18n_default_text="Please make sure that you've paid {{amount}} {{currency}} to {{other_user_name}}, and upload the receipt as proof of your payment"
                            values={{
                                amount: display_payment_amount,
                                currency: local_currency,
                                other_user_name: other_user_details.name,
                            }}
                        />
                    </Text>
                    <Text
                        color='less-prominent'
                        line-height='xl'
                        size={isDesktop ? 'xs' : 'xxs'}
                        as='div'
                        className='order-details-confirm-modal__file_format'
                    >
                        <Localize i18n_default_text='We accept JPG, PDF, or PNG (up to 5MB).' />
                    </Text>
                    <div className='order-details-confirm-modal__inline-message'>
                        <InlineMessage
                            message={localize(
                                'Sending forged documents will result in an immediate and permanent ban.'
                            )}
                            size={getInlineTextSize('sm', 'xs')}
                        />
                    </div>
                    <FileUploaderComponent
                        accept='image/png, image/jpeg, image/jpg, application/pdf'
                        hover_message={localize('Upload receipt here')}
                        max_size={max_pot_file_size}
                        onClickClose={removeFile}
                        onDropAccepted={handleAcceptedFiles}
                        onDropRejected={handleRejectedFiles}
                        upload_message={localize('Upload receipt here')}
                        validation_error_message={document_file.error_message}
                        value={document_file.files}
                    />
                </Modal.Body>
                <Modal.Footer className='order-details-confirm-modal__footer'>
                    {error_message && <FormError message={error_message} />}
                    <Button.Group>
                        <Button secondary type='button' onClick={hideModal} large>
                            <Localize i18n_default_text='Go Back' />
                        </Button>
                        <Button
                            is_disabled={document_file.files?.length === 0 || !!document_file.error_message}
                            primary
                            large
                            onClick={() => {
                                sendFile(document_file.files[0]);
                                hideModal();
                                confirmOrderRequest(id, true);
                            }}
                        >
                            <Localize i18n_default_text='Confirm' />
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(OrderDetailsConfirmModal);
