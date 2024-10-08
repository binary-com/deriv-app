import React from 'react';
import clsx from 'clsx';
import { Form, Formik, FormikHelpers } from 'formik';
import { GetSettings } from '@deriv/api-types';
import { Checkbox, HintBox, Loading, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import {
    filterObjProperties,
    isEmptyObject,
    isMobile,
    removeEmptyPropertiesFromObject,
    toMoment,
    WS,
} from '@deriv/shared';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import FormBody from '../../form-body';
import LoadErrorMessage from '../../load-error-message';
import PersonalDetailsForm from '../../forms/personal-details-form.jsx';
import { GENERIC_ERROR_MESSAGE, DUPLICATE_ACCOUNT_ERROR_MESSAGE } from '../../../Configs/poi-error-config';
import { API_ERROR_CODES } from '../../../Constants/api-error-codes';
import { makeSettingsRequest, validate, validateName } from '../../../Helpers/utils';
import { TInputFieldValues } from '../../../Types';
import { useDevice } from '@deriv-com/ui';

type TRestState = {
    api_error: string;
    show_form: boolean;
    errors?: boolean;
    form_initial_values: TInputFieldValues;
    changeable_fields: string[];
};

type TPoiConfirmWithExampleFormContainer = {
    account_settings: GetSettings;
    getChangeableFields: () => string[];
    onFormConfirm?: () => void;
};

const PoiConfirmWithExampleFormContainer = ({
    account_settings,
    getChangeableFields,
    onFormConfirm,
}: TPoiConfirmWithExampleFormContainer) => {
    const { isDesktop } = useDevice();
    const [is_loading, setIsLoading] = React.useState(true);
    const [checked, setChecked] = React.useState(false);
    const [rest_state, setRestState] = React.useState<TRestState>({
        show_form: true,
        form_initial_values: { first_name: '', last_name: '', date_of_birth: '' },
        changeable_fields: [],
        api_error: '',
    });

    const side_note_image = <DerivLightNameDobPoiIcon height='195px' width='285px' />;

    React.useEffect(() => {
        const initializeFormValues = async () => {
            try {
                await WS?.wait('get_settings');
                const visible_settings = ['first_name', 'last_name', 'date_of_birth'];
                const form_initial_values = filterObjProperties(account_settings, visible_settings);
                if (form_initial_values.date_of_birth) {
                    form_initial_values.date_of_birth = toMoment(form_initial_values.date_of_birth).format(
                        'YYYY-MM-DD'
                    );
                }
                setRestState({
                    ...rest_state,
                    changeable_fields: getChangeableFields(),
                    form_initial_values,
                });
                setIsLoading(false);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        };

        initializeFormValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account_settings]);

    const onSubmit = async (
        values: TInputFieldValues,
        { setStatus, setSubmitting }: FormikHelpers<TInputFieldValues>
    ) => {
        if (checked) return;
        setStatus({ error_msg: '' });
        const request = makeSettingsRequest(
            values,
            rest_state?.changeable_fields ? [...rest_state.changeable_fields] : []
        );
        const data = await WS.setSettings(request);

        if (data?.error) {
            const response_error =
                data.error?.code === API_ERROR_CODES.DUPLICATE_ACCOUNT
                    ? DUPLICATE_ACCOUNT_ERROR_MESSAGE
                    : GENERIC_ERROR_MESSAGE;
            setStatus({ error_msg: response_error });
            setSubmitting(false);
        } else {
            const response = await WS.authorized.storage.getSettings();
            if (response?.error) {
                setRestState({ ...rest_state, api_error: response.error.message });
                return;
            }
            const { first_name, last_name, date_of_birth } = response?.get_settings ?? {
                ...rest_state.form_initial_values,
            };
            setRestState({ ...rest_state, form_initial_values: { first_name, last_name, date_of_birth } });
            setChecked(true);
            setIsLoading(false);

            if (onFormConfirm) {
                setTimeout(() => {
                    onFormConfirm();
                }, 500);
            }
        }
    };

    const validateFields = (values: TInputFieldValues) => {
        const errors: TInputFieldValues = {};
        const validateValues = validate(errors, values);

        const required_fields = ['first_name', 'last_name', 'date_of_birth'];

        validateValues(val => val, required_fields, localize('This field is required'));

        if (values.first_name) {
            errors.first_name = validateName(values.first_name);
        }
        if (values.last_name) {
            errors.last_name = validateName(values.last_name);
        }

        setRestState({ ...rest_state, errors: !isEmptyObject(removeEmptyPropertiesFromObject(errors)) });
        return removeEmptyPropertiesFromObject(errors);
    };

    const {
        form_initial_values: { ...form_initial_values },
        api_error,
    } = rest_state;

    if (api_error) return <LoadErrorMessage error_message={api_error} />;

    if (is_loading) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    return (
        <Formik initialValues={form_initial_values} enableReinitialize onSubmit={onSubmit} validate={validateFields}>
            {({ errors, handleSubmit, isSubmitting, status }) => (
                <Form className='account-form__poi-confirm-example' onSubmit={handleSubmit}>
                    <FormBody>
                        <PersonalDetailsForm
                            editable_fields={rest_state.changeable_fields}
                            is_rendered_for_onfido
                            side_note={side_note_image}
                            inline_note_text={
                                <Localize
                                    i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your identity document.'
                                    components={[<strong key={0} />]}
                                />
                            }
                        />
                        <button
                            type='submit'
                            className={clsx('account-form__poi-confirm-example--button', {
                                'account-form__poi-confirm-example--button__disabled':
                                    checked || !isEmptyObject(errors),
                            })}
                        >
                            <Checkbox
                                value={checked}
                                label={
                                    <Text size={isDesktop ? 'xs' : 'xxs'}>
                                        {localize(
                                            'I confirm that the name and date of birth above match my chosen identity document (see below)'
                                        )}
                                    </Text>
                                }
                                disabled={isSubmitting}
                            />
                        </button>
                        {status?.error_msg && (
                            <div className='account-form__poi-confirm-example--status-message'>
                                <HintBox
                                    icon='IcAlertDanger'
                                    message={
                                        <Text as='p' size='xxxs'>
                                            {status?.error_msg}
                                        </Text>
                                    }
                                    is_danger
                                    className='hint-box-layout'
                                />
                            </div>
                        )}
                    </FormBody>
                </Form>
            )}
        </Formik>
    );
};

export default PoiConfirmWithExampleFormContainer;
