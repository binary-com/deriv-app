import React from 'react';
import { Tag } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

type TForwardStartingTagProps = {
    formatted_date?: string;
    formatted_time?: string;
};

const ForwardStartingTag = ({ formatted_date, formatted_time }: TForwardStartingTagProps) => {
    if (!formatted_date || !formatted_time) return null;

    return (
        <Tag
            color='info'
            className='forward-starting'
            data-testid='dt_forward-starting'
            label={
                <Localize
                    i18n_default_text='Starts on {{formatted_date}}, {{formatted_time}}'
                    values={{
                        formatted_date,
                        formatted_time,
                    }}
                />
            }
            showIcon={false}
            size='sm'
            variant='fill'
        />
    );
};

export default ForwardStartingTag;
