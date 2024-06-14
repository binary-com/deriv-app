import React from 'react';
import { isMobileOrTablet, isDesktop } from '@deriv/shared';
import { render, screen } from '@testing-library/react';
import SelfExclusionWrapper from '../self-exclusion-wrapper';
import SelfExclusionContext from '../self-exclusion-context';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobileOrTablet: jest.fn(),
    isDesktop: jest.fn(() => true),
}));

jest.mock('../self-exclusion-article', () => {
    const mockArticle = () => <div>SelfExclusionArticle</div>;
    return mockArticle;
});

describe('<SelfExclusionWrapper />', () => {
    let mock_context = {
        is_app_settings: false,
        is_wrapper_bypassed: false,
        currency: '',
        overlay_ref: document.createElement('div'),
        state: {},
        handleSubmit: jest.fn(),
    };

    beforeEach(() => {
        mock_context = {
            is_app_settings: false,
            is_wrapper_bypassed: false,
            currency: '',
            overlay_ref: document.createElement('div'),
            state: {},
            handleSubmit: jest.fn(),
        };
    });

    it('should render SelfExclusionWrapper component without wrapper', () => {
        mock_context.is_wrapper_bypassed = true;
        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByRole('section-self-exclusion-wrapper')).toHaveClass('da-self-exclusion');
        expect(screen.getByRole('section-self-exclusion-wrapper')).not.toHaveClass('da-self-exclusion__scrollbars');
    });

    it('should render SelfExclusionWrapper mobile component without wrapper', () => {
        mock_context.is_wrapper_bypassed = true;
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('SelfExclusionArticle')).toBeInTheDocument();
        expect(screen.getByRole('section-self-exclusion-wrapper')).toHaveClass('da-self-exclusion');
        expect(screen.getByRole('section-self-exclusion-wrapper')).not.toHaveClass('da-self-exclusion__scrollbars');
    });

    it('should render SelfExclusionWrapper component with wrapper', () => {
        (isMobileOrTablet as jest.Mock).mockReturnValue(false);
        const mock_child = <div>MockChild</div>;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper>{mock_child}</SelfExclusionWrapper>
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('MockChild')).toBeInTheDocument();
        expect(screen.getByText('SelfExclusionArticle')).toBeInTheDocument();
        expect(screen.getByTestId('dt_div_100_vh')).toHaveClass('da-self-exclusion__wrapper');
        expect(screen.getByTestId('dt_themed_scrollbars')).toHaveClass('da-self-exclusion__scrollbars');
    });

    it('should render SelfExclusionWrapper mobile component with wrapper', () => {
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);
        const mock_child = <div>MockChild</div>;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper>{mock_child}</SelfExclusionWrapper>
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('MockChild')).toBeInTheDocument();
        expect(screen.getAllByText('SelfExclusionArticle')).toHaveLength(2);
        expect(screen.getByTestId('dt_div_100_vh')).toHaveClass('da-self-exclusion__wrapper');
        expect(screen.getByTestId('dt_div_100_vh')).not.toHaveClass('da-self-exclusion__scrollbars');
    });
});
