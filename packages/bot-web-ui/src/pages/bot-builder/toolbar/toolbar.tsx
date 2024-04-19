import React from 'react';
import { Dialog } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import ToolbarButton from './toolbar-button';
import WorkspaceGroup from './workspace-group';

const Toolbar = observer(() => {
    const { run_panel, toolbar, quick_strategy } = useDBotStore();
    const {
        ui: { is_mobile },
    } = useStore();
    const { is_dialog_open, closeResetDialog, onResetOkButtonClick: onOkButtonClick } = toolbar;
    const { is_running } = run_panel;
    const { setFormVisibility } = quick_strategy;
    const confirm_button_text = is_running ? localize('Yes') : localize('OK');
    const cancel_button_text = is_running ? localize('No') : localize('Cancel');
    const handleQuickStrategyOpen = () => {
        setFormVisibility(true);
    };
    return (
        <React.Fragment>
            <div className='toolbar dashboard__toolbar' data-testid='dashboard__toolbar'>
                <div className='toolbar__section'>
                    {is_mobile && (
                        <ToolbarButton
                            popover_message={localize('Click here to start building your Deriv Bot.')}
                            button_id='db-toolbar__get-started-button'
                            button_classname='toolbar__btn toolbar__btn--icon toolbar__btn--start'
                            buttonOnClick={handleQuickStrategyOpen}
                            button_text={localize('Quick strategy')}
                        />
                    )}
                    {!is_mobile && <WorkspaceGroup />}
                </div>
            </div>
            {is_mobile && <WorkspaceGroup />}
            <Dialog
                portal_element_id='modal_root'
                title={localize('Are you sure?')}
                is_visible={is_dialog_open}
                confirm_button_text={confirm_button_text}
                onConfirm={onOkButtonClick}
                cancel_button_text={cancel_button_text}
                onCancel={closeResetDialog}
                is_mobile_full_width={false}
                className={'toolbar__dialog'}
                has_close_icon
            >
                {is_running ? (
                    <Localize
                        i18n_default_text='The workspace will be reset to the default strategy and any unsaved changes will be lost. <0>Note: This will not affect your running bot.</0>'
                        components={[
                            <div
                                key={0}
                                className='toolbar__dialog-text--second'
                                data-testid='toolbar__dialog-text--second'
                            />,
                        ]}
                    />
                ) : (
                    <Localize i18n_default_text='Any unsaved changes will be lost.' />
                )}
            </Dialog>
        </React.Fragment>
    );
});

export default Toolbar;
