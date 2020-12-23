import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { AutoHeightWrapper, FormSubmitButton, Div100vhContainer, Modal } from '@deriv/components';
import { ProofOfIdentityContainer } from '@deriv/account';
import { WS } from 'Services/ws-methods';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

const MT5POI = props => {
    const { form_error, index, onCancel, onSubmit, value } = props;
    const [poi_state, setPOIState] = React.useState('none');

    const validateForm = React.useCallback(() => {
        const errors = {};
        if (!['pending', 'verified'].includes(poi_state)) {
            errors.poi_state = true;
        }

        return errors;
    }, [poi_state]);

    return (
        <Formik
            initialValues={{
                poi_state: value.poi_state,
            }}
            validate={validateForm}
            onSubmit={(values, actions) => onSubmit(index, { poi_state }, actions.setSubmitting)}
        >
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <form ref={setRef} className='mt5-proof-of-identity' onSubmit={handleSubmit}>
                            <div className='details-form'>
                                <input type='hidden' name='poi_state' value={poi_state} readOnly />
                                <Div100vhContainer
                                    className='mt5-proof-of-identity__fields'
                                    height_offset='180px'
                                    is_disabled={isDesktop()}
                                >
                                    <ProofOfIdentityContainer
                                        {...props}
                                        serviceToken={WS.serviceToken}
                                        notificationEvent={WS.notificationEvent}
                                        getAccountStatus={WS.authorized.getAccountStatus}
                                        height={height}
                                        onStateChange={({ status }) => setPOIState(status)}
                                        is_trading_button_enabled={false}
                                        is_description_enabled={false}
                                    />
                                </Div100vhContainer>
                                <Modal.Footer is_bypassed={isMobile()}>
                                    <FormSubmitButton
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        is_disabled={!['pending', 'verified'].includes(poi_state)}
                                        is_absolute={isMobile()}
                                        label={localize('Next')}
                                        onCancel={onCancel}
                                        form_error={form_error}
                                    />
                                </Modal.Footer>
                            </div>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

MT5POI.propTypes = {
    form_error: PropTypes.string,
    index: PropTypes.number,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    refreshNotifications: PropTypes.func,
    addNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    value: PropTypes.object,
};

export default MT5POI;
