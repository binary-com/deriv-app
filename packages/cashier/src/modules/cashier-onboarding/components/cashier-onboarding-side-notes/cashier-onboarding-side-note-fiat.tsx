import React from 'react';
import { SideNote } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const CashierOnboardingSideNoteFiat: React.FC = observer(() => {
    const { common } = useStore();
    const { is_from_derivgo } = common;

    return (
        <SideNote
            description={
                <Localize
                    i18n_default_text='To change your account currency, contact us via <0>live chat</0>.'
                    components={[
                        is_from_derivgo ? (
                            <span />
                        ) : (
                            <a
                                key={0}
                                className='link link--orange'
                                onClick={() => window.LiveChatWidget.call('maximize')}
                            />
                        ),
                    ]}
                />
            }
        />
    );
});

export default CashierOnboardingSideNoteFiat;
