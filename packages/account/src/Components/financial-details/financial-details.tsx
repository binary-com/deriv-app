import React from 'react';
import clsx from 'clsx';
import { Formik } from 'formik';
import {
    AutoHeightWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Modal,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { EMPLOYMENT_VALUES, shouldHideOccupationField } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { TFinancialInformationForm } from 'Types';
import { observer, useStore } from '@deriv/stores';
import FinancialInformation from './financial-details-partials';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';
import ScrollToFieldWithError from '../forms/scroll-to-field-with-error';
import InlineNoteWithIcon from '../inline-note-with-icon';
import { useDevice } from '@deriv-com/ui';

type TFinancialDetails = {
    goToPreviousStep: () => void;
    goToNextStep: () => void;
    getCurrentStep: () => number;
    onSave: (current_step: number, values: TFinancialInformationForm) => void;
    onSubmit: (
        current_step: number,
        values: TFinancialInformationForm,
        actions: (isSubmitting: boolean) => void,
        props: () => void
    ) => void;
    onCancel: (current_step: number, props: () => void) => void;
    validate: (values: TFinancialInformationForm) => object;
    value: TFinancialInformationForm;
    employment_status: string;
    is_eu_user?: boolean;
};

/**
 * A wrapper for the financial details form.
 * @name FinancialDetails
 * @param {TFinancialDetails} props  - props of the component
 * @returns {React.ReactNode} React component that renders FinancialDetails form.
 */
const FinancialDetails = observer((props: TFinancialDetails) => {
    const handleCancel = (values: TFinancialInformationForm) => {
        const current_step = props.getCurrentStep() - 1;
        props.onSave(current_step, values);
        props.onCancel(current_step, props.goToPreviousStep);
    };
    const { isDesktop } = useDevice();
    const {
        traders_hub: { is_eu_user },
    } = useStore();

    const handleValidate = (values: TFinancialInformationForm) => {
        const current_step = (props.getCurrentStep?.() || 1) - 1;
        props.onSave(current_step, values);

        const { errors } = splitValidationResultTypes(props.validate(values));
        if (shouldHideOccupationField(props.employment_status)) {
            delete errors?.occupation;
        }
        return errors;
    };

    const fields_to_scroll_top = isDesktop
        ? ['income_source']
        : ['income_source', 'account_turnover', 'estimated_worth'];
    const fields_to_scroll_bottom = isDesktop ? ['account_turnover', 'estimated_worth'] : [];

    return (
        <Formik
            initialValues={{ ...props.value }}
            validate={handleValidate}
            onSubmit={(values, actions) => {
                props.onSubmit(props.getCurrentStep() - 1, values, actions.setSubmitting, props.goToNextStep);
            }}
            validateOnMount
        >
            {({ handleSubmit, isSubmitting, values }) => {
                return (
                    <AutoHeightWrapper default_height={200}>
                        {({
                            setRef,
                            height,
                        }: {
                            setRef: (instance: HTMLFormElement) => void;
                            height?: number | string;
                        }) => (
                            <form ref={setRef} onSubmit={handleSubmit} noValidate>
                                <ScrollToFieldWithError
                                    fields_to_scroll_top={fields_to_scroll_top}
                                    fields_to_scroll_bottom={fields_to_scroll_bottom}
                                />
                                <Div100vhContainer
                                    className={clsx('details-form', 'financial-assessment')}
                                    height_offset='110px'
                                    is_disabled={isDesktop}
                                >
                                    {is_eu_user ? (
                                        <div className='details-form__banner-container'>
                                            <InlineNoteWithIcon
                                                icon='IcAlertWarning'
                                                message={
                                                    <Localize i18n_default_text='We collect information about your employment as part of our due diligence obligations, as required by anti-money laundering legislation.' />
                                                }
                                                title={localize('Why do we collect this?')}
                                            />
                                        </div>
                                    ) : (
                                        <Text
                                            as='p'
                                            color='prominent'
                                            size='xxs'
                                            className='trading-assessment__side-note'
                                        >
                                            <Localize i18n_default_text='We collect information about your employment as part of our due diligence obligations, as required by anti-money laundering legislation.' />
                                        </Text>
                                    )}
                                    <ThemedScrollbars autohide={window.innerHeight >= 890} height={Number(height) - 77}>
                                        <div className={clsx('details-form__elements', 'financial-assessment__form')}>
                                            <FinancialInformation employment_status={props.employment_status} />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={!isDesktop}>
                                    <FormSubmitButton
                                        is_disabled={
                                            isSubmitting ||
                                            !!(
                                                props.employment_status === EMPLOYMENT_VALUES.EMPLOYED &&
                                                values?.occupation === EMPLOYMENT_VALUES.UNEMPLOYED
                                            )
                                        }
                                        is_absolute={!isDesktop}
                                        label={localize('Next')}
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        onCancel={() => handleCancel(values)}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                );
            }}
        </Formik>
    );
});

export default FinancialDetails;
