import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { mockStore } from '@deriv/stores';
import { Router } from 'react-router-dom';
import { TCoreStores } from '@deriv/stores/types';
import BinaryRoutes from '../../Components/Routes';
import Routes from '../routes';
import ReportsProviders from '../../reports-providers';

const mockedBinaryRoutes = 'BinaryRoutes';
const mockedErrorComponent = 'ErrorComponent';

jest.mock('../../../src/Components/Routes', () => jest.fn(() => mockedBinaryRoutes));
jest.mock('../../../src/Components/Errors', () => jest.fn(() => mockedErrorComponent));

describe('Routes', () => {
    const history = createMemoryHistory();
    const store = mockStore({});

    const renderMockedRoutes = (
        mockedStore: TCoreStores = store,
        passthrough?: React.ComponentProps<typeof BinaryRoutes>['passthrough']
    ) => {
        return render(
            <ReportsProviders store={mockedStore}>
                <Router history={history}>
                    <Routes passthrough={passthrough} />
                </Router>
            </ReportsProviders>
        );
    };

    it('should render BinaryRoutes', () => {
        renderMockedRoutes();
        expect(screen.getByText(mockedBinaryRoutes)).toBeInTheDocument();
    });
    it('should render ErrorComponent', () => {
        renderMockedRoutes(mockStore({ common: { has_error: true } }));
        expect(screen.queryByText(mockedBinaryRoutes)).not.toBeInTheDocument();
        expect(screen.getByText(mockedErrorComponent)).toBeInTheDocument();
    });
});
