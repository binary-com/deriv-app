import React from 'react';
import { Button } from '@deriv/components';
import { Localize } from 'Components/i18next';
import './business-hour-modal-footer.scss';

type TBusinessHourModalFooter = {
    setShowEdit: (show_edit: boolean) => void;
    show_edit: boolean;
};

const BusinessHourModalFooter = ({ setShowEdit, show_edit }: TBusinessHourModalFooter) => {
    if (show_edit) {
        return (
            <div className='business-hour-modal-footer__buttons'>
                <Button
                    className='business-hour-modal-footer__button'
                    secondary
                    onClick={() => setShowEdit(false)}
                    large
                >
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button className='business-hour-modal-footer__button' primary large>
                    <Localize i18n_default_text='Edit' />
                </Button>
            </div>
        );
    }

    return (
        <Button className='business-hour-modal-footer__button' secondary onClick={() => setShowEdit(true)} large>
            <Localize i18n_default_text='Edit' />
        </Button>
    );
};

export default BusinessHourModalFooter;
