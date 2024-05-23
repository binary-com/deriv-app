import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SelfExclusion from '../self-exclusion';
import { FormikValues } from 'formik';
import { StoreProvider, mockStore } from '@deriv/stores';
import { WS } from '@deriv/shared';
import userEvent from '@testing-library/user-event';

const portal_root = document.createElement('div');
document.body.appendChild(portal_root);

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    useIsMounted: jest.fn().mockImplementation(() => () => true),
}));
jest.mock('@deriv/shared/src/services/ws-methods', () => ({
    __esModule: true, // this property makes it work,
    default: 'mockedDefaultExport',
    WS: {
        authorized: {
            getLimits: jest.fn(() =>
                Promise.resolve({
                    get_limits: {},
                })
            ),
            getSelfExclusion: jest.fn(() =>
                Promise.resolve({
                    error: { message: '' },
                })
            ),
            setSelfExclusion: jest.fn(() =>
                Promise.resolve({
                    error: {},
                })
            ),
        },
    },
    useWS: () => undefined,
}));

jest.mock('Components/self-exclusion/self-exclusion-modal', () => {
    const MockSelfExclusionModal = () => <div>SelfExclusionModal</div>;
    return MockSelfExclusionModal;
});
const mock = {
    client: {
        currency: '',
        standpoint: {
            svg: false,
        },
        is_virtual: false,
        is_switching: false,
        landing_company_shortcode: '',
        logout: jest.fn(),
    },
    ui: {
        is_tablet: false,
    },
};
let store = mockStore(mock);
describe('<SelfExclusion />', () => {
    let mock_props: React.ComponentProps<typeof SelfExclusion> = {
        overlay_ref: document.createElement('div'),
        setIsOverlayShown: jest.fn(),
    };

    beforeEach(() => {
        mock.client.currency = 'Test currency';
        store = mockStore(mock);
        mock_props = {
            overlay_ref: document.createElement('div'),
            setIsOverlayShown: jest.fn(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render SelfExclusion component for virtual account', () => {
        store = mockStore({
            client: {
                is_virtual: true,
            },
        });

        render(
            <StoreProvider store={store}>
                <SelfExclusion {...mock_props} />
            </StoreProvider>
        );

        expect(screen.getByText('This feature is not available for demo accounts.')).toBeInTheDocument();
    });

    it('should render SelfExclusion component with SelfExclusionModal', async () => {
        store = mockStore(mock);
        await act(async () => {
            render(
                <StoreProvider store={store}>
                    <SelfExclusion {...mock_props} />
                </StoreProvider>
            );
        });

        expect(screen.getByText('SelfExclusionModal')).toBeInTheDocument();
        const currencies = screen.getAllByText(/Test currency/i);
        expect(currencies[0]).toBeInTheDocument();
        expect(currencies).toHaveLength(7);
        const inputs = screen.getAllByRole('textbox');
        expect(inputs).toHaveLength(11);
    });

    it('should render SelfExclusion component with error', async () => {
        WS.authorized.getSelfExclusion = jest.fn(() =>
            Promise.resolve({
                error: { message: 'Test getSelfExclusion response error' },
            })
        );

        await act(async () => {
            render(
                <StoreProvider store={store}>
                    <SelfExclusion {...mock_props} />
                </StoreProvider>
            );
        });

        expect(screen.queryByText('Test getSelfExclusion response error')).toBeInTheDocument();
    });

    it('Should trigger session_duration_limit input and show error if the value is greater than 60480 or does not show if less than 60480', async () => {
        store = mockStore({
            client: {
                is_eu: true,
            },
        });
        WS.authorized.getSelfExclusion = jest.fn(() =>
            Promise.resolve({
                error: { message: '' },
            })
        );

        render(
            <StoreProvider store={store}>
                <SelfExclusion {...mock_props} />
            </StoreProvider>
        );

        const inputs = await screen.findAllByRole('textbox');
        const session_duration_limit_input = inputs.find(
            (input: FormikValues) => input.name === 'session_duration_limit'
        );

        if (session_duration_limit_input) userEvent.type(session_duration_limit_input, '60481');

        expect(
            await screen.findByText('Enter a value in minutes, up to 60480 minutes (equivalent to 6 weeks).')
        ).toBeInTheDocument();
    });

    it('Should trigger exclude_until input and show error depends on input value', async () => {
        (Date.now as jest.Mock) = jest.fn(() => new Date('2022-02-03'));
        WS.authorized.getSelfExclusion = jest.fn(() =>
            Promise.resolve({
                error: { message: '' },
            })
        );
        store = mockStore(mock);
        render(
            <StoreProvider store={store}>
                <SelfExclusion {...mock_props} />
            </StoreProvider>
        );

        const inputs = await screen.findAllByRole('textbox');
        const exclude_until_input = inputs.find((input: FormikValues) => input.name === 'exclude_until');

        await act(async () => {
            if (exclude_until_input) fireEvent.change(exclude_until_input, { target: { value: '2021-04-13' } });
        });

        expect(screen.getByText('Exclude time must be after today.')).toBeInTheDocument();

        await act(async () => {
            if (exclude_until_input) fireEvent.change(exclude_until_input, { target: { value: '2022-04-13' } });
        });
        expect(screen.getByText('Exclude time cannot be less than 6 months.')).toBeInTheDocument();

        await act(async () => {
            if (exclude_until_input) fireEvent.change(exclude_until_input, { target: { value: '2028-04-13' } });
        });
        expect(screen.getByText('Exclude time cannot be for more than five years.')).toBeInTheDocument();
    });

    it('should trigger inputs with data, add new data, and show error wih invalid input data', async () => {
        store = mockStore(mock);
        WS.authorized.getSelfExclusion = jest.fn(() =>
            Promise.resolve({
                error: { message: '' },
            })
        );
        WS.authorized.setSelfExclusion = jest.fn(() =>
            Promise.resolve({
                error: { message: 'Test setSelfExclusion response error' },
            })
        );

        await act(async () => {
            render(
                <StoreProvider store={store}>
                    <SelfExclusion {...mock_props} />
                </StoreProvider>
            );
        });

        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        const next_btn_1 = screen.getByRole('button');
        expect(next_btn_1).toHaveTextContent('Next');

        const inputs_1 = await screen.findAllByRole('textbox');
        expect(inputs_1).toHaveLength(11);
        const max_turnover_input = inputs_1.find((input: FormikValues) => input.name === 'max_turnover');
        const max_open_bets_input = inputs_1.find((input: FormikValues) => input.name === 'max_open_bets');

        if (max_turnover_input) userEvent.type(max_turnover_input, '1700');
        if (max_open_bets_input) userEvent.type(max_open_bets_input, '999');

        await waitFor(() => {
            userEvent.click(next_btn_1);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        const accept_btn_1 = screen.getByRole('button');
        expect(accept_btn_1).toHaveTextContent('Accept');
        expect(next_btn_1).not.toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const back_btn_1 = screen.getByText('Back');
        expect(back_btn_1).toBeInTheDocument();

        await waitFor(() => {
            userEvent.click(back_btn_1);
        });

        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        expect(screen.queryByText('You have set the following limits:')).not.toBeInTheDocument();
        expect(accept_btn_1).not.toBeInTheDocument();
        const next_btn_2 = screen.getByRole('button');
        expect(next_btn_2).toHaveTextContent('Next');
        const inputs_2 = await screen.findAllByRole('textbox');
        expect(inputs_2).toHaveLength(11);
        const max_balance_input = inputs_1.find((input: FormikValues) => input.name === 'max_balance');

        await waitFor(() => {
            if (max_balance_input) userEvent.type(max_balance_input, '10000');
        });

        await waitFor(() => {
            userEvent.click(next_btn_2);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const accept_btn_2 = screen.getByRole('button');
        expect(accept_btn_2).toHaveTextContent('Accept');

        await waitFor(() => {
            userEvent.click(accept_btn_2);
        });

        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        const back_btn_2 = screen.getByText('Back');
        expect(back_btn_2).toBeInTheDocument();
        const accept_btn_3 = screen.getByRole('button');
        expect(accept_btn_3).toHaveTextContent('Accept');
        expect(screen.getByText('Test setSelfExclusion response error')).toBeInTheDocument();
    });

    it('should trigger inputs with correct data set timeout limit and logout', async () => {
        WS.authorized.setSelfExclusion = jest.fn(() =>
            Promise.resolve({
                error: false,
            })
        );
        const logout = store.client.logout;

        await act(async () => {
            render(
                <StoreProvider store={store}>
                    <SelfExclusion {...mock_props} />
                </StoreProvider>
            );
        });

        expect(screen.getByText('Your stake and loss limits')).toBeInTheDocument();
        const next_btn_1 = screen.getByRole('button');
        expect(next_btn_1).toHaveTextContent('Next');

        const inputs = await screen.findAllByRole('textbox');
        expect(inputs).toHaveLength(11);

        const exclude_until_input = inputs.find((input: FormikValues) => input.name === 'exclude_until');
        const max_open_bets_input = inputs.find((input: FormikValues) => input.name === 'max_open_bets');
        const max_losses_input = inputs.find((input: FormikValues) => input.name === 'max_losses');
        const max_turnover_input = inputs.find((input: FormikValues) => input.name === 'max_turnover');
        const max_7day_losses_input = inputs.find((input: FormikValues) => input.name === 'max_7day_losses');
        const max_7day_turnover_input = inputs.find((input: FormikValues) => input.name === 'max_7day_turnover');
        const max_30day_losses_input = inputs.find((input: FormikValues) => input.name === 'max_30day_losses');
        const max_30day_turnover_input = inputs.find((input: FormikValues) => input.name === 'max_30day_turnover');
        const session_duration_limit_input = inputs.find(
            (input: FormikValues) => input.name === 'session_duration_limit'
        );

        act(() => {
            if (exclude_until_input) fireEvent.change(exclude_until_input, { target: { value: '2023-02-03' } });
        });
        if (max_open_bets_input) userEvent.type(max_open_bets_input, '99');
        if (max_losses_input) userEvent.type(max_losses_input, '1000');
        if (max_turnover_input) userEvent.type(max_turnover_input, '1700');
        if (max_7day_losses_input) userEvent.type(max_7day_losses_input, '700');
        if (max_7day_turnover_input) userEvent.type(max_7day_turnover_input, '700');
        if (max_30day_losses_input) userEvent.type(max_30day_losses_input, '3000');
        if (max_30day_turnover_input) userEvent.type(max_30day_turnover_input, '5000');
        if (session_duration_limit_input) userEvent.type(session_duration_limit_input, '60399');

        await userEvent.click(next_btn_1);

        expect(await screen.findByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.queryByText('Your stake and loss limits')).not.toBeInTheDocument();
        expect(next_btn_1).not.toBeInTheDocument();
        const accept_btn_1 = screen.getByRole('button');
        expect(accept_btn_1).toHaveTextContent('Accept');
        await waitFor(() => {
            userEvent.click(accept_btn_1);
        });

        expect(accept_btn_1).not.toBeInTheDocument();

        const review_btn = screen.getByText('No, review my limits');

        expect(review_btn).toBeInTheDocument();

        expect(screen.getByText('Yes, log me out immediately')).toBeInTheDocument();

        await waitFor(() => {
            userEvent.click(review_btn);
        });

        expect(screen.queryByText('Yes, log me out immediately')).not.toBeInTheDocument();
        expect(review_btn).not.toBeInTheDocument();
        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();

        const accept_btn_2 = screen.getByRole('button');
        expect(accept_btn_2).toHaveTextContent('Accept');

        await waitFor(() => {
            userEvent.click(accept_btn_2);
        });

        expect(screen.getByText('No, review my limits')).toBeInTheDocument();
        const logout_btn = screen.getByText('Yes, log me out immediately');
        expect(logout_btn).toBeInTheDocument();

        await waitFor(() => {
            userEvent.click(logout_btn);
        });

        expect(logout).toHaveBeenCalled();
    });
});
