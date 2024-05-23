import React from 'react';
import classNames from 'classnames';
import { Formik, Field, FormikProps, FormikHelpers, FormikHandlers, FormikState, FieldProps } from 'formik';
import { StatesList } from '@deriv/api-types';
import {
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Loading,
    MobileWrapper,
    Modal,
    SelectNative,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { useStatesList } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import { FormInputField } from '../forms/form-fields';
import ScrollToFieldWithError from '../forms/scroll-to-field-with-error';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';

export type TAddressDetailFormProps = {
    address_line_1: string;
    address_line_2?: string;
    address_city: string;
    address_state?: string;
    address_postcode?: string;
};

type TAddressDetails = {
    disabled_items: string[];
    states_list: StatesList;
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
    selected_step_ref?: React.RefObject<FormikProps<TAddressDetailFormProps>>;
    value: TAddressDetailFormProps;
    has_real_account: boolean;
};

type TAutoComplete = {
    value: string;
    text: string;
};

/**
 * Component to display address details form
 * @name AddressDetails
 * @param getCurrentStep - function to get current step
 * @param states_list - array of states for the selected residence country
 * @param onSave - function to save form values
 * @param onCancel - function to cancel form values
 * @param goToNextStep - function to go to next step
 * @param goToPreviousStep - function to go to previous step
 * @param validate - function to validate form values
 * @param onSubmit - function to submit form values
 * @param selected_step_ref - reference to selected step
 * @param value - form values
 * @param disabled_items - array of disabled fields
 * @param has_real_account - has real account
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
        selected_step_ref,
        disabled_items,
        has_real_account,
        ...props
    }: TAddressDetails) => {
        const [address_state_to_display, setAddressStateToDisplay] = React.useState('');

        const {
            ui,
            client: { residence, account_settings },
            traders_hub: { is_eu_user },
        } = useStore();

        const { is_desktop, is_mobile } = ui;
        const { data: states_list, isFetched } = useStatesList(residence);

        const handleCancel = (values: TAddressDetailFormProps) => {
            const current_step = (getCurrentStep?.() || 1) - 1;
            onSave(current_step, values);
            onCancel(current_step, goToPreviousStep);
        };

        const handleValidate = (values: TAddressDetailFormProps) => {
            const current_step = (getCurrentStep?.() || 1) - 1;
            onSave(current_step, values);

            const { errors } = splitValidationResultTypes(validate(values));
            return errors;
        };

        const handleSubmitData = (values: TAddressDetailFormProps, actions: FormikHelpers<TAddressDetailFormProps>) => {
            onSubmit((getCurrentStep?.() || 1) - 1, values, actions.setSubmitting, goToNextStep);
        };

        return (
            <Formik initialValues={props.value} validate={handleValidate} validateOnMount onSubmit={handleSubmitData}>
                {({
                    handleSubmit,
                    isSubmitting,
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
                            //noValidate here is for skipping default browser validation
                            <form ref={setRef} onSubmit={handleSubmit} noValidate>
                                <Div100vhContainer
                                    className='details-form'
                                    height_offset='90px'
                                    is_disabled={is_desktop}
                                >
                                    <ScrollToFieldWithError />
                                    {is_mobile && (
                                        <Text size='xs' weight='bold' className='details-form__heading'>
                                            <Localize i18n_default_text='Complete your address details' />
                                        </Text>
                                    )}
                                    <ThemedScrollbars height={height} className='details-form__scrollbar'>
                                        <div
                                            className={classNames('details-form__elements', 'address-details-form', {
                                                'address-details-form__eu': is_eu_user,
                                            })}
                                        >
                                            <FormInputField
                                                name='address_line_1'
                                                required
                                                label={localize('First line of address*')}
                                                maxLength={255}
                                                placeholder={localize('First line of address')}
                                                disabled={
                                                    disabled_items.includes('address_line_1') ||
                                                    (!!account_settings?.address_line_1 && has_real_account)
                                                }
                                            />
                                            <FormInputField
                                                name='address_line_2'
                                                label={localize('Second line of address')}
                                                maxLength={255}
                                                placeholder={localize('Second line of address')}
                                                disabled={
                                                    disabled_items.includes('address_line_2') ||
                                                    (!!account_settings?.address_line_2 && has_real_account)
                                                }
                                            />
                                            <FormInputField
                                                name='address_city'
                                                required
                                                label={localize('Town/City*')}
                                                placeholder={localize('Town/City')}
                                                disabled={
                                                    disabled_items.includes('address_city') ||
                                                    (!!account_settings?.address_city && has_real_account)
                                                }
                                            />
                                            {!isFetched && (
                                                <div className='details-form__loader'>
                                                    <Loading is_fullscreen={false} />
                                                </div>
                                            )}
                                            {states_list?.length > 0 ? (
                                                <Field name='address_state'>
                                                    {({ field }: FieldProps) => (
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
                                                                        (!!account_settings?.address_state &&
                                                                            has_real_account)
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
                                                                        (!!account_settings?.address_state &&
                                                                            has_real_account)
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
                                                        (!!account_settings?.address_state && has_real_account)
                                                    }
                                                />
                                            )}
                                            <FormInputField
                                                name='address_postcode'
                                                label={localize('Postal/ZIP Code')}
                                                placeholder={localize('Postal/ZIP Code')}
                                                onChange={e => {
                                                    setFieldTouched('address_postcode', true);
                                                    handleChange(e);
                                                }}
                                                disabled={
                                                    disabled_items.includes('address_postcode') ||
                                                    (!!account_settings?.address_postcode && has_real_account)
                                                }
                                            />
                                        </div>
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={is_mobile}>
                                    <FormSubmitButton
                                        is_disabled={isSubmitting}
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
