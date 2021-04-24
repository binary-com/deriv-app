// import PropTypes        from 'prop-types';
import React from 'react';
import { Formik, Field } from 'formik';
import classNames from 'classnames';
import {
    Autocomplete,
    Checkbox,
    Button,
    FormSubmitErrorMessage,
    Input,
    DesktopWrapper,
    Loading,
    MobileWrapper,
    SelectNative,
    DateOfBirthPicker,
    Text,
} from '@deriv/components';
import {
    toMoment,
    isMobile,
    validAddress,
    validPostCode,
    validTaxID,
    validPhone,
    validLetterSymbol,
    validAlphabetSymbol,
    validLength,
    getLocation,
    removeObjProperties,
    filterObjProperties,
    PlatformContext,
    routes,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { withRouter } from 'react-router';
import { WS } from 'Services/ws-methods';
import { connect } from 'Stores/connect';
// import { account_opening_reason_list }         from './constants';
import LeaveConfirm from 'Components/leave-confirm';
import FormFooter from 'Components/form-footer';
import FormBody from 'Components/form-body';
import FormBodySection from 'Components/form-body-section';
import FormSubHeader from 'Components/form-sub-header';
import LoadErrorMessage from 'Components/load-error-message';

const validate = (errors, values) => (fn, arr, err_msg) => {
    arr.forEach(field => {
        const value = values[field];
        if (!fn(value) && !errors[field] && err_msg !== true) errors[field] = err_msg;
    });
};

const InputGroup = ({ children, className }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    if (is_dashboard) {
        return React.Children.map(children, child => <fieldset className='account-form__fieldset'>{child}</fieldset>);
    }
    return (
        <fieldset className='account-form__fieldset'>
            <div className={className}>{children}</div>
        </fieldset>
    );
};

const TaxResidenceSelect = ({ field, touched, errors, setFieldValue, values, is_changeable, residence_list }) => (
    <React.Fragment>
        <DesktopWrapper>
            <Autocomplete
                {...field}
                data-lpignore='true'
                autoComplete='new-password' // prevent chrome autocomplete
                type='text'
                label={localize('Tax residence*')}
                error={touched.tax_residence && errors.tax_residence}
                disabled={!is_changeable}
                list_items={residence_list}
                onItemSelection={({ value, text }) => setFieldValue('tax_residence', value ? text : '', true)}
                required
            />
        </DesktopWrapper>
        <MobileWrapper>
            <SelectNative
                placeholder={localize('Tax residence*')}
                label={localize('Tax residence*')}
                value={values.tax_residence}
                list_items={residence_list}
                error={touched.tax_residence && errors.tax_residence}
                disabled={!is_changeable}
                use_text={true}
                onChange={e => setFieldValue('tax_residence', e.target.value, true)}
                required
            />
        </MobileWrapper>
    </React.Fragment>
);

export class PersonalDetailsForm extends React.Component {
    static contextType = PlatformContext;

    state = { is_loading: true, is_state_loading: false, show_form: true };

    onSubmit = async (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });
        const request = this.makeSettingsRequest(values);
        this.setState({ is_btn_loading: true });
        const data = await WS.setSettings(request);

        if (data.error) {
            setStatus({ msg: data.error.message });
            this.setState({ is_btn_loading: false });
            setSubmitting(false);
        } else {
            // force request to update settings cache since settings have been updated
            const response = await WS.authorized.storage.getSettings();
            if (response.error) {
                this.setState({ api_error: response.error.message });
                return;
            }
            this.setState({ ...response.get_settings, is_loading: false });
            this.props.refreshNotifications();
            this.setState({ is_btn_loading: false, is_submit_success: true });
            setTimeout(() => {
                this.setState({ is_submit_success: false }, () => {
                    setSubmitting(false);
                });
            }, 3000);
            // redirection back based on 'from' param in query string
            const url_query_string = window.location.search;
            const url_params = new URLSearchParams(url_query_string);
            if (url_params.get('from')) {
                this.props.history.push(routes[url_params.get('from')]);
            }
        }
    };

    makeSettingsRequest = settings => {
        const { is_mf, is_virtual, residence_list, states_list } = this.props;
        if (is_virtual) return { email_consent: +settings.email_consent };
        const request = filterObjProperties(settings, [...this.state.changeable_fields]);

        request.email_consent = +request.email_consent; // checkbox is boolean but api expects number (1 or 0)
        if (request.first_name) {
            request.first_name = request.first_name.trim();
        }

        if (request.last_name) {
            request.last_name = request.last_name.trim();
        }
        if (request.date_of_birth) {
            request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
        }

        if (is_mf) {
            if (request.tax_residence) {
                request.tax_residence = getLocation(residence_list, request.tax_residence, 'value');
            }

            if (request.tax_identification_number) {
                request.tax_identification_number = request.tax_identification_number.trim();
            }
        }

        if (request.citizen) {
            request.citizen = getLocation(residence_list, request.citizen, 'value');
        }

        if (request.place_of_birth) {
            request.place_of_birth = getLocation(residence_list, request.place_of_birth, 'value');
        } else {
            delete request.place_of_birth;
        }

        if (request.address_state) {
            request.address_state = states_list.length
                ? getLocation(states_list, request.address_state, 'value')
                : request.address_state;
        }

        return request;
    };

    // TODO: standardize validations and refactor this
    validateFields = values => {
        const { is_eu, is_mf, residence_list, states_list, is_virtual } = this.props;
        this.setState({ is_submit_success: false });
        const errors = {};
        const validateValues = validate(errors, values);

        if (is_virtual) return errors;

        const required_fields = [
            'first_name',
            'last_name',
            'phone',
            // 'account_opening_reason',
            'address_line_1',
            'address_city',
        ];
        if (is_eu) {
            required_fields.push('citizen');
        }
        if (is_mf) {
            const required_tax_fields = ['tax_residence', 'tax_identification_number'];
            required_fields.push(...required_tax_fields);
        }

        validateValues(val => val, required_fields, localize('This field is required'));
        const only_alphabet_fields = ['first_name', 'last_name'];
        validateValues(validAlphabetSymbol, only_alphabet_fields, localize('Only alphabet is allowed'));

        const residence_fields = ['citizen'];
        const validateResidence = val => getLocation(residence_list, val, 'value');
        validateValues(validateResidence, residence_fields, true);

        const min_tax_identification_number = 0;
        const max_tax_identification_number = 20;
        if (values.tax_identification_number) {
            if (!validTaxID(values.tax_identification_number.trim())) {
                errors.tax_identification_number = localize(
                    'Should start with letter or number, and may contain hyphen and underscore.'
                );
            } else if (
                !validLength(values.tax_identification_number.trim(), {
                    min: min_tax_identification_number,
                    max: max_tax_identification_number,
                })
            ) {
                errors.tax_identification_number = localize('You should enter 0-20 characters.');
            }
        }

        const min_name = 2;
        const max_name = 50;
        if (values.first_name && !validLength(values.first_name.trim(), { min: min_name, max: max_name })) {
            errors.first_name = localize('You should enter 2-50 characters.');
        }
        if (values.last_name && !validLength(values.last_name.trim(), { min: min_name, max: max_name })) {
            errors.last_name = localize('You should enter 2-50 characters.');
        }

        if (values.phone) {
            // minimum characters required is 9 numbers (excluding +- signs or space)
            const min_phone_number = 9;
            const max_phone_number = 35;
            // phone_trim uses regex that trims non-digits
            const phone_trim = values.phone.replace(/\D/g, '');
            const phone_error_message = localize('Please enter a valid phone number (e.g. +15417541234).');

            if (!validLength(phone_trim, { min: min_phone_number, max: max_phone_number })) {
                errors.phone = localize('You should enter {{min}}-{{max}} numbers.', {
                    min: min_phone_number,
                    max: max_phone_number,
                });
            } else if (!validPhone(values.phone)) {
                errors.phone = phone_error_message;
            }
        }

        const permitted_characters = "- . ' # ; : ( ) , @ /";
        const address_validation_message = localize(
            'Only letters, numbers, space, and these special characters are allowed: {{ permitted_characters }}',
            {
                permitted_characters,
                interpolation: { escapeValue: false },
            }
        );

        if (values.address_line_1 && !validAddress(values.address_line_1)) {
            errors.address_line_1 = address_validation_message;
        }
        if (values.address_line_2 && !validAddress(values.address_line_2)) {
            errors.address_line_2 = address_validation_message;
        }

        if (values.address_city && !validLetterSymbol(values.address_city)) {
            errors.address_city = localize('Only letters, space, hyphen, period, and apostrophe are allowed.');
        }

        const state_is_input_element = values.address_state && !states_list.length;
        if (state_is_input_element) {
            if (!validLength(values.address_state, { min: 0, max: 35 })) {
                errors.address_state = localize('You should enter 0-35 characters.');
            } else if (!/^[\w\s\W'.-;,]{0,35}$/.test(values.address_state)) {
                errors.address_state = localize('State is not in a proper format');
            }
        }

        if (values.address_postcode) {
            if (!validLength(values.address_postcode, { min: 0, max: 20 })) {
                errors.address_postcode = localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                    field_name: localize('postal/ZIP code'),
                    max_number: 20,
                    interpolation: { escapeValue: false },
                });
            } else if (!validPostCode(values.address_postcode)) {
                errors.address_postcode = localize('Only letters, numbers, space, and hyphen are allowed.');
            }
        }

        return errors;
    };

    showForm = show_form => this.setState({ show_form });

    isChangeableField(name) {
        return this.state.changeable_fields.some(field => field === name);
    }

    onScrollToRefMount = node => {
        // wait for node to be rendered, if node exists check the hash in url to scroll down to
        const section_hash = window.location.hash.substr(1);

        if (node?.name === section_hash) {
            node?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            // smooth scrolling animation is ~500ms, focus event cancels out scroll animation, hence the timeout offset
            setTimeout(() => {
                node?.focus();
            }, 800);
        }
    };

    async componentDidMount() {
        // waits for residence to be populated
        await WS.wait('get_settings');

        const { fetchResidenceList, fetchStatesList, has_residence } = this.props;

        fetchResidenceList();
        if (has_residence) {
            this.setState({ is_state_loading: true }, () => {
                fetchStatesList().then(() => {
                    this.setState({ is_state_loading: false });
                });
            });
        }
        this.initializeFormValues();
    }

    componentDidUpdate(prevProps) {
        if (
            Object.values(this.props.account_settings).join('|') !==
                Object.values(prevProps.account_settings).join('|') ||
            this.props.is_eu !== prevProps.is_eu ||
            this.props.is_mf !== prevProps.is_mf
        ) {
            this.initializeFormValues();
        }
    }

    initializeFormValues() {
        WS.wait('landing_company', 'get_account_status', 'get_settings').then(() => {
            const { is_dashboard } = this.context;
            const { getChangeableFields, is_virtual, account_settings, is_mf, is_eu } = this.props;

            // Convert to boolean
            account_settings.email_consent = !!account_settings.email_consent;
            const hidden_settings = [
                'account_opening_reason',
                'allow_copiers',
                !is_mf && 'tax_residence',
                !is_mf && 'tax_identification_number',
                'client_tnc_status',
                'country_code',
                'has_secret_answer',
                'is_authenticated_payment_agent',
                'user_hash',
                'country',
                (!is_dashboard || !is_eu) && 'salutation',
                'request_professional_status',
                'immutable_fields',
            ];
            const form_initial_values = removeObjProperties(hidden_settings, account_settings);
            this.setState({
                changeable_fields: is_virtual ? [] : getChangeableFields(),
                is_loading: false,
                form_initial_values,
            });
        });
    }

    salutation_list = [
        { text: localize('Mr'), value: 'Mr' },
        { text: localize('Mrs'), value: 'Mrs' },
        { text: localize('Ms'), value: 'Ms' },
        { text: localize('Miss'), value: 'Miss' },
    ];
    render() {
        const {
            form_initial_values: { ...form_initial_values },
            api_error,
            is_loading,
            is_state_loading,
            is_btn_loading,
            is_submit_success,
            show_form,
        } = this.state;

        const { is_dashboard } = this.context;
        const { is_eu, residence_list, states_list, is_virtual, is_mf, is_svg } = this.props;
        if (api_error) return <LoadErrorMessage error_message={api_error} />;

        if (is_loading || is_state_loading || !residence_list.length) {
            return <Loading is_fullscreen={false} className='account__initial-loader' />;
        }

        form_initial_values.citizen = form_initial_values.citizen
            ? getLocation(residence_list, form_initial_values.citizen, 'text')
            : '';
        form_initial_values.place_of_birth = form_initial_values.place_of_birth
            ? getLocation(residence_list, form_initial_values.place_of_birth, 'text')
            : '';
        if (form_initial_values.address_state) {
            form_initial_values.address_state = states_list.length
                ? getLocation(states_list, form_initial_values.address_state, 'text')
                : form_initial_values.address_state;
        } else {
            form_initial_values.address_state = '';
        }
        if (is_mf) {
            if (form_initial_values.tax_residence) {
                const is_single_tax_value = form_initial_values.tax_residence.indexOf(',') < 0;
                // if there's only one tax residence set, show it in drop-down
                if (is_single_tax_value) {
                    form_initial_values.tax_residence = getLocation(
                        residence_list,
                        form_initial_values.tax_residence,
                        'text'
                    );
                } else if (this.isChangeableField('tax_residence')) {
                    // if there are multiple tax residences and user is allowed to update it
                    // select the first tax residence in drop-down
                    const first_tax_residence = form_initial_values.tax_residence.split(',')[0];
                    form_initial_values.tax_residence = getLocation(residence_list, first_tax_residence, 'text');
                } else {
                    // otherwise show all tax residences in a disabled input field
                    const tax_residences = [];
                    form_initial_values.tax_residence.split(',').forEach(residence => {
                        tax_residences.push(getLocation(residence_list, residence, 'text'));
                    });
                    form_initial_values.tax_residence = tax_residences;
                }
            } else {
                form_initial_values.tax_residence = '';
            }
            if (!form_initial_values.tax_identification_number) form_initial_values.tax_identification_number = '';
        }

        return (
            <Formik
                initialValues={form_initial_values}
                enableReinitialize={true}
                onSubmit={this.onSubmit}
                validate={this.validateFields}
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
                    setFieldValue,
                    setFieldTouched,
                    setTouched,
                    dirty,
                }) => (
                    <>
                        <LeaveConfirm onDirty={isMobile() ? this.showForm : null} />
                        {show_form && (
                            <form
                                noValidate
                                className={classNames('account-form account-form__personal-details', {
                                    'account-form account-form__personal-details--dashboard': is_dashboard,
                                })}
                                onSubmit={handleSubmit}
                            >
                                <FormBody scroll_offset={isMobile() ? '199px' : '80px'}>
                                    <FormSubHeader title={localize('Details')} />
                                    {!is_virtual && (
                                        <React.Fragment>
                                            <FormBodySection
                                                has_side_note={is_dashboard}
                                                side_note={localize(
                                                    'We use the information you give us only for verification purposes. All information is kept confidential.'
                                                )}
                                            >
                                                {is_dashboard && is_eu && (
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Field name='salutation'>
                                                                {({ field }) => (
                                                                    <Autocomplete
                                                                        {...field}
                                                                        data-lpignore='true'
                                                                        autoComplete='new-password' // prevent chrome autocomplete
                                                                        type='text'
                                                                        label={localize('Title*')}
                                                                        error={touched.salutation && errors.salutation}
                                                                        list_items={this.salutation_list}
                                                                        onItemSelection={({ value, text }) =>
                                                                            setFieldValue(
                                                                                'salutation',
                                                                                value ? text : '',
                                                                                true
                                                                            )
                                                                        }
                                                                        disabled={!this.isChangeableField('salutation')}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('Title')}
                                                                value={values.salutation}
                                                                list_items={this.salutation_list}
                                                                use_text={true}
                                                                error={touched.salutation && errors.salutation}
                                                                onChange={e =>
                                                                    setFieldValue('salutation', e.target.value, true)
                                                                }
                                                                disabled={!this.isChangeableField('salutation')}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                )}
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
                                                            disabled={!this.isChangeableField('first_name')}
                                                            error={touched.first_name && errors.first_name}
                                                        />
                                                        <Input
                                                            data-lpignore='true'
                                                            type='text'
                                                            name='last_name'
                                                            label={localize('Last name*')}
                                                            value={values.last_name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            disabled={!this.isChangeableField('last_name')}
                                                            error={touched.last_name && errors.last_name}
                                                        />
                                                    </InputGroup>
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <fieldset className='account-form__fieldset'>
                                                        <Input
                                                            data-lpignore='true'
                                                            type='text'
                                                            name='first_name'
                                                            label={localize('First name*')}
                                                            value={values.first_name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            disabled={!this.isChangeableField('first_name')}
                                                            error={touched.first_name && errors.first_name}
                                                        />
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <Input
                                                            data-lpignore='true'
                                                            type='text'
                                                            name='last_name'
                                                            label={localize('Last name*')}
                                                            value={values.last_name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            disabled={!this.isChangeableField('last_name')}
                                                            error={touched.last_name && errors.last_name}
                                                        />
                                                    </fieldset>
                                                </MobileWrapper>
                                                <fieldset className='account-form__fieldset'>
                                                    <DesktopWrapper>
                                                        <Field name='place_of_birth'>
                                                            {({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                                    type='text'
                                                                    label={
                                                                        is_svg
                                                                            ? localize('Place of birth')
                                                                            : localize('Place of birth*')
                                                                    }
                                                                    error={
                                                                        touched.place_of_birth && errors.place_of_birth
                                                                    }
                                                                    required={!is_svg}
                                                                    disabled={!this.isChangeableField('place_of_birth')}
                                                                    list_items={residence_list}
                                                                    onItemSelection={({ value, text }) =>
                                                                        setFieldValue(
                                                                            'place_of_birth',
                                                                            value ? text : '',
                                                                            true
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                    </DesktopWrapper>
                                                    <MobileWrapper>
                                                        <SelectNative
                                                            placeholder={localize('Please select')}
                                                            label={
                                                                is_svg
                                                                    ? localize('Place of birth')
                                                                    : localize('Place of birth*')
                                                            }
                                                            required={!is_svg}
                                                            disabled={!this.isChangeableField('place_of_birth')}
                                                            value={values.place_of_birth}
                                                            list_items={residence_list}
                                                            use_text={true}
                                                            error={touched.place_of_birth && errors.place_of_birth}
                                                            onChange={e =>
                                                                setFieldValue('place_of_birth', e.target.value, true)
                                                            }
                                                        />
                                                    </MobileWrapper>
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <DateOfBirthPicker
                                                        name='date_of_birth'
                                                        label={localize('Date of birth*')}
                                                        error={touched.date_of_birth && errors.date_of_birth}
                                                        onBlur={() => setTouched({ date_of_birth: true })}
                                                        onChange={({ target }) =>
                                                            setFieldValue(
                                                                'date_of_birth',
                                                                target?.value
                                                                    ? toMoment(target.value).format('YYYY-MM-DD')
                                                                    : '',
                                                                true
                                                            )
                                                        }
                                                        disabled={!this.isChangeableField('date_of_birth')}
                                                        value={values.date_of_birth}
                                                    />
                                                </fieldset>
                                                <fieldset className='account-form__fieldset'>
                                                    <DesktopWrapper>
                                                        <Field name='citizen'>
                                                            {({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    data-lpignore='true'
                                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                                    type='text'
                                                                    label={
                                                                        is_eu
                                                                            ? localize('Citizenship*')
                                                                            : localize('Citizenship')
                                                                    }
                                                                    error={touched.citizen && errors.citizen}
                                                                    disabled={!this.isChangeableField('citizen')}
                                                                    list_items={residence_list}
                                                                    onItemSelection={({ value, text }) =>
                                                                        setFieldValue(
                                                                            'citizen',
                                                                            value ? text : '',
                                                                            true
                                                                        )
                                                                    }
                                                                    required={is_eu}
                                                                />
                                                            )}
                                                        </Field>
                                                    </DesktopWrapper>
                                                    <MobileWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={
                                                                    is_eu
                                                                        ? localize('Citizenship*')
                                                                        : localize('Citizenship')
                                                                }
                                                                required={is_eu}
                                                                disabled={!this.isChangeableField('citizen')}
                                                                value={values.citizen}
                                                                list_items={residence_list}
                                                                error={touched.citizen && errors.citizen}
                                                                use_text={true}
                                                                onChange={e =>
                                                                    setFieldValue('citizen', e.target.value, true)
                                                                }
                                                                should_hide_disabled_options={false}
                                                            />
                                                        </MobileWrapper>
                                                    </MobileWrapper>
                                                </fieldset>
                                            </FormBodySection>
                                        </React.Fragment>
                                    )}
                                    <FormBodySection has_side_note={is_dashboard}>
                                        <fieldset className='account-form__fieldset'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='residence'
                                                label={localize('Country of residence*')}
                                                value={values.residence}
                                                required
                                                disabled={!this.isChangeableField('residence')}
                                                error={touched.residence && errors.residence}
                                                onChange={handleChange}
                                            />
                                        </fieldset>
                                        <fieldset className='account-form__fieldset'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='email'
                                                label={localize('Email address*')}
                                                value={values.email}
                                                required
                                                disabled={!this.isChangeableField('email')}
                                                error={touched.email && errors.email}
                                                onChange={handleChange}
                                            />
                                        </fieldset>
                                    </FormBodySection>
                                    {!is_virtual && (
                                        <React.Fragment>
                                            <FormBodySection has_side_note={is_dashboard}>
                                                <fieldset className='account-form__fieldset'>
                                                    <Input
                                                        data-lpignore='true'
                                                        type='text'
                                                        name='phone'
                                                        label={localize('Phone number*')}
                                                        value={values.phone}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        required
                                                        error={touched.phone && errors.phone}
                                                    />
                                                </fieldset>
                                            </FormBodySection>
                                        </React.Fragment>
                                    )}
                                    <React.Fragment>
                                        {/* Hide Account Opening Reason, uncomment block below to re-enable */}
                                        {/* <fieldset className='account-form__fieldset'> */}
                                        {/*    {account_opening_reason && is_fully_authenticated ? ( */}
                                        {/*        <Input */}
                                        {/*            data-lpignore='true' */}
                                        {/*            type='text' */}
                                        {/*            name='account_opening_reason' */}
                                        {/*            label={localize('Account opening reason')} */}
                                        {/*            value={values.account_opening_reason} */}
                                        {/*            disabled */}
                                        {/*        /> */}
                                        {/*    ) : ( */}
                                        {/*        <Dropdown */}
                                        {/*            placeholder={'Account opening reason'} */}
                                        {/*            is_align_text_left */}
                                        {/*            name='account_opening_reason' */}
                                        {/*            list={account_opening_reason_list} */}
                                        {/*            value={values.account_opening_reason} */}
                                        {/*            onChange={handleChange} */}
                                        {/*            handleBlur={handleBlur} */}
                                        {/*            error={ */}
                                        {/*                touched.account_opening_reason && */}
                                        {/*                errors.account_opening_reason */}
                                        {/*            } */}
                                        {/*        /> */}
                                        {/*    )} */}
                                        {/* </fieldset> */}
                                        {is_mf && (
                                            <React.Fragment>
                                                <FormSubHeader title={localize('Tax information')} />
                                                <FormBodySection
                                                    has_side_note={is_dashboard}
                                                    side_note={localize(
                                                        'We’re legally obliged to ask for your tax information.'
                                                    )}
                                                >
                                                    {'tax_residence' in values && (
                                                        <fieldset className='account-form__fieldset'>
                                                            <Field name='tax_residence'>
                                                                {({ field }) => (
                                                                    <React.Fragment>
                                                                        {Array.isArray(values.tax_residence) &&
                                                                        !this.isChangeableField('tax_residence') ? (
                                                                            <fieldset className='account-form__fieldset'>
                                                                                <Input
                                                                                    type='text'
                                                                                    name='tax_residence'
                                                                                    label={localize('Tax residence*')}
                                                                                    value={values.tax_residence.join(
                                                                                        ', '
                                                                                    )}
                                                                                    disabled
                                                                                />
                                                                            </fieldset>
                                                                        ) : (
                                                                            <TaxResidenceSelect
                                                                                is_changeable={this.isChangeableField(
                                                                                    'tax_residence'
                                                                                )}
                                                                                field={field}
                                                                                touched={touched}
                                                                                errors={errors}
                                                                                setFieldValue={setFieldValue}
                                                                                values={values}
                                                                                residence_list={
                                                                                    this.props.residence_list
                                                                                }
                                                                            />
                                                                        )}
                                                                    </React.Fragment>
                                                                )}
                                                            </Field>
                                                        </fieldset>
                                                    )}
                                                    {'tax_identification_number' in values && (
                                                        <fieldset className='account-form__fieldset'>
                                                            <Input
                                                                data-lpignore='true'
                                                                type='text'
                                                                name='tax_identification_number'
                                                                label={localize('Tax identification number*')}
                                                                value={values.tax_identification_number}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={
                                                                    touched.tax_identification_number &&
                                                                    errors.tax_identification_number
                                                                }
                                                                disabled={
                                                                    !this.isChangeableField('tax_identification_number')
                                                                }
                                                                required
                                                            />
                                                        </fieldset>
                                                    )}
                                                </FormBodySection>
                                            </React.Fragment>
                                        )}
                                        {!is_dashboard && !is_virtual && (
                                            <React.Fragment>
                                                <FormSubHeader title={localize('Address')} />
                                                <FormBodySection has_side_note={is_dashboard}>
                                                    <div className='account-address__details-section'>
                                                        <fieldset className='account-form__fieldset'>
                                                            <Input
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                type='text'
                                                                maxLength={70}
                                                                name='address_line_1'
                                                                label={localize('First line of address*')}
                                                                value={values.address_line_1}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={touched.address_line_1 && errors.address_line_1}
                                                                required
                                                                disabled={!this.isChangeableField('address_line_1')}
                                                            />
                                                        </fieldset>
                                                        <fieldset className='account-form__fieldset'>
                                                            <Input
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                type='text'
                                                                maxLength={70}
                                                                name='address_line_2'
                                                                label={localize('Second line of address (optional)')}
                                                                value={values.address_line_2}
                                                                error={touched.address_line_2 && errors.address_line_2}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                required
                                                                disabled={!this.isChangeableField('address_line_2')}
                                                            />
                                                        </fieldset>
                                                        <fieldset className='account-form__fieldset'>
                                                            <Input
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                type='text'
                                                                name='address_city'
                                                                label={localize('Town/City*')}
                                                                value={values.address_city}
                                                                error={touched.address_city && errors.address_city}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                required
                                                                disabled={!this.isChangeableField('address_city')}
                                                            />
                                                        </fieldset>
                                                        <fieldset className='account-form__fieldset'>
                                                            {states_list.length ? (
                                                                <>
                                                                    <DesktopWrapper>
                                                                        <Field name='address_state'>
                                                                            {({ field }) => (
                                                                                <Autocomplete
                                                                                    {...field}
                                                                                    data-lpignore='true'
                                                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                                                    type='text'
                                                                                    label={localize(
                                                                                        'State/Province (optional)'
                                                                                    )}
                                                                                    error={
                                                                                        touched.address_state &&
                                                                                        errors.address_state
                                                                                    }
                                                                                    list_items={states_list}
                                                                                    onItemSelection={({
                                                                                        value,
                                                                                        text,
                                                                                    }) =>
                                                                                        setFieldValue(
                                                                                            'address_state',
                                                                                            value ? text : '',
                                                                                            true
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        !this.isChangeableField(
                                                                                            'address_state'
                                                                                        )
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </Field>
                                                                    </DesktopWrapper>
                                                                    <MobileWrapper>
                                                                        <SelectNative
                                                                            placeholder={localize('Please select')}
                                                                            label={localize(
                                                                                'State/Province (optional)'
                                                                            )}
                                                                            value={values.address_state}
                                                                            list_items={states_list}
                                                                            error={
                                                                                touched.address_state &&
                                                                                errors.address_state
                                                                            }
                                                                            use_text={true}
                                                                            onChange={e =>
                                                                                setFieldValue(
                                                                                    'address_state',
                                                                                    e.target.value,
                                                                                    true
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                !this.isChangeableField('address_state')
                                                                            }
                                                                        />
                                                                    </MobileWrapper>
                                                                </>
                                                            ) : (
                                                                <Input
                                                                    data-lpignore='true'
                                                                    autoComplete='off' // prevent chrome autocomplete
                                                                    type='text'
                                                                    name='address_state'
                                                                    label={localize('State/Province (optional)')}
                                                                    value={values.address_state}
                                                                    error={
                                                                        touched.address_state && errors.address_state
                                                                    }
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    disabled={!this.isChangeableField('address_state')}
                                                                />
                                                            )}
                                                        </fieldset>
                                                        <fieldset className='account-form__fieldset'>
                                                            <Input
                                                                data-lpignore='true'
                                                                autoComplete='off' // prevent chrome autocomplete
                                                                type='text'
                                                                name='address_postcode'
                                                                label={localize('Postal/ZIP code')}
                                                                value={values.address_postcode}
                                                                error={
                                                                    touched.address_postcode && errors.address_postcode
                                                                }
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                disabled={!this.isChangeableField('address_postcode')}
                                                            />
                                                        </fieldset>
                                                    </div>
                                                </FormBodySection>
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                    <FormSubHeader title={localize('Email preference')} />
                                    <FormBodySection
                                        has_side_note={is_dashboard}
                                        side_note={localize('Check this box to receive updates via email.')}
                                    >
                                        <fieldset className='account-form__fieldset'>
                                            <Checkbox
                                                name='email_consent'
                                                value={values.email_consent}
                                                onChange={() => {
                                                    setFieldValue('email_consent', !values.email_consent);
                                                    setFieldTouched('email_consent', true, true);
                                                }}
                                                label={localize(
                                                    'Get updates about Deriv products, services and events.'
                                                )}
                                                defaultChecked={!!values.email_consent}
                                                disabled={!this.isChangeableField('email_consent') && !is_virtual}
                                                className={is_dashboard && 'dc-checkbox-blue'}
                                            />
                                        </fieldset>
                                    </FormBodySection>
                                </FormBody>
                                <FormFooter>
                                    {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                    {!this.props.is_virtual &&
                                        !(isSubmitting || is_submit_success || (status && status.msg)) && (
                                            <Text className='account-form__footer-note' size='xxxs'>
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
                                            isSubmitting ||
                                            !dirty ||
                                            (is_virtual
                                                ? false
                                                : !!(
                                                      errors.first_name ||
                                                      !values.first_name ||
                                                      errors.last_name ||
                                                      !values.last_name ||
                                                      errors.phone ||
                                                      !values.phone ||
                                                      (is_mf && errors.tax_residence) ||
                                                      (is_mf && !values.tax_residence) ||
                                                      (is_mf && errors.tax_identification_number) ||
                                                      (is_mf && !values.tax_identification_number) ||
                                                      (!is_svg && errors.place_of_birth) ||
                                                      (!is_svg && !values.place_of_birth) ||
                                                      // (errors.account_opening_reason || !values.account_opening_reason) ||
                                                      errors.address_line_1 ||
                                                      !values.address_line_1 ||
                                                      errors.address_line_2 ||
                                                      errors.address_city ||
                                                      !values.address_city ||
                                                      errors.address_state ||
                                                      errors.address_postcode
                                                  ))
                                        }
                                        has_effect
                                        is_loading={is_btn_loading}
                                        is_submit_success={is_submit_success}
                                        text={is_dashboard ? localize('Save') : localize('Submit')}
                                        large
                                        primary
                                    />
                                </FormFooter>
                            </form>
                        )}
                    </>
                )}
            </Formik>
        );
    }
}

// PersonalDetailsForm.propTypes = {};
export default connect(({ client }) => ({
    account_settings: client.account_settings,
    has_residence: client.has_residence,
    getChangeableFields: client.getChangeableFields,
    is_eu: client.is_eu,
    is_mf: client.landing_company_shortcode === 'maltainvest',
    is_svg: client.is_svg,
    is_virtual: client.is_virtual,
    residence_list: client.residence_list,
    states_list: client.states_list,
    fetchResidenceList: client.fetchResidenceList,
    fetchStatesList: client.fetchStatesList,
    refreshNotifications: client.refreshNotifications,
}))(withRouter(PersonalDetailsForm));
