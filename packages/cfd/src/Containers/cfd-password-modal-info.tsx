import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { DBVI_COMPANY_NAMES } from '@deriv/shared';
import { useIsSelectedMT5AccountCreated } from '@deriv/hooks';

type CfdPasswordModalInfoProps = {
    jurisdiction_selected_shortcode: string;
    platform: string;
    product: string;
    need_tnc: boolean;
};

const CfdPasswordModalInfo = ({
    jurisdiction_selected_shortcode,
    platform,
    product,
    need_tnc,
}: CfdPasswordModalInfoProps) => {
    const { available_account_to_create } = useIsSelectedMT5AccountCreated();
    return (
        <div className='cfd-password-modal-info'>
            <div className='cfd-password-modal-info__icon'>
                <Icon icon='IcInfoLight' />
            </div>
            <Text size='xxxs'>
                {need_tnc ? (
                    <Localize
                        i18n_default_text='You are adding your {{platform}} {{product}} account under {{company}}, regulated by the {{regulatory_authority}} (license no.<0/> )'
                        values={{
                            platform,
                            product,
                            company: available_account_to_create?.name,
                            regulatory_authority: available_account_to_create?.regulatory_authority ?? '',
                        }}
                        components={[
                            <span
                                key={0}
                                dangerouslySetInnerHTML={{ __html: available_account_to_create?.licence_number ?? '' }}
                            />,
                        ]}
                    />
                ) : (
                    <Localize
                        i18n_default_text='You are adding your {{platform}} {{product}} account under {{company}}.'
                        values={{
                            platform,
                            product,
                            company: DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode].name,
                        }}
                    />
                )}
            </Text>
        </div>
    );
};

export default CfdPasswordModalInfo;
