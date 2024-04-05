import { useMutation } from '@deriv/api-v2';

export type TFinancialAssessmentPayload = NonNullable<
    NonNullable<
        NonNullable<Parameters<ReturnType<typeof useMutation<'set_financial_assessment'>>['mutate']>>[0]
    >['payload']
>;

export type TFinancialAssessmentDetailsValues = Pick<
    TFinancialAssessmentPayload,
    | 'account_turnover'
    | 'education_level'
    | 'employment_industry'
    | 'employment_status'
    | 'estimated_worth'
    | 'income_source'
    | 'net_income'
    | 'occupation'
    | 'source_of_wealth'
>;

export type TFinancialAssessmentFormValues = {
    accountTurnover: TFinancialAssessmentDetailsValues['account_turnover'];
    educationLevel: TFinancialAssessmentDetailsValues['education_level'];
    employmentIndustry: TFinancialAssessmentDetailsValues['employment_industry'];
    employmentStatus: TFinancialAssessmentDetailsValues['employment_status'];
    estimatedWorth: TFinancialAssessmentDetailsValues['estimated_worth'];
    incomeSource: TFinancialAssessmentDetailsValues['income_source'];
    netIncome: TFinancialAssessmentDetailsValues['net_income'];
    occupation: TFinancialAssessmentDetailsValues['occupation'];
    sourceOfWealth: TFinancialAssessmentDetailsValues['source_of_wealth'];
};
