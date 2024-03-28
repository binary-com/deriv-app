import React from 'react';
import { FacebookShareButton, TelegramShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { SocialFacebookBrandIcon, SocialGoogleBrandIcon, SocialTelegramBrandIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import XIcon from '../../../public/ic-stock-twitter.svg';
import WhatsappIcon from '../../../public/ic-whatsapp-filled.svg';
import './ShareAdsSocials.scss';

type TShareMyAdsSocialsProps = {
    advertUrl: string;
    customMessage: string;
};

//TODO: fix the icon classnames once the icons are available in quillicons
const getShareButtons = (advertUrl: string) => [
    {
        icon: <WhatsappIcon className='h-[34px] w-[34px]' />,
        messagePropName: 'title',
        ShareButton: WhatsappShareButton,
        size: 34,
        text: 'WhatsApp',
    },
    {
        icon: <SocialFacebookBrandIcon />,
        messagePropName: 'quote',
        ShareButton: FacebookShareButton,
        size: 34,
        text: 'Facebook',
    },
    {
        icon: <SocialTelegramBrandIcon />,
        messagePropName: 'title',
        ShareButton: TelegramShareButton,
        size: 34,
        text: 'Telegram',
    },
    {
        icon: <XIcon />,
        messagePropName: 'title',
        ShareButton: TwitterShareButton,
        size: 28,
        smallIcon: true,
        text: 'Twitter',
    },
    {
        href: `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(advertUrl)}`,
        icon: <SocialGoogleBrandIcon />,
        rel: 'noreferrer',
        ShareButton: 'a',
        size: 28,
        smallIcon: true,
        target: '_blank',
        text: 'Gmail',
    },
];
const ShareMyAdsSocials = ({ advertUrl, customMessage }: TShareMyAdsSocialsProps) => (
    <div className='p2p-v2-share-ads-socials'>
        {getShareButtons(advertUrl).map(({ ShareButton, href, icon, messagePropName, rel, target, text }) => (
            <ShareButton
                className='flex flex-col items-center'
                key={text}
                url={text === 'Facebook' ? advertUrl : ' '}
                {...(messagePropName && { [messagePropName]: customMessage })}
                {...(href && { href })}
                {...(target && { target: '_blank' })}
                {...(rel && { rel: 'noreferrer' })}
            >
                <div className='p2p-v2-share-ads-socials__circle'>{icon}</div>
                <Text size='2xs'>{text}</Text>
            </ShareButton>
        ))}
    </div>
);

export default ShareMyAdsSocials;
