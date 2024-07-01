import {
    addressDetailsConfig,
    currencySelectorConfig,
    financialDetailsConfig,
    personalDetailsConfig,
    termsOfUseConfig,
    tradingAssessmentConfig,
    employmentTaxInfoConfig,
} from '@deriv/account';

import FinancialDetails from '@deriv/account/src/Components/financial-details';
import TradingAssessmentNewUser from '@deriv/account/src/Components/trading-assessment/trading-assessment-new-user';
import PersonalDetails from '@deriv/account/src/Components/personal-details';
import AddressDetails from '@deriv/account/src/Components/address-details';
import CurrencySelector from '@deriv/account/src/Components/currency-selector';
import TermsOfUse from '@deriv/account/src/Components/terms-of-use';
import EmploymentTaxInfo from '@deriv/account/src/Containers/employment-tax-info/employment-tax-info';

const isMaltaAccount = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';

export const getItems = props => [
    currencySelectorConfig(props, CurrencySelector),
    personalDetailsConfig(props, PersonalDetails),
    employmentTaxInfoConfig(props, EmploymentTaxInfo),
    addressDetailsConfig(props, AddressDetails),
    ...(isMaltaAccount(props) ? [tradingAssessmentConfig(props, TradingAssessmentNewUser)] : []),
    ...(isMaltaAccount(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
    termsOfUseConfig(props, TermsOfUse),
];
