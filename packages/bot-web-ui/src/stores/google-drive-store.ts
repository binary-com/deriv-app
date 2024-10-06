import { action, makeObservable, observable } from 'mobx';
import { config, importExternal, observer as globalObserver } from '@deriv/bot-skeleton';
import { getLanguage, localize } from '@deriv/translations';
import { botNotification } from 'Components/bot-notification/bot-notification';
import { notification_message, NOTIFICATION_TYPE } from 'Components/bot-notification/bot-notification-utils';
import { button_status } from 'Constants/button-status';
import {
    rudderStackSendUploadStrategyCompletedEvent,
    rudderStackSendUploadStrategyFailedEvent,
} from '../analytics/rudderstack-common-events';
import { getStrategyType } from '../analytics/utils';
import RootStore from './root-store';

export type TErrorWithStatus = Error & { status?: number; result?: { error: { message: string } } };

export type TFileOptions = {
    content: string;
    mimeType: string;
    name: string;
};

export type TPickerCallbackResponse = {
    action: string;
    docs: { id: string; name: string; driveError?: string }[];
};

export default class GoogleDriveStore {
    root_store: RootStore;
    bot_folder_name: string;
    client_id: string | undefined;
    app_id: string | undefined;
    api_key: string | undefined;
    scope: string | undefined;
    discovery_docs = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client: any;
    access_token: string;
    upload_id?: string;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_authorised: observable,
            upload_id: observable,
            is_google_drive_token_valid: observable,
            setIsAuthorized: action.bound,
            saveFile: action.bound,
            loadFile: action.bound,
            setKey: action.bound,
            initialise: action.bound,
            signIn: action.bound,
            signOut: action.bound,
            getPickerLanguage: action.bound,
            checkFolderExists: action.bound,
            createSaveFilePicker: action.bound,
            createLoadFilePicker: action.bound,
            showGoogleDriveFilePicker: action.bound,
            setGoogleDriveTokenValid: action.bound,
            verifyGoogleDriveAccessToken: action.bound,
            onDriveConnect: action,
        });

        this.root_store = root_store;
        this.bot_folder_name = `Binary Bot - ${localize('Strategies')}`;
        this.setKey();
        this.client = null;
        this.access_token = localStorage.getItem('google_access_token') ?? '';
        importExternal('https://accounts.google.com/gsi/client').then(() => this.initialiseClient());
        importExternal('https://apis.google.com/js/api.js').then(() => this.initialise());
    }

    is_google_drive_token_valid = true;
    is_authorised = !!localStorage.getItem('google_access_token');

    setGoogleDriveTokenValid = (is_google_drive_token_valid: boolean) => {
        this.is_google_drive_token_valid = is_google_drive_token_valid;
    };

    setKey = () => {
        const { SCOPE, DISCOVERY_DOCS } = config.GOOGLE_DRIVE;
        this.client_id = process.env.GD_CLIENT_ID;
        this.app_id = process.env.GD_APP_ID;
        this.api_key = process.env.GD_API_KEY;
        this.scope = SCOPE;
        this.discovery_docs = DISCOVERY_DOCS;
    };

    initialise = () => {
        gapi.load('client:picker', () => gapi.client.load(this.discovery_docs));
    };

    setGoogleDriveTokenExpiry = (seconds: number) => {
        const currentEpochTime = Math.floor(Date.now() / 1000);
        const expiry_time = currentEpochTime + seconds;
        localStorage.setItem('google_access_token_expiry', expiry_time.toString());
    };

    initialiseClient = () => {
        this.client = google.accounts.oauth2.initTokenClient({
            client_id: this.client_id,
            scope: this.scope,
            callback: (response: { expires_in: number; access_token: string; error?: TErrorWithStatus }) => {
                if (response?.access_token && !response?.error) {
                    this.access_token = response.access_token;
                    this.setIsAuthorized(true);
                    localStorage.setItem('google_access_token', response.access_token);
                    this.setGoogleDriveTokenExpiry(response?.expires_in);
                }
            },
        });
    };

    setIsAuthorized(is_authorized: boolean) {
        this.is_authorised = is_authorized;
    }

    verifyGoogleDriveAccessToken = async () => {
        const expiry_time = localStorage?.getItem('google_access_token_expiry');
        if (expiry_time) {
            const current_epoch_time = Math.floor(Date.now() / 1000);
            if (current_epoch_time > Number(expiry_time)) {
                try {
                    //request new access token if invalid
                    await this.client.requestAccessToken({ prompt: '' });
                } catch (error) {
                    this.signOut();
                    this.setGoogleDriveTokenValid(false);
                    localStorage.removeItem('google_access_token_expiry');
                    botNotification(notification_message.google_drive_error, undefined, {
                        closeButton: false,
                    });
                    return 'not_verified';
                }
            }
        }
        return 'verified';
    };

    async signIn() {
        if (!this.is_authorised) {
            await this.client.requestAccessToken();
        }
    }

    async signOut() {
        if (this.access_token) {
            await window?.gapi?.client?.setToken({ access_token: '' });
            await window?.google?.accounts?.oauth2?.revoke(this.access_token);
            localStorage?.removeItem('google_access_token');
            this.access_token = '';
        }
        this.setIsAuthorized(false);
    }

    // eslint-disable-next-line class-methods-use-this
    getPickerLanguage() {
        const language = getLanguage();

        if (language === 'zhTw') {
            return 'zh-TW';
        } else if (language === 'zhCn') {
            return 'zh-CN';
        }
        return language;
    }

    async saveFile(options: TFileOptions) {
        try {
            await this.signIn();
            if (this.access_token) gapi.client.setToken({ access_token: this.access_token });
            await this.checkFolderExists();
            await this.createSaveFilePicker('application/vnd.google-apps.folder', localize('Select a folder'), options);
        } catch (err) {
            if ((err as TErrorWithStatus).status === 401) {
                this.signOut();
            }
        }
    }

    async loadFile() {
        if (!this.is_google_drive_token_valid) return;
        await this.signIn();

        if (this.access_token) gapi.client.setToken({ access_token: this.access_token });
        try {
            await gapi.client.drive.files.list({
                pageSize: 10,
                fields: 'files(id, name)',
            });
        } catch (err) {
            if ((err as TErrorWithStatus)?.status === 401) {
                await this.signOut();
                const picker = document.getElementsByClassName('picker-dialog-content')[0] as HTMLElement;
                picker?.parentNode?.removeChild(picker);
                const pickerBackground = document.getElementsByClassName(
                    'picker-dialog-bg'
                ) as HTMLCollectionOf<HTMLElement>;

                if (pickerBackground.length) {
                    for (let i = 0; i < pickerBackground.length; i++) {
                        pickerBackground[i].style.display = 'none';
                    }
                }
            }
            rudderStackSendUploadStrategyFailedEvent({
                upload_provider: 'google_drive',
                upload_id: this.upload_id,
                upload_type: 'not_found',
                error_message: (err as TErrorWithStatus)?.result?.error?.message,
                error_code: (err as TErrorWithStatus)?.status?.toString(),
            });
        }

        const xml_doc = await this.createLoadFilePicker(
            'text/xml,application/xml',
            localize('Select a Deriv Bot Strategy')
        );

        return xml_doc;
    }

    async checkFolderExists() {
        const { files } = gapi.client.drive;
        const response = await files.list({ q: 'trashed=false' });
        const mime_type = 'application/vnd.google-apps.folder';
        const folder = response.result.files?.find(file => file.mimeType === mime_type);

        if (folder) {
            return;
        }

        await files.create({
            resource: {
                name: this.bot_folder_name,
                mimeType: mime_type,
            },
            fields: 'id',
        });
    }

    createSaveFilePicker(mime_type: string, title: string, options: TFileOptions) {
        const { setButtonStatus } = this.root_store.save_modal;
        return new Promise<void>(resolve => {
            const savePickerCallback = (data: TPickerCallbackResponse) => {
                if (data.action === google.picker.Action.PICKED) {
                    const folder_id = data.docs[0].id;
                    const strategy_file = new Blob([options.content], { type: options.mimeType });
                    const strategy_file_metadata = JSON.stringify({
                        name: options.name,
                        mimeType: options.mimeType,
                        parents: [folder_id],
                    });

                    const form_data = new FormData();
                    form_data.append('metadata', new Blob([strategy_file_metadata], { type: 'application/json' }));
                    form_data.append('file', strategy_file);

                    const xhr = new XMLHttpRequest();
                    xhr.responseType = 'json';
                    xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
                    xhr.setRequestHeader('Authorization', `Bearer ${this.access_token}`);
                    xhr.onload = () => {
                        if (xhr.status === 401) {
                            this.signOut();
                        }

                        setButtonStatus(button_status.NORMAL);
                        resolve();
                    };
                    xhr.send(form_data);
                } else if (data.action === google.picker.Action.CANCEL) {
                    setButtonStatus(button_status.NORMAL);
                }
            };

            this.showGoogleDriveFilePicker(true, mime_type, title, savePickerCallback);
        });
    }

    onDriveConnect = async () => {
        if (this.is_authorised) {
            this.signOut();
        } else {
            this.signIn();
        }
    };

    createLoadFilePicker(mime_type: string, title: string) {
        return new Promise(resolve => {
            const loadPickerCallback = async (data: TPickerCallbackResponse) => {
                if (data.action === google.picker.Action.PICKED) {
                    const file = data.docs[0];
                    if (file?.driveError === 'NETWORK') {
                        rudderStackSendUploadStrategyFailedEvent({
                            upload_provider: 'google_drive',
                            upload_id: this.upload_id,
                            upload_type: 'not_found',
                            error_message: 'File not found',
                            error_code: '404',
                        });
                    }

                    const file_name = file.name;
                    const fileId = file.id;
                    const { files } = gapi.client.drive;
                    const { setOpenSettings } = this.root_store.dashboard;

                    const response = await files.get({
                        alt: 'media',
                        fileId,
                    });

                    resolve({ xml_doc: response.body, file_name });
                    setOpenSettings(NOTIFICATION_TYPE.BOT_IMPORT);
                    const upload_type = getStrategyType(response.body);
                    rudderStackSendUploadStrategyCompletedEvent({
                        upload_provider: 'google_drive',
                        upload_type,
                        upload_id: this.upload_id,
                    });
                }
            };

            this.showGoogleDriveFilePicker(false, mime_type, title, loadPickerCallback);
        });
    }

    showGoogleDriveFilePicker(
        is_save: boolean,
        mime_type: string,
        title: string,
        callback: (data: TPickerCallbackResponse) => void
    ) {
        const docs_view = new google.picker.DocsView();
        docs_view.setIncludeFolders(true);
        docs_view.setMimeTypes(mime_type);

        if (is_save) {
            docs_view.setSelectFolderEnabled(true);
        }
        const picker = new google.picker.PickerBuilder();
        picker
            .setOrigin(`${window.location.protocol}//${window.location.host}`)
            .setTitle(localize(title))
            .setLocale(this.getPickerLanguage())
            .setAppId(this.app_id)
            .setOAuthToken(this.access_token)
            .addView(docs_view)
            .setDeveloperKey(this.api_key)
            .setSize(1051, 650)
            .setCallback(callback)
            .build()
            .setVisible(true);
    }
}
