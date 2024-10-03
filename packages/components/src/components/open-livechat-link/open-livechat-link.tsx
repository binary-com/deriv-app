import React from 'react';
import clsx from 'clsx';
import { Localize } from '@deriv/translations';
import Text from '../text';
import './open-livechat-link.scss';

type TOpenLiveChatLink = {
    text_size?: React.ComponentProps<typeof Text>['size'];
    className?: string;
};

const OpenLiveChatLink = ({ children, text_size, className }: React.PropsWithChildren<TOpenLiveChatLink>) => (
    <button
        type='button'
        className={clsx('open-livechat__link', className)}
        onClick={() => window.LiveChatWidget.call('maximize')}
    >
        <Text size={text_size || 'xs'} weight='bold' color='brand-red-coral'>
            {children || <Localize i18n_default_text='live chat' />}
        </Text>
    </button>
);

export default OpenLiveChatLink;
