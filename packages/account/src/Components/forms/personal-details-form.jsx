import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Field, useFormikContext } from 'formik';
import {
    Autocomplete,
    Checkbox,
    Dropdown,
    InlineMessage,
    Popover,
    RadioGroup,
    SelectNative,
    Text,
} from '@deriv/components';
import { getLegalEntityName, routes, validPhone } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { isFieldImmutable, verifyFields } from '../../Helpers/utils';
import { getEmploymentStatusList } from '../../Sections/Assessment/FinancialAssessment/financial-information-list';
import FormBodySection from '../form-body-section';
import { DateOfBirthField, FormInputField } from './form-fields';
import FormSubHeader from '../form-sub-header';
import InlineNoteWithIcon from '../inline-note-with-icon';
import { useDevice } from '@deriv-com/ui';
import { OECD_TIN_FORMAT_URL } from '../../Constants/external-urls';

const PersonalDetailsForm = props => {
    const { isDesktop } = useDevice();
    const {
        inline_note_text,
        is_virtual,
        is_eu_user,
        is_svg,
        is_rendered_for_idv,
        editable_fields = [],
        has_real_account,
        residence_list,
        is_fully_authenticated,
        account_opening_reason_list,
        closeRealAccountSignup,
        salutation_list,
        is_rendered_for_onfido,
        is_qualified_for_poa,
        should_close_tooltip,
        setShouldCloseTooltip,
        class_name,
        states_list,
        side_note,
        no_confirmation_needed,
        mismatch_status,
    } = props;
    const autocomplete_value = 'none';
    // need to put this check related to DIEL clients
    const is_svg_only = is_svg && !is_eu_user;

    const [is_tax_residence_popover_open, setIsTaxResidencePopoverOpen] = React.useState(false);
    const [is_tin_popover_open, setIsTinPopoverOpen] = React.useState(false);

    const { errors, touched, values, setFieldValue, handleChange, handleBlur, setFieldTouched } = useFormikContext();

    const handleToolTipStatus = React.useCallback(() => {
        if (is_tax_residence_popover_open) {
            setIsTaxResidencePopoverOpen(false);
        }
        if (is_tin_popover_open) {
            setIsTinPopoverOpen(false);
        }
    }, [is_tax_residence_popover_open, is_tin_popover_open]);

    React.useEffect(() => {
        if (should_close_tooltip) {
            handleToolTipStatus();
            setShouldCloseTooltip(false);
        }
    }, [should_close_tooltip, handleToolTipStatus, setShouldCloseTooltip]);

    const getNameAndDobLabels = () => {
        const is_asterisk_needed = is_svg || is_eu_user || is_rendered_for_onfido || is_rendered_for_idv;
        const first_name_label = is_asterisk_needed ? localize('First name*') : localize('First name');
        const last_name_label = is_asterisk_needed ? localize('Last name*') : localize('Last name');
        const dob_label = is_asterisk_needed ? localize('Date of birth*') : localize('Date of birth');

        return {
            first_name_label,
            last_name_label,
            dob_label,
        };
    };

    const is_rendered_for_idv_or_onfido = is_rendered_for_idv || is_rendered_for_onfido;

    const getFieldHint = field_name =>
        is_svg_only || is_rendered_for_idv_or_onfido ? (
            <Localize
                i18n_default_text={'Your {{ field_name }} as in your identity document'}
                values={{ field_name }}
            />
        ) : (
            <Localize
                i18n_default_text={'Please enter your {{ field_name }} as in your official identity documents.'}
                values={{ field_name }}
            />
        );

    const handleSalutationSelection = event => {
        if (event.target?.type === 'radio') {
            setFieldValue('salutation', event.target?.value);
        }
    };

    const poa_clarification_message = (
        <Localize i18n_default_text='Use the same address that appears on your proof of address (utility bill, bank statement, etc.).' />
    );

    // need to disable the checkbox if the user has not filled in the name and dob fields initially
    const is_confirmation_checkbox_disabled = verifyFields(mismatch_status).some(
        field => !values[field] || errors[field]
    );

    return (
        <React.Fragment>
            <div
                className={clsx(class_name, {
                    'account-form__poi-confirm-example': is_rendered_for_idv,
                })}
            >
                {(is_svg_only || is_rendered_for_idv_or_onfido) && (
                    <div className='account-form__poi-inline-message'>
                        <InlineMessage message={inline_note_text} size='md' />
                    </div>
                )}
                {is_qualified_for_poa && (
                    <InlineNoteWithIcon
                        icon='IcAlertWarning'
                        message={poa_clarification_message}
                        font_size={isDesktop ? 'xs' : 'xxxs'}
                    />
                )}
                <FormBodySection
                    has_side_note={is_rendered_for_idv_or_onfido || is_svg_only}
                    side_note={side_note}
                    side_note_position='right'
                    type='image'
                >
                    <fieldset className='account-form__fieldset'>
                        {'salutation' in values && !is_eu_user && (
                            <div>
                                <Text size={isDesktop ? 'xxs' : 'xs'} align={!isDesktop && 'center'}>
                                    {is_virtual ? (
                                        localize(
                                            'Please remember that it is your responsibility to keep your answers accurate and up to date. You can update your personal details at any time in your account settings.'
                                        )
                                    ) : (
                                        <Localize
                                            i18n_default_text='Please remember that it is your responsibility to keep your answers accurate and up to date. You can update your personal details at any time in your <0>account settings</0>.'
                                            components={[
                                                <Link
                                                    to={routes.personal_details}
                                                    key={0}
                                                    className='link'
                                                    onClick={closeRealAccountSignup}
                                                />,
                                            ]}
                                        />
                                    )}
                                </Text>
                            </div>
                        )}
                        {is_eu_user && !is_rendered_for_onfido && !is_qualified_for_poa && (
                            <FormSubHeader
                                title={'salutation' in values ? localize('Title and name') : localize('Name')}
                            />
                        )}
                        {'salutation' in values && (
                            <span onClick={handleSalutationSelection}>
                                <RadioGroup
                                    className='dc-radio__input'
                                    name='salutation'
                                    selected={values.salutation}
                                    onToggle={e => {
                                        e.persist();
                                        setFieldValue('salutation', e.target.value);
                                    }}
                                    required
                                >
                                    {salutation_list.map(item => (
                                        <RadioGroup.Item
                                            key={item.value}
                                            label={item.label}
                                            value={item.value}
                                            disabled={
                                                !!values.salutation && isFieldImmutable('salutation', editable_fields)
                                            }
                                            has_error={!!(touched.salutation && errors.salutation)}
                                        />
                                    ))}
                                </RadioGroup>
                            </span>
                        )}
                        {'first_name' in values && (
                            <FormInputField
                                name='first_name'
                                required={is_svg}
                                label={getNameAndDobLabels().first_name_label}
                                hint={getFieldHint(localize('first name'))}
                                disabled={
                                    isFieldImmutable('first_name', editable_fields) ||
                                    (values?.first_name && has_real_account)
                                }
                                placeholder={localize('John')}
                                data-testid='first_name'
                            />
                        )}
                        {'last_name' in values && (
                            <FormInputField
                                name='last_name'
                                required={is_svg}
                                label={getNameAndDobLabels().last_name_label}
                                hint={getFieldHint(localize('last name'))}
                                disabled={
                                    isFieldImmutable('last_name', editable_fields) ||
                                    (values?.last_name && has_real_account)
                                }
                                placeholder={localize('Doe')}
                                data-testid='last_name'
                            />
                        )}
                        {is_eu_user && !is_qualified_for_poa && <FormSubHeader title={localize('Other details')} />}
                        {'date_of_birth' in values && (
                            <DateOfBirthField
                                name='date_of_birth'
                                required={is_svg}
                                label={getNameAndDobLabels().dob_label}
                                hint={getFieldHint(localize('date of birth'))}
                                disabled={
                                    isFieldImmutable('date_of_birth', editable_fields) ||
                                    (values?.date_of_birth && has_real_account)
                                }
                                placeholder={localize('01-07-1999')}
                                portal_id='modal_root'
                                data_testid='date_of_birth'
                            />
                        )}
                        {'address_line_1' in values && (
                            <FormInputField
                                name='address_line_1'
                                label={localize('First line of address*')}
                                disabled={isFieldImmutable('address_line_1', editable_fields)}
                                data-testid='address_line_1'
                                autoComplete='off'
                                data-lpignore='true'
                                type='text'
                                maxLength={70}
                                required
                                onBlur={handleBlur}
                                error={touched.address_line_1 && errors.address_line_1}
                                value={values.address_line_1}
                            />
                        )}
                        {'address_line_2' in values && (
                            <FormInputField
                                name='address_line_2'
                                label={localize('Second line of address (optional)')}
                                disabled={isFieldImmutable('address_line_2', editable_fields)}
                                data-testid='address_line_2'
                                autoComplete='off'
                                data-lpignore='true'
                                type='text'
                                maxLength={70}
                                onBlur={handleBlur}
                                error={touched.address_line_2 && errors.address_line_2}
                                value={values.address_line_2}
                            />
                        )}
                        {'address_city' in values && (
                            <FormInputField
                                name='address_city'
                                label={localize('Town/City*')}
                                disabled={isFieldImmutable('address_city', editable_fields)}
                                data-testid='address_city'
                                autoComplete='off'
                                data-lpignore='true'
                                type='text'
                                maxLength={70}
                                required
                                onBlur={handleBlur}
                                error={touched.address_city && errors.address_city}
                                value={values.address_city}
                            />
                        )}
                        {'address_state' in values &&
                            (states_list?.length ? (
                                <React.Fragment>
                                    {isDesktop ? (
                                        <Field name='address_state'>
                                            {({ field }) => (
                                                <Autocomplete
                                                    {...field}
                                                    data-lpignore='true'
                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                    type='text'
                                                    label={localize('State/Province')}
                                                    error={touched.address_state && errors.address_state}
                                                    list_items={states_list}
                                                    onItemSelection={({ value, text }) =>
                                                        setFieldValue('address_state', value ? text : '', true)
                                                    }
                                                />
                                            )}
                                        </Field>
                                    ) : (
                                        <SelectNative
                                            placeholder={localize('Please select')}
                                            label={localize('State/Province')}
                                            value={values.address_state}
                                            list_items={states_list}
                                            error={touched.address_state && errors.address_state}
                                            use_text
                                            onChange={e => setFieldValue('address_state', e.target.value, true)}
                                        />
                                    )}
                                </React.Fragment>
                            ) : (
                                <FormInputField
                                    data-lpignore='true'
                                    autoComplete='off'
                                    type='text'
                                    name='address_state'
                                    label={localize('State/Province')}
                                    value={values.address_state}
                                    error={touched.address_state && errors.address_state}
                                    onBlur={handleBlur}
                                />
                            ))}
                        {'address_postcode' in values && (
                            <FormInputField
                                name='address_postcode'
                                label={localize('Postal/ZIP code')}
                                disabled={isFieldImmutable('address_postcode', editable_fields)}
                                data-testid='address_postcode'
                                autoComplete='off'
                                data-lpignore='true'
                                type='text'
                                maxLength={70}
                                onBlur={handleBlur}
                                error={touched.address_postcode && errors.address_postcode}
                                value={values.address_postcode}
                            />
                        )}
                        {!is_svg_only && 'place_of_birth' in values && (
                            <PlaceOfBirthField
                                handleChange={handleChange}
                                setFieldValue={setFieldValue}
                                disabled={isFieldImmutable('place_of_birth', editable_fields)}
                                residence_list={residence_list}
                                required
                            />
                        )}
                        {'citizen' in values && (
                            <Field name='citizen'>
                                {({ field }) => (
                                    <React.Fragment>
                                        {isDesktop ? (
                                            <Autocomplete
                                                {...field}
                                                data-lpignore='true'
                                                autoComplete={autocomplete_value} // prevent chrome autocomplete
                                                type='text'
                                                label={is_eu_user ? localize('Citizenship*') : localize('Citizenship')}
                                                error={touched.citizen && errors.citizen}
                                                disabled={
                                                    (values?.citizen && is_fully_authenticated) ||
                                                    isFieldImmutable('citizen', editable_fields) ||
                                                    (values?.citizen && has_real_account)
                                                }
                                                list_items={residence_list}
                                                onItemSelection={({ value, text }) =>
                                                    setFieldValue('citizen', value ? text : '', true)
                                                }
                                                list_portal_id='modal_root'
                                                required
                                                data-testid='citizenship'
                                            />
                                        ) : (
                                            <SelectNative
                                                placeholder={localize('Citizenship')}
                                                name={field.name}
                                                disabled={
                                                    (values?.citizen && is_fully_authenticated) ||
                                                    isFieldImmutable('citizen', editable_fields) ||
                                                    (values?.citizen && has_real_account)
                                                }
                                                label={is_eu_user ? localize('Citizenship*') : localize('Citizenship')}
                                                list_items={residence_list}
                                                value={values.citizen}
                                                use_text
                                                error={touched.citizen && errors.citizen}
                                                onChange={e => {
                                                    handleChange(e);
                                                    setFieldValue('citizen', e.target.value, true);
                                                }}
                                                {...field}
                                                required
                                                should_hide_disabled_options={false}
                                                data_testid='citizenship_mobile'
                                            />
                                        )}
                                    </React.Fragment>
                                )}
                            </Field>
                        )}
                        {!is_svg_only && 'phone' in values && (
                            <PhoneField
                                value={values.phone}
                                editable_fields={editable_fields}
                                has_real_account={has_real_account}
                                required
                            />
                        )}
                        {!is_svg_only && ('tax_residence' in values || 'tax_identification_number' in values) && (
                            <React.Fragment>
                                <FormSubHeader title={localize('Tax information')} />
                                {'tax_residence' in values && (
                                    <TaxResidenceField
                                        setFieldValue={setFieldValue}
                                        disabled={isFieldImmutable('tax_residence', editable_fields)}
                                        residence_list={residence_list}
                                        required
                                        setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                                        setIsTinPopoverOpen={setIsTinPopoverOpen}
                                        is_tax_residence_popover_open={is_tax_residence_popover_open}
                                    />
                                )}
                                {'tax_identification_number' in values && (
                                    <TaxIdentificationNumberField
                                        is_tin_popover_open={is_tin_popover_open}
                                        setIsTinPopoverOpen={setIsTinPopoverOpen}
                                        setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                                        disabled={isFieldImmutable('tax_identification_number', editable_fields)}
                                        required
                                    />
                                )}
                                {'employment_status' in values && (
                                    <fieldset className={clsx('account-form__fieldset', 'emp-status')}>
                                        {isDesktop ? (
                                            <Dropdown
                                                placeholder={
                                                    is_eu_user
                                                        ? localize('Employment status*')
                                                        : localize('Employment status')
                                                }
                                                is_align_text_left
                                                name='employment_status'
                                                list={getEmploymentStatusList()}
                                                value={values.employment_status}
                                                onChange={e => {
                                                    setFieldValue('occupation', '', true);
                                                    handleChange(e);
                                                }}
                                                handleBlur={handleBlur}
                                                error={touched.employment_status && errors.employment_status}
                                                disabled={isFieldImmutable('employment_status', editable_fields)}
                                            />
                                        ) : (
                                            <SelectNative
                                                placeholder={localize('Please select')}
                                                name='employment_status'
                                                label={
                                                    is_eu_user
                                                        ? localize('Employment status*')
                                                        : localize('Employment status')
                                                }
                                                list_items={getEmploymentStatusList()}
                                                value={values.employment_status}
                                                error={touched.employment_status && errors.employment_status}
                                                onChange={e => {
                                                    setFieldTouched('employment_status', true);
                                                    setFieldValue('occupation', '', true);
                                                    handleChange(e);
                                                }}
                                                disabled={isFieldImmutable('employment_status', editable_fields)}
                                            />
                                        )}
                                    </fieldset>
                                )}
                                {'tax_identification_confirm' in values && (
                                    <Checkbox
                                        name='tax_identification_confirm'
                                        className='details-form__tin-confirm'
                                        data-lpignore
                                        onChange={() =>
                                            setFieldValue(
                                                'tax_identification_confirm',
                                                !values.tax_identification_confirm,
                                                true
                                            )
                                        }
                                        value={values.tax_identification_confirm}
                                        label={localize(
                                            'I hereby confirm that the tax information I provided is true and complete. I will also inform {{legal_entity_name}} about any changes to this information.',
                                            {
                                                legal_entity_name: getLegalEntityName('maltainvest'),
                                            }
                                        )}
                                        withTabIndex={0}
                                        data-testid='tax_identification_confirm'
                                        has_error={
                                            !!(touched.tax_identification_confirm && errors.tax_identification_confirm)
                                        }
                                    />
                                )}
                            </React.Fragment>
                        )}
                        {!is_svg_only && 'account_opening_reason' in values && (
                            <AccountOpeningReasonField
                                required
                                account_opening_reason_list={account_opening_reason_list}
                                setFieldValue={setFieldValue}
                                disabled={
                                    isFieldImmutable('account_opening_reason', editable_fields) ||
                                    (values?.account_opening_reason && has_real_account)
                                }
                            />
                        )}
                    </fieldset>
                </FormBodySection>
                {!no_confirmation_needed && is_rendered_for_idv && (
                    <Checkbox
                        name='confirmation_checkbox'
                        className='formik__confirmation-checkbox'
                        value={values.confirmation_checkbox}
                        label={
                            <Localize i18n_default_text='I confirm that the name and date of birth above match my chosen identity document' />
                        }
                        label_font_size={isDesktop ? 'xs' : 'xxs'}
                        disabled={is_confirmation_checkbox_disabled}
                        onChange={handleChange}
                        has_error={!!(touched.confirmation_checkbox && errors.confirmation_checkbox)}
                    />
                )}
            </div>

            {is_svg_only && (
                <div className='account-form__poi-additional-information'>
                    <FormSubHeader title={localize('Additional information')} />
                    {'phone' in values && (
                        <PhoneField
                            value={values.phone}
                            editable_fields={editable_fields}
                            has_real_account={has_real_account}
                            required
                        />
                    )}
                    <React.Fragment>
                        {'place_of_birth' in values && (
                            <PlaceOfBirthField
                                handleChange={handleChange}
                                setFieldValue={setFieldValue}
                                disabled={isFieldImmutable('place_of_birth', editable_fields)}
                                residence_list={residence_list}
                                required
                            />
                        )}
                        {'tax_residence' in values && (
                            <TaxResidenceField
                                setFieldValue={setFieldValue}
                                disabled={isFieldImmutable('tax_residence', editable_fields)}
                                residence_list={residence_list}
                                setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                                setIsTinPopoverOpen={setIsTinPopoverOpen}
                                is_tax_residence_popover_open={is_tax_residence_popover_open}
                            />
                        )}
                        {'tax_identification_number' in values && (
                            <TaxIdentificationNumberField
                                is_tin_popover_open={is_tin_popover_open}
                                setIsTinPopoverOpen={setIsTinPopoverOpen}
                                setIsTaxResidencePopoverOpen={setIsTaxResidencePopoverOpen}
                                disabled={isFieldImmutable('tax_identification_number', editable_fields)}
                            />
                        )}
                        {'account_opening_reason' in values && (
                            <AccountOpeningReasonField
                                no_header
                                account_opening_reason_list={account_opening_reason_list}
                                setFieldValue={setFieldValue}
                                disabled={
                                    isFieldImmutable('account_opening_reason', editable_fields) ||
                                    (values?.account_opening_reason && has_real_account)
                                }
                                required
                            />
                        )}
                        {values?.tax_residence && values?.tax_identification_number && (
                            <Checkbox
                                name='crs_confirmation'
                                value={values?.crs_confirmation}
                                label={
                                    <Localize i18n_default_text='I confirm that my tax information is accurate and complete.' />
                                }
                                label_font_size={isDesktop ? 'xs' : 'xxs'}
                                onChange={e => {
                                    setFieldValue('crs_confirmation', e.target.checked, true);
                                    setFieldTouched('crs_confirmation', true);
                                }}
                                has_error={!!(touched?.crs_confirmation && errors?.crs_confirmation)}
                            />
                        )}
                    </React.Fragment>
                </div>
            )}
        </React.Fragment>
    );
};

