import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import CFDServerErrorDialog from '../cfd-server-error-dialog';
import CFDProviders from '../../cfd-providers';

describe('<CFDServerErrorDialog /> ', () => {
    let modal_root_el;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    let mockRootStore;
    beforeEach(() => {
        mockRootStore = {
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
            },
            modules: {
                cfd: {
                    clearCFDError: jest.fn(),
                    error_type: 'error_type',
                    has_cfd_error: true,
                    is_cfd_success_dialog_enabled: false,
                    error_message: 'This is a sample error message',
                },
            },
        };
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the component properly', () => {
        const { container } = render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
        });

        expect(container.firstChild).toHaveClass('dc-dialog__wrapper dc-dialog__wrapper--enter');
    });

    it('should render the proper text and error message', () => {
        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
        });

        expect(screen.getByText(/This is a sample error message/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('OK');
        expect(screen.getByRole('heading')).toHaveTextContent(/Something’s not right/i);
    });

    it('should not render the component if has_cfd_error is false', () => {
        const new_mockRootStore = {
            ui: {
                ...mockRootStore.ui,
            },
            modules: {
                cfd: {
                    ...mockRootStore.modules.cfd,
                    has_cfd_error: false,
                },
            },
        };
        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(new_mockRootStore)}>{children}</CFDProviders>,
        });

        expect(screen.queryByText(/This is a sample error message/i)).not.toBeInTheDocument();
    });

    it('should not render the component if is_cfd_success_dialog_enabled', () => {
        const new_mockRootStore = {
            ui: {
                ...mockRootStore.ui,
            },
            modules: {
                cfd: {
                    ...mockRootStore.modules.cfd,
                    is_cfd_success_dialog_enabled: true,
                },
            },
        };

        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(new_mockRootStore)}>{children}</CFDProviders>,
        });

        expect(screen.queryByText(/This is a sample error message/i)).not.toBeInTheDocument();
    });

    it('should clear the component if OK is clicked', () => {
        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mockRootStore)}>{children}</CFDProviders>,
        });

        const ok_btn = screen.getByRole('button', { name: /OK/i });
        fireEvent.click(ok_btn);

        expect(mockRootStore.modules.cfd.clearCFDError).toHaveBeenCalled();
    });
});
