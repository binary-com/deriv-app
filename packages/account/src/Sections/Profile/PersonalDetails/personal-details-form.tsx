import React from 'react';
import classNames from 'classnames';
import { Formik, Form, FormikHelpers } from 'formik';
import { BrowserHistory } from 'history';
import { withRouter } from 'react-router';
import {
    Button,
    Checkbox,
    DesktopWrapper,
    Dropdown,
    FormSubmitErrorMessage,
    HintBox,
    Input,
    Loading,
    MobileWrapper,
    SelectNative,
    Text,
} from '@deriv/components';
import { GetSettings } from '@deriv/api-types';
import { AUTH_STATUS_CODES, WS, getBrandWebsiteName, routes, useIsMounted } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import LeaveConfirm from 'Components/leave-confirm';
import FormFooter from 'Components/form-footer';
import FormBody from 'Components/form-body';
import { DateOfBirthField } from 'Components/forms/form-fields';
import FormSubHeader from 'Components/form-sub-header';
import LoadErrorMessage from 'Components/load-error-message';
import POAAddressMismatchHintBox from 'Components/poa-address-mismatch-hint-box';
import { getEmploymentStatusList } from 'Sections/Assessment/FinancialAssessment/financial-information-list';
import InputGroup from './input-group';
import { getPersonalDetailsInitialValues, getPersonalDetailsValidationSchema, makeSettingsRequest } from './validation';
import FormSelectField from 'Components/forms/form-select-field';

type TRestState = {
    show_form: boolean;
    errors?: boolean;
    api_error?: string;
    changeable_fields?: string[];
    form_initial_values?: Record<string, any>;
};

