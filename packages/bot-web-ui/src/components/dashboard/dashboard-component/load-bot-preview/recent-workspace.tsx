import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { DesktopWrapper, Icon, MobileWrapper, Text, useOnClickOutside } from '@deriv/components';
import classnames from 'classnames';
import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import './index.scss';

type TRecentWorkspace = {
    getRecentFileIcon: (string: string) => void;
    getSaveType: (type: string) => string;
    previewRecentStrategy: (workspaceId: string) => void;
    selected_strategy_id: string;
    workspace: { [key: string]: string };
    setFileLoaded: (param: boolean) => void;
    index: number;
    has_file_loaded: boolean;
    recent_strategies: boolean;
    toggleSaveModal: () => void;
    onToggleDeleteDialog: (is_delete_modal_open: boolean) => void;
    loadFileFromRecent: () => void;
    setActiveTab: (active_tab: number) => void;
    dashboard_strategies: [];
    setLoaderVisible: (param: boolean) => void;
};

const RecentWorkspace = ({
    getRecentFileIcon,
    getSaveType,
    previewRecentStrategy,
    selected_strategy_id,
    workspace,
    index,
    setFileLoaded,
    toggleSaveModal,
    loadFileFromRecent,
    onToggleDeleteDialog,
    setActiveTab,
    dashboard_strategies,
}: TRecentWorkspace) => {
    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (dashboard_strategies && dashboard_strategies.length && index === 0) {
            setTimeout(() => {
                trigger_div_ref?.current?.click();
            }, 50);
        }
    }, []);
    const [is_dropdown_visible, setDropdownVisibility] = React.useState(false);
    const toggle_ref = React.useRef<HTMLDivElement>(null);
    const validateClickOutside = (event: React.ChangeEvent<HTMLInputElement>) =>
        is_dropdown_visible && !toggle_ref.current?.contains(event.target);

    const onToggleDropdown = () => {
        setDropdownVisibility(!is_dropdown_visible);
    };

    useOnClickOutside(toggle_ref, onToggleDropdown, validateClickOutside);

    const viewRecentStrategy = (type: string) => {
        if (selected_strategy_id !== workspace.id) {
            previewRecentStrategy(workspace.id);
            setFileLoaded(true);
        }
        if (type === 'edit') {
            loadFileFromRecent();
            setActiveTab(1);
        } else if (type === 'save') {
            toggleSaveModal();
        } else if (type === 'delete') {
            onToggleDeleteDialog(true);
        }
    };

    return (
        <>
            <div
                className={classnames('load-strategy__recent-item', {
                    'load-strategy__recent-item--selected': selected_strategy_id === workspace.id,
                    'load-strategy__recent-item__loaded': dashboard_strategies,
                })}
                key={workspace.id}
                ref={trigger_div_ref}
                onClick={() => {
                    viewRecentStrategy('preview');
                }}
            >
                <div className='load-strategy__recent-item-text'>
                    <div className='load-strategy__recent-item-title'>{workspace.name}</div>
                </div>
                <div className='load-strategy__recent-item-time'>{timeSince(workspace.timestamp)}</div>
                <div className='load-strategy__recent-item-location'>
                    <Icon
                        icon={getRecentFileIcon(workspace.save_type)}
                        className={classnames({
                            'load-strategy__recent-icon--active': workspace.save_type === save_types.GOOGLE_DRIVE,
                        })}
                    />
                    <div className='load-strategy__recent-item-saved'>{getSaveType(workspace.save_type)}</div>
                </div>
                <DesktopWrapper>
                    <div className='load-strategy__recent-item__button'>
                        <div
                            className='load-strategy__recent-item__button'
                            onClick={() => {
                                viewRecentStrategy('edit');
                            }}
                        >
                            <Icon icon='IcEdit' />
                        </div>
                        <div
                            className='load-strategy__recent-item__button'
                            onClick={() => {
                                viewRecentStrategy('save');
                            }}
                        >
                            <Icon icon='IcSave' />
                        </div>
                        <div
                            className='load-strategy__recent-item__button'
                            onClick={e => {
                                viewRecentStrategy('delete');
                            }}
                        >
                            <Icon icon='IcDelete' />
                        </div>
                    </div>
                </DesktopWrapper>
                <MobileWrapper>
                    <div ref={toggle_ref} onClick={() => onToggleDropdown()}>
                        <Icon icon='IcMenuDots' />
                    </div>
                    <div
                        className={classnames('load-strategy__recent-item__mobile', {
                            'load-strategy__recent-item__mobile--active':
                                selected_strategy_id === workspace.id && is_dropdown_visible,
                        })}
                    >
                        <div className='load-strategy__recent-item__group'>
                            <div className='load-strategy__recent-item__group__icon'>
                                <Icon icon='IcPreview' />
                            </div>
                            <Text
                                color='general'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                Preview
                            </Text>
                        </div>
                        <div className='load-strategy__recent-item__group'>
                            <div>
                                <Icon icon='IcEdit' />
                            </div>
                            <Text
                                color='general'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                Edit
                            </Text>
                        </div>
                        <div className='load-strategy__recent-item__group'>
                            <div>
                                <Icon icon='IcSave' />
                            </div>
                            <Text
                                color='general'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                Save
                            </Text>
                        </div>
                        <div className='load-strategy__recent-item__group'>
                            <div>
                                <Icon icon='IcDelete' />
                            </div>
                            <Text
                                color='general'
                                className='load-strategy__recent-item__group__label'
                                as='p'
                                size='xxs'
                            >
                                Delete
                            </Text>
                        </div>
                    </div>
                </MobileWrapper>
            </div>
        </>
    );
};

export default connect(({ load_modal, dashboard, save_modal }: RootStore) => ({
    getRecentFileIcon: load_modal.getRecentFileIcon,
    getSaveType: load_modal.getSaveType,
    previewRecentStrategy: load_modal.previewRecentStrategy,
    selected_strategy_id: load_modal.selected_strategy_id,
    setFileLoaded: dashboard.setFileLoaded,
    has_file_loaded: dashboard.has_file_loaded,
    toggleSaveModal: save_modal.toggleSaveModal,
    onToggleDeleteDialog: load_modal.onToggleDeleteDialog,
    loadFileFromRecent: load_modal.loadFileFromRecent,
    setActiveTab: dashboard.setActiveTab,
    recent_strategies: load_modal.recent_strategies,
    dashboard_strategies: load_modal.dashboard_strategies,
    active_tab: dashboard.active_tab,
    setLoaderVisible: dashboard.setLoaderVisible,
}))(RecentWorkspace);
