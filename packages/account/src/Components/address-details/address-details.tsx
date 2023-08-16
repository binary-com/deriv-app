import {
    Formik,
    Field,
    FormikProps,
    FormikValues,
    FormikErrors,
    FormikHelpers,
    FormikHandlers,
    FormikState,
} from 'formik';
import React from 'react';
import {
    Modal,
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Loading,
    MobileWrapper,
    ThemedScrollbars,
    SelectNative,
    Text,
} from '@deriv/components';
import { useStatesList } from '@deriv/hooks';
import { localize, Localize } from '@deriv/translations';
import { getLocation } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';
import classNames from 'classnames';
import { FormInputField } from '../forms/form-fields';

export type TAddressDetailFormProps = {
    address_line_1: string;
    address_line_2?: string;
    address_city: string;
    address_state?: string;
    address_postcode?: string;
};

type TAddressDetails = {
    getCurrentStep?: () => number;
    onSave: (current_step: number, values: TAddressDetailFormProps) => void;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    validate: (values: TAddressDetailFormProps) => TAddressDetailFormProps;
    onSubmit: (
        current_step: number | null,
        values: TAddressDetailFormProps,
        action: (isSubmitting: boolean) => void,
        next_step: () => void
    ) => void;
    is_svg: boolean;
    is_mf?: boolean;
    is_gb_residence: boolean | string;
    onSubmitEnabledChange: (is_submit_disabled: boolean) => void;
    selected_step_ref?: React.RefObject<FormikProps<TAddressDetailFormProps>>;
    value: TAddressDetailFormProps;
    disabled_items: string[];
    has_real_account: boolean;
};

type TAutoComplete = {
    value: boolean;
    text: string;
};

/**
 * Component to display address details form
 * @name AddressDetails
 * @param getCurrentStep - function to get current step
 * @param onSave - function to save form values
 * @param onCancel - function to cancel form values
 * @param goToNextStep - function to go to next step
 * @param goToPreviousStep - function to go to previous step
 * @param validate - function to validate form values
 * @param onSubmit - function to submit form values
 * @param is_svg - is broker code SVG
 * @param is_mf - is broker code MF
 * @param is_gb_residence - is residence Great Britan
 * @param onSubmitEnabledChange - function to change submit button status
 * @param selected_step_ref - reference to selected step
 * @param fetchStatesList - function to fetch states list
 * @param value - form values
 * @param disabled_items - array of disabled fields
 * @param as_real_account - has real account
 * @returns react node
 */
