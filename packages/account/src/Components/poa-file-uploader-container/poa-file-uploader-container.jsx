import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { PlatformContext, isDesktop, WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FileUploader from '../file-uploader';

const FileProperties = () => {
    const properties = [
        { name: 'size', icon: 'IcPoaFileEightMb', text: localize('Less than 8MB') },
        { name: 'format', icon: 'IcPoaFileFormat', text: localize('JPEG  JPG  PNG  PDF  GIF') },
        { name: 'time', icon: 'IcPoaFileTime', text: localize('1 - 6 months old') },
        { name: 'clear', icon: 'IcPoaFileClear', text: localize('A clear colour photo or scanned image') },
        {
            name: 'with-address',
            icon: 'IcPoaFileWithAddress',
            text: localize('Issued under your name with your current address'),
        },
    ];
    return (
        <div className='account__file-uploader-property'>
            {properties.map(item => (
                <div
                    className={`account__file-uploader-property-item account__file-uploader-property-${item.name}`}
                    key={item.name}
                >
                    <div className='account__file-uploader-property-wrapper'>
                        <Icon icon={item.icon} className='account__file-uploader-icon-dashboard' size={40} />
                        <Text size='xxxs' weight='bold' align='center'>
                            {item.text}
                        </Text>
                    </div>
                </div>
            ))}
        </div>
    );
};

const PoaFileUploaderContainer = ({ is_description_enabled = true, getSocket, onFileDrop, onRef }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const ref = React.useRef();

    const getSocketFunc = getSocket ?? WS.getSocket;

    React.useEffect(() => {
        if (ref) {
            if (typeof onRef === 'function') onRef(ref);
        }
        return () => onRef(undefined);
    }, [onRef, ref]);
    if (is_appstore && isDesktop()) {
        return (
            <div className='account__file-uploader-section account__file-uploader-section-dashboard'>
                <div className='account__file-uploader-file account__file-uploader-file-dashboard'>
                    <FileProperties />
                    <div className='account__file-uploader-file-zone'>
                        <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='account__file-uploader-section'>
            {is_description_enabled && (
                <ul className='account__file-uploader-list' data-testid='dt_file_uploader_container'>
                    <li className='account__file-uploader-box'>
                        {is_appstore ? (
                            <Icon icon='IcPoaFileEightMb' className='account__file-uploader-icon' size={24} />
                        ) : (
                            <Icon icon='IcLessThanEight' className='account__file-uploader-icon' size={24} />
                        )}
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='Less than 8MB' />
                        </div>
                    </li>
                    <li className='account__file-uploader-box'>
                        <Icon icon='IcImage' className='account__file-uploader-icon' size={24} />
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='JPEG JPG PNG PDF GIF' />
                        </div>
                    </li>
                    <li className='account__file-uploader-box'>
                        {is_appstore ? (
                            <Icon icon='IcPoaFileTime' className='account__file-uploader-icon' size={24} />
                        ) : (
                            <Icon icon='IcClock' className='account__file-uploader-icon' size={24} />
                        )}
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='1 - 6 months old' />
                        </div>
                    </li>
                    <li className='account__file-uploader-box'>
                        {is_appstore ? (
                            <Icon icon='IcPoaFileClear' className='account__file-uploader-icon' size={24} />
                        ) : (
                            <Icon icon='IcEye' className='account__file-uploader-icon' size={24} />
                        )}
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='A clear colour photo or scanned image' />
                        </div>
                    </li>
                    <li className='account__file-uploader-box'>
                        {is_appstore ? (
                            <Icon icon='IcPoaFileWithAddress' className='account__file-uploader-icon' size={24} />
                        ) : (
                            <Icon icon='IcUser' className='account__file-uploader-icon' size={24} />
                        )}
                        <div className='account__file-uploader-item'>
                            <Localize i18n_default_text='Issued under your name with your current address' />
                        </div>
                    </li>
                </ul>
            )}
            <div
                className={classNames('account__file-uploader-file', {
                    'account__file-uploader-file--dashboard': isDesktop() && is_appstore,
                })}
            >
                <FileUploader getSocket={getSocketFunc} ref={ref} onFileDrop={onFileDrop} />
            </div>
        </div>
    );
};

PoaFileUploaderContainer.propTypes = {
    is_description_enabled: PropTypes.bool,
    getSocket: PropTypes.func,
    onFileDrop: PropTypes.func,
    onRef: PropTypes.func,
};

export default PoaFileUploaderContainer;
