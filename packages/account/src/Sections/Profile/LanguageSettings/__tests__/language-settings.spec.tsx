import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';
import LanguageSettings from '../language-settings';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    TranslationFlag: { lang_1: () => <div>Language 1 Flag</div>, lang_2: () => <div>Language 2 Flag</div> },
}));

jest.mock('@deriv/translations', () => ({
    ...jest.requireActual('@deriv/translations'),
    getAllowedLanguages: jest.fn(() => ({ lang_1: 'Test Lang 1', lang_2: 'Test Lang 2' })),
}));

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn(() => ({ i18n: { changeLanguage: jest.fn() } })),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Redirect: jest.fn(() => <div>Redirect</div>),
}));

describe('LanguageSettings', () => {
    let mockRootStore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mockRootStore = mockStore({
            common: {
                current_language: 'lang_1',
            },
            ui: {
                is_mobile: false,
            },
        });
    });

    const renderLanguageSettings = () => {
        render(<LanguageSettings />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });
    };

    it('should render LanguageSettings', () => {
        renderLanguageSettings();

        expect(screen.getByText('Select Language')).toBeInTheDocument();

        const lang_1 = screen.getByText('Test Lang 1');
        const lang_2 = screen.getByText('Test Lang 2');
        expect(screen.getByText(/Language 1 Flag/)).toBeInTheDocument();
        expect(screen.getByText(/Language 2 Flag/)).toBeInTheDocument();
        expect(lang_1).toBeInTheDocument();
        expect(/(active)/i.test(lang_1.className)).toBeTruthy();
        expect(lang_2).toBeInTheDocument();
        expect(/(active)/i.test(lang_2.className)).toBeFalsy();
    });

    it('should trigger language change', () => {
        renderLanguageSettings();

        const lang_2 = screen.getByText('Test Lang 2');
        userEvent.click(lang_2);

        expect(mockRootStore.common.changeSelectedLanguage).toHaveBeenCalled();
    });

    it('should redirect in mobile view when the user tries to reach `/account/languages` route', () => {
        mockRootStore.ui.is_mobile = true;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.languages },
        });

        renderLanguageSettings();

        expect(screen.queryByText('Select Language')).not.toBeInTheDocument();
        expect(screen.getByText('Redirect')).toBeInTheDocument();
    });

    it('should redirect when the user tries to reach `/account/languages` route having wallet accounts', () => {
        mockRootStore.client.has_wallet = true;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { pathname: routes.languages },
        });

        renderLanguageSettings();

        expect(screen.queryByText('Select Language')).not.toBeInTheDocument();
        expect(screen.getByText('Redirect')).toBeInTheDocument();
    });
});