export const PersonalDetailsForm = observer(({ history }: { history: BrowserHistory }) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const [is_state_loading, setIsStateLoading] = React.useState(false);
    const [is_btn_loading, setIsBtnLoading] = React.useState(false);
    const [is_submit_success, setIsSubmitSuccess] = React.useState(false);

    const {
        client,
        notifications,
        ui,
        common: { is_language_changing },
    } = useStore();

    const {
        account_settings,
        account_status,
        residence_list,
        authentication_status,
        is_eu,
        is_virtual,
        states_list,
        fetchStatesList,
        fetchResidenceList,
        has_residence,
        current_landing_company,
        updateAccountStatus,
    } = client;

    const {
        refreshNotifications,
        showPOAAddressMismatchSuccessNotification,
        showPOAAddressMismatchFailureNotification,
    } = notifications;

    const { is_mobile } = ui;
    const has_poa_address_mismatch = account_status?.status?.includes('poa_address_mismatch');
    const [rest_state, setRestState] = React.useState<TRestState>({
        show_form: true,
        form_initial_values: {},
    });

    const notification_timeout = React.useRef<NodeJS.Timeout>();

    const [start_on_submit_timeout, setStartOnSubmitTimeout] = React.useState<{
        is_timeout_started: boolean;
        timeout_callback: () => void;
    }>({
        is_timeout_started: false,
        timeout_callback: () => null,
    });

    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (isMounted()) {
            const getSettings = async () => {
                // waits for residence to be populated
                await WS.wait('get_settings');

                fetchResidenceList?.();

                if (has_residence) {
                    if (!is_language_changing) {
                        setIsStateLoading(true);
                        fetchStatesList().then(() => {
                            setIsStateLoading(false);
                        });
                    }
                }
            };
            getSettings();
        }
        setIsLoading(false);
    }, [account_settings, is_eu]);

    const onSubmit = async (values: GetSettings, { setStatus, setSubmitting }: FormikHelpers<GetSettings>) => {
        setStatus({ msg: '' });
        const request = makeSettingsRequest({ ...values }, residence_list, states_list, is_virtual);
        setIsBtnLoading(true);
        const data = await WS.authorized.setSettings(request);

        if (data.error) {
            setStatus({ msg: data.error.message });
            setIsBtnLoading(false);
            setSubmitting(false);
        } else {
            // Adding a delay to show the notification after the page reload
            notification_timeout.current = setTimeout(() => {
                if (data.set_settings.notification) {
                    showPOAAddressMismatchSuccessNotification();
                } else if (has_poa_address_mismatch) {
                    showPOAAddressMismatchFailureNotification();
                }
            }, 2000);

            // force request to update settings cache since settings have been updated
            const response = await WS.authorized.storage.getSettings();
            if (response.error) {
                setRestState({ ...rest_state, api_error: response.error.message });
                return;
            }
            // Fetches the status of the account after update
            updateAccountStatus();
            setRestState({ ...rest_state, ...response.get_settings });
            setIsLoading(false);
            refreshNotifications();
            setIsBtnLoading(false);
            setIsSubmitSuccess(true);
            setStartOnSubmitTimeout({
                is_timeout_started: true,
                timeout_callback: () => {
                    setSubmitting(false);
                },
            });
            // redirection back based on 'from' param in query string
            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            if (url_params.get('from')) {
                const from = url_params.get('from') as keyof typeof routes;
                history.push(routes[from]);
            }
        }
    };

    React.useEffect(() => () => clearTimeout(notification_timeout.current), []);

    React.useEffect(() => {
        let timeout_id: NodeJS.Timeout;
        if (start_on_submit_timeout.is_timeout_started) {
            timeout_id = setTimeout(() => {
                setIsSubmitSuccess(false);
                setStartOnSubmitTimeout({
                    is_timeout_started: false,
                    timeout_callback: () => setIsSubmitSuccess(false),
                });
            }, 3000);
        }

        return () => {
            clearTimeout(timeout_id);
        };
    }, [start_on_submit_timeout.is_timeout_started]);

    const showForm = (show_form: boolean) => setRestState({ show_form });

    const isFieldDisabled = (name: string): boolean => {
        return !!account_settings?.immutable_fields?.includes(name);
    };

    const { api_error, show_form } = rest_state;

    if (api_error) return <LoadErrorMessage error_message={api_error} />;

    if (is_loading || is_state_loading || !residence_list.length) {
        return <Loading is_fullscreen={false} className='account__initial-loader' />;
    }

    const is_poa_verified = authentication_status?.document_status === AUTH_STATUS_CODES.VERIFIED;
    const is_poi_verified = authentication_status?.identity_status === AUTH_STATUS_CODES.VERIFIED;

    const is_account_verified = is_poa_verified && is_poi_verified;

    //Generate Redirection Link to user based on verifiction status
    const getRedirectionLink = () => {
        if (!is_poi_verified) {
            return '/account/proof-of-identity';
        } else if (!is_poa_verified) {
            return '/account/proof-of-address';
        }
        return undefined;
    };

    const PersonalDetailSchema = getPersonalDetailsValidationSchema(is_eu, is_virtual);

    const initialValues = getPersonalDetailsInitialValues(account_settings, residence_list, states_list, is_virtual);

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={onSubmit}
            validationSchema={PersonalDetailSchema}
        >
            {({
                values,
                errors,
                status,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                setFieldTouched,
                dirty,
            }) => (
                <React.Fragment>
                    <LeaveConfirm onDirty={is_mobile ? showForm : undefined} />
                    {show_form && (
                        <Form
                            noValidate
                            className='account-form account-form__personal-details'
                            onSubmit={handleSubmit}
                            data-testid='dt_account_personal_details_section'
                        >
                            <FormBody scroll_offset={is_mobile ? '199px' : '80px'}>
                                <FormSubHeader title={localize('Details')} />
                                {!is_virtual && (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <InputGroup className='account-form__fieldset--2-cols'>
                                                <Input
                                                    data-lpignore='true'
                                                    type='text'
                                                    name='first_name'
                                                    label={localize('First name*')}
                                                    value={values.first_name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    disabled={isFieldDisabled('first_name')}
                                                    error={errors.first_name}
                                                    id='first_name'
                                                    data-testid='dt_first_name'
                                                />
                                                <Input
                                                    id='last_name'
                                                    data-lpignore='true'
                                                    type='text'
                                                    name='last_name'
                                                    label={localize('Last name*')}
                                                    value={values.last_name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    disabled={isFieldDisabled('last_name')}
                                                    error={errors.last_name}
                                                    data-testid='dt_last_name'
                                                />
                                            </InputGroup>
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    type='text'
                                                    name='first_name'
                                                    id='first_name_mobile'
                                                    label={localize('First name*')}
                                                    value={values.first_name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    disabled={isFieldDisabled('first_name')}
                                                    error={errors.first_name}
                                                    data-testid='dt_first_name'
                                                />
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <Input
                                                    data-lpignore='true'
                                                    type='text'
                                                    name='last_name'
                                                    id='last_name_mobile'
                                                    label={localize('Last name*')}
                                                    value={values.last_name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    disabled={isFieldDisabled('last_name')}
                                                    error={errors.last_name}
                                                    data-testid='dt_last_name'
                                                />
                                            </fieldset>
                                        </MobileWrapper>
                                        {'place_of_birth' in values && (
                                            <fieldset className='account-form__fieldset'>
                                                <FormSelectField
                                                    label={localize('Place of birth')}
                                                    name='place_of_birth'
                                                    list_items={residence_list}
                                                    disabled={isFieldDisabled('place_of_birth')}
                                                />
                                            </fieldset>
                                        )}
                                        <fieldset className='account-form__fieldset'>
                                            <DateOfBirthField
                                                name='date_of_birth'
                                                label={localize('Date of birth*')}
                                                id='birth_day'
                                                disabled={isFieldDisabled('date_of_birth')}
                                                portal_id=''
                                                // @ts-expect-error this type value needs to be check again in GetSettings
                                                value={values.date_of_birth}
                                            />
                                        </fieldset>
                                        {'citizen' in values && (
                                            <fieldset className='account-form__fieldset'>
                                                <FormSelectField
                                                    label={localize('Citizenship')}
                                                    name='citizen'
                                                    list_items={residence_list}
                                                    disabled={isFieldDisabled('citizen')}
                                                />
                                            </fieldset>
                                        )}
                                    </React.Fragment>
                                )}
                                <fieldset className='account-form__fieldset'>
                                    <Input
                                        data-lpignore='true'
                                        type='text'
                                        name='residence'
                                        id={'residence'}
                                        label={localize('Country of residence*')}
                                        //@ts-expect-error type of residence should not be null: needs to be updated in GetSettings type
                                        value={values.residence}
                                        required
                                        disabled={isFieldDisabled('residence')}
                                        error={errors.residence}
                                        onChange={handleChange}
                                    />
                                </fieldset>
                                {!is_virtual && (
                                    <fieldset className='account-form__fieldset'>
                                        <Input
                                            data-lpignore='true'
                                            type='text'
                                            name='phone'
                                            id={'phone'}
                                            label={localize('Phone number*')}
                                            //@ts-expect-error type of residence should not be null: needs to be updated in GetSettings type
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            error={errors.phone}
                                            disabled={isFieldDisabled('phone')}
                                            data-testid='dt_phone'
                                        />
                                    </fieldset>
                                )}
                                <React.Fragment>
                                    {'tax_residence' in values && (
                                        <React.Fragment>
                                            <FormSubHeader title={localize('Tax information')} />
                                            {'tax_residence' in values && (
                                                <fieldset className='account-form__fieldset'>
                                                    <FormSelectField
                                                        label={localize('Tax residence*')}
                                                        name='tax_residence'
                                                        list_items={residence_list}
                                                        disabled={isFieldDisabled('tax_residence')}
                                                    />
                                                </fieldset>
                                            )}
                                            {'tax_identification_number' in values && (
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        type='text'
                                                        id={'tax_identification_number'}
                                                        name='tax_identification_number'
                                                        label={localize('Tax identification number*')}
                                                        //@ts-expect-error type of residence should not be null: needs to be updated in GetSettings type
                                                        value={values.tax_identification_number}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={errors.tax_identification_number}
                                                        disabled={isFieldDisabled('tax_identification_number')}
                                                        required
                                                    />
                                                </fieldset>
                                            )}
                                            {'employment_status' in values && (
                                                <fieldset className='account-form__fieldset'>
                                                    <DesktopWrapper>
                                                        <Dropdown
                                                            placeholder={localize('Employment status')}
                                                            is_align_text_left
                                                            name='employment_status'
                                                            list={getEmploymentStatusList()}
                                                            value={values.employment_status}
                                                            onChange={handleChange}
                                                            handleBlur={handleBlur}
                                                            error={
                                                                touched.employment_status
                                                                    ? errors.employment_status
                                                                    : undefined
                                                            }
                                                        />
                                                    </DesktopWrapper>
                                                    <MobileWrapper>
                                                        <SelectNative
                                                            className={'emp-status'}
                                                            placeholder={localize('Please select')}
                                                            name='employment_status'
                                                            label={localize('Employment status')}
                                                            list_items={getEmploymentStatusList()}
                                                            value={values.employment_status ?? ''}
                                                            error={
                                                                touched.employment_status
                                                                    ? errors.employment_status
                                                                    : undefined
                                                            }
                                                            onChange={e => {
                                                                setFieldTouched('employment_status', true);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                    </MobileWrapper>
                                                </fieldset>
                                            )}
                                        </React.Fragment>
                                    )}
                                    {!is_virtual && (
                                        <React.Fragment>
                                            {has_poa_address_mismatch && <POAAddressMismatchHintBox />}
                                            <FormSubHeader title={localize('Address')} />
                                            <div className='account-address__details-section'>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        autoComplete='off' // prevent chrome autocomplete
                                                        type='text'
                                                        maxLength={70}
                                                        name='address_line_1'
                                                        id='address_line_1'
                                                        label={localize('First line of address*')}
                                                        value={values.address_line_1}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={errors.address_line_1}
                                                        required
                                                        disabled={isFieldDisabled('address_line_1')}
                                                        data-testid='dt_address_line_1'
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        autoComplete='off' // prevent chrome autocomplete
                                                        type='text'
                                                        maxLength={70}
                                                        name='address_line_2'
                                                        id='address_line_2'
                                                        label={localize('Second line of address (optional)')}
                                                        value={values.address_line_2}
                                                        error={errors.address_line_2}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={isFieldDisabled('address_line_2')}
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        autoComplete='off' // prevent chrome autocomplete
                                                        type='text'
                                                        name='address_city'
                                                        id='address_city'
                                                        label={localize('Town/City*')}
                                                        value={values.address_city}
                                                        error={errors.address_city}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        disabled={isFieldDisabled('address_city')}
                                                        data-testid='dt_address_city'
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    {states_list.length ? (
                                                        <FormSelectField
                                                            label={localize('State/Province (optional)')}
                                                            name='address_state'
                                                            list_items={states_list}
                                                            disabled={isFieldDisabled('address_state')}
                                                        />
                                                    ) : (
                                                        <Input
                                                            data-lpignore='true'
                                                            autoComplete='off' // prevent chrome autocomplete
                                                            type='text'
                                                            name='address_state'
                                                            id='address_state'
                                                            label={localize('State/Province (optional)')}
                                                            value={values.address_state}
                                                            error={errors.address_state}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={isFieldDisabled('address_state')}
                                                        />
                                                    )}
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        autoComplete='off' // prevent chrome autocomplete
                                                        type='text'
                                                        name='address_postcode'
                                                        id='address_postcode'
                                                        label={localize('Postal/ZIP code')}
                                                        value={values.address_postcode}
                                                        error={errors.address_postcode}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        disabled={isFieldDisabled('address_postcode')}
                                                    />
                                                </fieldset>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                                {!!current_landing_company?.support_professional_client && (
                                    <React.Fragment>
                                        <div className='account-form__divider' />
                                        <div className='pro-client'>
                                            <FormSubHeader title={localize('Professional Client')} />
                                            <fieldset className='account-form__fieldset'>
                                                <div>
                                                    <Text as='p' size='xs'>
                                                        <Localize
                                                            i18n_default_text='By default, all {{brand_website_name}} clients are retail clients but anyone can request to be treated as a professional client.'
                                                            values={{
                                                                brand_website_name: getBrandWebsiteName(),
                                                            }}
                                                        />
                                                    </Text>
                                                    <Text as='p' size='xs'>
                                                        <Localize i18n_default_text='A professional client receives a lower degree of client protection due to the following.' />
                                                    </Text>
                                                    <Text as='p' size='xs'>
                                                        <Localize i18n_default_text='We presume that you possess the experience, knowledge, and expertise to make your own investment decisions and properly assess the risk involved.' />
                                                    </Text>
                                                    <Text as='p' size='xs' className='last-child'>
                                                        <Localize i18n_default_text='We’re not obliged to conduct an appropriateness test, nor provide you with any risk warnings.' />
                                                    </Text>
                                                </div>
                                                {is_account_verified ? (
                                                    <Checkbox
                                                        name='request_professional_status'
                                                        value={!!values.request_professional_status}
                                                        onChange={() => {
                                                            setFieldValue(
                                                                'request_professional_status',
                                                                values.request_professional_status ? 0 : 1
                                                            );
                                                            setFieldTouched('request_professional_status', true, true);
                                                        }}
                                                        label={localize(
                                                            'I would like to be treated as a professional client.'
                                                        )}
                                                        id='request_professional_status'
                                                        disabled={
                                                            is_virtual || !!account_settings.request_professional_status
                                                        }
                                                        greyDisabled
                                                    />
                                                ) : (
                                                    <HintBox
                                                        icon='IcInfoBlue'
                                                        icon_height={20}
                                                        icon_width={30}
                                                        message={
                                                            <Text as='p' size='xs'>
                                                                <Localize
                                                                    i18n_default_text='You’ll need to authenticate your account before requesting to become a professional client. <0>Authenticate my account</0>'
                                                                    components={[
                                                                        <a
                                                                            key={0}
                                                                            className='link--no-bold'
                                                                            rel='noopener noreferrer'
                                                                            target='_blank'
                                                                            href={getRedirectionLink()}
                                                                        />,
                                                                    ]}
                                                                />
                                                            </Text>
                                                        }
                                                        is_info
                                                        is_inline
                                                    />
                                                )}
                                            </fieldset>
                                        </div>
                                        <div className='account-form__divider' />
                                    </React.Fragment>
                                )}
                                <FormSubHeader title={localize('Email preference')} />
                                <React.Fragment>
                                    <fieldset
                                        className={classNames(
                                            'account-form__fieldset',
                                            'account-form__fieldset--email-consent'
                                        )}
                                    >
                                        <Checkbox
                                            name='email_consent'
                                            value={!!values.email_consent}
                                            onChange={() => {
                                                setFieldValue('email_consent', values.email_consent ? 0 : 1);
                                                setFieldTouched('email_consent', true, true);
                                            }}
                                            label={localize('Get updates about Deriv products, services and events.')}
                                            id='email_consent'
                                            defaultChecked={!!values.email_consent}
                                            disabled={isFieldDisabled('email_consent') && !is_virtual}
                                        />
                                    </fieldset>
                                </React.Fragment>
                            </FormBody>
                            <FormFooter>
                                {status?.msg && <FormSubmitErrorMessage message={status?.msg} />}
                                {!is_virtual && !(isSubmitting || is_submit_success || status?.msg) && (
                                    <Text
                                        className='account-form__footer-note'
                                        size='xxs'
                                        color='prominent'
                                        align={is_mobile ? 'center' : 'right'}
                                    >
                                        {localize(
                                            'Please make sure your information is correct or it may affect your trading experience.'
                                        )}
                                    </Text>
                                )}
                                <Button
                                    className={classNames('account-form__footer-btn', {
                                        'dc-btn--green': is_submit_success,
                                    })}
                                    type='submit'
                                    is_disabled={
                                        isSubmitting || !dirty || !isValid || is_btn_loading || is_submit_success
                                    }
                                    has_effect
                                    is_loading={is_btn_loading}
                                    is_submit_success={is_submit_success}
                                    text={localize('Submit')}
                                    large
                                    primary
                                />
                            </FormFooter>
                        </Form>
                    )}
                </React.Fragment>
            )}
        </Formik>
    );
});

export default withRouter(PersonalDetailsForm);
