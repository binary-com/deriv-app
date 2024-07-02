import React from 'react';
import { THooks } from '../../../../types';
import { DocumentService, ManualDocumentUpload } from '../../screens';

type TPoiFlowProps = {
    poi?: THooks.POI;
};

const PoiFlow: React.FC<TPoiFlowProps> = ({ poi }) => {
    const service = poi?.current.service as keyof THooks.POI['services'];

    if (service === 'manual') return <ManualDocumentUpload />;

    return <DocumentService service={service} />;
};

export default PoiFlow;
