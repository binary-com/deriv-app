import React from 'react';
import classNames from 'classnames';
import { Icon, ProgressBarTracker, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { DBOT_ONBOARDING_MOBILE, TMobileTourConfig } from '../config';
import TourButton from './common/tour-button';

const default_tour_data = {
    content: [],
    header: '',
    img: '',
    tour_step_key: 1,
};

type TTourData = TMobileTourConfig & {
    img: string;
    tour_step_key: number;
};

const OnboardingTour = observer(() => {
    const { dashboard } = useDBotStore();
    const { onCloseTour, onTourEnd, setTourActiveStep } = dashboard;
    const [tour_step, setStep] = React.useState<number>(1);
    const [tour_data, setTourData] = React.useState<TTourData>(default_tour_data);
    const { content, header, img, media, tour_step_key } = tour_data;
    const start_button = tour_step === 1 ? localize('Start') : localize('Next');
    const tour_button_text = tour_step === 8 ? localize('Got it, thanks!') : start_button;
    const test_id = tour_step_key === 8 ? 'finish-onboard-tour' : 'next-onboard-tour';
    const hide_prev_button = [1, 2, 8];

    React.useEffect(() => {
        DBOT_ONBOARDING_MOBILE.forEach(data => {
            if (data.tour_step_key === tour_step) {
                setTourData(data);
            }
            setTourActiveStep(tour_step);
        });
    }, [tour_step]);
    return (
        <div
            className={classNames('dbot-slider', {
                'dbot-slider--active': tour_step === 1,
                'dbot-slider--tour-position': tour_step !== 1,
            })}
            data-testid='onboarding-tour-mobile'
        >
            {tour_step_key !== 1 && (
                <div className='dbot-slider__navbar'>
                    <Text
                        color='less-prominent'
                        weight='less-prominent'
                        line_height='s'
                        size='xxs'
                        data-testid='dbot-onboard-slider__navbar'
                    >{`${tour_step_key - 1}/7`}</Text>
                    <span onClick={onCloseTour}>
                        <Icon
                            icon='IcCross'
                            data_testid='exit-onboard-tour'
                            className='db-contract-card__result-icon'
                            color='secondary'
                        />
                    </span>
                </div>
            )}
            {header && (
                <Text
                    color='prominent'
                    weight='bold'
                    align='center'
                    className='dbot-slider__title'
                    as='span'
                    line_height='s'
                    size='xs'
                >
                    {localize(header)}
                </Text>
            )}
            {media && (
                <div className='dbot-slider__media'>
                    <video
                        autoPlay={true}
                        loop
                        controls
                        preload='auto'
                        playsInline
                        disablePictureInPicture
                        controlsList='nodownload'
                        src={media}
                    />
                </div>
            )}
            {img && (
                <div className='dbot-slider__image'>
                    <img src={img} />
                </div>
            )}

            {content && (
                <>
                    {content.map(data => {
                        return (
                            <Text
                                key={data}
                                align='center'
                                color='prominent'
                                className='dbot-slider__content'
                                as='div'
                                line_height='s'
                                size='xxs'
                            >
                                {data}
                            </Text>
                        );
                    })}
                </>
            )}
            <div className='dbot-slider__status'>
                <div className='dbot-slider__progress-bar'>
                    <ProgressBarTracker
                        step={tour_step}
                        steps_list={DBOT_ONBOARDING_MOBILE.map(v => v.tour_step_key.toString())}
                        setStep={setStep}
                    />
                </div>
                <div className='dbot-slider__button-group'>
                    {tour_step === 1 && (
                        <TourButton
                            onClick={() => {
                                onCloseTour();
                            }}
                            label={localize('Skip')}
                            data-testid='skip-onboard-tour'
                        />
                    )}
                    {!hide_prev_button.includes(tour_step) && (
                        <TourButton
                            onClick={() => {
                                setStep(tour_step - 1);
                            }}
                            label={localize('Previous')}
                            data-testid='prev-onboard-tour'
                        />
                    )}
                    <TourButton
                        type='danger'
                        onClick={() => {
                            setStep(tour_step + 1);
                            onTourEnd(tour_step, true);
                        }}
                        label={tour_button_text}
                        data-testid={test_id}
                    />
                </div>
            </div>
        </div>
    );
});

export default OnboardingTour;
