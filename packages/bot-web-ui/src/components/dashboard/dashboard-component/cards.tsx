//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { Icon, Dialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import LoadModalStore from 'Stores/load-modal-store';
import Recent from './load-bot-preview/recent';
import SaveModalStore from 'Stores/save-modal-store';
import GoogleDrive from './load-bot-preview/google-drive';

type TCardProps = {
    active_tab: number;
    closeResetDialog: () => void;
    dialog_options: { [key: string]: string };
    handleFileChange: (e: React.ChangeEvent, flag?: boolean) => boolean;
    has_file_loaded: boolean;
    is_dialog_open: boolean;
    is_running: boolean;
    load_modal: LoadModalStore;
    loadFileFromLocal: () => void;
    openFileLoader: () => void;
    onConfirmSave: () => void;
    onOkButtonClick: () => void;
    setActiveTab: (active_tab: number) => void;
    save_modal: SaveModalStore;
    setFileLoaded: (param: boolean) => void;
    showVideoDialog: (param: { [key: string]: string | React.ReactNode }) => void;
};

const Card = ({
    closeResetDialog,
    dialog_options,
    handleFileChange,
    has_file_loaded,
    is_dialog_open,
    loadFileFromLocal,
    onConfirmSave,
    setActiveTab,
    setFileLoaded,
    showVideoDialog,
}: TCardProps) => {
    type TCardArray = {
        icon: string;
        content: string;
        method: () => void;
        disable: string | '';
    };
    const openGoogleDriveDialog = () => {
        showVideoDialog({
            type: 'google',
            component: <GoogleDrive />,
            url: '',
        });
    };
    const file_input_ref = React.useRef<HTMLInputElement | null>(null);
    const [is_file_supported, setIsFileSupported] = React.useState<boolean>(true);

    const clear_preview_ref = React.useRef<HTMLInputElement | null>(null);
    const openFileLoader = () => {
        file_input_ref?.current?.click();
    };

    const actions: TCardArray[] = [
        {
            icon: 'IcMyComputer',
            content: 'My computer',
            method: openFileLoader,
            disable: has_file_loaded ? 'tab__dashboard__table__disabled-card' : '',
        },
        {
            icon: 'IcGoogleDriveDbot',
            content: 'Google Drive',
            method: openGoogleDriveDialog,
            disable: has_file_loaded ? 'tab__dashboard__table__disabled-card' : '',
        },
        {
            icon: 'IcBotBuilder',
            content: 'Bot Builder',
            method: () => setActiveTab(1),
            disable: '',
        },
        {
            icon: 'IcQuickStrategy',
            content: 'Quick Strategy',
            method: () => setActiveTab(2),
            disable: '',
        },
    ];

    return React.useMemo(
        () => (
            <div className='tab__dashboard__table'>
                <div className='tab__dashboard__table__tiles' id='tab__dashboard__table__tiles'>
                    {actions.map((icons, index) => {
                        const { icon, content, method, disable } = icons;
                        return (
                            <div key={index} className={`${disable} tab__dashboard__table__block`}>
                                <Icon
                                    className={'tab__dashboard__table__images'}
                                    width='8rem'
                                    height='8rem'
                                    icon={icon}
                                    id={icon}
                                    onClick={method}
                                />
                                <Text color='prominent' size='xs'>
                                    {localize(content)}
                                </Text>
                            </div>
                        );
                    })}
                    <input
                        type='file'
                        ref={file_input_ref}
                        accept='.xml'
                        hidden
                        onChange={e => {
                            clear_preview_ref.current?.click();
                            onConfirmSave();
                            setIsFileSupported(handleFileChange(e, false));
                            loadFileFromLocal();
                            setFileLoaded(true);
                        }}
                    />
                    <Dialog
                        title={dialog_options.title}
                        is_visible={is_dialog_open}
                        onCancel={closeResetDialog}
                        is_mobile_full_width
                        className={'dc-dialog__wrapper--google-drive'}
                        has_close_icon
                    >
                        {dialog_options.message}
                    </Dialog>
                </div>
                <Recent />
            </div>
        ),
        []
    );
};

export default connect(({ load_modal, dashboard, save_modal }: RootStore) => ({
    active_tab: dashboard.active_tab,
    closeResetDialog: dashboard.onCloseDialog,
    dialog_options: dashboard.dialog_options,
    handleFileChange: load_modal.handleFileChange,
    has_file_loaded: dashboard.has_file_loaded,
    is_dialog_open: dashboard.is_dialog_open,
    load_modal,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    onConfirmSave: save_modal.onConfirmSave,
    onDriveConnect: load_modal.onDriveConnect,
    onOkButtonClick: dashboard.onCloseDialog,
    setFileLoaded: dashboard.setFileLoaded,
    setActiveTab: dashboard.setActiveTab,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    showVideoDialog: dashboard.showVideoDialog,
}))(Card);
