import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import BottomNav from 'AppV2/Components/BottomNav';
import Guide from 'AppV2/Components/Guide';

const Trade = () => {
    return (
        <BottomNav>
            <Text size='sm'>Trade</Text>
            <Guide />
            <Guide is_minimalistic_look />
        </BottomNav>
    );
};

export default Trade;
