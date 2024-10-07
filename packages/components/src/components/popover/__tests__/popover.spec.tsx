import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import userEvent from '@testing-library/user-event';
import Popover from '../popover';
import Icon from '../../icon';
import { MAX_MOBILE_WIDTH } from '../../../hooks';

const blue_info_icon = 'IcInfoBlue';
const children = 'Children';
const relative_container_testid = 'dt_popover_relative_container';
const target_info_icon = 'IcInfoOutline';
const tooltip_message = 'Information about item.';

const default_mocked_props = {
    alignment: 'left',
    className: 'test-tooltip',
    classNameBubble: 'test-popover',
    icon: 'info',
    id: 'test_popover',
    is_bubble_hover_enabled: true,
    message: tooltip_message,
    onBubbleClose: jest.fn(),
    onBubbleOpen: jest.fn(),
} as React.ComponentProps<typeof Popover>;

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('../../icon', () =>
    jest.fn((props: React.ComponentProps<typeof Icon>) => <div data-testid='mocked_icon'>{props.icon}</div>)
);

describe('<Popover/>', () => {
    const mockPopover = (mocked_props = default_mocked_props) => {
        return <Popover {...mocked_props}>{children}</Popover>;
    };
    it('should render an info icon, display tooltip on hover/click, hide only after unfocusing in desktop', async () => {
        render(mockPopover());
        const info_icon = screen.getByText(target_info_icon);
        expect(info_icon).toBeInTheDocument();
        expect(screen.queryByText(tooltip_message)).not.toBeInTheDocument();
        await userEvent.hover(info_icon);
        expect(screen.getByText(blue_info_icon)).toBeInTheDocument();
        expect(screen.getByText(tooltip_message)).toBeInTheDocument();
        await userEvent.click(info_icon);
        expect(screen.getByText(blue_info_icon)).toBeInTheDocument();
        expect(screen.getByText(tooltip_message)).toBeInTheDocument();
        await userEvent.unhover(info_icon);
        expect(screen.queryByText(blue_info_icon)).not.toBeInTheDocument();
        expect(screen.queryByText(tooltip_message)).not.toBeInTheDocument();
    });
    it('should render a question icon, display tooltip upon tap & hide it upon the second tap on mobile', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(mockPopover({ ...default_mocked_props, icon: 'question' }));
        const unknown_icon = screen.getByText('IcUnknown');
        expect(unknown_icon).toBeInTheDocument();
        expect(screen.queryByText(tooltip_message)).not.toBeInTheDocument();
        await userEvent.click(unknown_icon);
        expect(screen.queryByText(blue_info_icon)).not.toBeInTheDocument();
        expect(screen.getByText(tooltip_message)).toBeInTheDocument();
        await userEvent.click(unknown_icon);
        expect(screen.queryByText(tooltip_message)).not.toBeInTheDocument();
    });
    it('should render controlled popover with open tooltip when is_open === true & should call onClick when target is clicked', async () => {
        const onClick = jest.fn();
        render(mockPopover({ ...default_mocked_props, icon: 'dot', is_open: true, onClick }));
        const circle_icon = screen.getByText('IcCircle');
        expect(circle_icon).toBeInTheDocument();
        expect(screen.getByText(tooltip_message)).toBeInTheDocument();
        await userEvent.click(circle_icon);
        expect(onClick).toBeCalled();
    });
    it('should render a counter instead of an icon when counter is provided & icon === counter', () => {
        render(mockPopover({ ...default_mocked_props, icon: 'counter', counter: 5 }));
        expect(screen.getByText('5')).toBeInTheDocument();
    });
    it('should hide the target icon when disable_target_icon === true', () => {
        render(mockPopover({ ...default_mocked_props, disable_target_icon: true }));
        expect(screen.queryByText(target_info_icon)).not.toBeInTheDocument();
        expect(screen.getByText(children)).toBeInTheDocument();
    });
    it('should hide a blue info icon inside the tooltip when disable_message_icon === true', () => {
        render(
            mockPopover({
                ...default_mocked_props,
                disable_message_icon: true,
                is_open: true,
                onClick: jest.fn(),
            })
        );
        expect(screen.getByText(target_info_icon)).toBeInTheDocument();
        expect(screen.queryByText(blue_info_icon)).not.toBeInTheDocument();
    });
    it('should not open tooltip when message is undefined', async () => {
        render(mockPopover({ ...default_mocked_props, message: undefined }));

        const info_icon = screen.getByText(target_info_icon);
        expect(info_icon).toBeInTheDocument();
        const message = screen.queryByText(tooltip_message);
        expect(message).not.toBeInTheDocument();
        await userEvent.hover(info_icon);
        expect(screen.queryByText(blue_info_icon)).not.toBeInTheDocument();
        expect(message).not.toBeInTheDocument();
    });
    it('should call onBubbleOpen when bubble is hovered & onBubbleClose when bubble is unhovered in controlled popover', async () => {
        const onBubbleClose = jest.fn();
        const onBubbleOpen = jest.fn();
        render(
            mockPopover({
                ...default_mocked_props,
                is_open: true,
                onBubbleClose,
                onBubbleOpen,
                onClick: jest.fn(),
            })
        );
        const message = screen.getByText(tooltip_message);
        await userEvent.hover(message);
        expect(onBubbleOpen).toBeCalled();
        await userEvent.unhover(message);
        expect(onBubbleClose).toBeCalled();
    });
    it('should call onBubbleOpen when bubble is focused & onBubbleClose when bubble is unfocused in uncontrolled popover in mobile', async () => {
        window.innerWidth = MAX_MOBILE_WIDTH;
        const onBubbleClose = jest.fn();
        const onBubbleOpen = jest.fn();
        render(mockPopover({ ...default_mocked_props, onBubbleClose, onBubbleOpen }));
        const info_icon = screen.getByText(target_info_icon);
        await userEvent.click(info_icon);
        const message = screen.getByText(tooltip_message);
        expect(message).toBeInTheDocument();
        await userEvent.hover(message);
        expect(onBubbleOpen).toBeCalled();
        await userEvent.unhover(message);
        expect(onBubbleClose).toBeCalled();
    });
    it('should render relative container when relative_render === true', () => {
        render(mockPopover({ ...default_mocked_props, relative_render: true, is_open: true }));
        const relative_container = screen.getByTestId(relative_container_testid);
        expect(within(relative_container).getByText(tooltip_message)).toBeInTheDocument();
    });
    it('should render relative container with an error message', () => {
        const error_message = 'Error message.';
        render(
            mockPopover({
                ...default_mocked_props,
                relative_render: true,
                is_open: true,
                has_error: true,
                message: error_message,
            })
        );
        const relative_container = screen.getByTestId(relative_container_testid);
        expect(within(relative_container).getByText(error_message)).toBeInTheDocument();
    });
});
