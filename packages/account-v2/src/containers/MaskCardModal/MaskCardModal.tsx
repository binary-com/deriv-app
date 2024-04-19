import React from 'react';
import { Modal, Text } from '@deriv-com/ui';
import SampleCreditCard from '../../assets/manual-upload/ic-poi-passport.svg';

type TMaskCardModal = {
    isOpen: boolean;
    onClose: () => void;
};

export const MaskCardModal = ({ isOpen, onClose }: TMaskCardModal) => {
    return (
        <Modal className='w-[440px]' isOpen={isOpen}>
            <Modal.Header onRequestClose={onClose}>
                <Text as='h3' size='md' weight='bold'>
                    How to mask your card?
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Text as='p' className='pt-20 pb-24 px-24' size='sm'>
                    Black out digits 7 to 12 of the card number that’s shown on the front of your debit/credit card.⁤
                </Text>
                {/*  TODO: Use actual icon once available in Quill */}
                <SampleCreditCard />
            </Modal.Body>
        </Modal>
    );
};
