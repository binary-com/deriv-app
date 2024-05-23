import React, { ComponentProps } from 'react';
import { DerivLightErrorIconIcon } from '@deriv/quill-icons';
import useDevice from '../../hooks/useDevice';
import { WalletButton } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';

type TProps = {
    buttonText?: string;
    buttonVariant?: ComponentProps<typeof WalletButton>['variant'];
    message?: string;
    onClick?: () => void;
    showIcon?: boolean;
    title?: string;
};

const WalletsErrorScreen: React.FC<TProps> = ({
    buttonText,
    buttonVariant = 'ghost',
    message = 'Sorry an error occurred. Please try accessing our cashier again.',
    onClick,
    showIcon = true,
    title = 'Oops, something went wrong!',
}) => {
    const { isMobile } = useDevice();
    const imageSize = {
        height: isMobile ? 80 : 128,
        width: isMobile ? 80 : 128,
    };

    return (
        <WalletsActionScreen
            description={message}
            icon={showIcon && <DerivLightErrorIconIcon {...imageSize} data-testid='dt_error_icon' />}
            renderButtons={() =>
                buttonText ? (
                    <WalletButton onClick={onClick} size='lg' variant={buttonVariant}>
                        {buttonText}
                    </WalletButton>
                ) : null
            }
            title={title}
        />
    );
};

export default WalletsErrorScreen;
