import { localize } from '@deriv-com/translations';
import { CFD_PLATFORMS, MARKET_TYPE } from '../../../constants';
import {
    getAccountVerificationStatus,
    getHighlightedIconLabel,
    getJurisdictionDescription,
    getPlatformType,
    isCTraderAccountAdded,
    isDxtradeAccountAdded,
    isMt5AccountAdded,
    shouldRestrictBviAccountCreation,
    shouldRestrictVanuatuAccountCreation,
} from '../compareAccountsConfig';
import { JURISDICTION, MARKET_TYPE_SHORTCODE } from '../constants';

describe('compareAccountsConfig', () => {
    describe('getHighlightedIconLabel', () => {
        it('returns correct labels for synthetic market type', () => {
            const result = getHighlightedIconLabel(CFD_PLATFORMS.MT5, false, localize, MARKET_TYPE.SYNTHETIC, 'SVG');
            expect(result).toHaveLength(9);
            expect(result[0].text).toBe('Forex: standard');
        });

        it('returns correct labels for EU region', () => {
            const result = getHighlightedIconLabel(CFD_PLATFORMS.MT5, true, localize, MARKET_TYPE.SYNTHETIC, 'SVG');
            expect(result).toHaveLength(9);
            expect(result[0].text).toBe('Forex');
        });

        it('returns correct labels for financial market type with LABUAN jurisdiction', () => {
            const result = getHighlightedIconLabel(
                CFD_PLATFORMS.MT5,
                false,
                localize,
                MARKET_TYPE.FINANCIAL,
                JURISDICTION.LABUAN
            );
            expect(result).toHaveLength(9);
            expect(result[0].text).toBe('Forex: standard/exotic');
        });

        it('returns correct labels for financial market type with MALTAINVEST jurisdiction', () => {
            const result = getHighlightedIconLabel(
                CFD_PLATFORMS.MT5,
                false,
                localize,
                MARKET_TYPE.FINANCIAL,
                JURISDICTION.MALTAINVEST
            );
            expect(result).toHaveLength(6);
            expect(result[5].isAsterisk).toBe(true);
        });

        it('returns correct labels for ALL market type with MT5 platform', () => {
            const result = getHighlightedIconLabel(CFD_PLATFORMS.MT5, false, localize, MARKET_TYPE.ALL, 'SVG');
            expect(result).toHaveLength(9);
            expect(result[6].text).toBe('Synthetics indices');
        });

        it('returns correct labels for ALL market type with non-MT5 platform', () => {
            const result = getHighlightedIconLabel(CFD_PLATFORMS.CTRADER, false, localize, MARKET_TYPE.ALL, 'SVG');
            expect(result).toHaveLength(9);
            expect(result[6].text).toBe('Synthetic indices');
        });
    });

    describe('getPlatformType', () => {
        it('returns correct platform type', () => {
            expect(getPlatformType(CFD_PLATFORMS.MT5)).toBe('MT5');
            expect(getPlatformType(CFD_PLATFORMS.CTRADER)).toBe('CTrader');
            expect(getPlatformType(CFD_PLATFORMS.DXTRADE)).toBe('DerivX');
            // @ts-expect-error - mock unknown value to test output of default case
            expect(getPlatformType('unknown')).toBe('OtherCFDs');
        });
    });

    describe('getJurisdictionDescription', () => {
        it('returns correct description for synthetic BVI', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI);
            expect(result.jurisdiction).toBe('British Virgin Islands');
        });

        it('returns correct description for financial BVI', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.FINANCIAL_BVI);
            expect(result.jurisdiction).toBe('British Virgin Islands');
        });

        it('returns correct description for synthetic Vanuatu', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU);
            expect(result.jurisdiction).toBe('Vanuatu');
        });

        it('returns correct description for financial Vanuatu', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU);
            expect(result.jurisdiction).toBe('Vanuatu');
        });

        it('returns correct description for financial Labuan', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN);
            expect(result.jurisdiction).toBe('Labuan');
        });

        it('returns correct description for financial Maltainvest', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.FINANCIAL_MALTAINVEST);
            expect(result.jurisdiction).toBe('Malta');
        });

        it('returns default description for DerivX', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.ALL_DXTRADE);
            expect(result).toEqual(
                expect.objectContaining({
                    jurisdiction: 'St. Vincent & Grenadines',
                })
            );
        });

        it('returns default description for all SVG', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.ALL_SVG);
            expect(result).toEqual(
                expect.objectContaining({
                    jurisdiction: 'St. Vincent & Grenadines',
                })
            );
        });

        it('returns default description for synthetic SVG', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG);
            expect(result).toEqual(
                expect.objectContaining({
                    jurisdiction: 'St. Vincent & Grenadines',
                })
            );
        });

        it('returns default description for financial SVG', () => {
            const result = getJurisdictionDescription(localize, MARKET_TYPE_SHORTCODE.FINANCIAL_SVG);
            expect(result).toEqual(
                expect.objectContaining({
                    jurisdiction: 'St. Vincent & Grenadines',
                })
            );
        });

        it('returns default description for unknown shortcode', () => {
            const result = getJurisdictionDescription(localize, 'unknown');
            expect(result).toEqual(
                expect.objectContaining({
                    jurisdiction: 'St. Vincent & Grenadines',
                })
            );
        });
    });

    describe('getAccountVerificationStatus', () => {
        it('returns correct status for SVG jurisdiction', () => {
            expect(getAccountVerificationStatus(JURISDICTION.SVG, false, false, true)).toBe(true);
        });

        it('returns correct status for BVI jurisdiction', () => {
            const authInfo = {
                has_poa_been_attempted: true,
                has_poi_been_attempted: true,
                identity: { services: { manual: { status: 'verified' } } },
                poa_status: 'verified',
                risk_classification: 'low',
            };
            // @ts-expect-error - since this is a mock, we only need partial properties of authInfo
            expect(getAccountVerificationStatus(JURISDICTION.BVI, false, false, true, authInfo)).toBe(true);
        });

        it('returns correct status for high risk classification', () => {
            const authInfo = {
                has_poa_been_attempted: true,
                has_poi_been_attempted: true,
                identity: { services: { manual: { status: 'verified' } } },
                poa_status: 'verified',
                risk_classification: 'high',
            };
            // @ts-expect-error - since this is a mock, we only need partial properties of authInfo
            expect(getAccountVerificationStatus(JURISDICTION.BVI, false, false, true, authInfo)).toBe(false);
        });

        it('returns correct status for Vanuatu jurisdiction', () => {
            const authInfo = {
                has_poa_been_attempted: true,
                has_poi_been_attempted: true,
                identity: { services: { manual: { status: 'verified' } } },
                poa_status: 'verified',
                risk_classification: 'low',
            };
            // @ts-expect-error - since this is a mock, we only need partial properties of authInfo
            expect(getAccountVerificationStatus(JURISDICTION.VANUATU, false, false, true, authInfo)).toBe(true);
        });

        it('returns correct status for Labuan jurisdiction', () => {
            const authInfo = {
                has_poa_been_attempted: true,
                has_poi_been_attempted: true,
                identity: { services: { manual: { status: 'verified' } } },
                poa_status: 'verified',
                risk_classification: 'low',
            };
            // @ts-expect-error - since this is a mock, we only need partial properties of authInfo
            expect(getAccountVerificationStatus(JURISDICTION.LABUAN, false, false, true, authInfo)).toBe(true);
        });

        it('returns correct status for Maltainvest jurisdiction', () => {
            const authInfo = {
                has_poa_been_attempted: true,
                has_poi_been_attempted: true,
                identity: { services: { manual: { status: 'verified' } } },
                poa_status: 'verified',
            };
            // @ts-expect-error - since this is a mock, we only need partial properties of authInfo
            expect(getAccountVerificationStatus(JURISDICTION.MALTAINVEST, false, false, true, authInfo)).toBe(true);
            // @ts-expect-error - since this is a mock, we only need partial properties of authInfo
            expect(getAccountVerificationStatus(JURISDICTION.MALTAINVEST, false, false, true, authInfo, true)).toBe(
                true
            );
        });
    });

    describe('isMt5AccountAdded', () => {
        it('returns true if account is added', () => {
            const list = [
                {
                    account_type: 'real',
                    landing_company_short: 'svg',
                    market_type: MARKET_TYPE.FINANCIAL,
                    platform: CFD_PLATFORMS.MT5,
                },
            ];
            // @ts-expect-error - since this is a mock, we only need partial properties of the list
            expect(isMt5AccountAdded(list, MARKET_TYPE.FINANCIAL, 'svg')).toBe(true);
        });

        it('returns false if account is not added', () => {
            const list = [
                {
                    account_type: 'real',
                    landing_company_short: 'svg',
                    market_type: MARKET_TYPE.FINANCIAL,
                    platform: CFD_PLATFORMS.MT5,
                },
            ];
            // @ts-expect-error - since this is a mock, we only need partial properties of the list
            expect(isMt5AccountAdded(list, MARKET_TYPE.FINANCIAL, 'svg', true)).toBe(false);
        });
    });

    describe('isDxtradeAccountAdded', () => {
        it('returns true if account is added', () => {
            const list = [{ account_type: 'real', platform: CFD_PLATFORMS.DXTRADE }];
            // @ts-expect-error - since this is a mock, we only need partial properties of the list
            expect(isDxtradeAccountAdded(list)).toBe(true);
        });

        it('returns false if account is not added', () => {
            const list = [{ account_type: 'real', platform: CFD_PLATFORMS.DXTRADE }];
            // @ts-expect-error - since this is a mock, we only need partial properties of the list
            expect(isDxtradeAccountAdded(list, true)).toBe(false);
        });
    });

    describe('isCTraderAccountAdded', () => {
        it('returns true if account is added', () => {
            const list = [{ account_type: 'real', platform: CFD_PLATFORMS.CTRADER }];
            // @ts-expect-error - since this is a mock, we only need partial properties of the list
            expect(isCTraderAccountAdded(list)).toBe(true);
        });

        it('returns false if account is not added', () => {
            const list = [{ account_type: 'real', platform: CFD_PLATFORMS.CTRADER }];
            // @ts-expect-error - since this is a mock, we only need partial properties of the list
            expect(isCTraderAccountAdded(list, true)).toBe(false);
        });
    });

    describe('shouldRestrictBviAccountCreation', () => {
        it('returns true if BVI account creation should be restricted', () => {
            const accounts = [{ landing_company_short: 'bvi', status: 'poa_failed' }];
            // @ts-expect-error - since this is a mock, we only need partial properties of the accounts
            expect(shouldRestrictBviAccountCreation(accounts)).toBe(true);
        });

        it('returns false if BVI account creation should not be restricted', () => {
            const accounts = [{ landing_company_short: 'bvi', status: 'active' }];
            // @ts-expect-error - since this is a mock, we only need partial properties of the accounts
            expect(shouldRestrictBviAccountCreation(accounts)).toBe(false);
        });
    });

    describe('shouldRestrictVanuatuAccountCreation', () => {
        it('returns true if Vanuatu account creation should be restricted', () => {
            const accounts = [{ landing_company_short: 'vanuatu', status: 'poa_failed' }];
            // @ts-expect-error - since this is a mock, we only need partial properties of the accounts
            expect(shouldRestrictVanuatuAccountCreation(accounts)).toBe(true);
        });

        it('returns false if Vanuatu account creation should not be restricted', () => {
            const accounts = [{ landing_company_short: 'vanuatu', status: 'active' }];
            // @ts-expect-error - since this is a mock, we only need partial properties of the accounts
            expect(shouldRestrictVanuatuAccountCreation(accounts)).toBe(false);
        });
    });
});
