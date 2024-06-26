import { Text } from '@deriv/components';
import React from 'react';
import { TFilesDescription } from '../../Types';
import { useDevice } from '@deriv-com/ui';

const FilesDescription = ({ descriptions, title }: TFilesDescription) => {
    const { isMobile } = useDevice();

    return (
        <div className='files-description'>
            <Text size={isMobile ? 'xxs' : 'xs'} as='div' className='files-description__title' weight='bold'>
                {title}
            </Text>
            <ul>
                {descriptions.map(item => (
                    <li key={item.id}>
                        <Text size={isMobile ? 'xxs' : 'xs'} line_height={isMobile ? 'l' : 'xl'}>
                            {item.value}
                        </Text>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FilesDescription;
