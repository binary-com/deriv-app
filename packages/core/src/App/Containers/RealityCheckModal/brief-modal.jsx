import PropTypes from 'prop-types';
import React from 'react';
import { Formik } from 'formik';
import {
    AutoHeightWrapper,
    Div100vhContainer,
    Modal,
    FormSubmitButton,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const BriefModal = ({ disableApp, enableApp, IntervalField, is_visible, onSubmit, validateForm }) => {
    return (
        <Modal
            className='reality-check'
            enableApp={enableApp}
            is_open={is_visible}
            disableApp={disableApp}
            has_close_icon={false}
            title={localize('Trading statistics')}
            portalId='modal_root_absolute'
            width='588px'
        >
            <Formik
                initialValues={{
                    interval: '',
                }}
                validate={validateForm}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                    <AutoHeightWrapper default_height={350} height_offset={isDesktop() ? 80 : null}>
                        {({ setRef }) => (
                            <form ref={setRef} onSubmit={handleSubmit}>
                                <Div100vhContainer
                                    is_bypassed={!isDesktop()}
                                    className='reality-check__wrapper'
                                    height_offset='204px'
                                    is_disabled={isDesktop()}
                                >
                                    <ThemedScrollbars height={500} className='reality-check__scrollbar'>
                                        <div className='reality-check__section'>
                                            <Text
                                                as='p'
                                                size={isDesktop() ? 'xs' : 'xxs'}
                                                line_height='m'
                                                className='reality-check__text reality-check__text--description'
                                            >
                                                <Localize i18n_default_text='We’ll show you details of your trades, such as your profit and loss, from time to time. This information will help you decide if you want to continue trading or not.' />
                                            </Text>
                                            <Text
                                                as='p'
                                                size={isDesktop() ? 'xs' : 'xxs'}
                                                line_height='m'
                                                align='center'
                                                className='reality-check__text reality-check__text--description'
                                            >
                                                <Localize i18n_default_text='When do you want to view your trading statistics?' />
                                            </Text>
                                            <IntervalField
                                                values={values}
                                                touched={touched}
                                                errors={errors}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator>
                                    <FormSubmitButton
                                        className='reality-check__submit'
                                        is_disabled={!values.interval || !isValid || isSubmitting}
                                        label={localize('Continue trading')}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        </Modal>
    );
};

BriefModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    IntervalField: PropTypes.func,
    is_visible: PropTypes.bool,
    logout: PropTypes.func,
    onSubmit: PropTypes.func,
    openStatement: PropTypes.func,
    validateForm: PropTypes.func,
};

export default BriefModal;
