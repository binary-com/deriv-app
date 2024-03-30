import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import EffortlessLoginModal from '../effortless-login-modal';

describe('EffortlessLoginModal', () => {
    let modal_root_el: HTMLDivElement, mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mock_store = mockStore({
            client: {
                setShouldShowEffortlessLoginModal: jest.fn(),
            },
        });
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'effortless_modal_root');
        document.body.appendChild(modal_root_el);
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
            },
        });
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const title = 'Effortless login with passkeys';
    const tips = [
        'No need to remember a password',
        'Sync across devices',
        'Enhanced security with biometrics or screen lock',
    ];
    const learn_more = /learn more about passkeys/i;
    const descriptions = [
        'What are passkeys?',
        'Why passkeys?',
        'How to create a passkey?',
        'Where are passkeys saved?',
        'What happens if my Deriv account email is changed?',
    ];
    const tips_title = 'Tips:';

    const mainScreenCheck = () => {
        expect(screen.getByText(title)).toBeInTheDocument();
        tips.forEach(tip => {
            expect(screen.getByText(tip)).toBeInTheDocument();
        });
        descriptions.forEach(description => {
            expect(screen.queryByText(description)).not.toBeInTheDocument();
        });

        expect(screen.getByText(learn_more)).toBeInTheDocument();
        expect(screen.queryByText(tips_title)).not.toBeInTheDocument();
    };

    const learnMoreScreenCheck = () => {
        expect(screen.getByText(title)).toBeInTheDocument();
        tips.forEach(tip => {
            expect(screen.queryByText(tip)).not.toBeInTheDocument();
        });
        descriptions.forEach(description => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });
        expect(screen.queryByText(learn_more)).not.toBeInTheDocument();
        expect(screen.getByText(tips_title)).toBeInTheDocument();
    };

    const componentRender = () => {
        const history = createBrowserHistory();

        render(
            <StoreProvider store={mock_store}>
                <Router history={history}>
                    <EffortlessLoginModal />
                </Router>
            </StoreProvider>
        );

        return { history_object: history };
    };

    it('should render EffortlessLoginModal and show "learn more" page', () => {
        componentRender();

        mainScreenCheck();
        const learn_more_link = screen.getByText(/here/i);
        expect(learn_more_link).toBeInTheDocument();
        userEvent.click(learn_more_link);
        learnMoreScreenCheck();
        expect(learn_more_link).not.toBeInTheDocument();
        const back_button = screen.getByTestId('effortless_login_modal__back-button');
        expect(back_button).toBeInTheDocument();
        userEvent.click(back_button);
        mainScreenCheck();
    });

    it('should leave EffortlessLoginModal', () => {
        const { history_object } = componentRender();

        mainScreenCheck();
        const maybe_later_link = screen.getByText(/maybe later/i);
        expect(maybe_later_link).toBeInTheDocument();
        userEvent.click(maybe_later_link);
        expect(history_object.location.pathname).toBe(routes.traders_hub);
        expect(mock_store.client.setShouldShowEffortlessLoginModal).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should leave EffortlessLoginModal from "learn more" screen', () => {
        const { history_object } = componentRender();

        mainScreenCheck();
        const learn_more_link = screen.getByText(/here/i);
        expect(learn_more_link).toBeInTheDocument();
        userEvent.click(learn_more_link);
        learnMoreScreenCheck();
        const get_started_button = screen.getByRole('button', { name: /get started/i });
        expect(get_started_button).toBeInTheDocument();
        userEvent.click(get_started_button);
        expect(history_object.location.pathname).toBe(routes.passkeys);
        expect(mock_store.client.setShouldShowEffortlessLoginModal).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should not render EffortlessLoginModal if there is no portal', () => {
        modal_root_el.setAttribute('id', '');

        componentRender();

        expect(screen.queryByText(title)).not.toBeInTheDocument();
        expect(screen.queryByText(learn_more)).not.toBeInTheDocument();
        tips.forEach(tip => {
            expect(screen.queryByText(tip)).not.toBeInTheDocument();
        });
        descriptions.forEach(description => {
            expect(screen.queryByText(description)).not.toBeInTheDocument();
        });
    });
});