export default PersonalDetailsForm;

const PhoneField = ({ value, editable_fields, has_real_account, required }) => (
    <FormInputField
        name='phone'
        label={required ? localize('Phone number*') : localize('Phone number')}
        placeholder={required ? localize('Phone number*') : localize('Phone number')}
        disabled={
            isFieldImmutable('phone', editable_fields) ||
            (value && has_real_account && validPhone(value) && value?.length >= 9 && value?.length <= 35)
        }
        maxLength={50}
        data-testid='phone'
    />
);

const PlaceOfBirthField = ({ handleChange, setFieldValue, disabled, residence_list, required }) => {
    const { isDesktop } = useDevice();
    return (
        <Field name='place_of_birth'>
            {({ field, meta }) => (
                <React.Fragment>
                    {isDesktop ? (
                        <Autocomplete
                            {...field}
                            disabled={disabled}
                            data-lpignore='true'
                            autoComplete='none' // prevent chrome autocomplete
                            type='text'
                            label={required ? localize('Place of birth*') : localize('Place of birth')}
                            error={meta.touched && meta.error}
                            list_items={residence_list}
                            onItemSelection={({ value, text }) =>
                                setFieldValue('place_of_birth', value ? text : '', true)
                            }
                            required
                            data-testid='place_of_birth'
                        />
                    ) : (
                        <SelectNative
                            placeholder={required ? localize('Place of birth') : localize('Place of birth')}
                            name={field.name}
                            disabled={disabled}
                            label={required ? localize('Place of birth*') : localize('Place of birth')}
                            list_items={residence_list}
                            value={field.value}
                            use_text
                            error={meta.touched && meta.error}
                            onChange={e => {
                                handleChange(e);
                                setFieldValue('place_of_birth', e.target.value, true);
                            }}
                            {...field}
                            list_portal_id='modal_root'
                            required
                            should_hide_disabled_options={false}
                            data_testid='place_of_birth_mobile'
                        />
                    )}
                </React.Fragment>
            )}
        </Field>
    );
};

