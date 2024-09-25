import React from 'react';
import { Icon, Loading, Modal, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getUrlBase, isMobile } from '@deriv/shared';

type TAccumulatorsStatsManualModal = {
    icon_classname: string;
    is_dark_theme?: boolean;
    is_manual_open: boolean;
    title: string;
    toggleManual: () => void;
};

const AccumulatorsStatsManualModal = ({
    icon_classname,
    is_dark_theme,
    is_manual_open,
    title,
    toggleManual,
}: TAccumulatorsStatsManualModal) => {
    const [is_loading, setIsLoading] = React.useState(true);
    const is_mobile = isMobile();
    // memoize file paths for videos and open the modal only after we get them
    const getVideoSource = React.useCallback(
        (extension: string) => {
            return getUrlBase(
                `/public/videos/accumulators_manual_${is_mobile ? 'mobile' : 'desktop'}${
                    is_dark_theme ? '_dark' : ''
                }.${extension}`
            );
        },
        [is_mobile, is_dark_theme]
    );
    const mp4_src = React.useMemo(() => getVideoSource('mp4'), [getVideoSource]);
    const webm_src = React.useMemo(() => getVideoSource('webm'), [getVideoSource]);

    return (
        <React.Fragment>
            <Icon
                icon='IcInfoOutline'
                onClick={toggleManual}
                size={16}
                className={icon_classname}
                data_testid='dt_ic_info_icon'
            />
            <Modal
                is_open={is_manual_open && !!mp4_src && !!webm_src}
                should_header_stick_body={false}
                title={title}
                toggleModal={toggleManual}
                width={is_mobile ? '328px' : '596px'}
                className='accumulators-stats-manual-modal'
            >
                <Modal.Body className='accumulators-stats-modal-body'>
                    <div className='accumulators-stats-modal-body__video'>
                        {is_loading && <Loading is_fullscreen={false} />}
                        <video
                            autoPlay
                            data-testid='dt_accumulators_stats_manual_video'
                            loop
                            onLoadedData={() => setIsLoading(false)}
                            playsInline
                            preload='auto'
                            width={is_mobile ? 296 : 563}
                        >
                            {/* a browser will select a source with extension it recognizes */}
                            <source src={mp4_src} type='video/mp4' />
                            <source src={webm_src} type='video/webm' />
                            {localize('Unfortunately, your browser does not support the video.')}
                        </video>
                    </div>
                    <Text
                        as='p'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        className='accumulators-stats-modal-body__text'
                    >
                        {localize(
                            'Stats show the history of consecutive tick counts, i.e. the number of ticks the price remained within range continuously.'
                        )}
                    </Text>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export { AccumulatorsStatsManualModal };
