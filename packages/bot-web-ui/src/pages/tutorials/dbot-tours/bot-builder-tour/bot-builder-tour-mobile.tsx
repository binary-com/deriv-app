import React from 'react';
import { ProgressBarTracker, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { getSetting } from 'Utils/settings';
import { useDBotStore } from 'Stores/useDBotStore';
import TourButton from '../common/tour-button';
import TourStartDialog from '../common/tour-start-dialog';
import { BOT_BUILDER_MOBILE } from '../tour-content';
import { highlightLoadModalButton } from '../utils';

const BotBuilderTourMobile = observer(() => {
    const { dashboard, load_modal, quick_strategy } = useDBotStore();
    const { toggleTourLoadModal } = load_modal;
    const {
        onTourEnd,
        setTourActiveStep,
        active_tour,
        show_mobile_tour_dialog,
        active_tab,
        setShowMobileTourDialog,
        setTourDialogVisibility,
    } = dashboard;
    const { is_open } = quick_strategy;
    const [tour_step, setTourStep] = React.useState<number>(1);
    const content_data = BOT_BUILDER_MOBILE.find(({ tour_step_key }) => {
        return tour_step_key === tour_step;
    });
    const test_id = tour_step === 3 ? 'finish-bot-builder-tour' : 'next-bot-builder-tour';

    React.useEffect(() => {
        setTourActiveStep(tour_step);
        //component does not rerender so calling this to highlight
        !show_mobile_tour_dialog && highlightLoadModalButton(active_tour, tour_step);
        if (tour_step === 2) toggleTourLoadModal(true);
        else if (active_tour !== '') toggleTourLoadModal(false);
        const token = getSetting('bot_builder_token');
        if (!token && active_tab === 1) {
            if (is_open) {
                setTourDialogVisibility(false);
            } else {
                setTourDialogVisibility(true);
            }
            setShowMobileTourDialog(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tour_step, show_mobile_tour_dialog]);

    const tour_button_text = tour_step === 3 ? localize('Finish') : localize('Next');
    const is_tour_active = active_tour === 'onboarding';
    return (
        <>
            {show_mobile_tour_dialog && <TourStartDialog />}
            {active_tour && !show_mobile_tour_dialog && (
                <div data-testid='botbuilder-tour-mobile' className='dbot-slider dbot-slider__bot-builder-tour'>
                    <div className='dbot-slider__label'>
                        <Text as='span' size='xs' weight='bold'>
                            {content_data?.header}
                        </Text>
                    </div>
                    <div className='dbot-slider__content'>
                        <Text as='span' line_height='s' size='xxs'>
                            {content_data?.content}
                        </Text>
                    </div>
                    <div className='dbot-slider__status'>
                        <div className='dbot-slider__progress-bar'>
                            {
                                <ProgressBarTracker
                                    step={tour_step}
                                    steps_list={BOT_BUILDER_MOBILE.map(v => v.tour_step_key.toString())}
                                    onStepChange={setTourStep}
                                />
                            }
                        </div>
                        <div className='dbot-slider__button-group'>
                            {tour_step !== 1 && (
                                <TourButton
                                    onClick={() => {
                                        setTourStep(tour_step - 1);
                                    }}
                                    label={localize('Previous')}
                                    data-testid='prev-bot-builder-tour'
                                />
                            )}
                            <TourButton
                                type='danger'
                                onClick={() => {
                                    setTourStep(tour_step + 1);
                                    onTourEnd(tour_step, is_tour_active);
                                }}
                                label={tour_button_text}
                                data-testid={test_id}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default BotBuilderTourMobile;