const TaxResidenceField = ({
    setFieldValue,
    residence_list,
    required = false,
    setIsTaxResidencePopoverOpen,
    setIsTinPopoverOpen,
    is_tax_residence_popover_open,
    disabled,
}) => {
    const { isDesktop } = useDevice();
    return (
        <Field name='tax_residence'>
            {({ field, meta }) => (
                <div className='details-form__tax'>
                    {isDesktop ? (
                        <Autocomplete
                            {...field}
                            data-lpignore='true'
                            autoComplete='none' // prevent chrome autocomplete
                            type='text'
                            label={required ? localize('Tax residence*') : localize('Tax residence')}
                            error={meta.touched && meta.error}
                            list_items={residence_list}
                            onItemSelection={({ value, text }) =>
                                setFieldValue('tax_residence', value ? text : '', true)
                            }
                            list_portal_id='modal_root'
                            data-testid='tax_residence'
                            disabled={disabled}
                            required={required}
                        />
                    ) : (
                        <SelectNative
                            placeholder={required ? localize('Tax residence*') : localize('Tax residence')}
                            name={field.name}
                            label={required ? localize('Tax residence*') : localize('Tax residence')}
                            list_items={residence_list}
                            value={field.value}
                            use_text
                            error={meta.touched && meta.error}
                            onChange={e => {
                                field.onChange(e);
                                setFieldValue('tax_residence', e.target.value, true);
                            }}
                            {...field}
                            required={required}
                            data_testid='tax_residence_mobile'
                            disabled={disabled}
                        />
                    )}
                    <div
                        data-testid='tax_residence_pop_over'
                        onClick={e => {
                            setIsTaxResidencePopoverOpen(true);
                            setIsTinPopoverOpen(false);
                            e.stopPropagation();
                        }}
                    >
                        <Popover
                            alignment={isDesktop ? 'right' : 'left'}
                            icon='info'
                            message={localize(
                                'The country in which you meet the criteria for paying taxes. Usually the country in which you physically reside.'
                            )}
                            zIndex={9998}
                            disable_message_icon
                            is_open={is_tax_residence_popover_open}
                        />
                    </div>
                </div>
            )}
        </Field>
    );
};

