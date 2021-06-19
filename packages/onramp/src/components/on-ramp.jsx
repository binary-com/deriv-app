import PropTypes from 'prop-types';
import React from 'react';
import { Modal, SelectNative, ReadMore, Text } from '@deriv/components';
import { routes, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import OnRampProviderCard from '../Components/on-ramp-provider-card.jsx';
import OnRampProviderPopup from '../Components/on-ramp-provider-popup.jsx';
import SideNote from '../Components/side-note.jsx';
import 'Sass/on-ramp.scss';

const OnRampSideNote = () => {
    const notes = [
        <Localize
            i18n_default_text='Fiat onramp is a cashier service that allows you to convert fiat currencies to crypto to top up your Deriv crypto accounts. Listed here are third-party crypto exchanges. You’ll need to create an account with them to use their services.'
            key={0}
        />,
    ];

    return <SideNote notes={notes} title={<Localize i18n_default_text='What is Fiat onramp?' />} />;
};
const OnRampInfo = () => (
    <div className='on-ramp__info'>
        <Text color='prominent' size='s' weight='bold' className='on-ramp__info-header' as='p'>
            <Localize i18n_default_text='What is Fiat onramp?' />
        </Text>
        <div className='on-ramp__info-content'>
            <ReadMore
                expand_text={localize('See more')}
                text={localize(
                    'Fiat onramp is a cashier service that allows you to convert fiat currencies to crypto to top up your Deriv crypto accounts. Listed here are third-party crypto exchanges. You’ll need to create an account with them to use their services.'
                )}
                collapse_length={140}
                className='on-ramp__read-more'
            />
        </div>
    </div>
);

const OnRamp = ({
    filtered_onramp_providers,
    is_onramp_modal_open,
    menu_options,
    onMountOnramp,
    onUnmountOnramp,
    onramp_popup_modal_title,
    resetPopup,
    routeTo,
    setIsOnRampModalOpen,
    should_show_dialog,
    setSideNotes,
}) => {
    const [selected_cashier_path, setSelectedCashierPath] = React.useState(routes.cashier_onramp);

    React.useEffect(() => {
        if (menu_options && selected_cashier_path !== routes.cashier_onramp) {
            routeTo(selected_cashier_path);
        }
    }, [selected_cashier_path]);

    React.useEffect(() => {
        onMountOnramp();
        if (typeof setSideNotes === 'function') {
            setSideNotes([<OnRampSideNote key={0} />]);
        }

        return () => onUnmountOnramp();
    }, [onMountOnramp, onUnmountOnramp]);

    const getActivePaths = () =>
        (menu_options ?? []).map(menu_option => ({
            text: menu_option.label,
            value: menu_option.path,
        }));

    return (
        <React.Fragment>
            <div className='cashier__wrapper cashier__wrapper--align-left on-ramp'>
                {isMobile() && (
                    <React.Fragment>
                        <SelectNative
                            className='on-ramp__selector'
                            list_items={getActivePaths()}
                            value={selected_cashier_path}
                            should_show_empty_option={false}
                            onChange={e => {
                                if (e.currentTarget.value !== selected_cashier_path) {
                                    setSelectedCashierPath(e.currentTarget.value);
                                }
                            }}
                        />
                        <OnRampInfo />
                    </React.Fragment>
                )}
                <Text
                    color={isMobile() ? 'less-prominent' : 'general'}
                    weight={isMobile() ? 'normal' : 'bold'}
                    align='center'
                    line_height='m'
                    className='on-ramp__page-header'
                    as='p'
                >
                    <Localize i18n_default_text='Select payment channel' />
                </Text>
                {filtered_onramp_providers.map(provider => (
                    <OnRampProviderCard key={provider.name} provider={provider} />
                ))}
                <Modal
                    className='on-ramp__modal'
                    has_close_icon
                    is_open={is_onramp_modal_open}
                    small={should_show_dialog}
                    title={onramp_popup_modal_title}
                    toggleModal={() => setIsOnRampModalOpen(!is_onramp_modal_open)}
                    onUnmount={resetPopup}
                    width={should_show_dialog ? '44rem' : '62.8rem'}
                >
                    <Modal.Body>
                        <OnRampProviderPopup />
                    </Modal.Body>
                </Modal>
            </div>
        </React.Fragment>
    );
};

OnRamp.propTypes = {
    filtered_onramp_providers: PropTypes.array,
    is_onramp_modal_open: PropTypes.bool,
    menu_options: PropTypes.array,
    onMountOnramp: PropTypes.func,
    onUnmountOnramp: PropTypes.func,
    onramp_popup_modal_title: PropTypes.string,
    resetPopup: PropTypes.func,
    routeTo: PropTypes.func,
    setIsOnRampModalOpen: PropTypes.func,
    setSideNotes: PropTypes.func,
    should_show_dialog: PropTypes.bool,
};

export default connect(({ modules, common }) => ({
    filtered_onramp_providers: modules.cashier.onramp.filtered_onramp_providers,
    is_onramp_modal_open: modules.cashier.onramp.is_onramp_modal_open,
    onMountOnramp: modules.cashier.onramp.onMountOnramp,
    onUnmountOnramp: modules.cashier.onramp.onUnmountOnramp,
    onramp_popup_modal_title: modules.cashier.onramp.onramp_popup_modal_title,
    resetPopup: modules.cashier.onramp.resetPopup,
    routeTo: common.routeTo,
    setIsOnRampModalOpen: modules.cashier.onramp.setIsOnRampModalOpen,
    should_show_dialog: modules.cashier.onramp.should_show_dialog,
}))(OnRamp);
