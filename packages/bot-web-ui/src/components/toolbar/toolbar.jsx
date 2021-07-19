import { Button, Icon, ThemedScrollbars, Popover, Dialog } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import PropTypes from 'prop-types';
import React from 'react';
import LoadModal from 'Components/load-modal';
import SaveModal from 'Components/save-modal';
import TradeAnimation from 'Components/trade-animation';
import { tabs_title } from 'Constants/bot-contents';
import { popover_zindex } from 'Constants/z-indexes';
import { connect } from 'Stores/connect';

const IconButton = ({ popover_message, icon, icon_id, icon_color, iconOnClick }) => (
    <Popover alignment='bottom' message={popover_message} zIndex={popover_zindex.TOOLBAR} should_disable_pointer_events>
        <Icon
            icon={icon}
            id={icon_id}
            className='toolbar__icon'
            onClick={iconOnClick}
            {...(icon_color ? { color: icon_color } : null)}
        />
    </Popover>
);

const ToolbarButton = ({ popover_message, button_id, button_classname, buttonOnClick, icon, button_text }) => (
    <Popover alignment='bottom' message={popover_message} should_disable_pointer_events>
        <Button id={button_id} className={button_classname} has_effect onClick={buttonOnClick} icon={icon} green>
            {button_text}
        </Button>
    </Popover>
);

const WorkspaceGroup = ({
    has_redo_stack,
    has_undo_stack,
    onResetClick,
    onSortClick,
    onUndoClick,
    onZoomInOutClick,
    toggleLoadModal,
    toggleSaveModal,
}) => (
    <div className='toolbar__group toolbar__group-btn'>
        <IconButton
            popover_message={localize('Reset')}
            icon='IcReset'
            icon_id='db-toolbar__reset-button'
            iconOnClick={onResetClick}
        />
        <IconButton
            popover_message={localize('Import')}
            icon='IcFolderOpen'
            icon_id='db-toolbar__import-button'
            iconOnClick={toggleLoadModal}
        />
        <IconButton
            popover_message={localize('Save')}
            icon='IcSave'
            icon_id='db-toolbar__save-button'
            iconOnClick={toggleSaveModal}
        />
        <div className='vertical-divider' />
        <IconButton
            popover_message={localize('Undo')}
            icon='IcUndo'
            icon_id='db-toolbar__undo-button'
            icon_color={has_undo_stack ? undefined : 'disabled'}
            iconOnClick={() => onUndoClick(/* redo */ false)}
        />
        <IconButton
            popover_message={localize('Redo')}
            icon='IcRedo'
            icon_id='db-toolbar__redo-button'
            icon_color={has_redo_stack ? undefined : 'disabled'}
            iconOnClick={() => onUndoClick(/* redo */ true)}
        />
        <IconButton
            popover_message={localize('Sort')}
            icon='IcSort'
            icon_id='db-toolbar__sort-button'
            iconOnClick={onSortClick}
        />
        <IconButton
            popover_message={localize('Zoom in')}
            icon='IcZoomIn'
            icon_id='db-toolbar__zoom-in-button'
            iconOnClick={() => onZoomInOutClick(/* in */ true)}
        />
        <IconButton
            popover_message={localize('Zoom out')}
            icon='IcZoomOut'
            icon_id='db-toolbar__zoom-out'
            iconOnClick={() => onZoomInOutClick(/* in */ false)}
        />
    </div>
);

