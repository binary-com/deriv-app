import React from 'react';
import { useHistory } from 'react-router-dom';
import { TModifiedMT5Accounts } from 'src/features/cfd/types';
import { useTranslations } from '@deriv-com/translations';
import { ClientVerificationStatusBadge } from '../../../../components';
import { getClientVerification } from '../../../../utils';
import { DocumentTile } from './components';
import './DocumentsList.scss';

type TDocumentsListProps = {
    account: TModifiedMT5Accounts;
};

type TStatusBadgeProps = Record<TModifiedMT5Accounts['client_kyc_status']['poa_status' | 'poi_status'], JSX.Element>;

const statusBadge: TStatusBadgeProps = {
    expired: <ClientVerificationStatusBadge variant='failed' />,
    none: <></>,
    pending: <ClientVerificationStatusBadge variant='in_review' />,
    rejected: <ClientVerificationStatusBadge variant='failed' />,
    suspected: <ClientVerificationStatusBadge variant='failed' />,
    verified: <ClientVerificationStatusBadge variant='verified' />,
};

const DocumentsList: React.FC<TDocumentsListProps> = ({ account }) => {
    const history = useHistory();
    const { localize } = useTranslations();
    const { hasPoaStatus, hasPoiStatus, hasTinStatus, isPoaRequired, isPoiRequired, isTinRequired, statuses } =
        getClientVerification(account);

    return (
        <div className='wallets-documents-list'>
            {hasPoiStatus && (
                <DocumentTile
                    badge={statusBadge[statuses.poi_status]}
                    disabled={!isPoiRequired}
                    // @ts-expect-error the following link is not part of wallets routes config
                    onClick={() => history.push('/account/proof-of-identity')}
                    title={localize('Proof of identity')}
                />
            )}
            {hasPoaStatus && (
                <DocumentTile
                    badge={statusBadge[statuses.poa_status]}
                    disabled={!isPoaRequired}
                    // @ts-expect-error the following link is not part of wallets routes config
                    onClick={() => history.push('/account/proof-of-address')}
                    title={localize('Proof of address')}
                />
            )}
            {hasTinStatus && isTinRequired && (
                <DocumentTile
                    // @ts-expect-error the following link is not part of wallets routes config
                    onClick={() => history.push('/account/personal-details')}
                    title={localize('Personal details')}
                />
            )}
        </div>
    );
};

export default DocumentsList;
