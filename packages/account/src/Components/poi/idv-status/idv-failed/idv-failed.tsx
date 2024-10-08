import React from 'react';
import clsx from 'clsx';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { GetAccountStatus, GetSettings, ResidenceList } from '@deriv/api-types';
import { Button, HintBox, Loading, Text } from '@deriv/components';
import {
    filterObjProperties,
    getIDVNotApplicableOption,
    IDV_ERROR_STATUS,
    isEmptyObject,
    removeEmptyPropertiesFromObject,
    TIDVErrorStatus,
    toMoment,
    WS,
} from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import FormBody from '../../../form-body';
import IDVForm from '../../../forms/idv-form';
import FormFooter from '../../../form-footer';
import FormSubHeader from '../../../form-sub-header';
import PersonalDetailsForm from '../../../forms/personal-details-form.jsx';
import {
    isAdditionalDocumentValid,
    isDocumentNumberValid,
    isDocumentTypeValid,
    makeSettingsRequest,
    shouldHideHelperImage,
    validate,
    validateName,
} from '../../../../Helpers/utils';
import {
    GENERIC_ERROR_MESSAGE,
    DUPLICATE_ACCOUNT_ERROR_MESSAGE,
    CLAIMED_DOCUMENT_ERROR_MESSAGE,
    generateIDVError,
} from '../../../../Configs/poi-error-config';
import { API_ERROR_CODES } from '../../../../Constants/api-error-codes';
import { TIDVFormValues, TConfirmPersonalDetailsForm } from '../../../../Types';
import LoadErrorMessage from '../../../load-error-message';
import { TIdvDocumentSubmitForm } from '../../idv-document-submit/idv-document-submit';
import { useDevice } from '@deriv-com/ui';

type TRestState = {
    api_error: string;
    errors?: boolean;
    form_initial_values: TIdvFailedForm;
    changeable_fields: string[];
};

type TIdvFailed = {
    account_settings: GetSettings;
    getChangeableFields: () => string[];
    handleSubmit: () => void;
    is_from_external: boolean;
    mismatch_status: TIDVErrorStatus;
    residence_list: ResidenceList;
    latest_status: DeepRequired<GetAccountStatus>['authentication']['attempts']['latest'];
    selected_country?: ResidenceList[0];
    handleSelectionNext?: (should_show_manual: boolean) => void;
};

type TIDVFailureConfig = {
    required_fields: string[];
    side_note_image: JSX.Element;
    failure_message: React.ReactNode;
    inline_note_text: React.ReactNode;
};

type TIdvFailedForm = Partial<TIDVFormValues> & Partial<TConfirmPersonalDetailsForm>;

