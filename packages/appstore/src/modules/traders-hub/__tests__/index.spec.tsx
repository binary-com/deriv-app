import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import TradersHub from '..';

jest.mock('Components/modals/modal-manager', () => jest.fn(() => 'mockedModalManager'));
jest.mock('Components/main-title-bar', () => jest.fn(() => 'mockedMainTitleBar'));
jest.mock('Components/cfds-listing', () => jest.fn(() => 'mockedCFDsListing'));
jest.mock('Components/options-multipliers-listing', () => jest.fn(() => 'mocked<OptionsAndMultipliersListing>'));
jest.mock('../../tour-guide/tour-guide', () => jest.fn(() => 'mocked<TourGuide>'));

describe('TradersHub', () => {
    const render_container = (mock_store_override = {}) => {
        const mock_store = mockStore(mock_store_override);
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );

        return render(<TradersHub />, {
            wrapper,
        });
    };

    it('should display the component', () => {
        const { container } = render_container({ client: { is_logged_in: true } });
        expect(container).toBeInTheDocument();
    });

    it('should display both CFDs and Multipliers section', () => {
        render_container({ client: { is_logged_in: true, is_mt5_allowed: true } });
        const dashboard_sections = screen.getByTestId('dt_traders_hub');
        expect(dashboard_sections?.textContent?.match(/Multipliers/)).not.toBeNull();
        expect(dashboard_sections?.textContent?.match(/CFDs/)).not.toBeNull();
    });

    it('should display Multipliers section if there is no MT5 accounts availble for country of residence', () => {
        render_container({ client: { is_logged_in: true, is_mt5_allowed: false } });
        const dashboard_sections = screen.getByTestId('dt_traders_hub');
        expect(dashboard_sections?.textContent?.match(/Multipliers/)).not.toBeNull();
        expect(dashboard_sections?.textContent?.match(/CFDs/)).toBeNull();
    });

    it('should display Multipliers and CFDs section in order if the user is non eu', () => {
        render_container({
            client: { is_logged_in: true },
            traders_hub: { is_eu_user: false },
        });
        const dashboard_sections = screen.getByTestId('dt_traders_hub');
        expect(dashboard_sections).not.toHaveClass('traders-hub__main-container-reversed');
    });

    it('should display Multipliers and CFDs section in reverse order if the user is eu', () => {
        render_container({ client: { is_logged_in: true }, traders_hub: { is_eu_user: true } });
        const dashboard_sections = screen.getByTestId('dt_traders_hub');
        expect(dashboard_sections).toHaveClass('traders-hub__main-container-reversed');
    });

    it('should display disclaimer if the user is from low risk eu country', () => {
        render_container({
            client: { is_logged_in: true },
            traders_hub: { is_eu_user: true },
        });
        const disclaimer = screen.getByTestId('dt_traders_hub_disclaimer');
        expect(disclaimer).toBeInTheDocument();
    });
});
