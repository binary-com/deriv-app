import React from 'react';
import { screen, render } from '@testing-library/react';
import LanguageLink, { TLanguageLink } from '../language-link';

jest.mock('@deriv/components', () => ({
    Icon: jest.fn(({ icon_classname }) => <div data-testid='dt_mocked_icon' className={icon_classname} />),
}));

describe('LanguageLink component', () => {
    const mock_props: TLanguageLink = {
        is_active: false,
        lang: 'ID',
    };

    it('should render language link with active classname without active classname when not active', () => {
        render(<LanguageLink {...mock_props} />);

        expect(screen.getByText('Indonesian')).toBeInTheDocument();
        expect(screen.getByTestId('dt_mocked_icon')).toBeInTheDocument();

        const language_link = screen.getByTestId(`dt_settings_${mock_props.lang}_button`);
        expect(language_link).toBeInTheDocument();
        expect(language_link).not.toHaveClass('settings-language__language-link--active');
    });

    it('should render language link with active classname when active', () => {
        mock_props.is_active = true;
        mock_props.lang = 'FR';

        render(<LanguageLink {...mock_props} />);

        expect(screen.getByText('Français')).toBeInTheDocument();
        expect(screen.getByTestId('dt_mocked_icon')).toBeInTheDocument();

        const language_link = screen.getByTestId(`dt_settings_${mock_props.lang}_button`);
        expect(language_link).toBeInTheDocument();
        expect(language_link).toHaveClass('settings-language__language-link--active');
    });
});
