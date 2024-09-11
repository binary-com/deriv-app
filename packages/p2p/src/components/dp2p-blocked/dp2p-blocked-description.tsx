import React from 'react';
import { observer } from 'mobx-react-lite';

import { Text } from '@deriv/components';

import { Localize } from 'Components/i18next';
import { useStores } from 'Stores/index'; //remove index when store migration to ts is done

const Dp2pBlockedDescription = () => {
    const { general_store } = useStores();

    const getBlockedDescription = () => {
        if (general_store.is_p2p_blocked_for_pa) {
            return (
                <Localize i18n_default_text='P2P transactions are locked. This feature is not available for payment agents.' />
            );
        } else if (general_store.is_high_risk && !general_store.is_blocked) {
            return <Localize i18n_default_text='To enable this feature you must complete the following:' />;
        } else if (general_store.should_show_poa) {
            return (
                <Localize
                    i18n_default_text='Please submit your <0>proof of address</0>. You can use Deriv P2P after we’ve verified your documents.'
                    components={[
                        <a key={0} className='link' rel='noopener noreferrer' href={'/account/proof-of-address'} />,
                    ]}
                />
            );
        }

        return (
            <Localize
                i18n_default_text='Please use <0>live chat</0> to contact our Customer Support team for help.'
                components={[
                    <span
                        key={0}
                        className='link link--orange'
                        onClick={() => window.LiveChatWidget.call('maximize')}
                    />,
                ]}
            />
        );
    };

    return (
        <Text align='center' color='prominent' size='xs'>
            {getBlockedDescription()}
        </Text>
    );
};

export default observer(Dp2pBlockedDescription);
