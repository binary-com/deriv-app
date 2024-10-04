/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors in Autocomplete & SelectNative components

import { useMemo, useRef } from 'react';
import { Form, Formik, FormikValues } from 'formik';
import clsx from 'clsx';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import EmploymentTaxDetailsContainer from '../employment-tax-details-container';
import { getEmploymentAndTaxValidationSchema } from '../../Configs/user-profile-validation-config';
import ScrollToFieldWithError from '../../Components/forms/scroll-to-field-with-error';
import { Div100vhContainer, FormSubmitButton, Modal, ThemedScrollbars } from '@deriv/components';
import { useTinValidations } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import './employment-tax-info.scss';

type TEmploymentTaxInfoProps = {
    disabled_items: string[];
    getCurrentStep: () => number;
    onSave: (current_step: number, values: FormikValues) => void;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSubmit: (
        current_step: number,
        values: FormikValues,
        setSubmitting: (is_submitting: boolean) => void,
        goToNextStep: () => void
    ) => void;
    goToPreviousStep: () => void;
    goToNextStep: () => void;
    real_account_signup_target: string;
    value: FormikValues;
};

const EmploymentTaxInfo = observer(
    ({
        disabled_items,
        value,
        getCurrentStep,
        onSave,
        onCancel,
        onSubmit,
        goToPreviousStep,
        goToNextStep,
        real_account_signup_target,
    }: TEmploymentTaxInfoProps) => {
        const { isMobile, isDesktop } = useDevice();
        const scroll_div_ref = useRef(null);
        const { tin_validation_config, mutate } = useTinValidations();
        const { client } = useStore();

        const editable_fields = useMemo(
            () =>
                ['employment_status', 'tax_residence', 'tax_identification_number'].filter(
                    field => !disabled_items.includes(field)
                ) || [],
            [disabled_items]
        );

        const is_eu = real_account_signup_target === 'maltainvest';

        const schema = getEmploymentAndTaxValidationSchema({
            tin_config: tin_validation_config,
            is_mf: is_eu,
            is_real: !client.is_virtual,
        });

        const handleCancel = (values: FormikValues) => {
            const current_step = (getCurrentStep?.() || 1) - 1;
            onSave(current_step, values);
            onCancel(current_step, goToPreviousStep);
        };

        return (
            <Formik
                initialValues={{ ...value }}
                validationSchema={schema}
                validateOnMount
                onSubmit={(values, actions) => {
                    const current_step = getCurrentStep() - 1;
                    onSave(current_step, values);
                    onSubmit(current_step, values, actions.setSubmitting, goToNextStep);
                }}
            >
                {({ handleSubmit, isSubmitting, values }) => {
                    return (
                        <Form onSubmit={handleSubmit} noValidate className='employment-tax-info__layout'>
                            <ScrollToFieldWithError />
                            <Div100vhContainer
                                height_offset='110px'
                                is_disabled={!isMobile}
                                className={clsx('details-form')}
                            >
                                <ThemedScrollbars
                                    refSetter={scroll_div_ref}
                                    className={clsx('details-form__elements', 'employment-tax-info__form')}
                                >
                                    <EmploymentTaxDetailsContainer
                                        editable_fields={editable_fields}
                                        parent_ref={scroll_div_ref}
                                        should_display_long_message={is_eu}
                                        handleChange={mutate}
                                        tin_validation_config={tin_validation_config}
                                    />
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={!isDesktop}>
                                <FormSubmitButton
                                    is_disabled={isSubmitting}
                                    label={localize('Next')}
                                    is_absolute={!isDesktop}
                                    has_cancel
                                    cancel_label={localize('Previous')}
                                    onCancel={() => handleCancel(values)}
                                />
                            </Modal.Footer>
                        </Form>
                    );
                }}
            </Formik>
        );
    }
);

export default EmploymentTaxInfo;
