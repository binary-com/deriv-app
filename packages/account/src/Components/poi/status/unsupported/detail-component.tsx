/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck [TODO] - Need to fix typescript errors in OnfidoUpload component
import React from 'react';
import { Loading, Icon, Text, Button } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { WS } from '@deriv/shared';
import { UploadComplete } from '../upload-complete/upload-complete';
import POIManualUploadFailed from '../../../poi-manual-upload-failed';
import { API_ERROR_CODES } from '../../../../Constants/api-error-codes';
import uploadFile from '../../../file-uploader-container/upload-file';
import OnfidoUpload from '../../../../Sections/Verification/ProofOfIdentity/onfido-sdk-view-container';

import CardDetails from './card-details';
import { SELFIE_DOCUMENT, getDocumentIndex } from './constants';
import { FormikValues } from 'formik';

const STATUS = {
    IS_UPLOADING: 'IS_UPLOADING',
    IS_COMPLETED: 'IS_COMPLETED',
    IS_FAILED: 'IS_FAILED',
};

type TDetailComponent = {
    document: ReturnType<typeof getDocumentIndex>[number];
    onClickBack: () => void;
    root_class: string;
    country_code_key?: string;
    height?: string | number;
    handleComplete?: () => void;
    is_onfido_supported?: boolean;
    is_from_external?: boolean;
    is_for_mt5?: boolean;
    handlePOIforMT5Complete?: () => void;
    needs_poa?: boolean;
};

const DetailComponent = ({
    document,
    onClickBack,
    root_class,
    country_code_key,
    height,
    handleComplete,
    is_onfido_supported,
    is_from_external,
    is_for_mt5,
    handlePOIforMT5Complete,
    needs_poa,
    ...props
}: TDetailComponent) => {
    const [status, setStatus] = React.useState('');
    const [response_error, setError] = React.useState('');

    let is_any_failed = false;

    const uploadFiles = (data: FormikValues) =>
        new Promise((resolve, reject) => {
            const docs = document.details.documents.map((item: FormikValues) => item.name);
            const files = Object.values(data).filter(item => [...docs, SELFIE_DOCUMENT.name].includes(item.name));
            const files_length = files.length;
            let file_to_upload_index = 0;
            const results: object[] = [];
            const uploadNext = () => {
                const item = files[file_to_upload_index];
                const { file, document_type, pageType, lifetime_valid } = item;
                const expiration_date =
                    typeof data.expiry_date?.format === 'function' ? data.expiry_date.format('YYYY-MM-DD') : undefined;
                uploadFile(file, WS.getSocket, {
                    document_type,
                    page_type: pageType,
                    expiration_date,
                    document_id: data.document_id || '',
                    lifetime_valid: +(lifetime_valid && !expiration_date),
                    document_issuing_country: country_code_key,
                })
                    .then(response => {
                        file_to_upload_index += 1;
                        if (response?.warning === API_ERROR_CODES.DUPLICATE_DOCUMENT) {
                            setStatus(STATUS.IS_DUPLICATE_UPLOAD);
                        } else if (response?.warning || response.error) {
                            is_any_failed = true;
                            setStatus(STATUS.IS_FAILED);
                            setError(
                                response.message || (response.error ? response.error.message : localize('Failed'))
                            );
                            if (file_to_upload_index < files_length) {
                                uploadNext();
                            }
                        } else if (file_to_upload_index < files_length) {
                            results.push(response);
                            uploadNext();
                        } else {
                            resolve(results);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            };

            uploadNext();
        });

    const onComplete = (values: FormikValues) => {
        setStatus(STATUS.IS_UPLOADING);
        uploadFiles(values)
            .then(() => {
                if (!is_any_failed) {
                    if (is_for_mt5) {
                        handlePOIforMT5Complete?.();
                    } else {
                        setStatus(STATUS.IS_COMPLETED);
                    }
                }
            })
            .catch(error => {
                setStatus(STATUS.IS_FAILED);
                setError(error.message);
            });
    };

    switch (status) {
        case STATUS.IS_UPLOADING:
            return <Loading is_fullscreen={false} is_slow_loading status={[localize('Uploading documents')]} />;
        case STATUS.IS_COMPLETED:
            return <UploadComplete is_from_external needs_poa={needs_poa} is_manual_upload />;
        case STATUS.IS_FAILED:
            return <POIManualUploadFailed error={response_error} />;
        case STATUS.IS_DUPLICATE_UPLOAD:
            return (
                <POIManualUploadFailed
                    error={
                        <Localize i18n_default_text='It seems you’ve submitted this document before. Upload a new document.' />
                    }
                >
                    <Button onClick={onClickBack} large primary className='upload_error_btn'>
                        <Localize i18n_default_text='Try Again' />
                    </Button>
                </POIManualUploadFailed>
            );

        default:
            return (
                <React.Fragment>
                    {is_onfido_supported ? (
                        <React.Fragment>
                            <div className={`${root_class}__detail-header`} onClick={onClickBack}>
                                <Icon icon='IcArrowLeftBold' />
                                <Text
                                    as='p'
                                    size='xs'
                                    weight='bold'
                                    color='prominent'
                                    className={`${root_class}__back-title`}
                                >
                                    {localize('Back')}
                                </Text>
                            </div>
                            <OnfidoUpload
                                country_code={country_code_key}
                                documents_supported={[document.onfido_name]}
                                height={height ?? null}
                                handleComplete={is_for_mt5 ? handlePOIforMT5Complete : handleComplete}
                                is_default_enabled
                                handleViewComplete={is_for_mt5 ? handlePOIforMT5Complete : handleComplete}
                                {...props}
                            />
                        </React.Fragment>
                    ) : (
                        <CardDetails
                            data={document.details}
                            onComplete={onComplete}
                            goToCards={onClickBack}
                            is_from_external={is_from_external}
                        />
                    )}
                </React.Fragment>
            );
    }
};

export default DetailComponent;
