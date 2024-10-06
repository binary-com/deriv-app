import React from 'react';
import { Text, SectionMessage } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TRiskManagementContentProps = {
    should_show_deal_cancellation?: boolean;
};

const RiskManagementContent = ({ should_show_deal_cancellation }: TRiskManagementContentProps) => {
    const content = [
        {
            definition: (
                <Localize i18n_default_text='When your profit reaches or exceeds this amount, your trade will be closed automatically.' />
            ),
            is_displayed: true,
            label: <Localize i18n_default_text='Take Profit' />,
        },
        {
            definition: (
                <Localize i18n_default_text='When your loss reaches or exceeds this amount, your trade will be closed automatically.' />
            ),
            is_displayed: true,
            label: <Localize i18n_default_text='Stop loss' />,
        },
        {
            definition: (
                <Localize i18n_default_text='When this is active, you can cancel your trade within the chosen time frame. Your stake will be returned without loss.' />
            ),
            is_displayed: should_show_deal_cancellation,
            label: <Localize i18n_default_text='Deal cancellation' />,
        },
    ];

    return (
        <React.Fragment>
            {content.map(
                ({ definition, is_displayed, label }) =>
                    is_displayed && (
                        <React.Fragment key={definition.props.i18n_default_text}>
                            <Text bold>{label}</Text>
                            <Text className='risk-management__description__definition'>{definition}</Text>
                        </React.Fragment>
                    )
            )}
            {should_show_deal_cancellation && (
                <SectionMessage
                    message={
                        <Localize i18n_default_text='Take profit and/or stop loss are not available while deal cancellation is active.' />
                    }
                    size='sm'
                    status='info'
                />
            )}
        </React.Fragment>
    );
};

export default RiskManagementContent;
