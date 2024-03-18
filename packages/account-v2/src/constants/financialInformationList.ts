export const getIncomeSourceList = () => [
    {
        text: 'Salaried Employee',
        value: 'Salaried Employee',
    },
    {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        text: 'Self-Employed',
        value: 'Self-Employed',
    },
    {
        text: 'Investments & Dividends',
        value: 'Investments & Dividends',
    },
    {
        text: 'Pension',
        value: 'Pension',
    },
    {
        text: 'State Benefits',
        value: 'State Benefits',
    },
    {
        text: 'Savings & Inheritance',
        value: 'Savings & Inheritance',
    },
];

export const getEmploymentStatusList = () => [
    {
        text: 'Employed',
        value: 'Employed',
    },
    {
        text: 'Pensioner',
        value: 'Pensioner',
    },
    {
        text: 'Self-Employed',
        value: 'Self-Employed',
    },
    {
        text: 'Student',
        value: 'Student',
    },
    {
        text: 'Unemployed',
        value: 'Unemployed',
    },
];

export const getEmploymentIndustryList = () => [
    {
        text: 'Construction',
        value: 'Construction',
    },
    {
        text: 'Education',
        value: 'Education',
    },
    {
        text: 'Finance',
        value: 'Finance',
    },
    {
        text: 'Health',
        value: 'Health',
    },
    {
        text: 'Tourism',
        value: 'Tourism',
    },
    {
        text: 'Information & Communications Technology',
        value: 'Information & Communications Technology',
    },
    {
        text: 'Science & Engineering',
        value: 'Science & Engineering',
    },
    {
        text: 'Legal',
        value: 'Legal',
    },
    {
        text: 'Social & Cultural',
        value: 'Social & Cultural',
    },
    {
        text: 'Agriculture',
        value: 'Agriculture',
    },
    {
        text: 'Real Estate',
        value: 'Real Estate',
    },
    {
        text: 'Food Services',
        value: 'Food Services',
    },
    {
        text: 'Manufacturing',
        value: 'Manufacturing',
    },
    {
        text: 'Unemployed',
        value: 'Unemployed',
    },
];

export const getOccupationList = () => [
    {
        text: 'Chief Executives, Senior Officials and Legislators',
        value: 'Chief Executives, Senior Officials and Legislators',
    },
    {
        text: 'Managers',
        value: 'Managers',
    },
    {
        text: 'Professionals',
        value: 'Professionals',
    },
    {
        text: 'Clerks',
        value: 'Clerks',
    },
    {
        text: 'Personal Care, Sales and Service Workers',
        value: 'Personal Care, Sales and Service Workers',
    },
    {
        text: 'Agricultural, Forestry and Fishery Workers',
        value: 'Agricultural, Forestry and Fishery Workers',
    },
    {
        text: 'Craft, Metal, Electrical and Electronics Workers',
        value: 'Craft, Metal, Electrical and Electronics Workers',
    },
    {
        text: 'Plant and Machine Operators and Assemblers',
        value: 'Plant and Machine Operators and Assemblers',
    },
    {
        text: 'Cleaners and Helpers',
        value: 'Cleaners and Helpers',
    },
    {
        text: 'Mining, Construction, Manufacturing and Transport Workers',
        value: 'Mining, Construction, Manufacturing and Transport Workers',
    },
    {
        text: 'Armed Forces',
        value: 'Armed Forces',
    },
    {
        text: 'Government Officers',
        value: 'Government Officers',
    },
    {
        text: 'Students',
        value: 'Students',
    },
    {
        text: 'Unemployed',
        value: 'Unemployed',
    },
];

export const getSourceOfWealthList = () => [
    {
        text: 'Accumulation of Income/Savings',
        value: 'Accumulation of Income/Savings',
    },
    {
        text: 'Cash Business',
        value: 'Cash Business',
    },
    {
        text: 'Company Ownership',
        value: 'Company Ownership',
    },
    {
        text: 'Divorce Settlement',
        value: 'Divorce Settlement',
    },
    {
        text: 'Inheritance',
        value: 'Inheritance',
    },
    {
        text: 'Investment Income',
        value: 'Investment Income',
    },
    {
        text: 'Sale of Property',
        value: 'Sale of Property',
    },
];

export const getEducationLevelList = () => [
    {
        text: 'Primary',
        value: 'Primary',
    },
    {
        text: 'Secondary',
        value: 'Secondary',
    },
    {
        text: 'Tertiary',
        value: 'Tertiary',
    },
];

export const getNetIncomeList = () => [
    {
        text: 'Less than $25,000',
        value: 'Less than $25,000',
    },
    {
        text: '$25,000 - $50,000',
        value: '$25,000 - $50,000',
    },
    {
        text: '$50,001 - $100,000',
        value: '$50,001 - $100,000',
    },
    {
        text: '$100,001 - $500,000',
        value: '$100,001 - $500,000',
    },
    {
        text: 'Over $500,000',
        value: 'Over $500,000',
    },
];

export const getEstimatedWorthList = () => [
    {
        text: 'Less than $100,000',
        value: 'Less than $100,000',
    },
    {
        text: '$100,000 - $250,000',
        value: '$100,000 - $250,000',
    },
    {
        text: '$250,001 - $500,000',
        value: '$250,001 - $500,000',
    },
    {
        text: '$500,001 - $1,000,000',
        value: '$500,001 - $1,000,000',
    },
    {
        text: 'Over $1,000,000',
        value: 'Over $1,000,000',
    },
];

export const getAccountTurnoverList = () => {
    return [...getNetIncomeList()];
};

export const getBinaryOptionsTradingExperienceList = () => [
    {
        text: '0-1 year',
        value: '0-1 year',
    },
    {
        text: '1-2 years',
        value: '1-2 years',
    },
    {
        text: 'Over 3 years',
        value: 'Over 3 years',
    },
];

export const getBinaryOptionsTradingFrequencyList = () => [
    {
        text: '0-5 transactions in the past 12 months',
        value: '0-5 transactions in the past 12 months',
    },
    {
        text: '6-10 transactions in the past 12 months',
        value: '6-10 transactions in the past 12 months',
    },
    {
        text: '11-39 transactions in the past 12 months',
        value: '11-39 transactions in the past 12 months',
    },
    {
        text: '40 transactions or more in the past 12 months',
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
