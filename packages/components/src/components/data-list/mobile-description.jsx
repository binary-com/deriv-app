import React from 'react';
import Text from '../text';

const MobileDescription = ({ desc, desc_titles }) => {
    if (desc.message.substring(0, 7) === 'Address') {
        const address = desc.message.split(', ')[0].split(': ')[1];
        const transaction = desc.message.split(', ')[1].split(': ')[1];

        return (
            <div className='statement__row--detail-text-mobile'>
                <Text className='address-title' size='xs'>
                    {desc_titles[0]}
                </Text>
                <Text className='address-desc' as='p' size='xs'>
                    {address}
                </Text>
                <Text className='transaction-title' size='xs'>
                    {desc_titles[1]}
                </Text>
                <Text className='transaction-desc' as='p' size='xs'>
                    {transaction}
                </Text>
            </div>
        );
    }

    return (
        <Text size='xs' align='center'>
            {desc.message}
        </Text>
    );
};

export default MobileDescription;
