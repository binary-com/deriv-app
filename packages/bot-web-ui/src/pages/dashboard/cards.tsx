//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, Dialog, Icon, MobileFullPageModal, MobileWrapper, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { NOTIFICATION_TYPE } from 'Components/bot-notification/bot-notification-utils';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendQsOpenEventFromDashboard } from '../bot-builder/quick-strategy/analytics/rudderstack-quick-strategy';
import GoogleDrive from './load-bot-preview/google-drive';
import Recent from './load-bot-preview/recent';

type TCardProps = {
    has_dashboard_strategies: boolean;
    is_mobile: boolean;
};

type TCardArray = {
    type: string;
    icon: string;
    content: string;
    method: () => void;
};

const Cards = observer(({ is_mobile, has_dashboard_strategies }: TCardProps) => {
    const { dashboard, load_modal, quick_strategy } = useDBotStore();
    const {
        onCloseDialog,
        dialog_options,
        is_dialog_open,
        setActiveTab,
        setFileLoaded,
        setPreviewOnPopup,
        setOpenSettings,
        showVideoDialog,
    } = dashboard;
    const { handleFileChange, loadFileFromLocal } = load_modal;
    const { setFormVisibility } = quick_strategy;

    const sendToRudderStackOnQuickStrategyIconClick = () => {
        // send to rs if quick strategy is opened from dashbaord
        rudderStackSendQsOpenEventFromDashboard();
    };

    const [is_file_supported, setIsFileSupported] = React.useState<boolean>(true);
    const file_input_ref = React.useRef<HTMLInputElement | null>(null);

    const openGoogleDriveDialog = () => {
        showVideoDialog({
            type: 'google',
        });
    };

    const openFileLoader = () => {
        file_input_ref?.current?.click();
    };

    const actions: TCardArray[] = [
        {
            type: 'my-computer',
            icon: is_mobile ? 'IcLocal' : 'IcMyComputer',
            content: is_mobile ? localize('Local') : localize('My computer'),
            method: openFileLoader,
        },
        {
            type: 'google-drive',
            icon: 'IcGoogleDriveDbot',
            content: localize('Google Drive'),
            method: openGoogleDriveDialog,
        },
        {
            type: 'bot-builder',
            icon: 'IcBotBuilder',
            content: localize('Bot Builder'),
            method: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
            },
        },
        {
            type: 'quick-strategy',
            icon: 'IcQuickStrategy',
            content: localize('Quick strategy'),
            method: () => {
                setActiveTab(DBOT_TABS.BOT_BUILDER);
                setFormVisibility(true);
                sendToRudderStackOnQuickStrategyIconClick();
            },
        },
    ];

    return React.useMemo(
        () => (
            <div
                className={classNames('tab__dashboard__table', {
                    'tab__dashboard__table--minimized': has_dashboard_strategies && is_mobile,
                })}
            >
                <div
                    className={classNames('tab__dashboard__table__tiles', {
                        'tab__dashboard__table__tiles--minimized': has_dashboard_strategies && is_mobile,
                    })}
                    id='tab__dashboard__table__tiles'
                >
                    {actions.map(icons => {
                        const { icon, content, method } = icons;
                        return (
                            <div
                                key={content}
                                className={classNames('tab__dashboard__table__block', {
                                    'tab__dashboard__table__block--minimized': has_dashboard_strategies && is_mobile,
                                })}
                            >
                                <Icon
                                    className={classNames('tab__dashboard__table__images', {
                                        'tab__dashboard__table__images--minimized': has_dashboard_strategies,
                                    })}
                                    width='8rem'
                                    height='8rem'
                                    icon={icon}
                                    id={icon}
                                    onClick={() => {
                                        method();
                                    }}
                                />
                                <Text color='prominent' size={is_mobile ? 'xxs' : 'xs'}>
                                    {content}
                                </Text>
                            </div>
                        );
                    })}
                    <input
                        type='file'
                        ref={file_input_ref}
                        accept='application/xml, text/xml'
                        hidden
                        onChange={e => {
                            setIsFileSupported(handleFileChange(e, false));
                            loadFileFromLocal();
                            setFileLoaded(true);
                            setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
                        }}
                    />
                    <DesktopWrapper>
                        <Dialog
                            title={dialog_options.title}
                            is_visible={is_dialog_open}
                            onCancel={onCloseDialog}
                            is_mobile_full_width
                            className='dc-dialog__wrapper--google-drive'
                            has_close_icon
                        >
                            <GoogleDrive />
                        </Dialog>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileFullPageModal
                            is_modal_open={is_dialog_open}
                            className='load-strategy__wrapper'
                            header={localize('Load strategy')}
                            onClickClose={() => {
                                setPreviewOnPopup(false);
                                onCloseDialog();
                            }}
                            height_offset='80px'
                            page_overlay
                        >
                            <div label='Google Drive' className='google-drive-label'>
                                <GoogleDrive />
                            </div>
                        </MobileFullPageModal>
                    </MobileWrapper>
                </div>
                <Recent is_file_supported={is_file_supported} />
            </div>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [is_dialog_open, has_dashboard_strategies]
    );
});

export default Cards;
