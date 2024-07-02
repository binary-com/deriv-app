import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Button, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { SectionMessage } from '@deriv-com/quill-ui';
import { botNotification } from 'Components/bot-notification/bot-notification';
import { notification_message } from 'Components/bot-notification/bot-notification-utils';
import { useDBotStore } from 'Stores/useDBotStore';
import LocalFooter from './local-footer';
import WorkspaceControl from './workspace-control';

const LocalComponent = observer(() => {
    const { ui } = useStore();
    const { dashboard, load_modal, blockly_store } = useDBotStore();
    const { active_tab, active_tour } = dashboard;
    const { handleFileChange, loaded_local_file, setLoadedLocalFile, imported_strategy_type, is_open_button_loading } =
        load_modal;

    const file_input_ref = React.useRef<HTMLInputElement>(null);
    const [is_file_supported, setIsFileSupported] = React.useState(true);
    const { is_desktop } = ui;
    const { is_loading } = blockly_store;

    useEffect(() => {
        if (loaded_local_file && is_file_supported && imported_strategy_type !== 'pending' && !is_loading) {
            if (imported_strategy_type === 'old') {
                botNotification(notification_message.strategy_conversion, undefined, {
                    closeButton: false,
                });
            }
        }
    }, [loaded_local_file, is_file_supported, imported_strategy_type, is_open_button_loading, is_loading]);

    if (loaded_local_file && is_file_supported) {
        return (
            <div className='load-strategy__container load-strategy__container--has-footer'>
                <div
                    className={classNames('load-strategy__local-preview', {
                        'load-strategy__local-preview--active': active_tab === 1 && active_tour,
                    })}
                >
                    <div className='load-strategy__title'>
                        <Localize i18n_default_text='Preview' />
                    </div>
                    <div className='load-strategy__preview-workspace'>
                        <div id='load-strategy__blockly-container' style={{ height: '100%' }}>
                            <div className='load-strategy__local-preview-close'>
                                <Icon
                                    data_testid='dt_load-strategy__local-preview-close'
                                    icon='IcCross'
                                    onClick={() => setLoadedLocalFile(null)}
                                />
                            </div>
                            <WorkspaceControl />
                        </div>
                    </div>
                </div>
                {!is_desktop && (
                    <div className='load-strategy__local-footer'>
                        <LocalFooter />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='load-strategy__container'>
            <div className='load-strategy__local-dropzone'>
                <input
                    type='file'
                    ref={file_input_ref}
                    accept='application/xml, text/xml'
                    style={{ display: 'none' }}
                    onChange={e => setIsFileSupported(handleFileChange(e, false))}
                    data-testid='dt-load-strategy-file-input'
                />

                <SectionMessage
                    message={localize(
                        'Importing XML files from Binary Bot and other third-party platforms may take longer.'
                    )}
                    size='sm'
                    status='warning'
                    title=''
                    className='load-strategy__section_message'
                />

                <div
                    data-testid='dt__local-dropzone-area'
                    className='load-strategy__local-dropzone-area'
                    onDrop={e => {
                        handleFileChange(e, false);
                    }}
                >
                    {is_desktop ? (
                        <React.Fragment>
                            <Icon icon='IcPc' className='load-strategy__local-icon' size={is_desktop ? 128 : 96} />
                            <div className='load-strategy__local-title'>
                                <Localize i18n_default_text='Drag your XML file here' />
                            </div>
                            <div className='load-strategy__local-description'>
                                <Localize i18n_default_text='or, if you prefer...' />
                            </div>
                        </React.Fragment>
                    ) : (
                        <Icon icon='IcLocal' className='load-strategy__local-icon' size={is_desktop ? 128 : 96} />
                    )}
                    <Button
                        text={
                            is_file_supported
                                ? localize('Select an XML file from your device')
                                : localize('Please upload an XML file')
                        }
                        data-testid='dt_load-strategy__local-upload'
                        onClick={() => file_input_ref?.current?.click()}
                        has_effect
                        primary
                        large
                    />
                </div>
            </div>
        </div>
    );
});

export default LocalComponent;
