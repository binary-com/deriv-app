import React from 'react';
import { Autocomplete, Button, DesktopWrapper, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { Formik, Field } from 'formik';
import { localize } from '@deriv/translations';

import FormFooter from 'Components/form-footer';

const CountrySelector = ({ handleSelectionNext, residence_list, selected_country, setSelectedCountry }) => {
    const [country_list, setCountryList] = React.useState([]);

    const initial_form_values = {
        country_input: '',
    };

    const validateFields = values => {
        const errors = {};
        const { country_input } = values;

        if (!country_input) {
            errors.country_input = localize('Please select the country of document issuance.');
        } else if (!country_list.find(c => c.text === country_input)) {
            errors.country_input = localize('Please select a valid country of document issuance.');
        }

        return errors;
    };

    const updateSelectedCountry = country_name => {
        const matching_country = country_list.find(c => c.text === country_name);
        if (matching_country) {
            setSelectedCountry(matching_country);
        }
    };

    const submitHandler = (values, { setSubmitting }) => {
        updateSelectedCountry(values.country_input);
        setSubmitting(false);
        handleSelectionNext();
    };

    React.useEffect(() => {
        const enabled_countries = residence_list.filter(r => !r.disabled);
        setCountryList(enabled_countries);
    }, [residence_list]);

    return (
        <Formik initialValues={initial_form_values} validate={validateFields} onSubmit={submitHandler}>
            {({
                dirty,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
                touched,
                values,
            }) => (
                <React.Fragment>
                    <div className='proof-of-identity__container'>
                        <Text className='proof-of-identity__header' align='center' weight='bold'>
                            {localize('Proof of identity')}
                        </Text>
                        <Text className='proof-of-identity__country-text ' size='xs'>
                            {localize('In which country was your document issued?')}
                        </Text>
                        <fieldset className='proof-of-identity__fieldset'>
                            <Field name='country_input'>
                                {({ field }) => (
                                    <React.Fragment>
                                        <DesktopWrapper>
                                            <Autocomplete
                                                {...field}
                                                name='country_input'
                                                data-lpignore='true'
                                                error={touched.country_input && errors.country_input}
                                                autoComplete='off'
                                                type='text'
                                                label={localize('Country')}
                                                list_items={country_list}
                                                value={values.country_input}
                                                onBlur={e => {
                                                    handleBlur(e);
                                                    const current_input = e.target.value;
                                                    if (!country_list.find(c => c.text === current_input)) {
                                                        setFieldValue('country_input', '', true);
                                                        updateSelectedCountry('');
                                                    }
                                                }}
                                                onChange={handleChange}
                                                onItemSelection={({ text }) => {
                                                    const select_value =
                                                        text === 'No results found' || !text ? '' : text;
                                                    setFieldValue('country_input', select_value, true);
                                                    updateSelectedCountry(text);
                                                }}
                                                required
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <div className='proof-of-identity__dropdown-container'>
                                                <SelectNative
                                                    {...field}
                                                    name='country_input'
                                                    error={touched.country_input && errors.country_input}
                                                    placeholder={localize('Place of birth')}
                                                    label={localize('Country')}
                                                    list_items={country_list}
                                                    value={values.country_input}
                                                    onChange={e => {
                                                        handleChange(e);
                                                        updateSelectedCountry(e.target.value);
                                                    }}
                                                    use_text={true}
                                                    required
                                                />
                                            </div>
                                        </MobileWrapper>
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                    </div>
                    <FormFooter className='proof-of-identity__footer'>
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            onClick={handleSubmit}
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid || !selected_country}
                            is_loading={false}
                            text={localize('Next')}
                            large
                            primary
                        />
                    </FormFooter>
                </React.Fragment>
            )}
        </Formik>
    );
};

export default CountrySelector;
