import { localize } from '@deriv-com/translations';
import { THooks, TMarketTypes, TWalletLandingCompanyName } from '../../../types';
import { PRODUCT } from '../../cfd/constants';
import { LandingCompanyDetails, MT5MarketTypeDetails, PlatformDetails } from '../constants';

type TGetAccountNameProps = {
    accountCategory: THooks.TransferAccount['account_category'];
    accountType: THooks.TransferAccount['account_type'];
    displayCurrencyCode?: THooks.CurrencyConfig['display_code'];
    landingCompanyName: TWalletLandingCompanyName;
    mt5MarketType?: TMarketTypes.SortedMT5Accounts;
    product?: THooks.AvailableMT5Accounts['product'];
};

//TODO: remove this function when market_type will be added to transfer_between_accounts response in API
export const getMarketType = (mt5Group?: string) => {
    if (mt5Group?.includes(MT5MarketTypeDetails.financial.name)) return MT5MarketTypeDetails.financial.name;
    if (mt5Group?.includes(MT5MarketTypeDetails.synthetic.name)) return MT5MarketTypeDetails.synthetic.name;
    if (mt5Group?.includes(MT5MarketTypeDetails.all.name)) return MT5MarketTypeDetails.all.name;
    return undefined;
};

//TODO: remove this function when landing_company_name will be added to transfer_between_accounts response in API for mt5 accounts
export const getLandingCompanyNameOfMT5Account = (mt5Group?: string) => {
    if (mt5Group?.includes(LandingCompanyDetails.bvi.name)) return LandingCompanyDetails.bvi.name;
    if (mt5Group?.includes(LandingCompanyDetails.labuan.name)) return LandingCompanyDetails.labuan.name;
    if (mt5Group?.includes(LandingCompanyDetails.svg.name)) return LandingCompanyDetails.svg.name;
    if (mt5Group?.includes(LandingCompanyDetails.vanuatu.name)) return LandingCompanyDetails.vanuatu.name;
    return LandingCompanyDetails.svg.name;
};

export const getAccountName = ({
    accountCategory,
    accountType,
    displayCurrencyCode,
    landingCompanyName,
    mt5MarketType,
    product,
}: TGetAccountNameProps) => {
    switch (accountCategory) {
        case 'wallet':
            return localize('{{currency}} Wallet', { currency: displayCurrencyCode });
        case 'trading': {
            switch (accountType) {
                case PlatformDetails.standard.name:
                    return PlatformDetails.standard.title;
                case PlatformDetails.dxtrade.name:
                    return PlatformDetails.dxtrade.title;
                case PlatformDetails.ctrader.name:
                    return PlatformDetails.ctrader.title;
                case PlatformDetails.mt5.name: {
                    switch (mt5MarketType) {
                        case MT5MarketTypeDetails.financial.name:
                            return [
                                MT5MarketTypeDetails.financial.landingCompany?.svg.name,
                                MT5MarketTypeDetails.financial.landingCompany?.virtual.name,
                            ].includes(
                                landingCompanyName as Extract<
                                    TGetAccountNameProps['landingCompanyName'],
                                    'svg' | 'virtual'
                                >
                            )
                                ? MT5MarketTypeDetails.financial.landingCompany?.svg.title
                                : MT5MarketTypeDetails.financial.landingCompany?.malta.title;
                        case MT5MarketTypeDetails.synthetic.name:
                            return MT5MarketTypeDetails.synthetic.title;
                        case MT5MarketTypeDetails.all.name:
                            if (product === PRODUCT.ZEROSPREAD) {
                                return MT5MarketTypeDetails.all.product?.zero_spread.title;
                            }
                            return MT5MarketTypeDetails.all.title;
                        default:
                            return '';
                    }
                }
                default:
                    return '';
            }
        }
        default:
            return '';
    }
};
