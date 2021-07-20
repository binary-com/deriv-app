import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import { Timeline } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import DetailComponent from './detail-component.jsx';
import { Documents } from './documents.jsx';
import { getDocumentIndex, DOCUMENT_TYPES } from './constants';

const checkNimcStep = documents => {
    let has_nimc = false;
    documents.forEach(document => {
        if (document.document_type === DOCUMENT_TYPES.NATIONAL_IDENTITY_CARD && document.lifetime_valid) {
            has_nimc = true;
        }
    });
    return has_nimc;
};

const Unsupported = ({ residence, ...props }) => {
    const [detail, setDetail] = React.useState(null);
    const toggleDetail = index => setDetail(index);
    const documents = getDocumentIndex({
        setDetail,
        residence,
    });

    if (detail !== null) {
        return (
            <DetailComponent
                is_onfido_supported={residence === 'ng' && !checkNimcStep(documents[detail].details.documents)}
                document={documents[detail]}
                root_class='manual-poi'
                onClickBack={() => setDetail(null)}
                {...props}
            />
        );
    }

    return (
        <Timeline
            className={classNames('manual-poi', {
                'manual-poi--mobile': isMobile(),
            })}
            disabled_items={[2]}
        >
            <Timeline.Item item_title={localize('Please upload one of the following documents:')}>
                <Documents documents={documents} toggleDetail={toggleDetail} />
            </Timeline.Item>
            <Timeline.Item item_title={localize('Upload your selfie')}>
                <div />
            </Timeline.Item>
        </Timeline>
    );
};

export default connect(({ client }) => ({
    residence: client.residence,
}))(Unsupported);
