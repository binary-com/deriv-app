import {
    currencySelectorConfig,
    personalDetailsConfig,
    addressDetailsConfig,
    termsOfUseConfig,
    PersonalDetails,
    TermsOfUse,
} from '@deriv/account';
import { walletSelectorConfig } from './containers/wallet-selector-form';
import { TWizardItemConfig } from './types';
import CurrencySelector from './containers/currency-selector-form';
import AddressDetails from './containers/address-details-form';

type TRealAccountSignupTarget = {
    real_account_signup_target: string;
};

const shouldShowPersonalAndAddressDetailsAndCurrency = ({
    real_account_signup_target,
}: TRealAccountSignupTarget): boolean => real_account_signup_target !== 'samoa';

export const getItems = (props: any): TWizardItemConfig[] => {
    return [
        walletSelectorConfig(props),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [currencySelectorConfig(props, CurrencySelector, true)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [personalDetailsConfig(props, PersonalDetails, true)]
            : []),
        ...(shouldShowPersonalAndAddressDetailsAndCurrency(props)
            ? [addressDetailsConfig(props, AddressDetails, true)]
            : []),
        termsOfUseConfig(props, TermsOfUse, true),
    ];
};
