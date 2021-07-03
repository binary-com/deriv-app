import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import notes from './README.md';
import Wrapper from '../shared/wrapper';
import FileDropzone from 'Components/file-dropzone';
import Icon from 'Components/icon';

storiesOf('Data Entry|File/FileDropzone', module)
    .addDecorator(withKnobs)
    .addDecorator(withInfo)
    .add(
        'Main function',
        () => {
            const UploadMessage = (
                <div style={{ margin: '20px' }}>
                    <Icon icon='IcCloudUpload' className='dc-file-dropzone__message-icon' size={50} />
                    <div className='dc-file-dropzone__message-subtitle'>
                        Drop file (JPEG JPG PNG PDF GIF) or click here to upload
                    </div>
                </div>
            );

            return (
                <Wrapper is_dark={boolean('Dark Theme', false)}>
                    <div style={{ height: '100px', width: '100%' }}>
                        <FileDropzone
                            accept={'image/png, image/jpeg, image/jpg, image/gif, application/pdf'}
                            error_message={'Please upload supported file type.'}
                            hover_message={'Drop files here..'}
                            max_size={8388608}
                            message={UploadMessage}
                            multiple={false}
                            validation_error_message={''}
                            value={[]}
                        />
                    </div>
                </Wrapper>
            );
        },
        {
            notes,
        }
    );
