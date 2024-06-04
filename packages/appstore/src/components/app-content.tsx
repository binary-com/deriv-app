import { useEffect } from 'react';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import Routes from 'Components/routes/routes';
import clsx from 'clsx';
import './app.scss';

const AppContent = observer(() => {
    const { ui, traders_hub } = useStore();
    const { is_dark_mode_on } = ui;
    const { selected_account_type } = traders_hub;

    useEffect(() => {
        if (selected_account_type) {
            Analytics.trackEvent('ce_tradershub_dashboard_form', {
                action: 'open',
                form_name: 'traders_hub_default',
                account_mode: selected_account_type,
            });
        }
    }, [selected_account_type]);

    return (
        <main
            className={clsx('dashboard', {
                'theme--light': !is_dark_mode_on,
                'theme--dark': is_dark_mode_on,
                'dashboard-onboarding': window.location.pathname === routes.onboarding,
            })}
        >
            <div className='dw-dashboard'>
                <Routes />
            </div>
        </main>
    );
});

export default AppContent;
