import React, { ComponentProps, InputHTMLAttributes, memo } from 'react';
import { Text } from '@deriv-com/ui';

export type HelperMessageProps = {
    inputValue?: InputHTMLAttributes<HTMLInputElement>['value'];
    isError?: boolean;
    maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength'];
    message?: string;
    messageVariant?: 'error' | 'general' | 'warning';
};

const HelperMessage: React.FC<HelperMessageProps> = memo(
    ({ inputValue, isError, maxLength, message, messageVariant = 'general' }) => {
        const HelperMessageColors: Record<string, ComponentProps<typeof Text>['color']> = {
            error: 'error',
            general: 'less-prominent',
            warning: 'warning',
        };

        return (
            <React.Fragment>
                {message && (
                    <div className='wallets-textfield__message-container--msg'>
                        <Text
                            align='start'
                            color={isError ? HelperMessageColors.error : HelperMessageColors[messageVariant]}
                            size='xs'
                        >
                            {message}
                        </Text>
                    </div>
                )}
                {maxLength && (
                    <div className='wallets-textfield__message-container--maxchar'>
                        <Text align='end' color='less-prominent' size='xs'>
                            {inputValue?.toString().length || 0} / {maxLength}
                        </Text>
                    </div>
                )}
            </React.Fragment>
        );
    }
);

HelperMessage.displayName = 'HelperMessage';
export default HelperMessage;
