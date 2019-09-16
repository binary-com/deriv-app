// import PropTypes        from 'prop-types';
import React                                   from 'react';
import { Formik, Field }                       from 'formik';
import {
    Autocomplete,
    Checkbox,
    Button,
    Dropdown,
    Input }                                    from 'deriv-components';
import { localize }                            from 'App/i18n';
import { WS }                                  from 'Services';
import { connect }                             from 'Stores/connect';
// import { formatDate }                       from 'Utils/Date';
import { account_opening_reason_list }         from './constants';
import Loading                                 from '../../../../../templates/app/components/loading.jsx';
import FormSubmitErrorMessage                  from '../../ErrorMessages/FormSubmitErrorMessage';
import LoadErrorMessage                        from '../../ErrorMessages/LoadErrorMessage';
import ButtonLoading                           from '../../../Components/button-loading.jsx';
import { LeaveConfirm }                        from '../../../Components/leave-confirm.jsx';
import { FormFooter, FormBody, FormSubHeader } from '../../../Components/layout-components.jsx';

const getResidence = (residence_list, value, type) => {
    const residence = residence_list.find(location =>
        location[type === 'text' ? 'value' : 'text'].toLowerCase() === value.toLowerCase());

    if (residence) return residence[type];
    return '';
};

const makeSettingsRequest = ({ ...settings }, residence_list) => {
    let { email_consent }                                           = settings;
    const { tax_residence_text, citizen_text, place_of_birth_text } = settings;

    email_consent = +email_consent; // checkbox is boolean but api expects number (1 or 0)

    const tax_residence  = tax_residence_text ? getResidence(residence_list, tax_residence_text, 'value') : '';
    const citizen        = citizen_text ? getResidence(residence_list, citizen_text, 'value') : '';
    const place_of_birth = place_of_birth_text ? getResidence(residence_list, place_of_birth_text, 'value') : '';

    const settings_to_be_removed_for_api = [
        'email',
        'email_consent',
        'citizen_text',
        'place_of_birth_text',
        'tax_residence_text',
        'residence',
    ];
    settings_to_be_removed_for_api.forEach(setting => delete settings[setting]);

    return { ...settings, citizen, tax_residence, email_consent, place_of_birth };
};

