import React from 'react';
import { Button } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { NOTIFICATION_TYPE } from 'Components/bot-notification/bot-notification-utils';
import { useDBotStore } from 'Stores/useDBotStore';

const LocalFooter = observer(() => {
    const { ui } = useStore();
    const { load_modal, dashboard } = useDBotStore();
    const { is_open_button_loading, loadFileFromLocal, setLoadedLocalFile, toggleLoadModal } = load_modal;
    const { setOpenSettings, setPreviewOnPopup } = dashboard;

    const { is_mobile_or_tablet } = ui;
    const Wrapper = is_mobile_or_tablet ? Button.Group : React.Fragment;

    return (
        <Wrapper>
            {is_mobile_or_tablet && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={() => {
                    loadFileFromLocal();
                    toggleLoadModal();
                    setPreviewOnPopup(false);
                    setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
                }}
                is_loading={is_open_button_loading}
                has_effect
                primary
                large
            />
        </Wrapper>
    );
});

export default LocalFooter;
