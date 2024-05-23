import React, { PropsWithChildren } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import WalletsAuthProvider from '../../AuthProvider';
import useSendPasswordResetEmail from '../useSendPasswordResetEmail';

const mockMutate = jest.fn();

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useSettings: jest.fn(() => ({
        data: {
            email: 'test@meme.com',
        },
    })),
    useVerifyEmail: jest.fn(() => ({
        mutate: mockMutate,
    })),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('useSendPasswordResetEmail', () => {
    it('should call mutate when sendEmail is called', () => {
        const { result } = renderHook(() => useSendPasswordResetEmail(), { wrapper });
        result.current.sendEmail({
            isInvestorPassword: true,
            platform: 'mt5',
        });
        expect(mockMutate).toHaveBeenCalledWith({
            type: 'trading_platform_investor_password_reset',
            url_parameters: {
                redirect_to: 10,
            },
            verify_email: 'test@meme.com',
        });
    });
});
