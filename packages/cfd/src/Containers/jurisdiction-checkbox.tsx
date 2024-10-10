import React from 'react';
import { Checkbox, StaticUrl, Text } from '@deriv/components';
import { DBVI_COMPANY_NAMES } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useIsSelectedMT5AccountCreated } from '@deriv/hooks';

type TJurisdictionCheckBoxProps = {
    class_name: string;
    is_checked: boolean;
    jurisdiction_selected_shortcode: string;
    onCheck: () => void;
};

const JurisdictionCheckBox = observer(
    ({ class_name, is_checked, jurisdiction_selected_shortcode, onCheck }: TJurisdictionCheckBoxProps) => {
        const { available_account_to_create } = useIsSelectedMT5AccountCreated();
        const getCheckboxLabel = () => (
            <Text as='p' size='xxs' line_height='m'>
                <Localize
                    i18n_default_text="I confirm and accept {{company}} 's <0>terms and conditions</0>"
                    values={{ company: available_account_to_create?.name }}
                    components={[
                        <StaticUrl
                            key={0}
                            className='link link--no-underline'
                            href={DBVI_COMPANY_NAMES[jurisdiction_selected_shortcode]?.tnc_url}
                            is_document
                        />,
                    ]}
                />
            </Text>
        );

        return (
            <div className={class_name}>
                <Checkbox
                    value={is_checked}
                    onChange={onCheck}
                    label={getCheckboxLabel()}
                    defaultChecked={!!is_checked}
                />
            </div>
        );
    }
);

export default JurisdictionCheckBox;