const AddressDetails = observer(
    ({
        getCurrentStep,
        onSave,
        onCancel,
        goToNextStep,
        goToPreviousStep,
        validate,
        onSubmit,
        is_svg,
        is_mf,
        is_gb_residence,
        onSubmitEnabledChange,
        selected_step_ref,
        disabled_items,
        has_real_account,
        ...props
    }: TAddressDetails) => {
        const [address_state_to_display, setAddressStateToDisplay] = React.useState('');

        const { ui } = useStore();

        const { is_desktop, is_mobile } = ui;
        const { data: states_list, isFetched } = useStatesList();

        const is_submit_disabled_ref = React.useRef<boolean | undefined>(true);

        const isSubmitDisabled = (errors?: FormikErrors<TAddressDetailFormProps>) => {
            return selected_step_ref?.current?.isSubmitting || (errors && Object.keys(errors).length > 0);
        };

        const checkSubmitStatus = (errors?: FormikErrors<TAddressDetailFormProps>) => {
            const is_submit_disabled = isSubmitDisabled(errors);

            if (is_submit_disabled_ref.current !== is_submit_disabled) {
                is_submit_disabled_ref.current = is_submit_disabled;
                onSubmitEnabledChange?.(!is_submit_disabled);
            }
        };

        const handleCancel = (values: TAddressDetailFormProps) => {
            const current_step = (getCurrentStep?.() || 1) - 1;
            onSave(current_step, values);
            onCancel(current_step, goToPreviousStep);
        };

        const handleValidate = (values: TAddressDetailFormProps) => {
            const { errors } = splitValidationResultTypes(validate(values));
            checkSubmitStatus(errors);
            return errors;
        };

        const handleSubmitData = (values: TAddressDetailFormProps, actions: FormikHelpers<TAddressDetailFormProps>) => {
            if (values.address_state && states_list.length) {
                values.address_state = address_state_to_display
                    ? getLocation(states_list, address_state_to_display, 'value')
                    : getLocation(states_list, values.address_state, 'value');
            }
            onSubmit((getCurrentStep?.() || 1) - 1, values, actions.setSubmitting, goToNextStep);
        };

        return (
            <Formik
                innerRef={selected_step_ref}
                initialValues={props.value}
                validate={handleValidate}
                validateOnMount
                onSubmit={handleSubmitData}
            >
                {({
                    handleSubmit,
                    errors,
                    values,
                    setFieldValue,
                    handleChange,
                    setFieldTouched,
                }: FormikHandlers & FormikHelpers<TAddressDetailFormProps> & FormikState<TAddressDetailFormProps>) => (
                    <AutoHeightWrapper default_height={350} height_offset={is_desktop ? 80 : null}>
                        {({
                            setRef,
                            height,
                        }: {
                            setRef: (instance: HTMLFormElement) => void;
                            height: number | string;
                        }) => (
                            <form ref={setRef} onSubmit={handleSubmit}>
                                <Div100vhContainer
                                    className='details-form'
                                    height_offset='90px'
                                    is_disabled={is_desktop}
                                >
                                    <Text
                                        as='p'
                                        align='left'
                                        size='xxs'
                                        line_height='l'
                                        className='details-form__description'
                                    >
                                        <strong>
                                            <Localize i18n_default_text='Only use an address for which you have proof of residence - ' />
                                        </strong>
                                        <Localize i18n_default_text='a recent utility bill (e.g. electricity, water, gas, landline, or internet), bank statement, or government-issued letter with your name and this address.' />
                                    </Text>

                                    <ThemedScrollbars height={height} className='details-form__scrollbar'>
                                        <div className={classNames('details-form__elements', 'address-details-form ')}>
                                            <FormInputField
                                                name='address_line_1'
                                                required={is_svg || is_mf}
                                                label={
                                                    is_svg || is_mf
                                                        ? localize('First line of address*')
                                                        : localize('First line of address')
                                                }
                                                maxLength={255}
                                                placeholder={localize('First line of address')}
                                                disabled={
                                                    disabled_items.includes('address_line_1') ||
                                                    (props.value?.address_line_1 && has_real_account)
                                                }
                                            />
                                            <FormInputField
                                                name='address_line_2'
                                                label={localize('Second line of address')}
                                                maxLength={255}
                                                placeholder={localize('Second line of address')}
                                                disabled={
                                                    disabled_items.includes('address_line_2') ||
                                                    (props.value?.address_line_2 && has_real_account)
                                                }
                                            />
                                            <FormInputField
                                                name='address_city'
                                                required={is_svg || is_mf}
                                                label={is_svg || is_mf ? localize('Town/City*') : localize('Town/City')}
                                                placeholder={localize('Town/City')}
                                                disabled={
                                                    disabled_items.includes('address_city') ||
                                                    (props.value?.address_city && has_real_account)
                                                }
                                            />
                                            {!isFetched && (
                                                <div className='details-form__loader'>
                                                    <Loading is_fullscreen={false} />
                                                </div>
                                            )}
                                            {states_list?.length > 0 ? (
                                                <Field name='address_state'>
                                                    {({ field }: FormikValues) => (
                                                        <React.Fragment>
                                                            <DesktopWrapper>
                                                                <Autocomplete
                                                                    {...field}
                                                                    {...(address_state_to_display && {
                                                                        value: address_state_to_display,
                                                                    })}
                                                                    data-lpignore='true'
                                                                    autoComplete='new-password' // prevent chrome autocomplete
                                                                    type='text'
                                                                    label={localize('State/Province')}
                                                                    list_items={states_list}
                                                                    onItemSelection={({
                                                                        value,
                                                                        text,
                                                                    }: TAutoComplete) => {
                                                                        setFieldValue(
                                                                            'address_state',
                                                                            value ? text : '',
                                                                            true
                                                                        );
                                                                        setAddressStateToDisplay('');
                                                                    }}
                                                                    list_portal_id='modal_root'
                                                                    disabled={
                                                                        disabled_items.includes('address_state') ||
                                                                        (props.value?.address_state && has_real_account)
                                                                    }
                                                                />
                                                            </DesktopWrapper>
                                                            <MobileWrapper>
                                                                <SelectNative
                                                                    placeholder={localize('Please select')}
                                                                    label={localize('State/Province')}
                                                                    value={
                                                                        address_state_to_display || values.address_state
                                                                    }
                                                                    list_items={states_list}
                                                                    use_text={true}
                                                                    onChange={(e: { target: { value: string } }) => {
                                                                        setFieldValue(
                                                                            'address_state',
                                                                            e.target.value,
                                                                            true
                                                                        );
                                                                        setAddressStateToDisplay('');
                                                                    }}
                                                                    disabled={
                                                                        disabled_items.includes('address_state') ||
                                                                        (props.value?.address_state && has_real_account)
                                                                    }
                                                                />
                                                            </MobileWrapper>
                                                        </React.Fragment>
                                                    )}
                                                </Field>
                                            ) : (
                                                // Fallback to input field when states list is empty / unavailable for country
                                                <FormInputField
                                                    name='address_state'
                                                    label={localize('State/Province')}
                                                    placeholder={localize('State/Province')}
                                                    disabled={
                                                        disabled_items.includes('address_state') ||
                                                        (props.value?.address_state && has_real_account)
                                                    }
                                                />
                                            )}
                                            <FormInputField
                                                name='address_postcode'
                                                required={is_gb_residence}
                                                label={localize('Postal/ZIP Code')}
                                                placeholder={localize('Postal/ZIP Code')}
                                                onChange={e => {
                                                    setFieldTouched('address_postcode', true);
                                                    handleChange(e);
                                                }}
                                                disabled={
                                                    disabled_items.includes('address_postcode') ||
                                                    (props.value?.address_postcode && has_real_account)
                                                }
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={is_mobile}>
                                    <FormSubmitButton
                                        is_disabled={isSubmitDisabled(errors)}
                                        label={localize('Next')}
                                        is_absolute={is_mobile}
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        onCancel={() => handleCancel(values)}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
);

export default AddressDetails;
