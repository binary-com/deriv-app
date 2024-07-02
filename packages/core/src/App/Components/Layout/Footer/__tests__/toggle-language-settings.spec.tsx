import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { ToggleLanguageSettings } from '../toggle-language-settings';

jest.mock('../../../../Containers/SettingsModal/settings-language', () => jest.fn(() => <div>LanguageSettings</div>));

jest.mock('@deriv-com/translations', () => ({
    useTranslations: jest.fn().mockReturnValue({
        currentLang: 'EN',
        localize: jest.fn().mockImplementation(key => key),
        switchLanguage: jest.fn(),
    }),
    Localize: jest.fn().mockImplementation(({ i18n_default_text }) => i18n_default_text),
}));

describe('ToggleLanguageSettings Component', () => {
    it('should has "ic-settings-active" class when "is_settings_visible" is true', () => {
        const mockRootStore = mockStore({ ui: { is_language_settings_modal_on: true } });

        render(<ToggleLanguageSettings />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });
        const link = screen.getByTestId('dt_toggle_language_settings');
        expect(link).toHaveClass('ic-settings--active');
    });

    it('should call "toggleSettings" function when the user clicked on the link', () => {
        const mockRootStore = mockStore({});

        render(<ToggleLanguageSettings />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const link = screen.getByTestId('dt_toggle_language_settings');
        userEvent.click(link);
        expect(mockRootStore.ui.toggleLanguageSettingsModal).toHaveBeenCalled();
    });
});
