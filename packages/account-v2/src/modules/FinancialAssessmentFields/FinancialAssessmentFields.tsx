import React, { useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useIsEuRegion } from '@deriv/api-v2';
import { FormDropDownField } from '../../components/FormFields';
import {
    accountTurnoverList,
    educationLevelList,
    EMPLOYMENT_VALUES,
    employmentIndustryList,
    employmentStatusList,
    estimatedWorthList,
    incomeSourceList,
    netIncomeList,
    sourceOfWealthList,
} from '../../constants/financialInformationList';
import { filterOccupationList, shouldHideOccupation } from '../../utils/financialAssessmentUtils';
import type { TFinancialAssessmentFormValues } from '../types';
import { financialAssessmentValidations } from './validations';

export const FinancialAssessmentFields = () => {
    const { isEUCountry } = useIsEuRegion();

    const formik = useFormikContext<TFinancialAssessmentFormValues>();

    if (!formik) {
        throw new Error('FinancialAssessmentFields must be used within a Formik component');
    }

    const { setFieldValue, values } = formik;
    const { employmentStatus, occupation } = values;

    const hideOccupation = shouldHideOccupation(employmentStatus);

    const filteredOccupationList = useMemo(() => filterOccupationList(employmentStatus), [employmentStatus]);

    useEffect(() => {
        if (employmentStatus === EMPLOYMENT_VALUES.employed && occupation === EMPLOYMENT_VALUES.unemployed) {
            setFieldValue('occupation', '');
        }
    }, [employmentStatus, setFieldValue, occupation]);

    const {
        accountTurnover: accountTurnoverSchema,
        educationLevel: educationLevelSchema,
        employmentIndustry: employmentIndustrySchema,
        employmentStatus: employmentStatusSchema,
        estimatedWorth: estimatedWorthSchema,
        incomeSource: incomeSourceSchema,
        netIncome: netIncomeSchema,
        occupation: occupationSchema,
        sourceOfWealth: sourceOfWealthSchema,
    } = financialAssessmentValidations;

    return (
        <div className='grid pt-8 space-y-6 grid-col-1'>
            <FormDropDownField
                label='Source of income'
                list={incomeSourceList}
                name='incomeSource'
                validationSchema={incomeSourceSchema}
            />
            {!isEUCountry && (
                <FormDropDownField
                    label='Employment status'
                    list={employmentStatusList}
                    name='employmentStatus'
                    validationSchema={employmentStatusSchema}
                />
            )}
            <FormDropDownField
                label='Industry of employment'
                list={employmentIndustryList}
                name='employmentIndustry'
                validationSchema={employmentIndustrySchema}
            />
            {!hideOccupation && (
                <FormDropDownField
                    label='Occupation'
                    list={filteredOccupationList}
                    name='occupation'
                    validationSchema={occupationSchema}
                />
            )}
            <FormDropDownField
                label='Source of wealth'
                list={sourceOfWealthList}
                name='sourceOfWealth'
                validationSchema={sourceOfWealthSchema}
            />
            <FormDropDownField
                label='Level of education'
                list={educationLevelList}
                name='educationLevel'
                validationSchema={educationLevelSchema}
            />
            <FormDropDownField
                label='Net annual income'
                list={netIncomeList}
                name='netIncome'
                validationSchema={netIncomeSchema}
            />
            <FormDropDownField
                label='Estimated net worth'
                list={estimatedWorthList}
                name='estimatedWorth'
                validationSchema={estimatedWorthSchema}
            />
            <FormDropDownField
                label='Anticipated account turnover'
                list={accountTurnoverList}
                name='accountTurnover'
                validationSchema={accountTurnoverSchema}
            />
        </div>
    );
};
