import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TOptionsDescription = {
    is_eu_user: boolean;
};

const OptionsDescription = ({ is_eu_user }: TOptionsDescription) => {
    return is_eu_user ? (
        <Text size='xs' line_height='s'>
            <Localize
                i18n_default_text='Multipliers let you trade with leverage and limit your risk to your stake. Learn more about <0>multipliers trading</0>.'
                components={[<StaticUrl key={0} className='options' href='trade-types/multiplier/' />]}
            />
        </Text>
    ) : (
        <div>
            <Text size='xs' line_height='s'>
                <Localize
                    i18n_default_text='Predict the market, profit if you’re right, risk only what you put in. Learn more about <0>options trading</0>.'
                    components={[
                        <StaticUrl
                            key={0}
                            className='options'
                            href='trade-types/options/digital-options/up-and-down/'
                        />,
                    ]}
                />
            </Text>
        </div>
    );
};

export default OptionsDescription;
