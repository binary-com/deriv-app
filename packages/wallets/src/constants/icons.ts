import {
    AccountsDerivAccountLightIcon,
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5DerivedIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    CurrencyAudIcon,
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyLtcIcon,
    CurrencyUsdcIcon,
    CurrencyUsdIcon,
    CurrencyUsdtIcon,
    DerivProductDerivBotBrandLightLogoHorizontalIcon,
    DerivProductDerivGoBrandLightLogoHorizontalIcon,
    DerivProductDerivTraderBrandLightLogoHorizontalIcon,
    PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    PartnersProductSmarttraderBrandLightLogoIcon,
    PaymentMethodBitcoinBrandIcon,
    PaymentMethodDerivDemoBrandDarkIcon,
    PaymentMethodEthereumBrandIcon,
    PaymentMethodLitecoinBrandIcon,
    PaymentMethodTetherUsdtBrandIcon,
    PaymentMethodUsdCoinBrandIcon,
} from '@deriv/quill-icons';
import { TCurrencyIconTypes, TIconTypes } from '../types';

export const AppIcons: TIconTypes = {
    binarybot: PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    bot: DerivProductDerivBotBrandLightLogoHorizontalIcon,
    derivgo: DerivProductDerivGoBrandLightLogoHorizontalIcon,
    smarttrader: PartnersProductSmarttraderBrandLightLogoIcon,
    trader: DerivProductDerivTraderBrandLightLogoHorizontalIcon,
};

export const CFDPlatformIcons: TIconTypes = {
    ctrader: AccountsDerivCtraderIcon,
    dxtrade: AccountsDerivXIcon,
};

export const MT5MarketIcons: TIconTypes = {
    all: AccountsDmt5SwfIcon,
    cfds: AccountsDmt5CfdsIcon,
    financial: AccountsDmt5FinancialIcon,
    synthetic: AccountsDmt5DerivedIcon,
};

export const PlatformIcons: TIconTypes = {
    standard: AccountsDerivAccountLightIcon,
};

// Currencies icons
export const fiatIcons = ['AUD', 'EUR', 'GBP', 'USD'] as const;

export const roundedCurrencyIcons: TCurrencyIconTypes = {
    AUD: CurrencyAudIcon,
    BTC: CurrencyBtcIcon,
    ETH: CurrencyEthIcon,
    EUR: CurrencyEurIcon,
    eUSDT: CurrencyUsdtIcon,
    GBP: CurrencyGbpIcon,
    LTC: CurrencyLtcIcon,
    tUSDT: CurrencyUsdtIcon,
    USD: CurrencyUsdIcon,
    USDC: CurrencyUsdcIcon,
    USDT: CurrencyUsdtIcon,
    UST: CurrencyUsdtIcon,
};

export const horizontalCurrencyIcons: TCurrencyIconTypes = {
    BTC: PaymentMethodBitcoinBrandIcon,
    DEMO: PaymentMethodDerivDemoBrandDarkIcon,
    ETH: PaymentMethodEthereumBrandIcon,
    eUSDT: PaymentMethodTetherUsdtBrandIcon,
    LTC: PaymentMethodLitecoinBrandIcon,
    tUSDT: PaymentMethodTetherUsdtBrandIcon,
    USDC: PaymentMethodUsdCoinBrandIcon,
    USDT: PaymentMethodTetherUsdtBrandIcon,
    UST: PaymentMethodTetherUsdtBrandIcon,
};
