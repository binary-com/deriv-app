import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import GoogleDrive from '../google-drive';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('GoogleDrive', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;

    beforeAll(() => {
        Object.defineProperty(window, 'google', {
            value: {
                picker: {
                    DocsView: jest.fn(() => ({
                        setIncludeFolders: jest.fn(),
                        setMimeTypes: jest.fn(),
                    })),
                    PickerBuilder: jest.fn(() => ({
                        setOrigin: jest.fn().mockReturnThis(),
                        setTitle: jest.fn().mockReturnThis(),
                        setLocale: jest.fn().mockReturnThis(),
                        setAppId: jest.fn().mockReturnThis(),
                        setOAuthToken: jest.fn().mockReturnThis(),
                        addView: jest.fn().mockReturnThis(),
                        setDeveloperKey: jest.fn().mockReturnThis(),
                        setSize: jest.fn().mockReturnThis(),
                        setCallback: jest.fn().mockReturnThis(),
                        build: jest.fn(() => ({
                            setVisible: jest.fn(),
                        })),
                    })),
                },
            },
        });
    });

    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render GoogleDrive component with svg element that has height and width equal 128, and should have text Google Drive, when is_authorised = false on desktop version', () => {
        mock_store.ui.is_desktop = true;
        render(<GoogleDrive />, { wrapper });
        const google_drive_container = screen.getByTestId('dt_google_drive');

        expect(google_drive_container).toBeInTheDocument();
        // eslint-disable-next-line testing-library/no-node-access
        const svg_element = google_drive_container.querySelector('svg');

        expect(svg_element).toHaveAttribute('height', '128');
        expect(svg_element).toHaveAttribute('width', '128');

        expect(screen.getByText('Google Drive')).toHaveClass('load-strategy__google-drive-connected-text');
    });
    it('should render GoogleDrive component with buttons Disconnect and Open when is_authorised = true', () => {
        mock_DBot_store?.google_drive?.updateSigninStatus(true);
        render(<GoogleDrive />, { wrapper });

        const google_drive_text = screen.getByText('You are connected to Google Drive');
        const google_drive_btn_first = screen.getByText('Disconnect');
        const google_drive_btn_second = screen.getByText('Open');

        expect(google_drive_text).toBeInTheDocument();
        expect(google_drive_btn_first).toBeInTheDocument();
        expect(google_drive_btn_second).toBeInTheDocument();
    });

    it('should render GoogleDrive component with ability to close dialog modal and invoke google drive when is_authorised = true', () => {
        mock_DBot_store?.google_drive?.updateSigninStatus(true);
        const { container } = render(<GoogleDrive />, { wrapper });

        userEvent.click(screen.getByRole('button', { name: 'Open' }));

        expect(mock_DBot_store?.dashboard.is_dialog_open).toBeFalsy();
        expect(container).toBeInTheDocument();
    });
    it('should render GoogleDrive component with with svg element that has height and width equal 96 when it is a mobile version', () => {
        mock_store.ui.is_desktop = false;
        const { container } = render(<GoogleDrive />, { wrapper });

        const google_drive_container = screen.getByTestId('dt_google_drive');
        // eslint-disable-next-line testing-library/no-node-access
        const svg_element = google_drive_container.querySelector('svg');

        expect(svg_element).toHaveAttribute('height', '96');
        expect(svg_element).toHaveAttribute('width', '96');

        expect(container).toBeInTheDocument();
    });
});
