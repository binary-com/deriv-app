import { useTranslations } from '@deriv-com/translations';
import { getJurisdictionMaltainvestContents } from './jurisdiction_maltainvest_contents';
import { getJurisdictionBviContents } from './jurisdiction-bvi-contents';
import { getJurisdictionLabuanContents } from './jurisdiction-labuan-contents';
import { getJurisdictionSvgContents } from './jurisdiction-svg-contents';
import { getJurisdictionVanuatuContents } from './jurisdiction-vanuatu-contents';
import { TJurisdictionCardItems } from './props.types';

export type TJurisdictionContent = {
    bvi: TJurisdictionCardItems;
    labuan: TJurisdictionCardItems;
    maltainvest: TJurisdictionCardItems;
    svg: TJurisdictionCardItems;
    vanuatu: TJurisdictionCardItems;
};

export const getJurisdictionContents = (
    localize: ReturnType<typeof useTranslations>['localize']
): Record<string, TJurisdictionCardItems> => ({
    bvi: getJurisdictionBviContents(localize),
    labuan: getJurisdictionLabuanContents(localize),
    maltainvest: getJurisdictionMaltainvestContents(localize),
    svg: getJurisdictionSvgContents(localize),
    vanuatu: getJurisdictionVanuatuContents(localize),
});
