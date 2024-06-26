import React from 'react';
import clsx from 'clsx';
import { Formik, Field, FormikErrors, FormikValues, FormikHelpers } from 'formik';
import { Autocomplete, Button, HintBox, Text, SelectNative } from '@deriv/components';
import { IDV_ERROR_STATUS, TIDVErrorStatus, POIContext } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FormFooter from '../../form-footer';
import { useDevice } from '@deriv-com/ui';
import { useResidenceList } from '@deriv/api';

type TCountrySelector = {
    handleSelectionNext?: () => void;
    is_from_external: boolean;
    mismatch_status?: TIDVErrorStatus;
};

const CountrySelector = ({ handleSelectionNext, is_from_external, mismatch_status }: TCountrySelector) => {
    const { setSelectedCountry } = React.useContext(POIContext);
    const { data: country_list, isLoading } = useResidenceList();

    const initial_form_values: FormikValues = {
        country_input: '',
    };

    const validateFields = (values: FormikValues) => {
        const errors: FormikErrors<FormikValues> = {};
        const { country_input } = values;

        if (!country_input) {
            errors.country_input = localize('Please select the country of document issuance.');
        } else if (!country_list.find((c: FormikValues) => c.text === country_input)) {
            errors.country_input = localize('Please select a valid country of document issuance.');
        }

        return errors;
    };
    const { isDesktop } = useDevice();

    const updateSelectedCountry = (country_name: string) => {
        const matching_country = country_list?.find((c: FormikValues) => c.text === country_name);
        if (matching_country) {
            setSelectedCountry?.(matching_country);
        }
    };

    const submitHandler = (values: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
        updateSelectedCountry(values.country_input);
        setSubmitting(false);
        handleSelectionNext?.();
    };

    const failed_message: React.ReactNode = mismatch_status ? IDV_ERROR_STATUS[mismatch_status]?.message ?? null : null;

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
                    <div
                        className={clsx('proof-of-identity__container proof-of-identity__country-container', {
                            'min-height': !is_from_external,
                        })}
                    >
                        {failed_message ? (
                            <React.Fragment>
                                <Text align='center' weight='bold' size={isDesktop ? 's' : 'xs'}>
                                    <Localize i18n_default_text='Your identity verification failed because:' />
                                </Text>
                                <HintBox
                                    className={clsx('proof-of-identity__failed-message', 'hint-box-layout')}
                                    icon='IcAlertDanger'
                                    message={
                                        <Text as='p' size={isDesktop ? 'xs' : 'xxs'}>
                                            {failed_message}
                                        </Text>
                                    }
                                    is_danger
                                />
                            </React.Fragment>
                        ) : (
                            <Text className='proof-of-identity__header' align='center' weight='bold'>
                                <Localize i18n_default_text='Proof of identity' />
                            </Text>
                        )}

                        <Text className='proof-of-identity__country-text ' size='xs'>
                            <Localize i18n_default_text='In which country was your document issued?' />
                        </Text>
                        <fieldset className='proof-of-identity__fieldset'>
                            <Field name='country_input'>
                                {({ field }: FormikValues) => (
                                    <React.Fragment>
                                        {isDesktop ? (
                                            <Autocomplete
                                                className={clsx({ 'external-dropdown': is_from_external })}
                                                {...field}
                                                data_testid='dt_external_dropdown'
                                                name='country_input'
                                                data-lpignore='true'
                                                error={touched.country_input && errors.country_input}
                                                autoComplete='off'
                                                type='text'
                                                label={localize('Country')}
                                                list_items={country_list}
                                                value={values.country_input}
                                                onBlur={(e: FormikValues) => {
                                                    handleBlur(e);
                                                    const current_input = e.target.value;
                                                    if (
                                                        !country_list.find(
                                                            (c: FormikValues) => c.text === current_input
                                                        )
                                                    ) {
                                                        setFieldValue('country_input', '', true);
                                                        updateSelectedCountry('');
                                                    }
                                                }}
                                                onChange={handleChange}
                                                onItemSelection={({ text }: FormikValues) => {
                                                    const select_value =
                                                        text === 'No results found' || !text ? '' : text;
                                                    setFieldValue('country_input', select_value, true);
                                                    updateSelectedCountry(text);
                                                }}
                                                required
                                            />
                                        ) : (
                                            <div className='proof-of-identity__dropdown-container'>
                                                <SelectNative
                                                    {...field}
                                                    name='country_input'
                                                    error={touched.country_input && errors.country_input}
                                                    label={localize('Country')}
                                                    placeholder={localize('Please select')}
                                                    list_items={country_list}
                                                    value={values.country_input}
                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                        handleChange(e);
                                                        updateSelectedCountry(e.target.value);
                                                    }}
                                                    use_text={true}
                                                    required
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                )}
                            </Field>
                        </fieldset>
                    </div>
                    <FormFooter className={clsx('proof-of-identity__footer', { 'external-footer': is_from_external })}>
                        <Button
                            className='proof-of-identity__submit-button'
                            type='submit'
                            onClick={() => handleSubmit()}
                            has_effect
                            is_disabled={!dirty || isSubmitting || !isValid || isLoading}
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
