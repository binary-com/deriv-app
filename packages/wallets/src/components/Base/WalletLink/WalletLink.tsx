import React from 'react';
import { getInitialLanguage } from '@deriv-com/translations';
import { getStaticUrl, setUrlLanguage } from '../../../helpers/urls';
import './WalletLink.scss';

type TVariant = 'bold' | 'normal';

interface LinkProps {
    children?: React.ReactNode;
    href?: React.AnchorHTMLAttributes<HTMLAnchorElement>['href'];
    staticUrl?: React.AnchorHTMLAttributes<HTMLAnchorElement>['href'];
    variant?: TVariant;
}

const WalletLink: React.FC<LinkProps> = ({ children, href, staticUrl, variant = 'normal' }) => {
    const getHref = () => {
        setUrlLanguage(getInitialLanguage());
        return getStaticUrl(staticUrl);
    };

    return (
        <a
            className={`wallets-link wallets-link__variant--${variant}`}
            href={href ?? (staticUrl ? getHref() : '#')}
            rel='noopener noreferrer'
            target='_blank'
        >
            {children}
        </a>
    );
};

export default WalletLink;
