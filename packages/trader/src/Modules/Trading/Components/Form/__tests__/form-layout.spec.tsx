import React from 'react';
import Loadable from 'react-loadable';

import { mockStore } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';

import TraderProviders from '../../../../../trader-providers';
import FormLayout from '../form-layout';

Loadable.preloadAll();

const mock_props = {
    is_market_closed: false,
    is_trade_enabled: false,
};

const mock_store = {
    common: {
        current_language: 'en',
    },
};

const store = mockStore(mock_store);

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../screen-large', () => jest.fn(() => 'ScreenLarge'));

describe('FormLayout', () => {
    const mockedFormLayout = (mock_props: { is_market_closed: boolean; is_trade_enabled: boolean }) => {
        return (
            <TraderProviders store={store}>
                <FormLayout {...mock_props} />
            </TraderProviders>
        );
    };
    it('should render the component', async () => {
        render(mockedFormLayout(mock_props));
        await waitFor(() => {
            expect(screen.getByText('ScreenLarge')).toBeInTheDocument();
        });
    });
});
