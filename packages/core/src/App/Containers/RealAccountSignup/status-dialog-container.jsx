import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Div100vhContainer, Icon } from '@deriv/components';
import { routes, isDesktop, isMobile } from '@deriv/shared';
import { EXPERIAN, getExperianResult } from './helpers/constants';
import { DialogHeading } from './helpers/dialog-heading.jsx';
import { DialogMessage } from './helpers/dialog-message.jsx';
import { DialogButtons } from './helpers/dialog-buttons.jsx';
import { observer, useStore } from '@deriv/stores';

const MainIcon = ({ currency }) => <Icon icon={`IcCurrency-${currency.toLowerCase()}`} size={120} />;
const Checkmark = ({ className }) => <Icon className={className} icon='IcCheckmarkCircle' color='green' size={24} />;
const Warning = ({ className }) => <Icon className={className} icon='IcAlertDanger' size={24} />;
const Danger = ({ className }) => <Icon className={className} icon='IcCrossCircle' size={24} color='red' />;
const CloseIcon = ({ closeModal }) => (
    <div onClick={closeModal} className='status-dialog__close'>
        <Icon icon='IcCross' />
    </div>
);

const StatusDialogContainer = observer(({ closeModal, currency, history, icon_size }) => {
    const { client } = useStore();
    const { landing_company_shortcode, is_fully_authenticated } = client;
    const closeModalAndOpenCashier = () => {
        closeModal();
        history.push(routes.cashier_deposit);
    };

    const closeModalAndOpenPOI = () => {
        closeModal();
        history.push(routes.proof_of_identity);
    };

    const closeModalAndOpenPOA = () => {
        closeModal();
        history.push(routes.proof_of_address);
    };

    /**
     * Get the status for the current account
     *
     * @readonly
     * @return {EXPERIAN} status
     */
    const getStatus = () =>
        getExperianResult({
            landing_company_shortcode,
        });

    return (
        <Div100vhContainer className='status-dialog' is_disabled={isDesktop()} height_offset='40px'>
            {isDesktop() && <CloseIcon closeModal={closeModal} />}
            <div
                className={classNames('status-dialog__header', {
                    'status-dialog__header--large': icon_size === 'large',
                    'status-dialog__header--xlarge': icon_size === 'xlarge',
                })}
            >
                <MainIcon currency={currency} />
                {getStatus() === EXPERIAN.SUCCESS && <Checkmark className='bottom-right-overlay' />}
                {getStatus() === EXPERIAN.WARN && <Warning className='bottom-right-overlay' />}
                {getStatus() === EXPERIAN.DANGER && <Danger className='bottom-right-overlay' />}
            </div>
            <div
                className={classNames('status-dialog__body', {
                    'status-dialog__body--no-grow': isMobile(),
                })}
            >
                <DialogHeading />
                <DialogMessage
                    is_fully_authenticated={is_fully_authenticated}
                    landing_company_shortcode={landing_company_shortcode}
                    status={getStatus()}
                />
            </div>
            <DialogButtons
                closeModal={closeModal}
                closeModalAndOpenPOI={closeModalAndOpenPOI}
                closeModalAndOpenPOA={closeModalAndOpenPOA}
                closeModalAndOpenCashier={closeModalAndOpenCashier}
                is_fully_authenticated={is_fully_authenticated}
                landing_company_shortcode={landing_company_shortcode}
                status={getStatus()}
            />
        </Div100vhContainer>
    );
});

StatusDialogContainer.defaultProps = {
    icon_size: 'large',
};

StatusDialogContainer.propTypes = {
    closeModal: PropTypes.func,
    currency: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.object,
    icon_size: PropTypes.string,
};

export default withRouter(StatusDialogContainer);
