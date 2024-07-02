import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { PasskeysStatusContainer } from '../passkeys-status-container';
import { PASSKEY_STATUS_CODES, TPasskeysStatus } from '../../passkeys-configs';

jest.mock('../no-passkeys', () => ({
    NoPasskeys: jest.fn(() => <div>NoPasskeys</div>),
}));
jest.mock('../passkey-created', () => ({
    PasskeyCreated: jest.fn(() => <div>PasskeyCreated</div>),
}));
jest.mock('../passkeys-learn-more', () => ({
    PasskeysLearnMore: jest.fn(() => <div>PasskeysLearnMore</div>),
}));
jest.mock('../passkeys-list', () => ({
    PasskeysList: jest.fn(() => <div>PasskeysList</div>),
}));
jest.mock('../passkey-rename', () => ({
    PasskeyRename: jest.fn(() => <div>PasskeyRename</div>),
}));

describe('PasskeysStatusContainer', () => {
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnPasskeyMenuClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();
    const mock_current_managed_passkey: ComponentProps<typeof PasskeysStatusContainer>['current_managed_passkey'] = {
        id: 777,
        name: 'test passkey name',
        passkey_id: 'test_passkey_id',
    };

    const renderComponent = (passkey_status: TPasskeysStatus) => {
        render(
            <PasskeysStatusContainer
                current_managed_passkey={mock_current_managed_passkey}
                passkey_status={passkey_status}
                passkeys_list={[]}
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
                onPasskeyMenuClick={mockOnPasskeyMenuClick}
            />
        );
    };

    it('renders PasskeysStatusContainer with PasskeyCreated component', () => {
        renderComponent(PASSKEY_STATUS_CODES.CREATED);

        expect(screen.getByText('PasskeyCreated')).toBeInTheDocument();
    });

    it('renders PasskeysStatusContainer with NoPasskeys component', () => {
        renderComponent(PASSKEY_STATUS_CODES.NO_PASSKEY);

        expect(screen.getByText('NoPasskeys')).toBeInTheDocument();
    });

    it('renders PasskeysStatusContainer with PasskeysLearnMore component', () => {
        renderComponent(PASSKEY_STATUS_CODES.LEARN_MORE);

        expect(screen.getByText('PasskeysLearnMore')).toBeInTheDocument();
    });

    it('renders PasskeysStatusContainer with PasskeysList component', () => {
        renderComponent(PASSKEY_STATUS_CODES.LIST);

        expect(screen.getByText('PasskeysList')).toBeInTheDocument();
    });

    it('renders PasskeysStatusContainer with PasskeyRename component', () => {
        renderComponent(PASSKEY_STATUS_CODES.RENAMING);

        expect(screen.getByText('PasskeyRename')).toBeInTheDocument();
    });
});
