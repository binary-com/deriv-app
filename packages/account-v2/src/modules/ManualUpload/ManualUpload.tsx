import React, { useState } from 'react';
import { DocumentSelection } from '../../containers/DocumentSelection';
import { ManualUploadContainer } from '../../pages/ManualUploadContainer/ManualUploadContainer';

type TManualUploadProps = { countryCode: string; handleComplete: () => void; onCancel: () => void };

export const ManualUpload = ({ countryCode, handleComplete, onCancel }: TManualUploadProps) => {
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

    if (selectedDocument) {
        return (
            <ManualUploadContainer
                countryCode={countryCode}
                onDocumentSubmit={handleComplete}
                selectedDocument={selectedDocument}
                setSelectedDocument={setSelectedDocument}
            />
        );
    }
    return <DocumentSelection countryCode={countryCode} handleOnClick={setSelectedDocument} onCancel={onCancel} />;
};
