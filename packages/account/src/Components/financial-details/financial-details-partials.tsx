import React from 'react';
import { Field, FormikValues, useFormikContext } from 'formik';
import { Dropdown, SelectNative } from '@deriv/components';
import { EMPLOYMENT_VALUES, TEmploymentStatus, shouldHideOccupationField } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import {
    getAccountTurnoverList,
    getEducationLevelList,
    getEmploymentIndustryList,
    getEstimatedWorthList,
    getIncomeSourceList,
    getNetIncomeList,
    getFormattedOccupationList,
    getSourceOfWealthList,
} from '../../Configs/financial-details-config';

type TFinancialDetailsDropdownFieldProps = {
    dropdown_list: Array<object>;
    field_key: string;
    placeholder?: string;
    label: string;
    employment_status?: TEmploymentStatus;
};

type TFinancialInformationProps = {
    employment_status?: TEmploymentStatus | string;
};

/**
 * Dropdown field for financial details form.
 * @name FinancialDetailsDropdownField
 * @param {Array<object>} dropdown_list - list of dropdown items
 * @param {string} field_key - field reference of the field
 * @param {string} placeholder - placeholder of the field
 * @param {string} label - label of the field
 *  @param {string} employment_status - selected employment_status,
 * @returns {JSX.Element}
 */
const FinancialDetailsDropdownField = ({
    dropdown_list,
    field_key,
    placeholder = localize('Please select'),
    label,
}: TFinancialDetailsDropdownFieldProps) => {
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormikContext<{
        [key: string]: string;
    }>();
    const { isDesktop } = useDevice();
    return (
        <Field name={field_key}>
            {({ field }: FormikValues) => (
                <React.Fragment>
                    {isDesktop ? (
                        <Dropdown
                            placeholder={label}
                            is_align_text_left
                            name={field.name}
                            list={dropdown_list}
                            value={values?.[field_key]}
                            onChange={handleChange}
                            handleBlur={handleBlur}
                            error={touched?.[field_key] && errors?.[field_key]}
                            list_portal_id='modal_root'
                            required
                            {...field}
                        />
                    ) : (
                        <SelectNative
                            placeholder={placeholder}
                            name={field.name}
                            label={label}
                            list_items={dropdown_list}
                            value={values?.[field_key]}
                            error={touched?.[field_key] && errors?.[field_key]}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                handleChange(e);
                                setFieldValue('field_key', e.target.value, true);
                            }}
                            required
                            {...field}
                        />
                    )}
                </React.Fragment>
            )}
        </Field>
    );
};

const FinancialDetailsOccupationDropdownField = ({
    dropdown_list,
    field_key,
    placeholder = localize('Please select'),
    label,
    employment_status,
}: TFinancialDetailsDropdownFieldProps) => {
    const { values, handleChange, handleBlur, touched, errors, setFieldValue } = useFormikContext<{
        [key: string]: string;
    }>();
    const { isDesktop } = useDevice();

    const getFormattedOccupationValues = () =>
        employment_status === EMPLOYMENT_VALUES.EMPLOYED && values?.occupation === EMPLOYMENT_VALUES.UNEMPLOYED
            ? ''
            : values?.occupation;

    return (
        <Field name={field_key}>
            {({ field }: FormikValues) => (
                <React.Fragment>
                    {isDesktop ? (
                        <Dropdown
                            {...field}
                            placeholder={label}
                            is_align_text_left
                            name={field.name}
                            list={dropdown_list}
                            value={getFormattedOccupationValues()}
                            onChange={e => {
                                setFieldValue(field_key, getFormattedOccupationValues(), true);
                                handleChange(e);
                            }}
                            handleBlur={handleBlur}
                            error={touched?.[field_key] && errors?.[field_key]}
                            list_portal_id='modal_root'
                            required
                        />
                    ) : (
                        <SelectNative
                            {...field}
                            placeholder={placeholder}
                            name={field.name}
                            label={label}
                            list_items={dropdown_list}
                            value={getFormattedOccupationValues()}
                            error={touched?.[field_key] && errors?.[field_key]}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setFieldValue(field_key, getFormattedOccupationValues(), true);
                                handleChange(e);
                            }}
                            required
                        />
                    )}
                </React.Fragment>
            )}
        </Field>
    );
};
/**
 * Wrapper for financial details form fields.
 * @name FinancialInformation
 * @returns {JSX.Element}
 */
const FinancialInformation = ({ employment_status }: TFinancialInformationProps) => {
    return (
        <React.Fragment>
            <FinancialDetailsDropdownField
                dropdown_list={getIncomeSourceList()}
                field_key='income_source'
                label={localize('Source of income')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getEmploymentIndustryList()}
                field_key='employment_industry'
                label={localize('Industry of employment')}
            />
            {!shouldHideOccupationField(employment_status) && (
                <FinancialDetailsOccupationDropdownField
                    dropdown_list={getFormattedOccupationList(employment_status as TEmploymentStatus)}
                    field_key='occupation'
                    label={localize('Occupation')}
                    employment_status={employment_status as TEmploymentStatus}
                />
            )}
            <FinancialDetailsDropdownField
                dropdown_list={getSourceOfWealthList()}
                field_key='source_of_wealth'
                label={localize('Source of wealth')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getEducationLevelList()}
                field_key='education_level'
                label={localize('Level of education')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getNetIncomeList()}
                field_key='net_income'
                label={localize('Net annual income')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getEstimatedWorthList()}
                field_key='estimated_worth'
                label={localize('Estimated net worth')}
            />
            <FinancialDetailsDropdownField
                dropdown_list={getAccountTurnoverList()}
                field_key='account_turnover'
                label={localize('Anticipated annual turnover')}
            />
        </React.Fragment>
    );
};

export default FinancialInformation;