const TaxIdentificationNumberField = ({
    is_tin_popover_open,
    setIsTinPopoverOpen,
    setIsTaxResidencePopoverOpen,
    disabled,
    required = false,
}) => {
    const { isDesktop } = useDevice();
    return (
        <div className='details-form__tax'>
            <FormInputField
                name='tax_identification_number'
                label={required ? localize('Tax Identification Number*') : localize('Tax Identification Number')}
                placeholder={localize('Tax Identification Number')}
                data-testid='tax_identification_number'
                disabled={disabled}
                required={required}
            />
            <div
                data-testid='tax_identification_number_pop_over'
                onClick={e => {
                    setIsTaxResidencePopoverOpen(false);
                    setIsTinPopoverOpen(true);
                    if (e.target.tagName !== 'A') e.stopPropagation();
                }}
            >
                <Popover
                    alignment={isDesktop ? 'right' : 'left'}
                    icon='info'
                    is_open={is_tin_popover_open}
                    message={
                        <Localize
                            i18n_default_text={
                                "Don't know your tax identification number? Click <0>here</0> to learn more."
                            }
                            components={[
                                <a
                                    key={0}
                                    className='link link--red'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href={OECD_TIN_FORMAT_URL}
                                />,
                            ]}
                        />
                    }
                    zIndex={9998}
                    disable_message_icon
                />
            </div>
        </div>
    );
};

