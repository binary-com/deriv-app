import React from 'react';
import { PageContainer } from '../../components/page-container';
import { WithdrawalFiatIframe } from './components';

const WithdrawalFiat: React.FC = () => (
    <div style={{ width: '100%' }} data-testid='dt_withdrawal_fiat_iframe_module'>
        <PageContainer hide_breadcrumb>
            <WithdrawalFiatIframe />
        </PageContainer>
    </div>
);

export default WithdrawalFiat;
