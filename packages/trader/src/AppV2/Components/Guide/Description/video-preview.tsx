import React from 'react';
import { Stream } from '@cloudflare/stream-react';
import { CaptionText } from '@deriv-com/quill-ui';
import { LabelPairedPlayMdFillIcon } from '@deriv/quill-icons';
import { Localize, localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';

type TVideoPreview = {
    contract_type: string;
    toggleVideoPlayer: () => void;
    video_src: string;
};

const VideoPreview = ({ contract_type, toggleVideoPlayer, video_src }: TVideoPreview) => {
    if (contract_type === CONTRACT_LIST.TURBOS) return null;

    return (
        <div className='guide-video__wrapper'>
            <div
                className='guide-video__preview'
                data-testid='dt_video_preview'
                onClick={toggleVideoPlayer}
                onKeyDown={toggleVideoPlayer}
            >
                <Stream
                    autoplay={false}
                    controls={false}
                    className='guide-video'
                    letterboxColor='transparent'
                    muted
                    preload='auto'
                    responsive={false}
                    src={video_src}
                    width='112px'
                    height='73px'
                />
                <div className='guide-video__preview__icon__wrapper'>
                    <LabelPairedPlayMdFillIcon className='guide-video__preview__icon' />
                </div>
            </div>
            <div className='guide-video__description'>
                <CaptionText bold color='quill-typography__color--default'>
                    {localize(`How to trade ${contract_type}?`)}
                </CaptionText>
                <CaptionText>
                    <Localize i18n_default_text='Watch this video to learn about this trade type.' />
                </CaptionText>
            </div>
        </div>
    );
};

export default VideoPreview;
