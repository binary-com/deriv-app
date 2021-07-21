import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { AutoHeightWrapper, FormSubmitButton, Div100vhContainer, Modal } from '@deriv/components';
import { ProofOfIdentityContainer } from '@deriv/account';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

const CFDPOI = ({ authentication_status, form_error, index, onCancel, onSubmit, value, ...props }) => {
    const { identity_status } = authentication_status;
    const [poi_state, setPOIState] = React.useState('none');
    const validateForm = React.useCallback(() => {
        const errors = {};
        if (!['pending'].includes(poi_state) || !['pending', 'verified'].includes(identity_status)) {
            errors.poi_state = true;
        }
        return errors;
    }, [poi_state, identity_status]);

    const is_next_btn_disabled = !(
        ['pending'].includes(poi_state) || ['pending', 'verified'].includes(identity_status)
    );

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
                        <form ref={setRef} className='cfd-proof-of-identity' onSubmit={handleSubmit}>
                            <div className='details-form'>
                                <input type='hidden' name='poi_state' value={poi_state} readOnly />
                                <Div100vhContainer
                                    className='cfd-proof-of-identity__fields'
                                    height_offset='180px'
                                    is_disabled={isDesktop()}
                                >
                                    <ProofOfIdentityContainer
                                        height={height}
                                        is_from_external={true}
                                        onStateChange={({ status }) => setPOIState(status)}
                                        {...props}
                                    />
                                </Div100vhContainer>
                                <Modal.Footer is_bypassed={isMobile()}>
                                    <FormSubmitButton
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        is_disabled={is_next_btn_disabled}
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

CFDPOI.propTypes = {
    authentication_status: PropTypes.object,
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

export default CFDPOI;
