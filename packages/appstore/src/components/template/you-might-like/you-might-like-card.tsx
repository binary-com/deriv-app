import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from '@deriv/translations';
import Frame from 'Components/elements/frame';
import { useStores } from 'Stores';

const YouMightLikeCard: React.FC<TYouMightLikeCardProps> = ({ bg_image_url, title, subtitle }) => {
    const { config } = useStores();

    return (
        <div className='dw-you-might-like__card'>
            <Frame
                alt={bg_image_url.split('/')[bg_image_url.split('/').length - 1]}
                className='dw-you-might-like__card-image'
            />
            <Text weight='bold' line_height='l'>
                {localize(title)}
            </Text>
            <Text size='xs' color='less-prominent' line_height='m'>
                {localize(subtitle)}
            </Text>
        </div>
    );
};

type TYouMightLikeCardProps = {
    bg_image_url: string;
    title: string;
    subtitle: string;
};

export default observer(YouMightLikeCard);