const AccountOpeningReasonField = ({ no_header, required, account_opening_reason_list, setFieldValue, disabled }) => {
    const { isDesktop } = useDevice();
    return (
        <React.Fragment>
            {!no_header && <FormSubHeader title={localize('Account opening reason')} />}
            <Field name='account_opening_reason'>
                {({ field, meta }) => (
                    <React.Fragment>
                        {isDesktop ? (
                            <Dropdown
                                placeholder={
                                    required ? localize('Account opening reason*') : localize('Account opening reason')
                                }
                                name={field.name}
                                disabled={disabled}
                                is_align_text_left
                                list={account_opening_reason_list}
                                {...field}
                                error={meta.touched && meta.error}
                                list_portal_id='modal_root'
                                required
                            />
                        ) : (
                            <SelectNative
                                placeholder={localize('Please select')}
                                name={field.name}
                                label={
                                    required ? localize('Account opening reason*') : localize('Account opening reason')
                                }
                                list_items={account_opening_reason_list}
                                error={meta.touched && meta.error}
                                onChange={e => {
                                    field.onChange(e);
                                    setFieldValue('account_opening_reason', e.target.value, true);
                                }}
                                {...field}
                                required
                                data_testid='account_opening_reason_mobile'
                                disabled={disabled}
                            />
                        )}
                    </React.Fragment>
                )}
            </Field>
        </React.Fragment>
    );
};
