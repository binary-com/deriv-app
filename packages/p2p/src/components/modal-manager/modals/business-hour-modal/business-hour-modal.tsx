import React from 'react';
import { MobileFullPageModal, Modal, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { Localize } from 'Components/i18next';
import BusinessHourModalEdit from './business-hour-modal-edit';
import BusinessHourModalFooter from './business-hour-modal-footer';
import BusinessHourModalMain from './business-hour-modal-main';
import './business-hour-modal.scss';

// TODO: delete these hardcoded data when implementing BE
const business_days = [
    {
        day: <Localize i18n_default_text='Monday' />,
        short_day: <Localize i18n_default_text='M' />,
        time: <Localize i18n_default_text='Open 24 hours' />,
        start_time: null,
        end_time: null,
        value: 'monday',
    },
    {
        day: <Localize i18n_default_text='Tuesday' />,
        short_day: <Localize i18n_default_text='T' />,
        time: <Localize i18n_default_text='Closed' />,
        value: 'tuesday',
    },
    {
        day: <Localize i18n_default_text='Wednesday' />,
        short_day: <Localize i18n_default_text='W' />,
        time: <Localize i18n_default_text='10:30 am - 11:30 pm' />,
        start_time: '10:30 am',
        end_time: '11:30 pm',
        value: 'wednesday',
    },
    {
        day: <Localize i18n_default_text='Thursday' />,
        short_day: <Localize i18n_default_text='T' />,
        time: <Localize i18n_default_text='10:30 am - 11:30 pm' />,
        start_time: '10:30 am',
        end_time: '11:30 pm',
        value: 'thursday',
    },
    {
        day: <Localize i18n_default_text='Friday' />,
        short_day: <Localize i18n_default_text='F' />,
        time: <Localize i18n_default_text='9:00 am - 9:00 pm' />,
        start_time: '09:00 am',
        end_time: '09:00 pm',
        value: 'friday',
    },
    {
        day: <Localize i18n_default_text='Saturday' />,
        short_day: <Localize i18n_default_text='S' />,
        time: <Localize i18n_default_text='Open 24 hours' />,
        start_time: null,
        end_time: null,
        value: 'saturday',
    },
    {
        day: <Localize i18n_default_text='Sunday' />,
        short_day: <Localize i18n_default_text='S' />,
        time: <Localize i18n_default_text='Closed' />,
        value: 'sunday',
    },
];

const HeaderRenderer = ({ show_edit }: { show_edit: boolean }) => (
    <Text weight='bold'>
        {show_edit ? (
            <Localize i18n_default_text='Edit business hour' />
        ) : (
            <Localize i18n_default_text='Business hour' />
        )}
    </Text>
);

const BusinessHourModal = () => {
    const [show_edit, setShowEdit] = React.useState(false);
    const { hideModal, is_modal_open } = useModalManagerContext();
    const {
        ui: { is_mobile },
    } = useStore();

    if (is_mobile) {
        return (
            <MobileFullPageModal
                body_className='business-hour-modal__body'
                is_modal_open={is_modal_open}
                renderPageFooterChildren={() => (
                    <BusinessHourModalFooter setShowEdit={setShowEdit} show_edit={show_edit} />
                )}
                renderPageHeaderElement={<HeaderRenderer show_edit={show_edit} />}
                pageHeaderReturnFn={() => (show_edit ? setShowEdit(false) : hideModal())}
            >
                {show_edit ? (
                    <BusinessHourModalEdit data={business_days} />
                ) : (
                    <BusinessHourModalMain business_days={business_days} />
                )}
            </MobileFullPageModal>
        );
    }

    return (
        <Modal
            className='business-hour-modal'
            is_open={is_modal_open}
            title={<HeaderRenderer show_edit={show_edit} />}
            toggleModal={hideModal}
            width='44rem'
        >
            <Modal.Body className='business-hour-modal__body'>
                {show_edit ? (
                    <BusinessHourModalEdit data={business_days} />
                ) : (
                    <BusinessHourModalMain business_days={business_days} />
                )}
            </Modal.Body>
            <Modal.Footer className='business-hour-modal__footer'>
                <BusinessHourModalFooter setShowEdit={setShowEdit} show_edit={show_edit} />
            </Modal.Footer>
        </Modal>
    );
};

export default BusinessHourModal;
