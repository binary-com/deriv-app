import RegulatorSwitcher from '../regulators-switcher';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('../../pre-loader/regulations-switcher-loader', () => ({
    __esModule: true,
    default: () => <div>RegulationsSwitcherLoader</div>,
}));

describe('RegulatorSwitcher', () => {
    it('should render correctly', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RegulatorSwitcher />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the correct text', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RegulatorSwitcher />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Regulation:')).toBeInTheDocument();
        expect(screen.getByText('Non-EU')).toBeInTheDocument();
        expect(screen.getByText('EU')).toBeInTheDocument();
    });
    it('should open toggleRegulatorsCompareModal if the user clicks on the icon', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RegulatorSwitcher />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_regulators-switcher-icon'));
        expect(mock.traders_hub.toggleRegulatorsCompareModal).toHaveBeenCalled();
    });

    it('should switch the region to EU if the user clicks on EU', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RegulatorSwitcher />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        fireEvent.click(screen.getByText('EU'));
        expect(mock.traders_hub.selectRegion).toHaveBeenCalledWith('EU');
    });

    it('should switch the region to Non-EU if the user clicks on Non-EU', () => {
        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RegulatorSwitcher />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        fireEvent.click(screen.getByText('Non-EU'));
        expect(mock.traders_hub.selectRegion).toHaveBeenCalledWith('Non-EU');
    });

    it('should show loader if is_switching is true', () => {
        const mock = mockStore({
            client: {
                is_switching: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<RegulatorSwitcher />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
        expect(screen.getByText('RegulationsSwitcherLoader')).toBeInTheDocument();
    });
});
