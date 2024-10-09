import React from 'react';
import classNames from 'classnames';
import {
    LabelPairedCircleCheckCaptionBoldIcon,
    LabelPairedCircleExclamationCaptionBoldIcon,
    LabelPairedClockThreeCaptionBoldIcon,
    LabelPairedTriangleExclamationCaptionBoldIcon,
} from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Badge, Text, useDevice } from '@deriv-com/ui';
import { TTranslations } from '../../../../types';
import './ClientVerificationStatusBadge.scss';

type TBadgeColor = React.ComponentProps<typeof Badge>['color'];

const getBadgeVariations = (localize: TTranslations['localize']) => {
    return {
        failed: {
            color: 'danger-secondary',
            content: localize('Failed'),
            icon: <LabelPairedTriangleExclamationCaptionBoldIcon fill='#C40000' />,
        },
        in_review: {
            color: 'warning-secondary',
            content: localize('In review'),
            icon: <LabelPairedClockThreeCaptionBoldIcon fill='#C47D00' />,
        },
        needs_verification: {
            color: 'blue-secondary',
            content: localize('Needs verification'),
            icon: <LabelPairedCircleExclamationCaptionBoldIcon fill='#0777C4' />,
        },
        verified: {
            color: 'success-secondary',
            content: localize('Verified'),
            icon: <LabelPairedCircleCheckCaptionBoldIcon fill='#007A22' />,
        },
    };
};

type TClientVerificationBadgeProps = {
    onClick?: VoidFunction;
    underlined?: boolean;
    variant: keyof ReturnType<typeof getBadgeVariations>;
};

const ClientVerificationStatusBadge: React.FC<TClientVerificationBadgeProps> = ({ onClick, underlined, variant }) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { color, content, icon } = getBadgeVariations(localize)[variant];
    return (
        <Badge
            badgeSize='sm'
            className='wallets-client-verification-badge'
            color={color as TBadgeColor}
            leftIcon={icon}
            onClick={onClick}
        >
            <Text
                className={classNames('wallets-client-verification-badge__content', {
                    'wallets-client-verification-badge__content--underlined': !!onClick || underlined,
                })}
                size={isDesktop ? 'xs' : 'sm'}
                weight='bold'
            >
                {content}
            </Text>
        </Badge>
    );
};

export default ClientVerificationStatusBadge;
