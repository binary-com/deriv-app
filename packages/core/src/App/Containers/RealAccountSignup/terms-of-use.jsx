import { Field, Formik } from 'formik';
import React from 'react';
import {
    Div100vhContainer,
    Modal,
    ThemedScrollbars,
    FormSubmitButton,
    AutoHeightWrapper,
    StaticUrl,
} from '@deriv/components';
import { isDesktop, isMobile, PlatformContext } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import CheckboxField from 'App/Containers/RealAccountSignup/checkbox-field.jsx';
import { SharedMessage, BrokerSpecificMessage, Hr } from './terms-of-use-messages.jsx';
import 'Sass/terms-of-use.scss';

class TermsOfUse extends React.Component {
    static contextType = PlatformContext;

    handleCancel = () => {
        const current_step = this.props.getCurrentStep() - 1;
        this.props.onCancel(current_step, this.props.goToPreviousStep);
    };

    render() {
        return (
            <Formik
                initialValues={this.props.value}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(
                        this.props.getCurrentStep() - 1,
                        values.agreed_tos,
                        actions.setSubmitting,
                        this.goToNextStep
                    );
                }}
            >
                {({ handleSubmit, values, isSubmitting }) => (
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef, height }) => (
                            <form ref={setRef} onSubmit={handleSubmit}>
                                <ThemedScrollbars is_bypassed={isMobile()} height={height - 72}>
                                    <Div100vhContainer
                                        className='terms-of-use'
                                        height_offset='110px'
                                        is_disabled={isDesktop()}
                                    >
                                        <BrokerSpecificMessage target={this.props.real_account_signup_target} />
                                        <Hr />
                                        <SharedMessage />
                                        <Field
                                            component={CheckboxField}
                                            className='terms-of-use__checkbox'
                                            name='agreed_tos'
                                            id='agreed_tos'
                                            label={localize(
                                                'I am not a PEP, and I have not been a PEP in the last 12 months.'
                                            )}
                                        />
                                        <Hr />
                                        <Field
                                            component={CheckboxField}
                                            className='terms-of-use__checkbox'
                                            name='agreed_tnc'
                                            id='agreed_tnc'
                                            label={
                                                <Localize
                                                    i18n_default_text='I agree to the <0>terms and conditions</0>.'
                                                    components={[
                                                        <StaticUrl
                                                            key={0}
                                                            className='link'
                                                            href='/terms-and-conditions'
                                                        />,
                                                    ]}
                                                />
                                            }
                                        />
                                    </Div100vhContainer>
                                </ThemedScrollbars>
                                <Modal.Footer has_separator is_bypassed={isMobile()}>
                                    <FormSubmitButton
                                        is_disabled={isSubmitting || !values.agreed_tos || !values.agreed_tnc}
                                        label={
                                            this.context.is_deriv_crypto ? localize('Next') : localize('Add account')
                                        }
                                        has_cancel={!this.context.is_deriv_crypto}
                                        is_absolute={isMobile()}
                                        onCancel={this.handleCancel.bind(this)}
                                        cancel_label={localize('Previous')}
                                        form_error={this.props.form_error}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
}

export default TermsOfUse;
