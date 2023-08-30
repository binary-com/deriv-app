import React from 'react';
import { Loading, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';

type TTourGuide = {
    content: string[];
    img?: string;
    label: string | boolean;
    onCloseTour: () => void;
    step_index: number;
    show_actions?: boolean;
    has_localize_component?: boolean;
};

const TourGuide = observer(
    ({ content, img, label, step_index, has_localize_component = false, show_actions = true }: TTourGuide) => {
        const { dashboard } = useDBotStore();
        const { onCloseTour } = dashboard;

        const [has_image_loaded, setImageLoaded] = React.useState(false);

        React.useEffect(() => {
            if (img) {
                const tour_image = new Image();
                tour_image.onload = () => {
                    setImageLoaded(true);
                };
                tour_image.src = img;
            }
        }, [step_index]);

        return (
            <React.Fragment>
                <div className='onboard'>
                    {show_actions && (
                        <div className='onboard__header'>
                            <Text color='less-prominent' line_height='l'>
                                {step_index}/6
                            </Text>
                            <Text className='onboard__header--close' line_height='l' onClick={onCloseTour}>
                                {localize('Exit tour')}
                            </Text>
                        </div>
                    )}
                    <div className='onboard__label'>
                        <Text as='h' line_height='l' weight='bold'>
                            {label}
                        </Text>
                    </div>

                    {img && (
                        <div className='onboard__container'>
                            {has_image_loaded ? <img src={img} loading='eager' /> : <Loading />}
                        </div>
                    )}

                    <div className='onboard__content'>
                        <>
                            {content.map((content_data, index) => {
                                return has_localize_component ? (
                                    content_data
                                ) : (
                                    <div className='onboard__content__block' key={`${content_data + index}`}>
                                        <Text align='left' as='h' size='xs' line_height='l'>
                                            {content_data}
                                        </Text>
                                    </div>
                                );
                            })}
                        </>
                    </div>
                </div>
            </React.Fragment>
        );
    }
);

export default TourGuide;
