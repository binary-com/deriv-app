import React from 'react';
import classnames from 'classnames';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { Icon } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';

type TRecentWorkspaceProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workspace: { [key: string]: any };
};

const RecentWorkspace = observer(({ workspace }: TRecentWorkspaceProps) => {
    const { load_modal, blockly_store } = useDBotStore();
    const { setLoading } = blockly_store;
    const {
        getRecentFileIcon,
        getSaveType,
        loadStrategyOnModalRecentPreview,
        selected_strategy_id,
        updateXmlValuesOnStrategySelection,
    } = load_modal;

    const onRecentWorkspaceClick = () => {
        if (selected_strategy_id === workspace.id) return;
        setLoading(true);
        loadStrategyOnModalRecentPreview(workspace.id);
        updateXmlValuesOnStrategySelection();
    };

    return (
        <div
            className={classnames('load-strategy__recent-item', {
                'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
            })}
            key={workspace.id}
            onClick={onRecentWorkspaceClick}
            data-testid='dt_recent_workspace_item'
        >
            <div className='load-strategy__recent-item-text'>
                <div className='load-strategy__recent-item-title' title={workspace.name}>
                    {workspace.name}
                </div>
                <div className='load-strategy__recent-item-time'>{timeSince(workspace.timestamp)}</div>
            </div>
            <div className='load-strategy__recent-item-location'>
                <Icon
                    icon={getRecentFileIcon(workspace.save_type)}
                    className={classnames({
                        'load-strategy__recent-icon--active': workspace.save_type === save_types.GOOGLE_DRIVE,
                    })}
                />
                <div className='load-strategy__recent-item-saved'>{getSaveType(workspace.save_type)}</div>
            </div>
        </div>
    );
});

export default RecentWorkspace;
