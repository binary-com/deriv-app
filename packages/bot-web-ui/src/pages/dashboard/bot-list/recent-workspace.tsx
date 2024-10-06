import React from 'react';
import classnames from 'classnames';
import { timeSince } from '@deriv/bot-skeleton';
import { save_types } from '@deriv/bot-skeleton/src/constants/save-type';
import { Icon, Popover, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { DBOT_TABS } from 'Constants/bot-contents';
import { CONTEXT_MENU, STRATEGY } from 'Constants/dashboard';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendDashboardClickEvent } from '../../../analytics/rudderstack-dashboard';
import { useComponentVisibility } from '../../../hooks';
import { TRecentStrategy } from './types';
import './index.scss';

type TRecentWorkspace = {
    workspace: TRecentStrategy;
};

const RecentWorkspace = observer(({ workspace }: TRecentWorkspace) => {
    const { ui } = useStore();
    const { is_desktop } = ui;
    const { dashboard, load_modal, save_modal } = useDBotStore();
    const { setActiveTab } = dashboard;
    const { toggleSaveModal, updateBotName } = save_modal;
    const {
        dashboard_strategies,
        getRecentFileIcon,
        getSaveType,
        loadFileFromRecent,
        onToggleDeleteDialog,
        selected_strategy_id,
        setSelectedStrategyId,
    } = load_modal;

    const trigger_div_ref = React.useRef<HTMLInputElement | null>(null);
    const toggle_ref = React.useRef<HTMLButtonElement>(null);
    const visible = useComponentVisibility(toggle_ref);
    const { setDropdownVisibility, is_dropdown_visible } = visible;

    const onToggleDropdown = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setDropdownVisibility(!is_dropdown_visible);
        setSelectedStrategyId(workspace.id);
    };

    const handleOpen = async () => {
        await loadFileFromRecent();
        setActiveTab(DBOT_TABS.BOT_BUILDER);
        rudderStackSendDashboardClickEvent({ dashboard_click_name: 'open', subpage_name: 'bot_builder' });
    };

    const handleSave = () => {
        updateBotName(workspace?.name);
        toggleSaveModal();
        rudderStackSendDashboardClickEvent({ dashboard_click_name: 'save', subpage_name: 'dashboard' });
    };

    const viewRecentStrategy = async (type: string) => {
        setSelectedStrategyId(workspace.id);

        switch (type) {
            case STRATEGY.OPEN:
                await handleOpen();
                break;

            case STRATEGY.SAVE:
                handleSave();
                break;

            case STRATEGY.DELETE:
                onToggleDeleteDialog(true);
                rudderStackSendDashboardClickEvent({ dashboard_click_name: 'delete', subpage_name: 'dashboard' });
                break;

            default:
                break;
        }
    };

    const is_active_mobile = selected_strategy_id === workspace.id && is_dropdown_visible;
    const text_size = is_desktop ? 'xs' : 'xxs';

    return (
        <div
            className={classnames('bot-list__item', {
                'bot-list__item--loaded': dashboard_strategies,
                'bot-list__item--min': !!dashboard_strategies?.length && !is_desktop,
            })}
            key={workspace.id}
            ref={trigger_div_ref}
        >
            <div className='bot-list__item__label'>
                <div className='text-wrapper' title={workspace.name}>
                    <Text align='left' as='p' size={text_size} line_height='l'>
                        {workspace.name}
                    </Text>
                </div>
            </div>
            <div className='bot-list__item__time-stamp'>
                <Text align='left' as='p' size={text_size} line_height='l'>
                    {timeSince(workspace.timestamp)}
                </Text>
            </div>
            <div className='bot-list__item__load-type'>
                <Icon
                    icon={getRecentFileIcon(workspace.save_type)}
                    className={classnames({
                        'bot-list__item__load-type__icon--active': workspace.save_type === save_types.GOOGLE_DRIVE,
                    })}
                />
                <div className='bot-list__item__load-type__icon--saved'>
                    <Text align='left' as='p' size={text_size} line_height='l'>
                        {getSaveType(workspace.save_type)}
                    </Text>
                </div>
            </div>
            {is_desktop ? (
                <div className='bot-list__item__actions'>
                    {CONTEXT_MENU.map(({ type, label, icon }) => (
                        <div
                            data-testid={`dt_desktop_bot_list_action-${type}`}
                            key={type}
                            className='bot-list__item__actions__action-item'
                            onClick={e => {
                                e.stopPropagation();
                                viewRecentStrategy(type);
                            }}
                            onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                    e.stopPropagation();
                                    viewRecentStrategy(type);
                                }
                            }}
                            tabIndex={0}
                        >
                            <Popover alignment='top' message={label} zIndex={'9999'}>
                                <Icon icon={icon} />
                            </Popover>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className='bot-list__item__actions'>
                        <button
                            ref={toggle_ref}
                            onClick={onToggleDropdown}
                            tabIndex={0}
                            data-testid='dt_mobile_menu_icon'
                        >
                            <Icon icon='IcMenuDots' />
                        </button>
                    </div>
                    <div
                        className={classnames('bot-list__item__responsive', {
                            'bot-list__item__responsive--active': is_active_mobile,
                            'bot-list__item__responsive--min': dashboard_strategies.length <= 5,
                        })}
                    >
                        {CONTEXT_MENU.map(({ type, label, icon }) => (
                            <div
                                key={type}
                                className='bot-list__item__responsive__menu'
                                onClick={e => {
                                    e.stopPropagation();
                                    viewRecentStrategy(type);
                                }}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter') {
                                        e.stopPropagation();
                                        viewRecentStrategy(type);
                                    }
                                }}
                                tabIndex={0}
                            >
                                <div>
                                    <Icon icon={icon} />
                                </div>
                                <Text
                                    data-testid={`dt_mobile_bot_list_action-${type}`}
                                    color='prominent'
                                    className='bot-list__item__responsive__menu__item'
                                    as='p'
                                    size='xxs'
                                >
                                    {label}
                                </Text>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
});

export default RecentWorkspace;
