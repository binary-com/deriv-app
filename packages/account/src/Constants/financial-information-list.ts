import { localize } from '@deriv-com/translations';

export const getIncomeSourceList = () => [
    {
        text: localize('Salaried Employee'),
        value: 'Salaried Employee',
    },
    {
        text: localize('Self-Employed'),
        value: 'Self-Employed',
    },
    {
        text: localize('Investments & Dividends'),
        value: 'Investments & Dividends',
    },
    {
        text: localize('Pension'),
        value: 'Pension',
    },
    {
        text: localize('State Benefits'),
        value: 'State Benefits',
    },
    {
        text: localize('Savings & Inheritance'),
        value: 'Savings & Inheritance',
    },
];

export const getEmploymentStatusList = () => [
    {
        text: localize('Employed'),
        value: 'Employed',
    },
    {
        text: localize('Pensioner'),
        value: 'Pensioner',
    },
    {
        text: localize('Self-Employed'),
        value: 'Self-Employed',
    },
    {
        text: localize('Student'),
        value: 'Student',
    },
    {
        text: localize('Unemployed'),
        value: 'Unemployed',
    },
];

export const getEmploymentIndustryList = () => [
    {
        text: localize('Construction'),
        value: 'Construction',
    },
    {
        text: localize('Education'),
        value: 'Education',
    },
    {
        text: localize('Finance'),
        value: 'Finance',
    },
    {
        text: localize('Health'),
        value: 'Health',
    },
    {
        text: localize('Tourism'),
        value: 'Tourism',
    },
    {
        text: localize('Information & Communications Technology'),
        value: 'Information & Communications Technology',
    },
    {
        text: localize('Science & Engineering'),
        value: 'Science & Engineering',
    },
    {
        text: localize('Legal'),
        value: 'Legal',
    },
    {
        text: localize('Social & Cultural'),
        value: 'Social & Cultural',
    },
    {
        text: localize('Agriculture'),
        value: 'Agriculture',
    },
    {
        text: localize('Real Estate'),
        value: 'Real Estate',
    },
    {
        text: localize('Food Services'),
        value: 'Food Services',
    },
    {
        text: localize('Manufacturing'),
        value: 'Manufacturing',
    },
    {
        text: localize('Unemployed'),
        value: 'Unemployed',
    },
];

export const getOccupationList = () => [
    {
        text: localize('Chief Executives, Senior Officials and Legislators'),
        value: 'Chief Executives, Senior Officials and Legislators',
    },
    {
        text: localize('Managers'),
        value: 'Managers',
    },
    {
        text: localize('Professionals'),
        value: 'Professionals',
    },
    {
        text: localize('Clerks'),
        value: 'Clerks',
    },
    {
        text: localize('Personal Care, Sales and Service Workers'),
        value: 'Personal Care, Sales and Service Workers',
    },
    {
        text: localize('Agricultural, Forestry and Fishery Workers'),
        value: 'Agricultural, Forestry and Fishery Workers',
    },
    {
        text: localize('Craft, Metal, Electrical and Electronics Workers'),
        value: 'Craft, Metal, Electrical and Electronics Workers',
    },
    {
        text: localize('Plant and Machine Operators and Assemblers'),
        value: 'Plant and Machine Operators and Assemblers',
    },
    {
        text: localize('Cleaners and Helpers'),
        value: 'Cleaners and Helpers',
    },
    {
        text: localize('Mining, Construction, Manufacturing and Transport Workers'),
        value: 'Mining, Construction, Manufacturing and Transport Workers',
    },
    {
        text: localize('Armed Forces'),
        value: 'Armed Forces',
    },
    {
        text: localize('Government Officers'),
        value: 'Government Officers',
    },
    {
        text: localize('Students'),
        value: 'Students',
    },
    {
        text: localize('Unemployed'),
        value: 'Unemployed',
    },
];

export const getSourceOfWealthList = () => [
    {
        text: localize('Accumulation of Income/Savings'),
        value: 'Accumulation of Income/Savings',
    },
    {
        text: localize('Cash Business'),
        value: 'Cash Business',
    },
    {
        text: localize('Company Ownership'),
        value: 'Company Ownership',
    },
    {
        text: localize('Divorce Settlement'),
        value: 'Divorce Settlement',
    },
    {
        text: localize('Inheritance'),
        value: 'Inheritance',
    },
    {
        text: localize('Investment Income'),
        value: 'Investment Income',
    },
    {
        text: localize('Sale of Property'),
        value: 'Sale of Property',
    },
];

export const getEducationLevelList = () => [
    {
        text: localize('Primary'),
        value: 'Primary',
    },
    {
        text: localize('Secondary'),
        value: 'Secondary',
    },
    {
        text: localize('Tertiary'),
        value: 'Tertiary',
    },
];

export const getNetIncomeList = () => [
    {
        text: localize('Less than $25,000'),
        value: 'Less than $25,000',
    },
    {
        text: localize('$25,000 - $50,000'),
        value: '$25,000 - $50,000',
    },
    {
        text: localize('$50,001 - $100,000'),
        value: '$50,001 - $100,000',
    },
    {
        text: localize('$100,001 - $500,000'),
        value: '$100,001 - $500,000',
    },
    {
        text: localize('Over $500,000'),
        value: 'Over $500,000',
    },
];

export const getEstimatedWorthList = () => [
    {
        text: localize('Less than $100,000'),
        value: 'Less than $100,000',
    },
    {
        text: localize('$100,000 - $250,000'),
        value: '$100,000 - $250,000',
    },
    {
        text: localize('$250,001 - $500,000'),
        value: '$250,001 - $500,000',
    },
    {
        text: localize('$500,001 - $1,000,000'),
        value: '$500,001 - $1,000,000',
    },
    {
        text: localize('Over $1,000,000'),
        value: 'Over $1,000,000',
    },
];

export const getAccountTurnoverList = () => {
    return [...getNetIncomeList()];
};

export const getBinaryOptionsTradingExperienceList = () => [
    {
        text: localize('0-1 year'),
        value: '0-1 year',
    },
    {
        text: localize('1-2 years'),
        value: '1-2 years',
    },
    {
        text: localize('Over 3 years'),
        value: 'Over 3 years',
    },
];

export const getBinaryOptionsTradingFrequencyList = () => [
    {
        text: localize('0-5 transactions in the past 12 months'),
        value: '0-5 transactions in the past 12 months',
    },
    {
        text: localize('6-10 transactions in the past 12 months'),
        value: '6-10 transactions in the past 12 months',
    },
    {
        text: localize('11-39 transactions in the past 12 months'),
        value: '11-39 transactions in the past 12 months',
    },
    {
        text: localize('40 transactions or more in the past 12 months'),
        value: '40 transactions or more in the past 12 months',
    },
];

export const getCfdTradingExperienceList = () => {
    return [...getBinaryOptionsTradingExperienceList()];
};

export const getCfdTradingFrequencyList = () => {
    return [...getBinaryOptionsTradingFrequencyList()];
};

export const getForexTradingExperienceList = () => {
    return [...getBinaryOptionsTradingExperienceList()];
};

export const getForexTradingFrequencyList = () => {
    return [...getBinaryOptionsTradingFrequencyList()];
};

export const getOtherInstrumentsTradingExperienceList = () => {
    return [...getBinaryOptionsTradingExperienceList()];
};

export const getOtherInstrumentsTradingFrequencyList = () => {
    return [...getBinaryOptionsTradingFrequencyList()];
};
