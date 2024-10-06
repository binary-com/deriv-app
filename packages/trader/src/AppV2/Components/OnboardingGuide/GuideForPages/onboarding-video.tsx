import React from 'react';
import clsx from 'clsx';
import { Skeleton } from '@deriv-com/quill-ui';
import { getUrlBase } from '@deriv/shared';
import { Localize } from '@deriv/translations';

type TOnboardingVideoProps = {
    type: 'trade_page' | 'positions_page';
};
const ASPECT_RATIO = 0.5625;

const OnboardingVideo = ({ type }: TOnboardingVideoProps) => {
    const [is_loading, setIsLoading] = React.useState(true);

    // memoize file paths for videos and open the modal only after we get them
    const getVideoSource = React.useCallback(
        (extension: string) =>
            getUrlBase(`/public/videos/user-onboarding-guide-${type.replace('_', '-')}.${extension}`),
        [type]
    );
    const mp4_src = React.useMemo(() => getVideoSource('mp4'), [getVideoSource]);

    return (
        <div className={clsx('guide__player__wrapper', is_loading && 'guide__player__wrapper--is-loading')}>
            {is_loading && <Skeleton.Square height={`calc(100vw * ${ASPECT_RATIO})`} />}
            <video
                autoPlay
                className='guide__player'
                data-testid='dt_onboarding_guide_video'
                muted
                loop
                onLoadedData={() => setIsLoading(false)}
                playsInline
                preload='auto'
            >
                {/* a browser will select a source with extension it recognizes */}
                <source src={mp4_src} type='video/mp4' />
                <Localize i18n_default_text='Unfortunately, your browser does not support the video.' />
            </video>
        </div>
    );
};

export default OnboardingVideo;
