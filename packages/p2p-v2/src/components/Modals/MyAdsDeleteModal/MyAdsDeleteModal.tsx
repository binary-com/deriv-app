import React, { memo } from 'react';
import { useDevice } from '@/hooks';
import { p2p } from '@deriv/api-v2';
import { Button, Modal, Text } from '@deriv-com/ui';
import './MyAdsDeleteModal.scss';

type TMyAdsDeleteModalProps = {
    error?: string;
    id: string;
    isModalOpen: boolean;
    onClickDelete: () => void;
    onRequestClose: () => void;
};

const MyAdsDeleteModal = ({ error, id, isModalOpen, onClickDelete, onRequestClose }: TMyAdsDeleteModalProps) => {
    const { data: advertInfo, isLoading: isLoadingInfo } = p2p.advert.useGet({ id });
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

    const hasActiveOrders = advertInfo?.active_orders && advertInfo?.active_orders > 0;

    const getModalText = () => {
        if (hasActiveOrders && !error) {
            return 'You have open orders for this ad. Complete all open orders before deleting this ad.';
        } else if (error) {
            return error;
        }
        return 'You will NOT be able to restore it.';
    };

    const getModalFooter = () => {
        if (hasActiveOrders || error) {
            return (
                <Button onClick={onRequestClose} size='lg' textSize={textSize}>
                    Ok
                </Button>
            );
        }

        return (
            <div className='flex gap-[0.8rem]'>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onRequestClose}
                    size='lg'
                    textSize={textSize}
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button onClick={onClickDelete} size='lg' textSize={textSize}>
                    Delete
                </Button>
            </div>
        );
    };
    return (
        <>
            {!isLoadingInfo && (
                <Modal
                    ariaHideApp={false}
                    className='p2p-v2-my-ads-delete-modal'
                    isOpen={isModalOpen}
                    onRequestClose={onRequestClose}
                    shouldCloseOnOverlayClick={false}
                    testId='dt_p2p_v2_ads_delete_modal'
                >
                    <Modal.Header
                        className='p2p-v2-my-ads-delete-modal__header'
                        hideBorder
                        hideCloseIcon
                        onRequestClose={onRequestClose}
                    >
                        <Text weight='bold'>Do you want to delete this ad?</Text>
                    </Modal.Header>
                    <Modal.Body className='p2p-v2-my-ads-delete-modal__body'>
                        <Text color='prominent' size='sm'>
                            {getModalText()}
                        </Text>
                    </Modal.Body>
                    <Modal.Footer className='p2p-v2-my-ads-delete-modal__footer' hideBorder>
                        {getModalFooter()}
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default memo(MyAdsDeleteModal);
