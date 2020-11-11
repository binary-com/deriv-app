import { Formik, Field } from 'formik';
import React from 'react';
import {
    Modal,
    Autocomplete,
    AutoHeightWrapper,
    DesktopWrapper,
    Div100vhContainer,
    FormSubmitButton,
    Input,
    Loading,
    MobileWrapper,
    ThemedScrollbars,
    SelectNative,
} from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isDesktop, isMobile, getLocation } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { splitValidationResultTypes } from 'App/Containers/RealAccountSignup/helpers/utils';

const InputField = props => {
    return (
        <Field name={props.name}>
            {({ field, form: { errors, touched } }) => (
                <React.Fragment>
                    <Input
                        type='text'
                        autoComplete='off'
                        maxLength={props.maxLength || '30'}
                        error={touched[field.name] && errors[field.name]}
                        {...field}
                        {...props}
                    />
                </React.Fragment>
            )}
        </Field>
    );
};

const AddressDetails = props => {
    const [has_fetched_states_list, setHasFetchedStatesList] = React.useState(false);
    const [address_state_to_display, setAddressStateToDisplay] = React.useState('');

    React.useEffect(() => {
        const fetchedStateList = async () => {
            await props.fetchStatesList();
            setHasFetchedStatesList(true);
            setAddressStateToDisplay(getLocation(props.states_list, props.value.address_state, 'text'));
        };
        fetchedStateList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = values => {
        const current_step = props.getCurrentStep() - 1;
        props.onSave(current_step, values);
        props.onCancel(current_step, props.goToPreviousStep);
    };

    const handleValidate = values => {
        const { errors } = splitValidationResultTypes(props.validate(values));
        return errors;
    };

    return (
        <Formik
            initialValues={props.value}
            validate={handleValidate}
            validateOnMount
            onSubmit={(values, actions) => {
                if (values.address_state && props.states_list.length) {
                    values.address_state = address_state_to_display
                        ? getLocation(props.states_list, address_state_to_display, 'value')
                        : getLocation(props.states_list, values.address_state, 'value');
                }
                props.onSubmit(props.getCurrentStep() - 1, values, actions.setSubmitting, props.goToNextStep);
            }}
        >
            {({ handleSubmit, isSubmitting, errors, values, setFieldValue }) => (
                <AutoHeightWrapper default_height={350} height_offset={isDesktop() ? 80 : null}>
                    {({ setRef, height }) => (
                        <form ref={setRef} onSubmit={handleSubmit}>
                            <Div100vhContainer className='details-form' height_offset='110px' is_disabled={isDesktop()}>
                                <p className='details-form__description'>
                                    <strong>
                                        <Localize i18n_default_text='Only use an address for which you have proof of residence - ' />
                                    </strong>
                                    <Localize i18n_default_text='a recent utility bill (e.g. electricity, water, gas, landline, or internet), bank statement, or government-issued letter with your name and this address.' />
                                </p>
                                <ThemedScrollbars
                                    is_bypassed={isMobile()}
                                    height={height}
                                    className='details-form__scrollbar'
                                >
                                    <div className='details-form__elements'>
                                        <InputField
                                            name='address_line_1'
                                            required={props.is_svg}
                                            label={
                                                props.is_svg
                                                    ? localize('First line of address*')
                                                    : localize('First line of address')
                                            }
                                            maxLength={255}
                                            placeholder={localize('First line of address')}
                                        />
                                        <InputField
                                            name='address_line_2'
                                            label={localize('Second line of address')}
                                            maxLength={255}
                                            placeholder={localize('Second line of address')}
                                        />
                                        <InputField
                                            name='address_city'
                                            required={props.is_svg}
                                            label={props.is_svg ? localize('Town/City*') : localize('Town/City')}
                                            placeholder={localize('Town/City')}
                                        />
                                        {!has_fetched_states_list && (
                                            <div className='details-form__loader'>
                                                <Loading is_fullscreen={false} />
                                            </div>
                                        )}
                                        {props.states_list?.length > 0 ? (
                                            <Field name='address_state'>
                                                {({ field }) => (
                                                    <>
                                                        <DesktopWrapper>
                                                            <Autocomplete
                                                                {...field}
                                                                {...(address_state_to_display && {
                                                                    value: address_state_to_display,
                                                                })}
                                                                data-lpignore='true'
                                                                autoComplete='new-password' // prevent chrome autocomplete
                                                                list_height='85px'
                                                                type='text'
                                                                label={localize('State/Province')}
                                                                list_items={props.states_list}
                                                                onItemSelection={({ value, text }) => {
                                                                    setFieldValue(
                                                                        'address_state',
                                                                        value ? text : '',
                                                                        true
                                                                    );
                                                                    setAddressStateToDisplay('');
                                                                }}
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                label={localize('State/Province')}
                                                                value={address_state_to_display || values.address_state}
                                                                list_items={props.states_list}
                                                                use_text={true}
                                                                onChange={e => {
                                                                    setFieldValue(
                                                                        'address_state',
                                                                        e.target.value,
                                                                        true
                                                                    );
                                                                    setAddressStateToDisplay('');
                                                                }}
                                                            />
                                                        </MobileWrapper>
                                                    </>
                                                )}
                                            </Field>
                                        ) : (
                                            // Fallback to input field when states list is empty / unavailable for country
                                            <InputField
                                                name='address_state'
                                                label={localize('State/Province')}
                                                placeholder={localize('State/Province')}
                                            />
                                        )}
                                        <InputField
                                            name='address_postcode'
                                            required={props.is_gb_residence}
                                            label={localize('Postal/ZIP Code')}
                                            placeholder={localize('Postal/ZIP Code')}
                                        />
                                    </div>
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer has_separator is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    is_disabled={isSubmitting || Object.keys(errors).length > 0}
                                    label={localize('Next')}
                                    is_absolute={isMobile()}
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
};

export default connect(({ client }) => ({
    is_gb_residence: client.residence === 'gb',
    fetchStatesList: client.fetchStatesList,
    states_list: client.states_list,
}))(AddressDetails);
