import { TFinancialAssessmentDetailsValues } from 'src/modules/types';
import { EMPLOYMENT_VALUES, occupationList } from '../constants/financialInformationList';

type TEmploymentStatus = TFinancialAssessmentDetailsValues['employment_status'];

export const filterOccupationList = (employmentStatus: TEmploymentStatus) =>
    [EMPLOYMENT_VALUES.employed, EMPLOYMENT_VALUES.selfEmployed].some(val => val === employmentStatus)
        ? occupationList.filter(item => item.value !== EMPLOYMENT_VALUES.unemployed)
        : occupationList;

export const shouldHideOccupation = (employmentStatus: TEmploymentStatus) =>
    employmentStatus === EMPLOYMENT_VALUES.unemployed;
