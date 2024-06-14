import React from 'react';
import { Loading, Modal, SelectNative, ReadMore, Text } from '@deriv/components';
import { useCashierLocked, useDepositLocked } from '@deriv/hooks';
import { routes, isMobileOrTablet } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import CashierLocked from '../../components/cashier-locked';
import SideNote from '../../components/side-note';
import OnRampProviderCard from './on-ramp-provider-card';
import OnRampProviderPopup from './on-ramp-provider-popup';
import { useCashierStore } from '../../stores/useCashierStores';
import './on-ramp.scss';

type TMenuOption = {
    count?: number;
    default?: boolean;
    icon?: string;
    label: string;
    value?: string;
    path: string;
    has_side_note?: boolean;
};

export type TOnRampProps = {
    menu_options: TMenuOption[];
    setSideNotes?: (notes: React.ReactNode[]) => void;
};

const OnRampSideNote = () => {
    const notes = [
        <Localize
            i18n_default_text='Fiat onramp is a cashier service that allows you to convert fiat currencies to crypto to top up your Deriv crypto accounts. Listed here are third-party crypto exchanges. You’ll need to create an account with them to use their services.'
            key={0}
        />,
    ];

    return <SideNote side_notes={notes} title={<Localize i18n_default_text='What is Fiat onramp?' />} />;
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

const OnRamp = observer(({ menu_options, setSideNotes }: TOnRampProps) => {
    const { common, client } = useStore();
    const { onramp, general_store } = useCashierStore();
    const {
        filtered_onramp_providers,
        is_onramp_modal_open,
        onMountOnramp,
        onUnmountOnramp,
        onramp_popup_modal_title,
        resetPopup,
        setIsOnRampModalOpen,
        should_show_dialog,
    } = onramp;
    const { is_cashier_onboarding, is_loading, cashier_route_tab_index } = general_store;
    const is_cashier_locked = useCashierLocked();
    const { is_switching } = client;
    const { routeTo } = common;
    const is_deposit_locked = useDepositLocked();

    const [selected_cashier_path, setSelectedCashierPath] = React.useState(routes.cashier_onramp);

    React.useEffect(() => {
        if (menu_options && selected_cashier_path !== routes.cashier_onramp) {
            routeTo(selected_cashier_path);
        }
    }, [menu_options, routeTo, selected_cashier_path]);

    React.useEffect(() => {
        onMountOnramp();
        if (!is_switching && !is_loading) {
            setSideNotes?.([<OnRampSideNote key={0} />]);
        }

        return () => {
            onUnmountOnramp();
            setSideNotes?.([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onMountOnramp, onUnmountOnramp, is_cashier_onboarding, is_switching, is_loading, cashier_route_tab_index]);

    const getActivePaths = () =>
        (menu_options ?? []).map(menu_option => ({
            text: menu_option.label,
            value: menu_option.path,
        }));

    if (is_switching || is_loading) return <Loading className='cashier-onboarding__loader' is_fullscreen />;

    if (is_deposit_locked || is_cashier_locked) {
        return (
            <div className='cashier-locked-padding'>
                <CashierLocked />
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className='cashier__wrapper cashier__wrapper--align-left on-ramp'>
                {isMobileOrTablet() && (
                    <React.Fragment>
                        <SelectNative
                            data_testid='dt_on_ramp_select_native'
                            className='on-ramp__selector'
                            label={''}
                            list_items={getActivePaths()}
                            value={selected_cashier_path}
                            should_show_empty_option={false}
                            hide_top_placeholder={false}
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
                    color={isMobileOrTablet() ? 'less-prominent' : 'general'}
                    weight={isMobileOrTablet() ? 'normal' : 'bold'}
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
});

export default OnRamp;
