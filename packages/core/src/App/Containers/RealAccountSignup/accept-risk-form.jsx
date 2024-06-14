import { Formik } from 'formik';
import React from 'react';
import {
    AutoHeightWrapper,
    Div100vhContainer,
    ThemedScrollbars,
    FormSubmitButton,
    Text,
    Modal,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobileOrTablet } from '@deriv/shared';

const AcceptRiskForm = ({ onConfirm, onClose }) => {
    return (
        <Formik initialValues={{}} onSubmit={onConfirm} validateOnMount>
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <form ref={setRef} onSubmit={handleSubmit} className='accept-risk__form'>
                            <Div100vhContainer className='details-form' height_offset='40px' is_disabled={isDesktop()}>
                                <ThemedScrollbars autoHide={!(window.innerHeight < 890)} height={height - 77}>
                                    <div className='accept-risk__container'>
                                        <div className='accept-risk__header'>
                                            <Text weight='bold' size='xs'>
                                                {localize('Appropriateness Test, WARNING:')}
                                            </Text>
                                        </div>
                                        <Text as='p' size='xs'>
                                            <Localize
                                                i18n_default_text='In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you (that is, whether you possess the experience and knowledge to understand the risks involved).<0/><1/>'
                                                components={[<br key={0} />, <br key={1} />]}
                                            />
                                            <Localize
                                                i18n_default_text='On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.<0/><1/>'
                                                components={[<br key={0} />, <br key={1} />]}
                                            />
                                            <Localize i18n_default_text='By clicking Accept below and proceeding with the Account Opening you should note that you may be exposing yourself to risks (which may be significant, including the risk of loss of the entire sum invested) that you may not have the knowledge and experience to properly assess or mitigate.' />
                                        </Text>
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <input name='accept_risk' value='1' type='hidden' />
                            <Modal.Footer has_separator is_bypassed={isMobileOrTablet()}>
                                <FormSubmitButton
                                    is_absolute={isMobileOrTablet()}
                                    label={localize('Accept')}
                                    has_cancel
                                    cancel_label={localize('Decline')}
                                    onCancel={onClose}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default AcceptRiskForm;
