import React from 'react';
import { render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import Contract from '../contract';
import TraderProviders from '../../../../trader-providers';
import { createMemoryHistory } from 'history';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    withRouter: (component: React.FC) => component,
    Redirect: jest.fn(() => 'MockRedirect'),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    match: jest.fn(() => 'MockMatch'),
}));

jest.mock('../contract-replay', () => jest.fn(() => 'MockContractReplay'));

const defaultProps = {
    match: { params: { contract_id: '123' } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockContract = ({ store, props }: { store: any; props: any }) => {
    const history = createMemoryHistory();
    history.push('/contract/123');

    return (
        <TraderProviders store={store}>
            <Router history={history}>
                <Contract {...props} />
            </Router>
        </TraderProviders>
    );
};

describe('<Contract>', () => {
    const mockStore = {
        contract_replay: {
            has_error: false,
            error_message: '',
            error_code: '',
            removeErrorMessage: jest.fn(),
            removeAccountSwitcherListener: jest.fn(),
            setAccountSwitcherListener: jest.fn(),
        },
    };

    it('renders ContractReplay component when no error is present', () => {
        render(<MockContract store={mockStore} props={defaultProps} />);

        expect(screen.getByText('MockContractReplay')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_error-component')).not.toBeInTheDocument();
        expect(screen.queryByText('MockRedirect')).not.toBeInTheDocument();
    });

    it('redirects to 404 page when contract ID is not a number', () => {
        const props = {
            match: { params: { contract_id: 'abc' } },
        };

        render(<MockContract store={mockStore} props={props} />);

        expect(screen.queryByText('MockRedirect')).toBeInTheDocument();
    });

    it('renders ErrorComponent when there is a contract replay error', () => {
        mockStore.contract_replay.has_error = true;
        mockStore.contract_replay.error_message = 'Something went wrong!';
        mockStore.contract_replay.error_code = 'GetProposalFailure';

        render(<MockContract store={mockStore} props={defaultProps} />);

        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
        expect(screen.getByText('Ok')).toBeInTheDocument();
        expect(screen.queryByText('MockRedirect')).not.toBeInTheDocument();
    });
});
