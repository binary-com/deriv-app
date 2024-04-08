import React from 'react';
import ReactDOM from 'react-dom';
import { useHistory } from 'react-router';
import { Analytics } from '@deriv-com/analytics';
import FormFooter from '@deriv/account/src/Components/form-footer';
import FormBody from '@deriv/account/src/Components/form-body';
import { Button, Icon, Text } from '@deriv/components';
import { mobileOSDetect, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { EffortLessLoginTips } from './effortless-login-tips';
import { EffortlessLoginDescription } from './effortless-login-description';
import './effortless-login-modal.scss';

const effortlessLoginModalTrackEvent = (action: string) => {
    const mobile_os = mobileOSDetect();
    Analytics.trackEvent('ce_passkey_effortless_form', {
        action,
        form_name: 'ce_passkey_effortless_form',
        operating_system: mobile_os,
    });
};

const EffortlessLoginModal = observer(() => {
    const [is_learn_more_opened, setIsLearnMoreOpened] = React.useState(false);
    const portal_element = document.getElementById('effortless_modal_root');
    const history = useHistory();
    const { client } = useStore();
    const { setShouldShowEffortlessLoginModal } = client;

    React.useEffect(() => {
        if (!portal_element) return;
        effortlessLoginModalTrackEvent('open');

        const track_close = () => {
            effortlessLoginModalTrackEvent('close');
        };
        window.addEventListener('beforeunload', track_close);
        return () => {
            window.removeEventListener('beforeunload', track_close);
        };
    }, []);

    const onClickHandler = (route: string, action_event: string) => {
        localStorage.setItem('show_effortless_login_modal', JSON.stringify(false));
        history.push(route);
        setShouldShowEffortlessLoginModal(false);
        effortlessLoginModalTrackEvent(action_event);
    };

    const onLearnMoreClick = () => {
        setIsLearnMoreOpened(true);
        effortlessLoginModalTrackEvent('info_open');
    };

    if (!portal_element) return null;
    return ReactDOM.createPortal(
        <div className={'effortless-login-modal'}>
            {is_learn_more_opened ? (
                <Icon
                    data_testid='effortless_login_modal__back-button'
                    icon='IcBackButton'
                    onClick={() => setIsLearnMoreOpened(false)}
                    className='effortless-login-modal__back-button'
                />
            ) : (
                <Text
                    as='div'
                    size='xxs'
                    color='loss-danger'
                    weight='bold'
                    line_height='xl'
                    align='right'
                    className='effortless-login-modal__header'
                    onClick={() => onClickHandler(routes.traders_hub, 'maybe_later')}
                >
                    <Localize i18n_default_text='Maybe later' />
                </Text>
            )}

            <FormBody scroll_offset='15rem' className='effortless-login-modal__wrapper'>
                <Icon icon='IcInfoPasskey' size={96} />
                <Text as='div' color='general' weight='bold' align='center' className='effortless-login-modal__title'>
                    <Localize i18n_default_text='Effortless login with passkeys' />
                </Text>
                {is_learn_more_opened ? (
                    <EffortlessLoginDescription />
                ) : (
                    <EffortLessLoginTips onLearnMoreClick={onLearnMoreClick} />
                )}
            </FormBody>
            <FormFooter>
                <Button
                    type='button'
                    has_effect
                    large
                    primary
                    onClick={() => onClickHandler(routes.passkeys, 'get_started')}
                >
                    <Localize i18n_default_text='Get started' />
                </Button>
            </FormFooter>
        </div>,
        portal_element
    );
});

export default EffortlessLoginModal;
