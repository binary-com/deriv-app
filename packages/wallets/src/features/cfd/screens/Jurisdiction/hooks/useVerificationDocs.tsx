import { useMemo } from 'react';
import { usePOI, useResidenceList } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { JURISDICTION } from '../../../constants';
import { getJurisdictionContents } from '../jurisdiction-contents/jurisdiction-contents';

type TJurisdictionContent = ReturnType<typeof getJurisdictionContents>;
type TVerificationDocument = TJurisdictionContent[keyof TJurisdictionContent]['verificationDocs'];

const useVerificationDocs = (jurisdiction: string): TVerificationDocument => {
    const { data } = usePOI();
    const { data: residenceList } = useResidenceList();
    const { localize } = useTranslations();
    const { verificationDocs } = getJurisdictionContents(localize)[jurisdiction];
    const isIDVSupported = useMemo(
        () =>
            residenceList.find(residence => residence.value === data?.current?.country_code)?.identity?.services?.idv
                ?.is_country_supported,
        [data, residenceList]
    );
    const hasIDVAttempts = useMemo(() => (data?.services?.idv?.submissions_left ?? 0) > 0, [data]);
    const isNonIDV = useMemo(
        () => (isIDVSupported !== undefined && !isIDVSupported) || (isIDVSupported && !hasIDVAttempts),
        [hasIDVAttempts, isIDVSupported]
    );

    const modifiedVerificationDocs: TVerificationDocument = useMemo(() => {
        const jurisdictionToCheck: string[] = [JURISDICTION.BVI, JURISDICTION.LABUAN, JURISDICTION.VANUATU];
        if (jurisdictionToCheck.includes(jurisdiction) && isNonIDV) {
            return {
                financial: ['selfie', 'identityDocument', 'nameAndAddress'],
                synthetic: ['selfie', 'identityDocument', 'nameAndAddress'],
            };
        }
        return verificationDocs;
    }, [isNonIDV, jurisdiction, verificationDocs]);

    return modifiedVerificationDocs;
};

export default useVerificationDocs;
