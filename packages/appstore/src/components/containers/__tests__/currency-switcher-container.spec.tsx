import CurrentSwitcherContainer from '../currency-switcher-container';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('CurrentSwitcherContainer', () => {
    it('should render the modal', async () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        CR123123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(
            <CurrentSwitcherContainer actions={null} has_interaction={false} icon='USD' title='USD' />,
            {
                wrapper,
            }
        );
        expect(container).toBeInTheDocument();
    });

    it('should not have the dropdown if is demo is true', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        CR123123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
            traders_hub: {
                is_demo: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CurrentSwitcherContainer actions={null} has_interaction={false} icon='USD' title='USD' />, {
            wrapper,
        });

        expect(screen.queryByTestId('currency-switcher-container__arrow')).not.toBeInTheDocument();
    });

    it('should not have the dropdown if is_eu_user is true', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        CR123123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
            traders_hub: {
                is_eu_user: true,
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CurrentSwitcherContainer actions={null} has_interaction={false} icon='USD' title='USD' />, {
            wrapper,
        });

        expect(screen.queryByTestId('currency-switcher-container__arrow')).not.toBeInTheDocument();
    });

    it('should have pending in the classname if the document status is pending', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        CR123123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
            client: {
                authentication_status: {
                    document_status: 'pending',
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CurrentSwitcherContainer actions={null} has_interaction={false} icon='USD' title='USD' />, {
            wrapper,
        });

        expect(screen.getByText('USD')).toHaveClass('currency-switcher-container__content--text--pending');
    });

    it('should have default in the classname if the document status is default', () => {
        const mock = mockStore({
            modules: {
                cfd: {
                    current_list: {
                        CR123123: {
                            landing_company_short: 'maltainvest',
                        },
                    },
                },
            },
            client: {
                authentication_status: {
                    document_status: 'default',
                },
            },
        });
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<CurrentSwitcherContainer actions={null} has_interaction={false} icon='USD' title='USD' />, {
            wrapper,
        });

        expect(screen.getByText('USD')).toHaveClass('currency-switcher-container__content--text--default');
    });
});
