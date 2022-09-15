import * as React from 'react';
// Todo: After upgrading to react 18 we should use @testing-library/react-hooks instead.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useCountdown, { TCountdownOptions } from '../useCountdown';

jest.setTimeout(10000);

const UseCountdownExample = (props: TCountdownOptions) => {
    const counter = useCountdown(props);

    return (
        <React.Fragment>
            <p data-testid={'count'}>{counter.count}</p>
            <p data-testid={'is_running'}>{counter.is_running ? 'true' : 'false'}</p>
            <button data-testid={'start'} onClick={counter.start}>
                start
            </button>
            <button data-testid={'pause'} onClick={counter.pause}>
                pause
            </button>
            <button data-testid={'stop'} onClick={counter.stop}>
                stop
            </button>
            <button data-testid={'reset'} onClick={counter.reset}>
                reset
            </button>
        </React.Fragment>
    );
};

describe('useCountdown', () => {
    test('should have initial count of 10 and is_running of false', () => {
        render(<UseCountdownExample from={10} />);

        const count = screen.getByTestId('count');
        const is_running = screen.getByTestId('is_running');

        expect(count).toHaveTextContent('10');
        expect(is_running).toHaveTextContent('false');
    });

    test('should count down from 5 to 0 after start is called and stop once finished', async () => {
        render(<UseCountdownExample from={5} />);

        const count = screen.getByTestId('count');
        const is_running = screen.getByTestId('is_running');
        const start = screen.getByTestId('start');

        expect(count).toHaveTextContent('5');
        expect(is_running).toHaveTextContent('false');
        userEvent.click(start);
        await waitFor(() => expect(is_running).toHaveTextContent('true'));
        await waitFor(() => expect(count).toHaveTextContent('4'));
        await waitFor(() => expect(count).toHaveTextContent('3'));
        await waitFor(() => expect(count).toHaveTextContent('2'));
        await waitFor(() => expect(count).toHaveTextContent('1'));
        await waitFor(() => expect(count).toHaveTextContent('0'));
        await waitFor(() => expect(is_running).toHaveTextContent('false'));
    });

    test('should count down from 2 to -2 after start is called and stop once finished', async () => {
        render(<UseCountdownExample from={2} to={-2} />);

        const count = screen.getByTestId('count');
        const is_running = screen.getByTestId('is_running');
        const start = screen.getByTestId('start');

        expect(count).toHaveTextContent('2');
        expect(is_running).toHaveTextContent('false');
        userEvent.click(start);
        await waitFor(() => expect(is_running).toHaveTextContent('true'));
        await waitFor(() => expect(count).toHaveTextContent('1'));
        await waitFor(() => expect(count).toHaveTextContent('0'));
        await waitFor(() => expect(count).toHaveTextContent('-1'));
        await waitFor(() => expect(count).toHaveTextContent('-2'));
        await waitFor(() => expect(is_running).toHaveTextContent('false'));
    });

    test('should count down from -2 to 2 after start is called and stop once finished', async () => {
        render(<UseCountdownExample from={-2} to={2} increment />);

        const count = screen.getByTestId('count');
        const is_running = screen.getByTestId('is_running');
        const start = screen.getByTestId('start');

        expect(count).toHaveTextContent('-2');
        expect(is_running).toHaveTextContent('false');
        userEvent.click(start);
        await waitFor(() => expect(is_running).toHaveTextContent('true'));
        await waitFor(() => expect(count).toHaveTextContent('-1'));
        await waitFor(() => expect(count).toHaveTextContent('0'));
        await waitFor(() => expect(count).toHaveTextContent('1'));
        await waitFor(() => expect(count).toHaveTextContent('2'));
        await waitFor(() => expect(is_running).toHaveTextContent('false'));
    });

    test('should count down from 3 to 0 after start is called and reset the counter at 1 and stop once finished', async () => {
        render(<UseCountdownExample from={3} />);

        const count = screen.getByTestId('count');
        const is_running = screen.getByTestId('is_running');
        const start = screen.getByTestId('start');
        const reset = screen.getByTestId('reset');

        expect(count).toHaveTextContent('3');
        expect(is_running).toHaveTextContent('false');
        userEvent.click(start);
        await waitFor(() => expect(is_running).toHaveTextContent('true'));
        await waitFor(() => expect(count).toHaveTextContent('2'));
        await waitFor(() => expect(count).toHaveTextContent('1'));
        userEvent.click(reset);
        await waitFor(() => expect(count).toHaveTextContent('3'));
        await waitFor(() => expect(count).toHaveTextContent('2'));
        await waitFor(() => expect(count).toHaveTextContent('1'));
        await waitFor(() => expect(count).toHaveTextContent('0'));
        await waitFor(() => expect(is_running).toHaveTextContent('false'));
    });

    test('should count down from 3 to 0 after start is called and pause the counter at 1', async () => {
        render(<UseCountdownExample from={3} />);

        const count = screen.getByTestId('count');
        const is_running = screen.getByTestId('is_running');
        const start = screen.getByTestId('start');
        const pause = screen.getByTestId('pause');

        expect(count).toHaveTextContent('3');
        expect(is_running).toHaveTextContent('false');
        userEvent.click(start);
        await waitFor(() => expect(is_running).toHaveTextContent('true'));
        await waitFor(() => expect(count).toHaveTextContent('2'));
        await waitFor(() => expect(count).toHaveTextContent('1'));
        userEvent.click(pause);
        await waitFor(() => expect(count).toHaveTextContent('1'));
        await waitFor(() => expect(is_running).toHaveTextContent('false'));
    });

    test('should count down from 3 to 0 after start is called and stop the counter at 1', async () => {
        render(<UseCountdownExample from={3} />);

        const count = screen.getByTestId('count');
        const is_running = screen.getByTestId('is_running');
        const start = screen.getByTestId('start');
        const stop = screen.getByTestId('stop');

        expect(count).toHaveTextContent('3');
        expect(is_running).toHaveTextContent('false');
        userEvent.click(start);
        await waitFor(() => expect(is_running).toHaveTextContent('true'));
        await waitFor(() => expect(count).toHaveTextContent('2'));
        await waitFor(() => expect(count).toHaveTextContent('1'));
        userEvent.click(stop);
        await waitFor(() => expect(count).toHaveTextContent('3'));
        await waitFor(() => expect(is_running).toHaveTextContent('false'));
    });
});
