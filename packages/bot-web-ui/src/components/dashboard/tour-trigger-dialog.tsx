import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { tour_type, getTourSettings, setTourSettings } from './joyride-config';

type TourTriggrerDialog = {
    active_tab: number;
    is_tour_dialog_visible: boolean;
    is_tour_ended: boolean;
    setTourActive: (param: boolean) => void;
    setIsTourEnded: (param: boolean) => void;
    setTourDialogVisibility: (param: boolean) => void;
    setOnBoardTourRunState: (param: boolean) => void;
    setBotBuilderTourState: (param: boolean) => void;
};

const TourTriggrerDialog = ({
    active_tab,
    is_tour_dialog_visible,
    is_tour_ended,
    setTourDialogVisibility,
    setBotBuilderTourState,
    setOnBoardTourRunState,
    setTourActive,
    setIsTourEnded,
}: TourTriggrerDialog) => {
    const toggleTour = (value: boolean, type: string) => {
        if (active_tab === 0) {
            setTourActive(value);
            setOnBoardTourRunState(value);
            if (is_tour_ended) {
                setIsTourEnded(false);
            }
        } else {
            setBotBuilderTourState(value);
        }
        setTourDialogVisibility(value);
        if (type === 'onConfirm') {
            setTourDialogVisibility(!value);
        }
        if (active_tab === 1 && tour_type.key === 'bot_builder_') {
            if (!getTourSettings(`${tour_type.key}token`))
                setTourSettings(new Date().getTime(), `${tour_type.key}token`);
        }

        if (!getTourSettings(`${tour_type.key}token`)) localStorage.removeItem('dbot_settings');
    };
    const getTourContent = () => {
        return (
            <>
                {active_tab === 0 && !is_tour_ended ? (
                    <Localize
                        key={0}
                        i18n_default_text={
                            'Hi [first name]! Hit <0>Start</0> for a quick <1>tour</1> to help you get started.'
                        }
                        components={[<strong key={1} />, <i key={2} />]}
                    />
                ) : (
                    <Localize
                        key={0}
                        i18n_default_text={'If yes, go to <0>Tutorials</0>.'}
                        components={[<strong key={0} />]}
                    />
                )}
                {active_tab === 1 && !is_tour_ended ? (
                    <>
                        <div className='dc-dialog__content__description__text'>
                            <Localize
                                key={0}
                                i18n_default_text={'Learn how to build your bot from scratch using a simple strategy.'}
                            />
                        </div>
                        <div className='dc-dialog__content__description__text'>
                            <Localize
                                key={0}
                                i18n_default_text={'Hit the <0>Start</0> button to begin and follow the tutorial.'}
                                components={[<strong key={1} />]}
                            />
                        </div>
                        <div className='dc-dialog__content__description__text'>
                            <Localize
                                key={0}
                                i18n_default_text={'Note: You can also find this tutorial in the <0>Tutorials</0> tab.'}
                                components={[<strong key={1} />]}
                            />
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </>
        );
    };
    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={() => toggleTour(false, 'onCancel')}
                confirm_button_text={is_tour_ended ? localize('Got it, thanks!') : localize('Start')}
                onConfirm={() => toggleTour(true, 'onConfirm')}
                is_mobile_full_width
                className={'dc-dialog onboarding-tour-guide'}
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent'>
                        {!is_tour_ended &&
                            (active_tab === 1 ? localize("Let's build a Bot") : localize('Get started on DBot'))}
                        {is_tour_ended &&
                            (active_tab === 1
                                ? localize('Want to take retake the tour?')
                                : localize('Congratulations!'))}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text color='prominent'>{getTourContent()}</Text>
                </div>
            </Dialog>
        </div>
    );
};

export default connect(({ dashboard }: RootStore) => ({
    active_tab: dashboard.active_tab,
    setTourActive: dashboard.setTourActive,
    is_tour_ended: dashboard.is_tour_ended,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
    setIsTourEnded: dashboard.setIsTourEnded,
}))(TourTriggrerDialog);
