import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider, mockStore } from '@deriv/stores';
import FinancialAssessment from '../financial-assessment';
import { WS } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        wait: jest.fn(() => Promise.resolve()),
        setSettings: jest.fn(() => Promise.resolve({ error: '' })),
        authorized: {
            storage: {
                getFinancialAssessment: jest.fn(() =>
                    Promise.resolve({
                        get_financial_assessment: {
                            account_turnover: '',
                            cfd_score: 0,
                            education_level: '',
                            employment_industry: '',
                            employment_status: 'Employed',
                            estimated_worth: '',
                            financial_information_score: '',
                            income_source: '',
                            net_income: '',
                            occupation: '',
                            source_of_wealth: '',
                            total_score: '',
                            trading_score: '',
                        },
                    })
                ),
            },
        },
    },
    useWS: () => undefined,
}));
jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Loading: jest.fn(() => 'mockedLoading'),
    };
});
describe('<FinancialAssessment/>', () => {
    const mock = mockStore({
        client: {
            account_settings: {
                account_opening_reason: 'Hedging',
                tax_residence: 'Germany',
                tax_identification_number: '123456789',
                employment_status: 'Employed',
            },
        },
    });
    const renderComponent = (store_config = mock) =>
        render(
            <BrowserRouter>
                <StoreProvider store={store_config}>
                    <FinancialAssessment />
                </StoreProvider>
            </BrowserRouter>
        );

    it('should render FinancialAssessment component', async () => {
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Financial information')).toBeInTheDocument();
            expect(screen.getByText('Source of income')).toBeInTheDocument();
            expect(screen.getByText('Employment status')).toBeInTheDocument();
            expect(screen.getByText('Industry of employment')).toBeInTheDocument();
            expect(screen.getByText('Occupation')).toBeInTheDocument();
            expect(screen.getByText('Source of wealth')).toBeInTheDocument();
            expect(screen.getByText('Level of education')).toBeInTheDocument();
            expect(screen.getByText('Net annual income')).toBeInTheDocument();
            expect(screen.getByText('Source of wealth')).toBeInTheDocument();
            expect(screen.getByText('Estimated net worth')).toBeInTheDocument();
            expect(screen.getByText('Anticipated account turnover')).toBeInTheDocument();
        });
    });

    it('should render FinancialAssessment component without occupation field when Employment status is un employed', async () => {
        WS.authorized.storage.getFinancialAssessment = jest.fn(() =>
            Promise.resolve({
                get_financial_assessment: {
                    account_turnover: '',
                    cfd_score: 0,
                    education_level: '',
                    employment_industry: '',
                    employment_status: 'Unemployed',
                    estimated_worth: '',
                    financial_information_score: '',
                    income_source: '',
                    net_income: '',
                    occupation: '',
                    source_of_wealth: '',
                    total_score: '',
                    trading_score: '',
                },
            })
        );
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Employment status')).toBeInTheDocument();
            expect(screen.getByText('Industry of employment')).toBeInTheDocument();
            expect(screen.queryByText('Occupation')).not.toBeInTheDocument();
        });
    });

    it('should render FinancialAssessment component without occupation field when Employment status is Self-Employed', async () => {
        WS.authorized.storage.getFinancialAssessment = jest.fn(() =>
            Promise.resolve({
                get_financial_assessment: {
                    account_turnover: '',
                    cfd_score: 0,
                    education_level: '',
                    employment_industry: '',
                    employment_status: 'Self-Employed',
                    estimated_worth: '',
                    financial_information_score: '',
                    income_source: '',
                    net_income: '',
                    occupation: '',
                    source_of_wealth: '',
                    total_score: '',
                    trading_score: '',
                },
            })
        );
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Employment status')).toBeInTheDocument();
            expect(screen.getByText('Industry of employment')).toBeInTheDocument();
            expect(screen.queryByText('Occupation')).toBeInTheDocument();
        });
    });
});