const Toolbar = ({ onMount, onUnmount, ...other_props }) => {
    const {
        is_mobile,
        is_running,
        active_tab,
        is_dialog_open,
        onOkButtonClick,
        closeResetDialog,
        toggleStrategyModal,
        toggleLoadModal,
        toggleSaveModal,
    } = other_props;

    return (
        <>
            {is_mobile ? (
                <div className='toolbar'>
                    <div className='toolbar__section'>
                        <ToolbarButton
                            button_id='db-toolbar__import-button--mobile'
                            button_classname='toolbar__btn--icon'
                            buttonOnClick={toggleLoadModal}
                            icon={<Icon icon='IcFolderOpenFilled' color='active' size={16} />}
                            button_text={localize('Load')}
                        />
                        <ToolbarButton
                            button_id='db-toolbar__quick-strategy-button--mobile'
                            button_classname='toolbar__btn--icon'
                            buttonOnClick={toggleStrategyModal}
                            icon={<Icon icon='IcPuzzle' color='active' size={16} />}
                            button_text={localize('Quick')}
                        />
                        <ToolbarButton
                            button_id='db-toolbar__save-button--mobile'
                            button_classname='toolbar__btn--icon'
                            buttonOnClick={toggleSaveModal}
                            icon={<Icon icon='IcSaveFilled' color='active' size={16} />}
                            button_text={localize('Save')}
                        />
                    </div>
                </div>
            ) : (
                <ThemedScrollbars height='56px' is_only_horizontal width='100%'>
                    <div className='toolbar'>
                        <div className='toolbar__section'>
                            <ToolbarButton
                                popover_message={localize('Click here to start building your DBot.')}
                                button_id='db-toolbar__get-started-button'
                                button_classname='toolbar__btn toolbar__btn--icon toolbar__btn--start'
                                buttonOnClick={toggleStrategyModal}
                                icon={<Icon icon='IcPuzzle' color='active' />}
                                button_text={localize('Quick strategy')}
                            />
                            {active_tab === tabs_title.WORKSPACE && <WorkspaceGroup {...other_props} />}
                        </div>
                        <div className='toolbar__section'>
                            <TradeAnimation
                                className='toolbar__animation'
                                should_show_overlay={true}
                                info_direction={'left'}
                            />
                        </div>
                    </div>
                </ThemedScrollbars>
            )}
            <SaveModal />
            <LoadModal />
            <Dialog
                title={localize('Are you sure?')}
                is_visible={is_dialog_open}
                confirm_button_text={is_running ? localize('Yes') : localize('OK')}
                onConfirm={onOkButtonClick}
                cancel_button_text={is_running ? localize('No') : localize('Cancel')}
                onCancel={closeResetDialog}
                is_mobile_full_width={false}
                className={'toolbar__dialog dc-dialog__wrapper--fixed'}
                has_close_icon
            >
                {is_running ? (
                    <Localize
                        i18n_default_text='DBot will not proceed with any new trades. Any ongoing trades will be completed by our system. Any unsaved changes will be lost.<0>Note: Please check your statement to view completed transactions.</0>'
                        components={[<div key={0} className='toolbar__dialog-text--second' />]}
                    />
                ) : (
                    localize('Any unsaved changes will be lost.')
                )}
            </Dialog>
        </>
    );
};

Toolbar.propTypes = {
    active_tab: PropTypes.string,
    file_name: PropTypes.string,
    has_redo_stack: PropTypes.bool,
    has_undo_stack: PropTypes.bool,
    is_dialog_open: PropTypes.bool,
    is_drawer_open: PropTypes.bool,
    is_running: PropTypes.bool,
    is_search_loading: PropTypes.bool,
    is_stop_button_disabled: PropTypes.bool,
    is_stop_button_visible: PropTypes.bool,
    closeResetDialog: PropTypes.func,
    onGoogleDriveClick: PropTypes.func,
    onMount: PropTypes.func,
    onOkButtonClick: PropTypes.func,
    onResetClick: PropTypes.func,
    onRunButtonClick: PropTypes.func,
    onSortClick: PropTypes.func,
    onUndoClick: PropTypes.func,
    onUnmount: PropTypes.func,
    onZoomInOutClick: PropTypes.func,
    toggleSaveLoadModal: PropTypes.func,
};

export default connect(({ main_content, run_panel, save_modal, load_modal, toolbar, ui, quick_strategy }) => ({
    active_tab: main_content.active_tab,
    file_name: toolbar.file_name,
    has_redo_stack: toolbar.has_redo_stack,
    has_undo_stack: toolbar.has_undo_stack,
    is_dialog_open: toolbar.is_dialog_open,
    is_drawer_open: run_panel.is_drawer_open,
    is_mobile: ui.is_mobile,
    is_running: run_panel.is_running,
    is_search_loading: toolbar.is_search_loading,
    is_stop_button_disabled: run_panel.is_stop_button_disabled,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    closeResetDialog: toolbar.closeResetDialog,
    onGoogleDriveClick: toolbar.onGoogleDriveClick,
    onMount: toolbar.onMount,
    onOkButtonClick: toolbar.onResetOkButtonClick,
    onResetClick: toolbar.onResetClick,
    onRunButtonClick: run_panel.onRunButtonClick,
    onSortClick: toolbar.onSortClick,
    onUndoClick: toolbar.onUndoClick,
    onUnmount: toolbar.onUnmount,
    onZoomInOutClick: toolbar.onZoomInOutClick,
    toggleLoadModal: load_modal.toggleLoadModal,
    toggleSaveModal: save_modal.toggleSaveModal,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
}))(Toolbar);
