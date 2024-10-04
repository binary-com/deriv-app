import { Fragment, useCallback, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { AutoHeightWrapper, Div100vhContainer, FormSubmitButton, Modal, ThemedScrollbars } from '@deriv/components';
import { getIDVNotApplicableOption } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { Localize, localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { shouldShowIdentityInformation } from '../../Helpers/utils';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import FormSubHeader from '../form-sub-header';
import IDVForm from '../forms/idv-form';
import PersonalDetailsForm from '../forms/personal-details-form';
import ScrollToFieldWithError from '../forms/scroll-to-field-with-error';
import { TIDVFormValues, TListItem, TPersonalDetailsBaseForm } from '../../Types';
import { GetAccountStatus, GetSettings, ResidenceList } from '@deriv/api-types';
import { getPersonalDetailsBaseValidationSchema } from '../../Configs/user-profile-validation-config';
import { getIDVFormValidationSchema } from '../../Configs/kyc-validation-config';

type TPersonalDetailsSectionForm = Partial<TIDVFormValues & TPersonalDetailsBaseForm> & {
    confirmation_checkbox?: boolean;
};

type TPersonalDetailProps = {
    getCurrentStep: () => number;
    onSave: (current_step: number, values: TPersonalDetailsSectionForm) => void;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSubmit: (
        current_step: number,
        values: TPersonalDetailsSectionForm,
        setSubmitting: (is_submitting: boolean) => void,
        goToNextStep: () => void
    ) => void;
    goToPreviousStep: () => void;
    goToNextStep: () => void;
    validate: (values: TPersonalDetailsSectionForm) => TPersonalDetailsSectionForm;
    salutation_list: { label: string; value: string }[];
    disabled_items: string[];
    is_svg: boolean;
    residence_list: ResidenceList;
    is_virtual: boolean;
    is_fully_authenticated: boolean;
    account_opening_reason_list: TListItem[];
    closeRealAccountSignup: () => void;
    has_real_account: boolean;
    account_status?: GetAccountStatus;
    account_settings: GetSettings;
    residence: string;
    real_account_signup_target: string;
    value: TPersonalDetailsSectionForm;
};

type TrackEvent = TEvents['ce_real_account_signup_identity_form'];

const PersonalDetails = observer(
    ({
        getCurrentStep,
        onSave,
        onCancel,
        onSubmit,
        goToPreviousStep,
        goToNextStep,
        validate,
        salutation_list,
        disabled_items,
        is_svg,
        residence_list,
        is_virtual,
        is_fully_authenticated,
        account_opening_reason_list,
        closeRealAccountSignup,
        has_real_account,
        value,
        ...props
    }: TPersonalDetailProps) => {
        const {
            traders_hub: { is_eu_user },
        } = useStore();
        const { account_status, account_settings, residence, real_account_signup_target } = props;

        const { isDesktop } = useDevice();
        const handleCancel = (values: TPersonalDetailsSectionForm) => {
            const current_step = getCurrentStep() - 1;
            onSave(current_step, values);
            onCancel(current_step, goToPreviousStep);
        };
        const citizen = residence || account_settings?.citizen;

        const trackEvent = useCallback(
            (payload: TrackEvent) => {
                if (is_eu_user) return;
                Analytics.trackEvent('ce_real_account_signup_identity_form', {
                    ...payload,
                    step_codename: 'identity',
                    landing_company: real_account_signup_target,
                });
            },
            [is_eu_user, real_account_signup_target]
        );

        useEffect(() => {
            trackEvent({
                action: 'open',
            });

            return () =>
                trackEvent({
                    action: 'close',
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        //is_rendered_for_idv is used for configuring the components when they are used in idv page
        const is_rendered_for_idv = shouldShowIdentityInformation({
            account_status: account_status as GetAccountStatus,
            citizen: citizen as string,
            residence_list,
            real_account_signup_target,
        });

        const IDV_NOT_APPLICABLE_OPTION = useMemo(() => getIDVNotApplicableOption(), []);

        const schema = useMemo(
            () =>
                is_rendered_for_idv
                    ? getPersonalDetailsBaseValidationSchema(real_account_signup_target).concat(
                          getIDVFormValidationSchema()
                      )
                    : getPersonalDetailsBaseValidationSchema(real_account_signup_target),
            [is_rendered_for_idv, real_account_signup_target]
        );

        /*
    In most modern browsers, setting autocomplete to "off" will not prevent a password manager from asking the user if they would like to save username and password information, or from automatically filling in those values in a site's login form.
    check this link https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#the_autocomplete_attribute_and_login_fields
    */
        // for dropdowns use 'none'

        const selected_country = residence_list.find(residence_data => residence_data.value === citizen) || {};

        const getEditableFields = (is_confirmed = false, selected_document_type_id?: string) => {
            const editable_fields = Object.keys(value).filter(field => !disabled_items.includes(field)) || [];

            if (IDV_NOT_APPLICABLE_OPTION.id === selected_document_type_id) return editable_fields;

            if (is_confirmed && is_rendered_for_idv) {
                return editable_fields.filter(field => !['first_name', 'last_name', 'date_of_birth'].includes(field));
            }

            return editable_fields;
        };

        return (
            <Formik
                initialValues={{ ...value }}
                validationSchema={schema}
                validateOnMount
                onSubmit={(values, actions) => {
                    trackEvent({
                        action: 'save',
                        user_choice: JSON.stringify(values),
                    });
                    const current_step = getCurrentStep() - 1;
                    onSave(current_step, values);
                    onSubmit(current_step, values, actions.setSubmitting, goToNextStep);
                }}
            >
                {({ handleSubmit, isSubmitting, values }) => (
                    <AutoHeightWrapper default_height={380} height_offset={isDesktop ? 81 : null}>
                        {({ setRef, height }) => (
                            <Form
                                noValidate
                                ref={setRef}
                                onSubmit={handleSubmit}
                                autoComplete='off'
                                data-testid='personal_details_form'
                            >
                                <ScrollToFieldWithError
                                    fields_to_scroll_bottom={isDesktop ? ['account_opening_reason'] : undefined}
                                    fields_to_scroll_top={isDesktop ? undefined : ['account_opening_reason']}
                                    should_recollect_inputs_names={
                                        values?.document_type?.id === IDV_NOT_APPLICABLE_OPTION.id
                                    }
                                />
                                <Div100vhContainer
                                    className='details-form'
                                    height_offset='100px'
                                    is_disabled={isDesktop}
                                >
                                    <ThemedScrollbars height={height} testId='dt_personal_details_container'>
                                        <div className={clsx('details-form__elements', 'personal-details-form')}>
                                            {is_rendered_for_idv && (
                                                <Fragment>
                                                    <FormSubHeader title={localize('Identity verification')} />
                                                    <IDVForm
                                                        selected_country={selected_country}
                                                        hide_hint
                                                        is_for_real_account_signup_modal
                                                    />
                                                </Fragment>
                                            )}
                                            {is_svg && !is_eu_user && <FormSubHeader title={localize('Details')} />}
                                            <PersonalDetailsForm
                                                class_name={clsx({
                                                    'account-form__poi-confirm-example_container':
                                                        is_svg && !is_eu_user,
                                                })}
                                                is_virtual={is_virtual}
                                                is_svg={is_svg}
                                                is_eu_user={is_eu_user}
                                                side_note={<DerivLightNameDobPoiIcon height='200px' />}
                                                is_rendered_for_idv={is_rendered_for_idv}
                                                editable_fields={getEditableFields(
                                                    values?.confirmation_checkbox,
                                                    values?.document_type?.id
                                                )}
                                                residence_list={residence_list}
                                                has_real_account={has_real_account}
                                                is_fully_authenticated={is_fully_authenticated}
                                                closeRealAccountSignup={closeRealAccountSignup}
                                                salutation_list={salutation_list}
                                                account_opening_reason_list={account_opening_reason_list}
                                                inline_note_text={
                                                    <Localize
                                                        i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
                                                        components={[<strong key={0} />]}
                                                    />
                                                }
                                                no_confirmation_needed={
                                                    values?.document_type?.id === IDV_NOT_APPLICABLE_OPTION.id
                                                }
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={!isDesktop}>
                                    <FormSubmitButton
                                        cancel_label={localize('Previous')}
                                        has_cancel
                                        is_disabled={isSubmitting}
                                        is_absolute={!isDesktop}
                                        label={localize('Next')}
                                        onCancel={() => handleCancel(values)}
                                    />
                                </Modal.Footer>
                            </Form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
);

export default PersonalDetails;
