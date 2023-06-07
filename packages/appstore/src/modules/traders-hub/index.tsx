import React from 'react';
import ModalManager from 'Components/modals/modal-manager';
import TourGuide from 'Modules/tour-guide/tour-guide';
import { isDesktop, ContentFlag } from '@deriv/shared';
import { Div100vhContainer } from '@deriv/components';
import classNames from 'classnames';
import AccountWithWallets from './account-with-wallets';
import AccountWithoutWallets from './account-without-wallets';
import { useStore, observer } from '@deriv/stores';
import EUDisclaimer from 'Components/eu-disclaimer';
import './traders-hub.scss';
import { useContentFlag } from '@deriv/hooks';

const TradersHub = () => {
    const { traders_hub, client, ui } = useStore();
    const { notification_messages_ui: Notifications } = ui;
    const {
        is_landing_company_loaded,
        is_logged_in,
        is_switching,
        is_logging_in,
        is_account_setting_loaded,
        accounts,
    } = client;
    const { is_tour_open, is_eu_user } = traders_hub;
    const traders_hub_ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    const can_show_notify =
        !is_switching &&
        !is_logging_in &&
        is_account_setting_loaded &&
        is_landing_company_loaded &&
        Notifications !== null;

    const [scrolled, setScrolled] = React.useState(false);
    // TODO: delete later. Just for testing purpose
    const [is_display_test_wallets, setIsDisplayTestWallets] = React.useState(0);

    const handleScroll = () => {
        const element = traders_hub_ref?.current;
        if (element && is_tour_open) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    React.useEffect(() => {
        setTimeout(() => {
            handleScroll();
            setTimeout(() => {
                setScrolled(true);
            }, 200);
        }, 100);
    }, [is_tour_open]);

    const { is_low_risk_cr_eu } = useContentFlag();

    if (!is_logged_in) return null;

    // TODO: delete after testing
    const SelectJSX = (
        <div>
            <select
                onChange={event => {
                    if (Number(event.target.value) === 0) setIsDisplayTestWallets(0);
                    else setIsDisplayTestWallets(1);
                }}
            >
                <option value={0}>Hide test wallets</option>
                <option value={1}>Show test wallets</option>
            </select>
        </div>
    );

    // TODO: change it when 'wallet' property will be in authorize response
    const is_wallet_account = Object.keys(accounts).some(key => accounts[key]?.account_category === 'wallet');

    return (
        <React.Fragment>
            <Div100vhContainer
                className={classNames('traders-hub--mobile', {
                    'traders-hub--mobile--eu-user': is_eu_user,
                    'traders-hub__wallets-bg': is_wallet_account || is_display_test_wallets,
                })}
                height_offset='50px'
                is_disabled={isDesktop()}
            >
                {can_show_notify && <Notifications />}
                <div id='traders-hub' className='traders-hub' ref={traders_hub_ref}>
                    {SelectJSX}
                    {!!is_display_test_wallets && <AccountWithWallets show_test_wallets={!!is_display_test_wallets} />}
                    {is_wallet_account ? <AccountWithWallets /> : <AccountWithoutWallets />}
                    <ModalManager />
                    {scrolled && <TourGuide />}
                </div>
            </Div100vhContainer>
            {is_low_risk_cr_eu && <EUDisclaimer />}
        </React.Fragment>
    );
};

export default observer(TradersHub);
