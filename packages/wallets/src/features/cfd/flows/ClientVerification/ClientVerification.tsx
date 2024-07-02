import React from 'react';
import { usePOA, usePOI, useSettings } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { THooks } from '../../../../types';
import { Poi } from '../../../accounts';
import { PersonalDetails, PoaScreen } from '../../../accounts/screens';

type TClientVerificationProps = {
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const ClientVerification: React.FC<TClientVerificationProps> = ({ selectedJurisdiction }) => {
    const { data: poi, isLoading: isPoiLoading } = usePOI();
    const { data: poa, isLoading: isPoaLoading } = usePOA();
    const { data: settings, isLoading: isSettingsLoading } = useSettings();

    if (isPoiLoading || isPoaLoading || isSettingsLoading || !settings || !poi || !poi.current.status || !poa) {
        return <Loader />;
    }

    const shouldSubmitPOI = ['none', 'rejected', 'expired'].includes(poi.current.status);
    // @ts-expect-error broken API types for get_account_status
    const shouldSubmitPOA = selectedJurisdiction ? !poa.verified_jurisdiction?.[selectedJurisdiction] : false;

    const shouldFillPersonalDetails = !settings?.has_submitted_personal_details;

    if (shouldSubmitPOI) {
        return <Poi poi={poi} />;
    }

    if (shouldSubmitPOA) {
        return <PoaScreen />;
    }

    if (shouldFillPersonalDetails) return <PersonalDetails settings={settings} />;

    return null;
};

export default ClientVerification;
