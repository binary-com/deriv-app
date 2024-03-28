import React from 'react';
import { Button } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { NOTIFICATION_TYPE } from 'Components/bot-notification/bot-notification-utils';
import { useDBotStore } from 'Stores/useDBotStore';

const RecentFooter = observer(() => {
    const { load_modal, dashboard, toolbar } = useDBotStore();
    const { is_open_button_loading, loadFileFromRecent, toggleLoadModal } = load_modal;
    const { setOpenSettings } = dashboard;
    const { setImportButtonClick } = toolbar;

    return (
        <Button
            text={localize('Open')}
            onClick={() => {
                setImportButtonClick(true);
                loadFileFromRecent();
                toggleLoadModal();
                setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
            }}
            is_loading={is_open_button_loading}
            has_effect
            primary
            large
        />
    );
});

export default RecentFooter;
