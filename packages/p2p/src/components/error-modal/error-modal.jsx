import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@deriv/components';
import { Localize } from 'Components/i18next';

const ErrorModal = ({ error_message, error_modal_title, has_close_icon, is_error_modal_open, setIsErrorModalOpen }) => {
    return (
        <Modal has_close_icon={has_close_icon} is_open={is_error_modal_open} title={error_modal_title}>
            <Modal.Body>{error_message}</Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={() => setIsErrorModalOpen(false)}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ErrorModal.propTypes = {
    error_message: PropTypes.string,
    error_modal_title: PropTypes.string,
    has_close_icon: PropTypes.bool,
    is_error_modal_open: PropTypes.bool,
    setIsErrorModalOpen: PropTypes.func,
};

export default observer(ErrorModal);
