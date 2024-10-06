import React from 'react';
import { Icon } from '@deriv/components';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import IconRadio from '../icon-radio';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('IconRadio', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the text passed as prop', () => {
        const { container } = render(
            <IconRadio
                icon={<Icon icon={'IcGoogleDrive'} size={48} />}
                text='test'
                google_drive_connected={false}
                onDriveConnect={() => {
                    // empty
                }}
            />,
            { wrapper }
        );
        expect(container).toHaveTextContent('test');
    });

    it('should render Google Drive as disconnected', () => {
        const { container } = render(
            <IconRadio
                icon={<Icon icon={'IcGoogleDrive'} size={48} />}
                text='Google Drive'
                google_drive_connected={false}
                onDriveConnect={() => {
                    // empty
                }}
            />,
            { wrapper }
        );
        expect(container).toHaveTextContent('Connect');
    });

    it('should fire gdrive connect callback', async () => {
        const onDriveConnectCB = jest.fn();
        render(
            <IconRadio
                icon={<Icon icon={'IcGoogleDrive'} size={48} />}
                text='Google Drive'
                google_drive_connected={false}
                onDriveConnect={onDriveConnectCB}
            />,
            { wrapper }
        );
        await userEvent.click(screen.getByText('Connect'));
        expect(onDriveConnectCB).toHaveBeenCalled();
    });

    it('should fire gdrive disconnect callback', async () => {
        const onDriveConnectCB = jest.fn();
        render(
            <IconRadio
                icon={<Icon icon={'IcGoogleDrive'} size={48} />}
                text='Google Drive'
                google_drive_connected={true}
                onDriveConnect={onDriveConnectCB}
            />,
            { wrapper }
        );
        await userEvent.click(screen.getByText('Disconnect'));
        expect(onDriveConnectCB).toHaveBeenCalled();
    });
});
