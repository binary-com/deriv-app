import React, { ComponentProps } from 'react';
import { LabelPairedTriangleExclamationSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Badge } from '@deriv-com/ui';

type TStatus = 'disabled';

type TProps = Omit<ComponentProps<typeof Badge>, 'children'> & {
    status: TStatus;
};

const statusConfig = {
    disabled: {
        color: 'danger',
        icon: <LabelPairedTriangleExclamationSmBoldIcon fill='var(--du-status-danger, #ec3f3f)' />,
        text: <Localize i18n_default_text='Disabled' />,
    },
} as const;

const WalletStatusBadge: React.FC<TProps> = ({
    badgeSize = 'sm',
    padding = 'loose',
    rounded = 'sm',
    status,
    textSize = 'xs',
    variant = 'bordered',
    ...rest
}) => {
    return (
        <Badge
            badgeSize={badgeSize}
            color={statusConfig[status].color}
            isBold
            leftIcon={statusConfig[status].icon}
            padding={padding}
            rounded={rounded}
            textSize={textSize}
            variant={variant}
            {...rest}
        >
            {statusConfig[status].text}
        </Badge>
    );
};

export default WalletStatusBadge;
