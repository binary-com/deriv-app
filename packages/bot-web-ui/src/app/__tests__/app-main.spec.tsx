import React from 'react';
import moment from 'moment';
import { mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { render } from '@testing-library/react';
import { mock_ws } from '../../utils/mock';
import App from '../app-main';

const root_store = {
    ...mockStore({}),
    common: {
        ...mockStore({}).common,
        server_time: moment(new Date()).utc(),
    },
    client: {
        ...mockStore({}).client,
        is_landing_company_loaded: true,
        is_logged_in: false,
    },
};

jest.mock('react-toastify/dist/ReactToastify.css', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: () => <div>Loading...</div>,
}));

jest.mock('react-toastify/dist/ReactToastify.css', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

jest.mock('Components/bot-notification-messages', () => ({
    __esModule: true,
    default: () => <div>BotNotificationMessages</div>,
}));

jest.mock('../../pages/main', () => ({
    __esModule: true,
    default: () => <div>Dashboard</div>,
}));

jest.mock('../../pages/bot-builder', () => ({
    __esModule: true,
    default: () => <div>BotBuilder</div>,
}));

describe('App', () => {
    //mock for blockly
    window.Blockly = {
        Colours: {
            RootBlock: {},
        },
    };

    it('should render loader on app', async () => {
        const { container } = render(
            <App
                passthrough={{
                    root_store: root_store as TStores,
                    WS: mock_ws,
                }}
            />
        );
        expect(container).toBeInTheDocument();
    });
});
