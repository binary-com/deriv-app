import React from 'react';
import { Dialog, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from '../../../../stores/useDBotStore';
import {
    getBotBuilderTourHeader,
    getTourDialogAction,
    getTourDialogInfo,
    onboarding_tour_header,
} from '../tour-content';
import { setTourSettings, tour_list } from '../utils';

const TourStartDialog = observer(() => {
    const { ui } = useStore();
    const { dashboard } = useDBotStore();
    const { active_tab, is_tour_dialog_visible, setTourDialogVisibility, setActiveTour, setShowMobileTourDialog } =
        dashboard;
    const { is_desktop } = ui;
    const tour_token = active_tab === 0 ? 'onboard_tour_token' : 'bot_builder_token';
    const toggleTour = () => {
        if (!is_desktop) setShowMobileTourDialog(false);
        setTourDialogVisibility(false);
        setActiveTour('');
        setTourSettings(new Date().getTime(), tour_token);
    };

    const onboard_tour = active_tab === DBOT_TABS.DASHBOARD;
    const tour_dialog_info = getTourDialogInfo(!is_desktop);
    const tour_dialog_action = getTourDialogAction(!is_desktop);

    const getTourContent = () => {
        return (
            <>
                {onboard_tour ? (
                    <Localize
                        key={0}
                        i18n_default_text='Hi! Hit <0>Start</0> for a quick tour.'
                        components={[<strong key={0} />]}
                    />
                ) : (
                    <>
                        <div className='dc-dialog__content__description__text'>{tour_dialog_info}</div>
                        <div className='dc-dialog__content__description__text'>{tour_dialog_action}</div>
                        <div className='dc-dialog__content__description__text'>
                            <Localize
                                key={0}
                                i18n_default_text={'Note: You can also find this tutorial in the <0>Tutorials</0> tab.'}
                                components={[<strong key={0} />]}
                            />
                        </div>
                    </>
                )}
            </>
        );
    };

    const onHandleConfirm = () => {
        setActiveTour(tour_list[active_tab]);
        if (!is_desktop) setShowMobileTourDialog(false);
        setTourDialogVisibility(false);
        setTourSettings(new Date().getTime(), tour_token);
    };
    const header_text_size = is_desktop ? 's' : 'xs';
    const content_text_size = is_desktop ? 'xs' : 'xxs';

    const tour_headers = active_tab === 0 ? onboarding_tour_header : getBotBuilderTourHeader(!is_desktop);
    return (
        <div>
            <Dialog
                is_visible={is_tour_dialog_visible}
                cancel_button_text={localize('Skip')}
                onCancel={() => toggleTour()}
                confirm_button_text={localize('Start')}
                onConfirm={onHandleConfirm}
                is_mobile_full_width
                className={'dc-dialog tour-dialog'}
                has_close_icon={false}
            >
                <div className='dc-dialog__content__header'>
                    <Text weight='bold' color='prominent' size={header_text_size}>
                        {tour_headers}
                    </Text>
                </div>
                <div className='dc-dialog__content__description'>
                    <Text size={content_text_size} color='prominent'>
                        {getTourContent()}
                    </Text>
                </div>
            </Dialog>
        </div>
    );
});

export default TourStartDialog;
