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
    title?: string;
};

const WalletsErrorScreen: React.FC<TProps> = ({
    buttonText = 'Try again',
    buttonVariant = 'ghost',
    message = 'Sorry an error occurred. Please try accessing our cashier page again.',
    onClick,
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
            icon={<DerivLightErrorIconIcon {...imageSize} data-testid='dt_error_icon' />}
            renderButtons={() => (
                <WalletButton onClick={onClick} size='lg' variant={buttonVariant}>
                    {buttonText}
                </WalletButton>
            )}
            title={title}
        />
    );
};

export default WalletsErrorScreen;
