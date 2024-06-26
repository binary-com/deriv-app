import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SelfExclusionArticle from '../self-exclusion-article';
import SelfExclusionContext from '../self-exclusion-context';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('Components/self-exclusion/self-exclusion-article-content', () => ({
    ...jest.requireActual('Components/self-exclusion/self-exclusion-article-content'),
}));

describe('<SelfExclusionArticle />', () => {
    let mock_self_exclusion_context = {
        is_app_settings: false,
        is_eu: false,
        currency: '',
        overlay_ref: document.createElement('div'),
        toggleArticle: jest.fn(),
        handleSubmit: jest.fn(),
    };

    const store = mockStore({});

    const eu_item =
        /these trading limits and self-exclusion help you control the amount of money and time you spend on deriv.com and exercise/i;
    const non_eu_item =
        /these self-exclusion limits help you control the amount of money and time you spend trading on deriv trader, deriv bot, smarttrader and binary bot on deriv. the limits you set here will help you exercise/i;

    beforeEach(() => {
        mock_self_exclusion_context = {
            is_app_settings: false,
            is_eu: false,
            currency: '',
            overlay_ref: document.createElement('div'),
            toggleArticle: jest.fn(),
            handleSubmit: jest.fn(),
        };
    });

    it('should render SelfExclusionArticle with selfExclusionArticleItems', () => {
        render(
            <StoreProvider store={store}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </StoreProvider>
        );

        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).toBeInTheDocument();
    });

    it('should render SelfExclusionArticle for EU items', () => {
        mock_self_exclusion_context.is_eu = true;

        render(
            <StoreProvider store={store}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </StoreProvider>
        );

        expect(screen.getByText(eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(non_eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle for non EU items', () => {
        render(
            <StoreProvider store={store}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </StoreProvider>
        );

        expect(screen.getByText(non_eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionArticle component and trigger click', () => {
        const mockToggleArticle = mock_self_exclusion_context.toggleArticle;

        render(
            <StoreProvider store={store}>
                <SelfExclusionContext.Provider value={mock_self_exclusion_context}>
                    <SelfExclusionArticle />
                </SelfExclusionContext.Provider>
            </StoreProvider>
        );

        expect(screen.getByText(non_eu_item)).toBeInTheDocument();
        expect(screen.getByText('Trading limits and self-exclusion')).toBeInTheDocument();
        expect(screen.queryByText(eu_item)).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Learn more'));
        expect(mockToggleArticle).toHaveBeenCalledTimes(1);
    });
});
