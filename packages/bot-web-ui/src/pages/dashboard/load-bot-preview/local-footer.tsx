import React from 'react';
import { Button } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import './index.scss';

const LocalFooter = observer(() => {
    const { ui } = useStore();
    const { load_modal, dashboard } = useDBotStore();
    const { is_open_button_loading, loadFileFromLocal, setLoadedLocalFile, toggleLoadModal } = load_modal;
    const { setPreviewOnPopup } = dashboard;

    const { is_desktop } = ui;
    const Wrapper = is_desktop ? React.Fragment : Button.Group;
    return (
        <Wrapper>
            {!is_desktop && (
                <Button text={localize('Cancel')} onClick={() => setLoadedLocalFile(null)} has_effect secondary large />
            )}
            <Button
                text={localize('Open')}
                onClick={() => {
                    loadFileFromLocal();
                    setPreviewOnPopup(false);
                    toggleLoadModal();
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
