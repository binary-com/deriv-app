import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { TWebSocket } from 'Types';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Draggable from '../draggable';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

const mock_close = jest.fn();

const setBoundary = () => {
    // eslint-disable-next-line testing-library/no-node-access
    jest.spyOn(document.querySelector('.main') as Element, 'getBoundingClientRect').mockReturnValue({
        width: 1920,
        height: 1080,
        top: 0,
        left: 0,
        right: 1920,
        bottom: 1080,
        x: 0,
        y: 0,
        toJSON: () => ({ width: 1920, height: 1080, top: 0, left: 0, right: 1920, bottom: 1080, x: 0, y: 0 }),
    });
};

const resizeContainer = ({
    wrapper,
    xMove,
    yMove,
    handler,
    initX = 0,
    initY = 0,
}: {
    wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    xMove: number;
    yMove: number;
    handler: string;
    initX?: number;
    initY?: number;
}) => {
    render(
        <Draggable
            onClose={mock_close}
            minHeight={20}
            minWidth={20}
            initialValues={{
                width: 20,
                height: 20,
                xAxis: initX,
                yAxis: initY,
            }}
            boundary='.main'
            enableResizing
        >
            <div>Test</div>
        </Draggable>,
        { wrapper }
    );
    setBoundary();
    const resizable_handler = screen.getByTestId(`dt_resizable-handle__${handler}`);
    fireEvent.keyDown(resizable_handler, { key: 'Enter' });
    fireEvent.mouseDown(resizable_handler);
    fireEvent.mouseMove(resizable_handler, { clientX: xMove, clientY: yMove });
    fireEvent.mouseUp(resizable_handler);
};

describe('Draggable', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_websocket = mock_ws as unknown as TWebSocket;

    beforeEach(() => {
        jest.resetModules();
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_websocket);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <div
                style={{
                    width: '1920px',
                    height: '1080px',
                    margin: '0',
                    padding: '0',
                }}
                className='main'
            >
                <StoreProvider store={mock_store}>
                    <DBotStoreProvider ws={mock_websocket} mock={mock_DBot_store}>
                        {children}
                    </DBotStoreProvider>
                </StoreProvider>
            </div>
        );
    });

    it('should render Draggable', () => {
        render(
            <Draggable>
                <div>Test</div>
            </Draggable>,
            { wrapper }
        );
        expect(screen.getByTestId('dt_react_draggable')).toBeInTheDocument();
    });

    it('should call onClose function on close button click', () => {
        render(
            <Draggable onClose={mock_close}>
                <div>Test</div>
            </Draggable>,
            { wrapper }
        );

        const close_btn = screen.getByTestId('dt_react_draggable-close-modal');
        fireEvent.click(close_btn);

        expect(mock_close).toBeCalled();
    });

    it('should change styles on the left and top by drag', () => {
        render(
            <Draggable
                onClose={mock_close}
                minHeight={20}
                minWidth={20}
                initialValues={{
                    width: 20,
                    height: 20,
                    xAxis: 0,
                    yAxis: 0,
                }}
                boundary='.main'
            >
                <div>Test</div>
            </Draggable>,
            { wrapper }
        );

        setBoundary();

        const draggable_container = screen.getByTestId('dt_react_draggable');
        const draggable_handler = screen.getByTestId('dt_react_draggable_handler');

        fireEvent.mouseDown(draggable_handler);
        fireEvent.mouseMove(draggable_handler, { clientX: 10, clientY: 10 });
        fireEvent.mouseUp(draggable_handler);

        expect(draggable_container).toHaveStyle('left: 10px');
        expect(draggable_container).toHaveStyle('top: 10px');
    });

    it('should change the z-index value by 3 on enter and on mousedown on the draggable container', () => {
        render(
            <Draggable
                onClose={mock_close}
                minHeight={20}
                minWidth={20}
                initialValues={{
                    width: 20,
                    height: 20,
                    xAxis: 0,
                    yAxis: 0,
                }}
                boundary='.main'
            >
                <div>Test</div>
            </Draggable>,
            { wrapper }
        );
        const draggable_container = screen.getByTestId('dt_react_draggable');
        const previouse_z_index = draggable_container.style.getPropertyValue('z-index');
        const draggable_handler = screen.getByTestId('dt_react_draggable_handler');
        fireEvent.keyDown(draggable_handler, { key: 'Enter' });
        expect(draggable_container).toHaveStyle(`z-index: ${Number(previouse_z_index) + 3}`);
        fireEvent.mouseUp(draggable_handler);
        fireEvent.mouseDown(draggable_container);
        expect(draggable_container).toHaveStyle(`z-index: ${Number(previouse_z_index) + 6}`);
        fireEvent.mouseUp(draggable_container);
    });

    it('should change width and height accordingly on resizing from bottom right', () => {
        resizeContainer({ wrapper, xMove: 50, yMove: 50, handler: 'bottom-right' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 70px');
        expect(draggable_container).toHaveStyle('height: 70px');
    });

    it('should change width and height accordingly on resizing from top right', () => {
        resizeContainer({ wrapper, xMove: 50, yMove: 50, handler: 'top-right' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 70px');
        expect(draggable_container).toHaveStyle('height: 20px');
    });

    it('should change width and height accordingly on resizing from top left', () => {
        resizeContainer({ wrapper, xMove: 50, yMove: 50, handler: 'top-left' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 20px');
        expect(draggable_container).toHaveStyle('height: 20px');
    });

    it('should change width and height accordingly on resizing from bottom left', () => {
        resizeContainer({ wrapper, xMove: 50, yMove: 50, handler: 'bottom-left' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 20px');
        expect(draggable_container).toHaveStyle('height: 70px');
    });

    it('should change height on resizing from top', () => {
        resizeContainer({ wrapper, xMove: 50, yMove: 50, handler: 'top' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 20px');
        expect(draggable_container).toHaveStyle('height: 20px');
    });

    it('should change height on resizing from bottom', () => {
        resizeContainer({ wrapper, xMove: 50, yMove: 50, handler: 'bottom' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 20px');
        expect(draggable_container).toHaveStyle('height: 70px');
    });

    it('should change width on resizing from left', () => {
        resizeContainer({ wrapper, xMove: 50, yMove: 50, handler: 'left' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 20px');
        expect(draggable_container).toHaveStyle('height: 20px');
    });

    it('should change width on resizing from right', () => {
        resizeContainer({ wrapper, xMove: 50, yMove: 50, handler: 'right' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 70px');
        expect(draggable_container).toHaveStyle('height: 20px');
    });

    it('should not change width and height if mouse goes out of the window - resizing from bottom right', () => {
        resizeContainer({ wrapper, initX: 500, initY: 500, xMove: -500, yMove: -500, handler: 'bottom-right' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 20px;');
        expect(draggable_container).toHaveStyle('height: 20px;');
    });

    it('should not change width and height if mouse goes out of the window - resizing from top left', () => {
        resizeContainer({ wrapper, initX: 500, initY: 500, xMove: 2000, yMove: 2000, handler: 'top-left' });
        const draggable_container = screen.getByTestId('dt_react_draggable_content');
        expect(draggable_container).toHaveStyle('width: 20px;');
        expect(draggable_container).toHaveStyle('height: 20px;');
    });
});
