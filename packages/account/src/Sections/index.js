import Passkeys from 'Sections/Security/Passkeys';
import PersonalDetails from 'Sections/Profile/PersonalDetails';
import TradingAssessment from 'Sections/Assessment/TradingAssessment';
import FinancialAssessment from 'Sections/Assessment/FinancialAssessment';
import { ProofOfIdentityContainer, ProofOfIdentity } from 'Sections/Verification/ProofOfIdentity';
import ProofOfAddress from 'Sections/Verification/ProofOfAddress';
import ProofOfOwnership from 'Sections/Verification/ProofOfOwnership';
import ProofOfIncome from 'Sections/Verification/ProofOfIncome';
import TwoFactorAuthentication from 'Sections/Security/TwoFactorAuthentication';
import ApiToken from 'Sections/Security/ApiToken';
import SelfExclusion from 'Sections/Security/SelfExclusion';
import Account from 'Containers/Account/account';
import ClosingAccount from 'Sections/Security/ClosingAccount';
import EmploymentTaxInfo from '../Containers/employment-tax-info/employment-tax-info';
import DeactivateAccount from 'Sections/Security/DeactivateAccount'; // TODO: Remove once mobile team has changed this link

export {
    Passkeys,
    PersonalDetails,
    TradingAssessment,
    FinancialAssessment,
    ProofOfIdentityContainer,
    ProofOfIdentity,
    ProofOfAddress,
    ProofOfOwnership,
    ProofOfIncome,
    TwoFactorAuthentication,
    ApiToken,
    SelfExclusion,
    Account,
    ClosingAccount,
    DeactivateAccount,
    EmploymentTaxInfo,
};
