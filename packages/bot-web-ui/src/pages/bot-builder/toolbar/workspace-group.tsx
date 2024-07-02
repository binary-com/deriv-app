import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendOpenEvent } from '../../../analytics/rudderstack-common-events';
import ToolbarIcon from './toolbar-icon';

const WorkspaceGroup = observer(() => {
    const { dashboard, toolbar, load_modal, save_modal } = useDBotStore();
    const { setPreviewOnPopup, setChartModalVisibility, setTradingViewModalVisibility } = dashboard;
    const { has_redo_stack, has_undo_stack, onResetClick, onSortClick, onUndoClick, onZoomInOutClick } = toolbar;
    const { toggleSaveModal } = save_modal;
    const { toggleLoadModal } = load_modal;
    const { ui } = useStore();
    const { is_desktop } = ui;

    return (
        <div className='toolbar__wrapper'>
            <div className='toolbar__group toolbar__group-btn' data-testid='dt_toolbar_group_btn'>
                <ToolbarIcon
                    popover_message={localize('Reset')}
                    icon='IcReset'
                    icon_id='db-toolbar__reset-button'
                    data_testid='dt_toolbar_reset_button'
                    action={onResetClick}
                />
                <ToolbarIcon
                    popover_message={localize('Import')}
                    icon='IcFolderOpen'
                    icon_id='db-toolbar__import-button'
                    data_testid='dt_toolbar_import_button'
                    action={() => {
                        setPreviewOnPopup(true);
                        toggleLoadModal();
                        rudderStackSendOpenEvent({ subform_source: 'bot_builder', subform_name: 'load_strategy' });
                    }}
                />
                <ToolbarIcon
                    popover_message={localize('Save')}
                    icon='IcSave'
                    icon_id='db-toolbar__save-button'
                    data_testid='dt_toolbar_save_button'
                    action={toggleSaveModal}
                />
                <ToolbarIcon
                    popover_message={localize('Sort blocks')}
                    icon='IcSort'
                    icon_id='db-toolbar__sort-button'
                    data_testid='dt_toolbar_sort_button'
                    action={onSortClick}
                />
                {is_desktop && (
                    <>
                        <div className='vertical-divider' />
                        <ToolbarIcon
                            popover_message={localize('Charts')}
                            icon='IcChartsTabDbot'
                            icon_id='db-toolbar__charts-button'
                            data_testid='dt_toolbar_chart_button'
                            action={() => setChartModalVisibility()}
                        />
                        <ToolbarIcon
                            popover_message={localize('Trading View Chart')}
                            icon='IcTradingViewChart'
                            icon_id='db-toolbar__tradingview-button'
                            data_testid='dt_toolbar_tradingview_chart_button'
                            action={() => setTradingViewModalVisibility()}
                        />
                    </>
                )}
                <div className='vertical-divider' />
                <ToolbarIcon
                    popover_message={localize('Undo')}
                    icon='IcUndo'
                    icon_id='db-toolbar__undo-button'
                    data_testid='dt_toolbar_undo_button'
                    icon_color={has_undo_stack ? undefined : 'disabled'}
                    action={() => onUndoClick(/* redo */ false)}
                />
                <ToolbarIcon
                    popover_message={localize('Redo')}
                    icon='IcRedo'
                    icon_id='db-toolbar__redo-button'
                    data_testid='dt_toolbar_redo_button'
                    icon_color={has_redo_stack ? undefined : 'disabled'}
                    action={() => onUndoClick(/* redo */ true)}
                />
                <div className='vertical-divider' />
                <ToolbarIcon
                    popover_message={localize('Zoom in')}
                    icon='IcZoomIn'
                    icon_id='db-toolbar__zoom-in-button'
                    data_testid='dt_toolbar_zoom_in_button'
                    action={() => onZoomInOutClick(/* in */ true)}
                />
                <ToolbarIcon
                    popover_message={localize('Zoom out')}
                    icon='IcZoomOut'
                    icon_id='db-toolbar__zoom-out'
                    data_testid='dt_toolbar_zoom_out_button'
                    action={() => onZoomInOutClick(/* in */ false)}
                />
            </div>
        </div>
    );
});

export default WorkspaceGroup;
