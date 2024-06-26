import React from 'react';
import { render, screen } from '@testing-library/react';
import SelfExclusionWrapper from '../self-exclusion-wrapper';
import SelfExclusionContext from '../self-exclusion-context';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
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

    it('should render SelfExclusionWrapper responsive component without wrapper', () => {
        mock_context.is_wrapper_bypassed = true;
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });

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

    it('should render SelfExclusionWrapper responsive component with wrapper', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isDesktop: false });
        const mock_child = <div>MockChild</div>;

        render(
            <SelfExclusionContext.Provider value={mock_context}>
                <SelfExclusionWrapper>{mock_child}</SelfExclusionWrapper>
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('MockChild')).toBeInTheDocument();
        expect(screen.getByText('SelfExclusionArticle')).toBeInTheDocument();
        expect(screen.getByTestId('dt_div_100_vh')).toHaveClass('da-self-exclusion__wrapper');
        expect(screen.getByTestId('dt_div_100_vh')).not.toHaveClass('da-self-exclusion__scrollbars');
    });
});