// TODO: generalize validation and make it sharable
const isValidPhoneNumber = phone_number => /^\+?((-|\s)*[0-9])*$/.test(phone_number);
const isValidLetterSymbol = value => !/[`~!@#$%^&*)(_=+[}{\]\\/";:?><,|\d]+/.test(value);
const isValidLength = (value, min, max) =>  value.length > min && value.length < max;

const InputGroup = ({ children, className }) => (
    <fieldset className='account-management-form-fieldset'>
        <div className={className}>{children}</div>
    </fieldset>
);

class PersonalDetailsForm extends React.Component {
    state = { is_loading: true, show_form: true }

    onSubmit = (values, { setStatus, setSubmitting }) => {
        setStatus({ msg: '' });
        // TODO: Refactor requests for virtual and real accounts
        const email_consent_value = values.email_consent ? 1 : 0;
        const request = this.props.is_virtual ?
            { 'email_consent': email_consent_value }
            : makeSettingsRequest(values, this.props.residence_list);
        this.setState({ is_btn_loading: true });
        WS.setSettings(request).then((data) => {
            this.setState({ is_btn_loading: false });
            setSubmitting(false);
            if (data.error) {
                setStatus({ msg: data.error.message });
            } else {
                // force request to update settings cache since settings have been updated
                WS.authorized.storage.getSettings();
                this.setState({ is_submit_success: true });
            }
        });
    }

    validateFields = (values) => {
        this.setState({ is_submit_success: false });
        const errors = {};

        if (this.props.is_virtual) return errors;

        const required_fields = ['first_name', 'last_name', 'phone', 'account_opening_reason', 'place_of_birth_text'];
        required_fields.forEach(field => {
            if (!values[field]) errors[field] = localize('This field is required');
        });

        const min_phone_number = 8;
        const max_phone_number = 35;
        if (values.phone && !isValidPhoneNumber(values.phone)) {
            errors.phone = localize('Only numbers, hyphens, and spaces are allowed.');
        }  else if (values.phone && !isValidLength(values.phone.trim(), min_phone_number, max_phone_number)) {
            errors.phone = localize('You should enter 8-35 characters.');
        }

        const only_alphabet_fields = ['first_name', 'last_name'];
        only_alphabet_fields.forEach(field => {
            if (values[field] && !isValidLetterSymbol(values[field])) {
                errors[field] = localize('Only alphabet is allowed');
            }
        });

        const { residence_list } = this.props;
        const country_dropdown_fields = ['place_of_birth_text', 'tax_residence_text', 'citizen_text'];
        country_dropdown_fields.forEach(field => {
            if (values[field] && !getResidence(residence_list, values[field], 'value')) {
                errors[field] = localize('Please enter a country or choose one from the dropdown menu');
            }
        });

        return errors;
    };

    showForm = show_form => this.setState({ show_form });

    render() {
        const {
            api_initial_load_error,
            account_opening_reason,
            // date_of_birth,
            first_name,
            last_name,
            citizen,
            email,
            place_of_birth,
            phone,
            email_consent,
            residence,
            tax_residence,
            show_form,
            is_loading,
            is_btn_loading,
            is_submit_success,
        } = this.state;

        let { tax_identification_number } = this.state;

        const { residence_list } = this.props;

        if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;

        if (is_loading || !residence_list.length) return <Loading is_fullscreen={false}  className='initial-loader--accounts-modal' />;

        let citizen_text = '';
        let tax_residence_text = '';
        let place_of_birth_text = '';
        if (this.props.residence_list.length) {
            citizen_text = citizen ? getResidence(residence_list, citizen, 'text') : '';
            tax_residence_text = tax_residence ? getResidence(residence_list, tax_residence, 'text') : '';
            place_of_birth_text = place_of_birth ? getResidence(residence_list, place_of_birth, 'text') : '';
        }

        if (!tax_residence_text) tax_residence_text = '';
        if (!tax_identification_number) tax_identification_number = '';

        return (
            <Formik
                initialValues={{
                    account_opening_reason,
                    first_name,
                    last_name,
                    citizen_text,
                    tax_residence_text,
                    place_of_birth_text,
                    phone,
                    email,
                    email_consent,
                    residence,
                    tax_identification_number,
                }}
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
                }) => (
                    <>
                        <LeaveConfirm onDirty={this.showForm} />
                        { show_form && (
                            <form className='account-management-form' onSubmit={handleSubmit}>
                                <FormBody scroll_offset='55px'>
                                    <FormSubHeader title={localize('Details')} />
                                    {!this.props.is_virtual &&
                                    <React.Fragment>
                                        <InputGroup className='grid-2-cols'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='first_name'
                                                label={localize('First name')}
                                                value={values.first_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={touched.first_name && errors.first_name}
                                            />
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='last_name'
                                                label={localize('Last name')}
                                                value={values.last_name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={touched.last_name && errors.last_name}
                                            />
                                        </InputGroup>
                                        <fieldset className='account-management-form-fieldset'>
                                            <Field name='place_of_birth_text'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        { ...field }
                                                        data-lpignore='true'
                                                        type='text'
                                                        label={localize('Place of birth')}
                                                        error={
                                                            touched.place_of_birth_text && errors.place_of_birth_text
                                                        }
                                                        required
                                                        list_items={this.props.residence_list}
                                                        onItemSelection={
                                                            (item) => setFieldValue('place_of_birth_text', item.text, true)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </fieldset>
                                        <fieldset className='account-management-form-fieldset'>
                                            <Field name='citizen_text'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        { ...field }
                                                        data-lpignore='true'
                                                        type='text'
                                                        label={localize('Citizenship')}
                                                        error={touched.citizen_text && errors.citizen_text}
                                                        required
                                                        list_items={this.props.residence_list}
                                                        onItemSelection={
                                                            (item) => setFieldValue('citizen_text', item.text, true)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </fieldset>
                                    </React.Fragment>
                                    }
                                    <fieldset className='account-management-form-fieldset'>
                                        <Input
                                            data-lpignore='true'
                                            type='text'
                                            name='residence'
                                            label={localize('Country of residence')}
                                            value={values.residence}
                                            required
                                            disabled
                                            error={touched.residence && errors.residence}
                                        />
                                    </fieldset>
                                    <fieldset className='account-management-form-fieldset'>
                                        <Input
                                            data-lpignore='true'
                                            type='text'
                                            name='email'
                                            label={localize('Email address')}
                                            value={values.email}
                                            required
                                            disabled
                                            error={touched.email && errors.email}
                                        />
                                    </fieldset>
                                    {!this.props.is_virtual &&
                                    <React.Fragment>
                                        <fieldset className='account-management-form-fieldset'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='phone'
                                                label={localize('Phone number')}
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                error={touched.phone && errors.phone}
                                            />
                                        </fieldset>
                                        <fieldset className='account-management-form-fieldset'>
                                            <Dropdown
                                                placeholder={'Account opening reason'}
                                                is_align_text_left
                                                name='account_opening_reason'
                                                list={account_opening_reason_list}
                                                value={values.account_opening_reason}
                                                onChange={handleChange}
                                                handleBlur={handleBlur}
                                                error={touched.account_opening_reason && errors.account_opening_reason}
                                            />
                                        </fieldset>
                                        <FormSubHeader title={localize('Tax information')} />
                                        <fieldset className='account-management-form-fieldset'>
                                            <Field name='tax_residence_text'>
                                                {({ field }) => (
                                                    <Autocomplete
                                                        { ...field }
                                                        data-lpignore='true'
                                                        type='text'
                                                        label={localize('Tax residence')}
                                                        error={touched.tax_residence_text && errors.tax_residence_text}
                                                        list_items={this.props.residence_list}
                                                        onItemSelection={
                                                            (item) => setFieldValue('tax_residence_text', item.text, true)
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </fieldset>
                                        <fieldset className='account-management-form-fieldset'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='tax_identification_number'
                                                label={localize('Tax identification number')}
                                                value={values.tax_identification_number}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={
                                                    touched.tax_identification_number &&
                                                    errors.tax_identification_number
                                                }
                                            />
                                        </fieldset>
                                    </React.Fragment>
                                    }
                                    <FormSubHeader title={localize('Email Preference')} />
                                    <fieldset className='account-management-form-fieldset'>
                                        <Checkbox
                                            name='email_consent'
                                            value={values.email_consent}
                                            onChange={handleChange}
                                            label={localize('Get updates about Deriv products, services and events.')}
                                            defaultChecked={!!values.email_consent}
                                        />
                                    </fieldset>
                                </FormBody>
                                <FormFooter>
                                    {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                    <Button
                                        className='btn--primary'
                                        type='submit'
                                        is_disabled={isSubmitting || (
                                            this.props.is_virtual ?
                                                true
                                                :
                                                !!((errors.first_name || !values.first_name) ||
                                                (errors.last_name || !values.last_name) ||
                                                (errors.phone || !values.phone) ||
                                                (errors.place_of_birth_text || !values.place_of_birth_text))
                                        )}
                                        has_effect
                                        is_loading={is_btn_loading && <ButtonLoading />}
                                        is_submit_success={is_submit_success}
                                        text={localize('Submit')}
                                    />
                                </FormFooter>
                            </form>
                        )}
                    </>
                )}
            </Formik>
        );
    }

    componentDidMount() {
        this.props.fetchResidenceList();
        WS.authorized.storage.getSettings().then((data) => {
            if (data.error) {
                this.setState({ api_initial_load_error: data.error.message });
                return;
            }
            this.setState({ ...data.get_settings, is_loading: false });
        });
    }
}
// PersonalDetailsForm.propTypes = {};
export default connect(
    ({ client }) => ({
        is_virtual        : client.is_virtual,
        residence_list    : client.residence_list,
        fetchResidenceList: client.fetchResidenceList,
    }),
)(PersonalDetailsForm);
