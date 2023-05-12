import React from 'react';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import './index.scss';

const RecentFooter = observer(() => {
    const {
        load_modal: { is_open_button_loading, loadFileFromRecent },
    } = useDBotStore();
    return (
        <Button
            text={localize('Open')}
            onClick={loadFileFromRecent}
            is_loading={is_open_button_loading}
            has_effect
            primary
            large
        />
    );
});

export default RecentFooter;
