import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

type TListItem = {
    text: React.ReactNode;
    index?: number;
};

const ListItem = ({ text, index }: TListItem) => {
    const { isDesktop } = useDevice();

    const text_size = isDesktop ? 'xs' : 'xxs';
    return (
        <div className='account-management__list-text-container'>
            {index && (
                <Text size={text_size} className='account-management__list-text'>
                    <Localize i18n_default_text='{{index}}.' values={{ index }} />{' '}
                </Text>
            )}
            <Text size={text_size} className='account-management__list-text'>
                {text}
            </Text>
        </div>
    );
};

export default ListItem;
