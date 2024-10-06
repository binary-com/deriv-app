import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnboardingGuide from '../onboarding-guide';

const trading_modal_text = 'Welcome to the new Deriv Trader';
const positions_modal_text = 'View your positions';
const guide_container = 'GuideContainer';
const localStorage_key = 'guide_dtrader_v2';

jest.mock('../guide-container', () =>
    jest.fn(({ should_run }: { should_run?: boolean }) => <div>{should_run && guide_container}</div>)
);
jest.mock('../onboarding-video', () => jest.fn(() => <div>OnboardingVideo</div>));

describe('OnboardingGuide', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should render Modal with correct content for trading page after 800ms after mounting', async () => {
        jest.useFakeTimers();
        render(<OnboardingGuide />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.getByText('OnboardingVideo')).toBeInTheDocument();
        expect(screen.getByText(trading_modal_text)).toBeInTheDocument();
        expect(screen.getByText("Let's begin")).toBeInTheDocument();

        jest.useRealTimers();
    });

    it('should render Modal with correct content for positions page after 800ms after mounting', async () => {
        jest.useFakeTimers();
        render(<OnboardingGuide type='positions_page' />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.getByText('OnboardingVideo')).toBeInTheDocument();
        expect(screen.getByText(positions_modal_text)).toBeInTheDocument();
        expect(screen.getByText('Got it')).toBeInTheDocument();

        jest.useRealTimers();
    });

    it('should close the Modal for trading page and start the guide after user clicks on "Let\'s begin" button', async () => {
        jest.useFakeTimers();
        render(<OnboardingGuide />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.getByText(trading_modal_text)).toBeInTheDocument();
        expect(screen.queryByText(guide_container)).not.toBeInTheDocument();

        userEvent.click(screen.getByRole('button'));
        await waitFor(() => jest.advanceTimersByTime(300));

        expect(screen.queryByText(trading_modal_text)).not.toBeInTheDocument();
        expect(screen.getByText(guide_container)).toBeInTheDocument();

        jest.useRealTimers();
    });

    it('should close the Modal for positions page, set flag to localStorage equal to true and do NOT start the guide after user clicks on "Got it" button', async () => {
        const field = 'positions_page';
        jest.useFakeTimers();
        render(<OnboardingGuide type='positions_page' />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.getByText(positions_modal_text)).toBeInTheDocument();
        expect(screen.queryByText(guide_container)).not.toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem(localStorage_key) as string)[field]).toBe(false);

        userEvent.click(screen.getByRole('button'));
        await waitFor(() => jest.advanceTimersByTime(300));

        expect(screen.queryByText(positions_modal_text)).not.toBeInTheDocument();
        expect(screen.queryByText(guide_container)).not.toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem(localStorage_key) as string)[field]).toBe(true);

        jest.useRealTimers();
    });

    it('should close the Modal for trading page and set flag to localStorage equal to true if user clicks on overlay and do NOT start the guide', async () => {
        const field = 'trade_page';
        jest.useFakeTimers();
        render(<OnboardingGuide />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.getByText(trading_modal_text)).toBeInTheDocument();
        expect(screen.queryByText(guide_container)).not.toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem(localStorage_key) as string)[field]).toBe(false);

        userEvent.click(screen.getByTestId('dt-actionsheet-overlay'));
        await waitFor(() => jest.advanceTimersByTime(300));

        expect(screen.queryByText(trading_modal_text)).not.toBeInTheDocument();
        expect(screen.queryByText(guide_container)).not.toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem(localStorage_key) as string)[field]).toBe(true);

        jest.useRealTimers();
    });

    it('should execute callback function after Modal is closed', async () => {
        const callback = jest.fn();
        jest.useFakeTimers();
        render(<OnboardingGuide callback={callback} type='positions_page' />);

        await waitFor(() => jest.advanceTimersByTime(800));

        expect(screen.getByText(positions_modal_text)).toBeInTheDocument();
        expect(screen.queryByText(guide_container)).not.toBeInTheDocument();

        userEvent.click(screen.getByRole('button'));
        await waitFor(() => jest.advanceTimersByTime(300));

        expect(callback).toBeCalled();

        jest.useRealTimers();
    });
});
