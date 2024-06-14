import React from 'react';
import { Div100vhContainer } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import MT5MigrationFrontSideContent from './mt5-migration-front-side-content';
import { useMT5MigrationModalContext } from './mt5-migration-modal-context';
import MT5MigrationBackSideContent from './mt5-migration-back-side-content';

const MT5MigrationModalContent = observer(() => {
    const { ui } = useStore();
    const { is_mobile_or_tablet } = ui;
    const { show_modal_front_side } = useMT5MigrationModalContext();

    return (
        <Div100vhContainer
            className='mt5-migration-modal__mobile-container'
            height_offset='150px'
            is_bypassed={!is_mobile_or_tablet}
        >
            {show_modal_front_side ? <MT5MigrationFrontSideContent /> : <MT5MigrationBackSideContent />}
        </Div100vhContainer>
    );
});

export default MT5MigrationModalContent;
