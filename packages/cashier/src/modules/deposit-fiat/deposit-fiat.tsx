import React from 'react';
import { SideNote } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import PageContainer from '../../components/page-container';
import { DepositSubPageAnalyticsEventTracker } from '../../components/deposit-sub-page-analytics-event-tracker';
import { DepositFiatIframe } from './components';
import { SideNoteFAQ } from 'Components/side-notes';

const DepositFiat: React.FC = observer(() => {
    const { common, traders_hub } = useStore();
    const { is_from_derivgo } = common;
    const { is_low_risk_cr_eu_real } = traders_hub;
    const onClickHandler = () => window.LiveChatWidget.call('maximize');

    return (
        <PageContainer
            // Hide the breadcrumbs for the EU users since this is the main page they see.
            hide_breadcrumb={is_low_risk_cr_eu_real}
            right={
                <>
                    <SideNoteFAQ transaction_type='deposit' />
                    <SideNote
                        description={
                            <Localize
                                i18n_default_text='To change your account currency, contact us via <0>live chat</0>.'
                                components={[
                                    is_from_derivgo ? (
                                        <span />
                                    ) : (
                                        <span
                                            key={0}
                                            className='link'
                                            onClick={onClickHandler}
                                            onKeyDown={onClickHandler}
                                        />
                                    ),
                                ]}
                            />
                        }
                    />
                </>
            }
        >
            <DepositSubPageAnalyticsEventTracker deposit_category='fiat' />
            <DepositFiatIframe />
        </PageContainer>
    );
});

export default DepositFiat;
