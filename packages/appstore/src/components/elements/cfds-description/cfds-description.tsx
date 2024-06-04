import { Text, StaticUrl } from '@deriv/components';
import { Localize } from '@deriv/translations';

const CFDsDescription = () => {
    return (
        <Text size='xs' line_height='s'>
            <Localize
                i18n_default_text='Trade bigger positions with less capital across diverse financial and derived instruments. <0>Learn more</0>'
                components={[<StaticUrl key={0} className='options' href='/trade-types/cfds' />]}
            />
        </Text>
    );
};

export default CFDsDescription;
