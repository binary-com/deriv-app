import React from 'react';
import DocumentsUpload from './documents-upload.jsx';
import SelfieUpload from './selfie-upload.jsx';
import { SELFIE_DOCUMENT } from '../constants';
import './card-details.scss';

const CardDetails = ({ data, goToCards, onComplete }) => {
    const [documents, setDocuments] = React.useState();
    const [selfie, setSelfie] = React.useState();
    const [is_selfie_upload, setIsSelfieUpload] = React.useState(false);

    const onSubmitDucuments = values => {
        setDocuments(values);
        setIsSelfieUpload(true);
    };

    const onConfirmDocuments = values => {
        onComplete({ ...documents, ...values });
    };

    return (
        <React.Fragment>
            {!is_selfie_upload ? (
                <DocumentsUpload
                    initial_values={documents}
                    data={data}
                    goToCards={goToCards}
                    onSubmit={onSubmitDucuments}
                />
            ) : (
                <SelfieUpload
                    initial_values={selfie}
                    goBack={() => setIsSelfieUpload(false)}
                    onConfirm={onConfirmDocuments}
                    onFileDrop={value => setSelfie({ [SELFIE_DOCUMENT.name]: value })}
                />
            )}
        </React.Fragment>
    );
};

export default CardDetails;
