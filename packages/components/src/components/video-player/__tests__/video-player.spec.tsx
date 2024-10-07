import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import VideoPlayer from '../video-player';
import userEvent from '@testing-library/user-event';

type TMockedStreamProps = {
    onEnded: () => void;
    onPlay: () => void;
    onLoadedMetaData: () => void;
    streamRef: React.MutableRefObject<HTMLVideoElement>;
    src: string;
};

const default_playback_rate = 'Normal';
const player_data_testid = 'dt_video_player';
const video_data_testid = 'dt_video';
const icon_play = 'IcPlay';
const icon_pause = 'IcPause';
const icon_replay = 'IcReplay';
const faster_playback_rate = '1.5x';

const mocked_props: React.ComponentProps<typeof VideoPlayer> = {
    data_testid: player_data_testid,
    src: 'test_src',
};

jest.mock('../../icon', () => ({
    __esModule: true,
    default: jest.fn(({ icon }: { icon: string }) => <div>{icon}</div>),
}));

jest.mock('@cloudflare/stream-react', () => ({
    ...jest.requireActual('@cloudflare/stream-react'),
    Stream: jest.fn(({ onEnded, onPlay, onLoadedMetaData, streamRef, src }: TMockedStreamProps) => (
        <video
            data-testid={video_data_testid}
            onClick={onEnded}
            onLoadedData={onLoadedMetaData}
            onPlay={onPlay}
            src={src}
            ref={() => {
                streamRef.current = {
                    duration: 50,
                    currentTime: 0,
                    pause: () => undefined,
                    play: () => Promise.resolve(),
                } as HTMLVideoElement;
            }}
        />
    )),
}));

describe('<VideoPlayer />', () => {
    const original_user_agent = window.navigator.userAgent;

    beforeAll(() => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            configurable: true,
        });
    });

    afterAll(() => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: original_user_agent,
            configurable: true,
        });
    });

    it('should render the component on desktop', async () => {
        render(<VideoPlayer {...mocked_props} />);
        const video = screen.getByTestId(video_data_testid);
        fireEvent.loadedData(video);
        expect(screen.getByTestId(player_data_testid)).toBeInTheDocument();

        const playback_rate = screen.getByText(default_playback_rate);
        await userEvent.click(playback_rate);
        const new_playback_rate = screen.getByText(faster_playback_rate);
        await userEvent.click(new_playback_rate);
        expect(screen.getAllByText(faster_playback_rate)).toHaveLength(2);

        const pause_button = screen.getByText(icon_pause);
        await userEvent.click(pause_button);
        expect(screen.queryByText(icon_pause)).not.toBeInTheDocument();
        expect(screen.getByText(icon_play)).toBeInTheDocument();

        const player_progress_bar = screen.getByTestId('dt_progress_bar');
        expect(player_progress_bar).toBeInTheDocument();
        await userEvent.click(player_progress_bar);
        expect(screen.getByText(icon_play)).toBeInTheDocument();
    });
    it('should render the component for mobile browsers except for Safari', async () => {
        render(<VideoPlayer {...mocked_props} is_mobile />);
        const video = screen.getByTestId(video_data_testid);
        fireEvent.loadedData(video);
        expect(screen.getByTestId(player_data_testid)).toBeInTheDocument();

        const pause_button = screen.getByText(icon_pause);
        await userEvent.click(pause_button);
        expect(screen.queryByText(icon_pause)).not.toBeInTheDocument();
        expect(screen.getByText(icon_play)).toBeInTheDocument();

        // a tap upon replay overlay on mobile should not resume playing while the video is not ended:
        const replay_button = screen.getByText(icon_replay);
        expect(replay_button).toBeInTheDocument();
        await userEvent.click(replay_button);
        expect(screen.getByText(icon_play)).toBeInTheDocument();
    });
    it('should render the component on mobile for Safari', () => {
        Object.defineProperty(window.navigator, 'userAgent', {
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
            configurable: true,
        });
        render(<VideoPlayer {...mocked_props} is_mobile />);
        const video = screen.getByTestId(video_data_testid);
        fireEvent.loadedData(video);
        expect(screen.getByTestId(player_data_testid)).toBeInTheDocument();

        const play_button = screen.getByText(icon_play);
        expect(play_button).toBeInTheDocument();
    });
    it('should not resume playing if user taps upon replay overlay while the video is not ended', async () => {
        render(<VideoPlayer {...mocked_props} />);
        const video = screen.getByTestId(video_data_testid);
        fireEvent.loadedData(video);
        await userEvent.click(video);
        expect(screen.getByText(icon_play)).toBeInTheDocument();

        const replay_button = screen.getByText(icon_replay);
        expect(replay_button).toBeInTheDocument();
        await userEvent.click(replay_button);
        expect(screen.getByText(icon_play)).toBeInTheDocument();
    });
});
