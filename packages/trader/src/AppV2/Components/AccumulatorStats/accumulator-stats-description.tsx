import React from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const AccumulatorStatsDescription = ({ onActionSheetClose }: { onActionSheetClose: () => void }) => {
    const src = 'cfd0bd25af245c1c987106a247cbb81a';

    return (
        <ActionSheet.Portal showHandlebar={false}>
            <div className='stats-description'>
                <div className='stats-description__player-wrapper'>
                    <div className='stats-description__player-wrapper__player'>
                        <iframe
                            allowFullScreen={false}
                            width='100%'
                            height='100%'
                            src={`https://iframe.cloudflarestream.com/${src}?muted=true&controls=false&autoplay=true&loop=true&preload=auto`}
                        />
                    </div>
                </div>

                <div className='stats-description__content'>
                    <div className='stats-description__content__title'>
                        <Text size='lg' bold>
                            <Localize i18n_default_text='Stats' />
                        </Text>
                    </div>
                    <div className='stats-description__content__description'>
                        <Text>
                            <Localize i18n_default_text='Stats show the history of consecutive tick counts, i.e. the number of ticks the price remained within range continuously.' />
                        </Text>
                    </div>
                </div>
            </div>
            <ActionSheet.Footer
                alignment='vertical'
                primaryAction={{
                    content: <Localize i18n_default_text='Got it' />,
                    onAction: onActionSheetClose,
                }}
            />
        </ActionSheet.Portal>
    );
};

export default AccumulatorStatsDescription;
