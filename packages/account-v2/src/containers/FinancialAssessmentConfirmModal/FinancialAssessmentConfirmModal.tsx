import React from 'react';
import { Button, Modal, Text } from '@deriv-com/ui';

type TFinancialAssessmentConfirmModal = {
    handleCancel: () => void;
    handleSubmit: () => void;
    isModalOpen: boolean;
};

export const FinancialAssessmentConfirmModal = ({
    handleCancel,
    handleSubmit,
    isModalOpen,
}: TFinancialAssessmentConfirmModal) => (
    <Modal className='md:w-[440px] sm:w-[312px]' isOpen={isModalOpen}>
        <Modal.Header className='border-b-0'>
            <Text size='md' weight='bold'>
                Appropriateness Test, WARNING:
            </Text>
        </Modal.Header>
        <Modal.Body className='flex flex-col p-24'>
            <Text as='p' size='sm'>
                In providing our services to you, we are required to obtain information from you in order to assess
                whether a given product or service is appropriate for you (that is, whether you possess the experience
                and knowledge to understand the risks involved).
                <br />
                <br />
                On the basis of the information provided in relation to your knowledge and experience, we consider that
                the investments available via this website are not appropriate for you.
                <br />
                <br />
                By clicking Accept below and proceeding with the Account Opening you should note that you may be
                exposing yourself to risks (which may be significant, including the risk of loss of the entire sum
                invested) that you may not have the knowledge and experience to properly assess or mitigate.
            </Text>
        </Modal.Body>
        <Modal.Footer className='flex justify-end mt-24 gap-x-16' hideBorder>
            <Button color='black' onClick={handleCancel} rounded='sm' size='md' type='button' variant='outlined'>
                Decline
            </Button>
            <Button color='primary' onClick={handleSubmit} rounded='sm' size='md' type='button'>
                Accept
            </Button>
        </Modal.Footer>
    </Modal>
);
