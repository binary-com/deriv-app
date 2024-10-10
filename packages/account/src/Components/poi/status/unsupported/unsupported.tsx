import React from 'react';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { identity_status_codes } from '../../../../Sections/Verification/ProofOfIdentity/proof-of-identity-utils';
import DetailComponent from './detail-component';
import { Documents } from './documents';
import { getDocumentIndex, DOCUMENT_TYPES } from './constants';
import UploadComplete from '../upload-complete';
import { FormikValues } from 'formik';
import Verified from '../verified';
import Limited from '../limited';
import Expired from '../expired';
import FormFooter from '../../../form-footer';

const checkNimcStep = (documents: FormikValues) => {
    let has_nimc = false;
    documents.forEach((document: FormikValues) => {
        if (document.document_type === DOCUMENT_TYPES.NIMC_SLIP) {
            has_nimc = true;
        }
    });
    return has_nimc;
};

type TUnsupported = {
    country_code: string;
    handlePOIforMT5Complete: () => void;
    manual: {
        status: string;
    };
    redirect_button: React.ReactElement;
    needs_poa: boolean;
    handleBack: () => void;
    handleRequireSubmission: () => void;
    handleViewComplete: () => void;
    allow_poi_resubmission: boolean;
    onfido: {
        submissions_left: number;
    };
    is_for_mt5?: boolean;
    is_resubmission?: boolean;
};

const Unsupported = ({
    country_code,
    handlePOIforMT5Complete,
    manual,
    redirect_button,
    needs_poa,
    handleBack,
    handleRequireSubmission,
    allow_poi_resubmission,
    handleViewComplete,
    onfido,
    is_for_mt5,
    is_resubmission,
    ...props
}: TUnsupported) => {
    const [detail, setDetail] = React.useState<number | null>(null);
    const toggleDetail = (index: number) => setDetail(index);

    const documents = getDocumentIndex({
        country_code,
    });

    if (manual) {
        if (manual.status === identity_status_codes.pending)
            return <UploadComplete is_manual_upload needs_poa={needs_poa} redirect_button={redirect_button} />;
        else if (
            [identity_status_codes.rejected, identity_status_codes.suspected].some(status => status === manual.status)
        ) {
            if (!allow_poi_resubmission) return <Limited />;
        } else if (manual.status === identity_status_codes.verified) {
            return <Verified needs_poa={needs_poa} redirect_button={redirect_button} />;
        } else if (manual.status === identity_status_codes.expired) {
            return <Expired redirect_button={redirect_button} handleRequireSubmission={handleRequireSubmission} />;
        }
    }

    if (detail !== null) {
        const is_onfido_supported =
            country_code === 'ng' &&
            !checkNimcStep(documents[detail ?? 0].details.documents) &&
            onfido &&
            onfido.submissions_left > 0;
        return (
            <DetailComponent
                is_onfido_supported={is_onfido_supported}
                country_code_key={country_code}
                document={documents[detail]}
                root_class='manual-poi'
                onClickBack={() => setDetail(null)}
                handlePOIforMT5Complete={handlePOIforMT5Complete}
                handleComplete={handleViewComplete}
                is_for_mt5={is_for_mt5}
                needs_poa={needs_poa}
                {...props}
            />
        );
    }

    return (
        <div className='manual-poi'>
            <Text as='h2' color='prominent' size='xs' className='manual-poi__title'>
                <Localize i18n_default_text='Please upload one of the following documents:' />
            </Text>
            <Documents documents={documents} toggleDetail={toggleDetail} />
            {!is_for_mt5 && !is_resubmission && (
                <FormFooter className='proof-of-identity__footer'>
                    <Button className='back-btn' onClick={handleBack} type='button' has_effect large secondary>
                        <Localize i18n_default_text='Back' />
                    </Button>
                </FormFooter>
            )}
        </div>
    );
};
export default Unsupported;
