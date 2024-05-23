import React from 'react';
import { render, screen } from '@testing-library/react';
import Tooltip from '../Tooltip';

const WrappedComponent = () => <div>WrappedComponent</div>;

describe('Tooltip', () => {
    type TTooltipProps = React.ComponentProps<typeof Tooltip>;
    const tooltipMessage = 'Test tooltip message';
    const baseMockProps: TTooltipProps = {
        isVisible: true,
        message: tooltipMessage,
    };
    it('should not be visible if isVisible=false', () => {
        const mockProps: TTooltipProps = {
            ...baseMockProps,
            isVisible: false,
        };
        render(
            <Tooltip {...mockProps}>
                <WrappedComponent />
            </Tooltip>
        );
        expect(screen.queryByText('WrappedComponent')).toBeInTheDocument();
        expect(screen.queryByText(tooltipMessage)).not.toBeInTheDocument();
    });
    it('should be visible if isVisible=true', () => {
        const mockProps: TTooltipProps = {
            ...baseMockProps,
        };
        render(
            <Tooltip {...mockProps}>
                <WrappedComponent />
            </Tooltip>
        );
        expect(screen.queryByText('WrappedComponent')).toBeInTheDocument();
        expect(screen.queryByText(tooltipMessage)).toBeInTheDocument();
    });
    it('should have "left" CSS modifier by default', () => {
        const mockProps: TTooltipProps = {
            ...baseMockProps,
        };
        render(
            <Tooltip {...mockProps}>
                <WrappedComponent />
            </Tooltip>
        );
        expect(screen.queryByText('WrappedComponent')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tooltip_content')).toHaveClass('wallets-tooltip__content--left');
    });
    it('should have "left" CSS modifier if alignment="left"', () => {
        const mockProps: TTooltipProps = {
            ...baseMockProps,
            alignment: 'left',
        };
        render(
            <Tooltip {...mockProps}>
                <WrappedComponent />
            </Tooltip>
        );
        expect(screen.queryByText('WrappedComponent')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tooltip_content')).toHaveClass('wallets-tooltip__content--left');
    });
    it('should have "bottom" CSS modifier if alignment="bottom"', () => {
        const mockProps: TTooltipProps = {
            ...baseMockProps,
            alignment: 'bottom',
        };
        render(
            <Tooltip {...mockProps}>
                <WrappedComponent />
            </Tooltip>
        );
        expect(screen.queryByText('WrappedComponent')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tooltip_content')).toHaveClass('wallets-tooltip__content--bottom');
    });
    it('should have "right" CSS modifier if alignment="right"', () => {
        const mockProps: TTooltipProps = {
            ...baseMockProps,
            alignment: 'right',
        };
        render(
            <Tooltip {...mockProps}>
                <WrappedComponent />
            </Tooltip>
        );
        expect(screen.queryByText('WrappedComponent')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tooltip_content')).toHaveClass('wallets-tooltip__content--right');
    });
    it('should have "top" CSS modifier if alignment="top"', () => {
        const mockProps: TTooltipProps = {
            ...baseMockProps,
            alignment: 'top',
        };
        render(
            <Tooltip {...mockProps}>
                <WrappedComponent />
            </Tooltip>
        );
        expect(screen.queryByText('WrappedComponent')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tooltip_content')).toHaveClass('wallets-tooltip__content--top');
    });
    it("should have a class applied if it's passed as className prop", () => {
        const mockProps: TTooltipProps = {
            ...baseMockProps,
            className: 'test-class',
        };
        render(
            <Tooltip {...mockProps}>
                <WrappedComponent />
            </Tooltip>
        );
        expect(screen.queryByText('WrappedComponent')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tooltip_content')).toHaveClass('test-class');
    });
});
