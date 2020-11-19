import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Formik, Form } from 'formik';
import {
    Modal,
    FadeWrapper,
    FormSubmitButton,
    PageOverlay,
    DesktopWrapper,
    MobileWrapper,
    ThemedScrollbars,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';

const BriefModal = ({
    disableApp,
    enableApp,
    handleIntervalInputMobileFocus,
    IntervalField,
    is_onscreen_keyboard_active,
    is_visible,
    logout,
    onSubmit,
    openStatement,
    setCurrentFocus,
    validateForm,
}) => {
    const interval_input_ref = React.useRef();

    const Message = () => (
        <React.Fragment>
            <p className='reality-check__text reality-check__text--description'>
                <Localize i18n_default_text='Options trading can become a real addiction, as can any other activity pushed to its limits. To avoid the danger of such an addiction, we provide a reality-check that gives you a summary of your trades and accounts on a regular basis.' />
            </p>
            <p className='reality-check__text reality-check__text--description'>
                <Localize
                    i18n_default_text='Would like to check your statement first? <0>Check Statement</0>'
                    components={[<a key={0} className='link' onClick={openStatement} />]}
                />
            </p>
            <div className='reality-check__separator reality-check__separator--large' />
            <p className='reality-check__text reality-check__text--center'>
                <Localize i18n_default_text='Please specify your preferred interval reality check in minutes:' />
            </p>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='reality-check'
                    enableApp={enableApp}
                    is_open={is_visible}
                    disableApp={disableApp}
                    has_close_icon={false}
                    title={localize('Trading statistics report')}
                    portalId='modal_root_absolute'
                    width='720px'
                >
                    <Formik
                        initialValues={{
                            interval: '',
                        }}
                        validate={validateForm}
                        onSubmit={onSubmit}
                    >
                        {({ errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                            <Form noValidate>
                                <Modal.Body>
                                    <Message />
                                    <IntervalField
                                        values={values}
                                        touched={touched}
                                        errors={errors}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                    />
                                </Modal.Body>
                                <Modal.Footer has_separator>
                                    <FormSubmitButton
                                        className='reality-check__submit'
                                        has_cancel
                                        cancel_label={localize('Log out')}
                                        is_disabled={!values.interval || !isValid || isSubmitting}
                                        label={localize('Continue trading')}
                                        onCancel={logout}
                                    />
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <FadeWrapper is_visible={is_visible} className='reality-check' keyname='reality-check'>
                    <ThemedScrollbars>
                        <div
                            className={classNames('reality-check__wrapper', 'reality-check__brief', {
                                'reality-check__brief--with-mobile-keyboard': is_onscreen_keyboard_active,
                            })}
                        >
                            <PageOverlay header={localize('Trading statistics report')} is_open={is_visible}>
                                <Formik
                                    initialValues={{
                                        interval: '',
                                    }}
                                    validate={validateForm}
                                    onSubmit={onSubmit}
                                >
                                    {({ errors, isSubmitting, isValid, values, touched, handleChange, handleBlur }) => (
                                        <Form
                                            className={classNames('reality-check__brief__form', {
                                                'reality-check__brief__form--with-mobile-keyboard': is_onscreen_keyboard_active,
                                            })}
                                            noValidate
                                        >
                                            <Message />
                                            <IntervalField
                                                ref={interval_input_ref}
                                                values={values}
                                                touched={touched}
                                                errors={errors}
                                                handleChange={handleChange}
                                                handleBlur={e => {
                                                    setCurrentFocus(null);
                                                    handleBlur(e);
                                                }}
                                                onFocus={e => {
                                                    setCurrentFocus(e.target.name);
                                                    handleIntervalInputMobileFocus(interval_input_ref.current);
                                                }}
                                            />
                                            <FormSubmitButton
                                                className={classNames('reality-check__brief__submit', {
                                                    'reality-check__brief__submit--with-mobile-keyboard': is_onscreen_keyboard_active,
                                                })}
                                                has_cancel
                                                cancel_label={localize('Log out')}
                                                is_disabled={!values.interval || !isValid || isSubmitting}
                                                label={localize('Continue trading')}
                                                onCancel={logout}
                                            />
                                        </Form>
                                    )}
                                </Formik>
                            </PageOverlay>
                        </div>
                    </ThemedScrollbars>
                </FadeWrapper>
            </MobileWrapper>
        </React.Fragment>
    );
};

BriefModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    handleIntervalInputMobileFocus: PropTypes.func,
    IntervalField: PropTypes.object,
    is_onscreen_keyboard_active: PropTypes.bool,
    is_visible: PropTypes.bool,
    logout: PropTypes.func,
    onSubmit: PropTypes.func,
    openStatement: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    validateForm: PropTypes.func,
};

export default React.memo(BriefModal);