const IdvFailed = ({
    getChangeableFields,
    is_from_external,
    residence_list,
    account_settings,
    handleSubmit,
    mismatch_status = IDV_ERROR_STATUS.Failed.code,
    latest_status,
    selected_country,
    handleSelectionNext,
}: TIdvFailed) => {
    const { client } = useStore();
    const { setIsAlreadyAttempted } = client;
    const { isMobile, isDesktop } = useDevice();

    const [idv_failure, setIdvFailure] = React.useState<TIDVFailureConfig>({
        required_fields: [],
        side_note_image: <DerivLightNameDobPoiIcon height='195px' width='285px' />,
        failure_message: null,
        inline_note_text: null,
    });
    const [is_loading, setIsLoading] = React.useState(true);
    const [rest_state, setRestState] = React.useState<TRestState>({
        api_error: '',
        errors: false,
        form_initial_values: {},
        changeable_fields: [],
    });

    // Document upload not required for the below error codes
    const is_document_upload_required = React.useMemo(
        () =>
            ![
                IDV_ERROR_STATUS.DobMismatch.code,
                IDV_ERROR_STATUS.NameMismatch.code,
                IDV_ERROR_STATUS.NameDobMismatch.code,
            ].includes(mismatch_status),
        [mismatch_status]
    );

    /**
     * If user needs to resubmit IDV document, the country should be the new selected country
     * If user needs to update Personal info, the country should be the country of the latest status
     */
    const chosen_country = React.useMemo(
        () =>
            is_document_upload_required && !is_from_external
                ? selected_country ?? {}
                : residence_list.find(residence_data => residence_data.value === latest_status?.country_code) ?? {},
        [selected_country, is_document_upload_required, latest_status?.country_code, residence_list, is_from_external]
    );

    const IDV_NOT_APPLICABLE_OPTION = React.useMemo(() => getIDVNotApplicableOption(), []);
    const shouldSkipIdv = (document_id?: string) => document_id === IDV_NOT_APPLICABLE_OPTION.id;

    React.useEffect(() => {
        const initializeFormValues = async (required_fields: string[]) => {
            await WS?.wait('get_settings');
            const form_data = filterObjProperties(account_settings, required_fields);
            if (form_data.date_of_birth) {
                form_data.date_of_birth = toMoment(form_data.date_of_birth).format('YYYY-MM-DD');
            }
            // Remove the checkbox value as it is used only for moving cursor to the error field
            form_data.confirmation_checkbox = false;
            let initial_form_values = form_data;
            if (is_document_upload_required) {
                initial_form_values = {
                    document_type: {
                        id: '',
                        text: '',
                        value: '',
                        example_format: '',
                        sample_image: '',
                    },
                    document_number: '',
                    ...initial_form_values,
                };
            }
            setRestState({
                form_initial_values: { ...initial_form_values },
                changeable_fields: [...getChangeableFields()],
                api_error: '',
            });
            setIsLoading(false);
        };

        setIsAlreadyAttempted(true);

        const error_config = generateIDVError(
            is_document_upload_required,
            latest_status,
            chosen_country,
            mismatch_status
        );
        setIdvFailure(error_config);
        initializeFormValues(error_config?.required_fields ?? []).catch(e => {
            setRestState({
                form_initial_values: {},
                changeable_fields: [],
                api_error: e?.error?.message,
            });
        });
    }, [
        mismatch_status,
        account_settings,
        is_document_upload_required,
        getChangeableFields,
        generateIDVError,
        setIsAlreadyAttempted,
    ]);

    const onSubmit = async (values: TIdvFailedForm, { setStatus, setSubmitting }: FormikHelpers<TIdvFailedForm>) => {
        if (shouldSkipIdv(values?.document_type?.id)) {
            handleSelectionNext?.(true);
            return;
        }

        delete values.confirmation_checkbox;
        setSubmitting(true);
        setStatus({ error_msg: null });
        const { document_number, document_type } = values;
        const request = makeSettingsRequest(
            values,
            rest_state?.changeable_fields ? [...rest_state.changeable_fields] : []
        );
        const data = await WS.setSettings(request);

        if (data.error) {
            const response_error =
                data.error?.code === API_ERROR_CODES.DUPLICATE_ACCOUNT
                    ? DUPLICATE_ACCOUNT_ERROR_MESSAGE
                    : GENERIC_ERROR_MESSAGE;
            setStatus({ error_msg: response_error });
            setSubmitting(false);
        } else {
            const response = await WS.authorized.storage.getSettings();
            if (response.error) {
                setRestState(prev_state => ({ ...prev_state, api_error: response.error.message }));
                setSubmitting(false);
                return;
            }
            const submit_data = {
                identity_verification_document_add: 1,
                document_number,
                document_type: document_type?.id,
                issuing_country: chosen_country.value,
            };

            if (!submit_data.document_type || shouldSkipIdv(submit_data.document_type)) {
                setSubmitting(false);
                handleSubmit();
                return;
            }
            const idv_update_response = await WS.send(submit_data);
            if (idv_update_response?.error) {
                const response_error =
                    idv_update_response.error?.code === API_ERROR_CODES.CLAIMED_DOCUMENT
                        ? CLAIMED_DOCUMENT_ERROR_MESSAGE
                        : idv_update_response?.error?.message ?? GENERIC_ERROR_MESSAGE;
                setStatus({ error_msg: response_error });
                setSubmitting(false);
                return;
            }
            setSubmitting(false);
            handleSubmit();
        }
    };

    const validateFields = (values: TIdvFailedForm) => {
        const errors: Record<string, unknown> = {};
        if (is_document_upload_required) {
            const { document_type, document_number, document_additional } = values;

            if (shouldSkipIdv(document_type?.id)) {
                return errors;
            }

            const needs_additional_document = !!document_type?.additional;
            errors.document_type = isDocumentTypeValid(document_type as FormikValues);
            if (!shouldHideHelperImage(document_type?.id as string)) {
                if (needs_additional_document) {
                    errors.document_additional = isAdditionalDocumentValid(document_type, document_additional);
                }
                errors.document_number = isDocumentNumberValid(document_number ?? '', document_type as FormikValues);
            }
        }

        const validateValues = validate(errors as Record<string, string>, values);

        validateValues(val => val, idv_failure?.required_fields ?? [], localize('This field is required'));

        if (values.first_name) {
            errors.first_name = validateName(values.first_name);
        }
        if (values.last_name) {
            errors.last_name = validateName(values.last_name);
        }

        if (!values.confirmation_checkbox) {
            errors.confirmation_checkbox = 'error';
        }

        setRestState(prev_state => ({
            ...prev_state,
            errors: !isEmptyObject(removeEmptyPropertiesFromObject(errors)),
        }));

        return removeEmptyPropertiesFromObject(errors);
    };

    if (rest_state?.api_error) return <LoadErrorMessage error_message={rest_state.api_error} />;

    if (is_loading && Object.keys(rest_state?.form_initial_values ?? {}).length === 0) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    const setScrollOffset = () => {
        if (!isDesktop) {
            if (is_from_external) {
                return '140px';
            }
            return '180px';
        }
        return '80px';
    };

    const buttonText = (is_idv_skipping: boolean) => {
        if (is_idv_skipping) return localize('Next');
        if (is_document_upload_required) return localize('Verify');
        return localize('Update profile');
    };

    return (
        <Formik
            initialValues={rest_state?.form_initial_values ?? {}}
            onSubmit={onSubmit}
            validate={validateFields}
            className='proof-of-identity__container'
        >
            {({ isSubmitting, isValid, dirty, status, values }) => (
                <Form
                    className={clsx('proof-of-identity__mismatch-container', {
                        'upload-layout': is_document_upload_required,
                        'min-height': shouldSkipIdv(values?.document_type?.id),
                    })}
                >
                    <FormBody className='form-body' scroll_offset={setScrollOffset()}>
                        <Text size={isMobile ? 'xs' : 's'} weight='bold' align='center'>
                            <Localize i18n_default_text='Your identity verification failed because:' />
                        </Text>
                        {(status?.error_msg || idv_failure?.failure_message) && (
                            <HintBox
                                className={clsx('proof-of-identity__failed-message', 'hint-box-layout')}
                                icon='IcAlertDanger'
                                message={
                                    <Text as='p' size={isMobile ? 'xxs' : 'xs'} data-testid={mismatch_status}>
                                        {status?.error_msg ?? idv_failure?.failure_message}
                                    </Text>
                                }
                                is_danger
                            />
                        )}
                        {is_document_upload_required && (
                            <div>
                                <Text size='xs' align={isMobile ? 'left' : 'center'}>
                                    <Localize i18n_default_text='Let’s try again. Choose another document and enter the corresponding details.' />
                                </Text>
                                <FormSubHeader title={localize('Identity verification')} />
                                <IDVForm selected_country={chosen_country} class_name='idv-layout idv-resubmit' />
                                {!shouldSkipIdv(values?.document_type?.id) && (
                                    <FormSubHeader title={localize('Details')} />
                                )}
                            </div>
                        )}
                        {!shouldSkipIdv(values?.document_type?.id) && (
                            <PersonalDetailsForm
                                class_name='account-form__poi-confirm-example_container'
                                editable_fields={values.confirmation_checkbox ? [] : rest_state?.changeable_fields}
                                is_rendered_for_idv
                                side_note={idv_failure?.side_note_image}
                                inline_note_text={idv_failure?.inline_note_text}
                                mismatch_status={mismatch_status}
                            />
                        )}
                    </FormBody>
                    <FormFooter className='proof-of-identity__footer'>
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid}
                            text={buttonText(shouldSkipIdv(values?.document_type?.id))}
                            large
                            primary
                        />
                    </FormFooter>
                </Form>
            )}
        </Formik>
    );
};

export default IdvFailed;
