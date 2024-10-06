import React, { useEffect, useRef } from 'react';
import { useDerivAccountsList, useSettings } from '@deriv/api-v2';
import { Analytics } from '@deriv-com/analytics';
import useAllBalanceSubscription from './hooks/useAllBalanceSubscription';
import { defineViewportHeight } from './utils/utils';
import { Router } from './routes';
import { TLanguageType } from './types';
import './AppContent.scss';

type AppContentProps = {
    setPreferredLanguage: (language: TLanguageType | null) => void;
};

const AppContent: React.FC<AppContentProps> = ({ setPreferredLanguage }) => {
    const { isSubscribed, subscribeToAllBalance, unsubscribeFromAllBalance } = useAllBalanceSubscription();
    const { data: derivAccountList } = useDerivAccountsList();
    const previousDerivAccountListLenghtRef = useRef(0);
    const {
        data: { preferred_language: preferredLanguage },
    } = useSettings();

    useEffect(() => {
        if (preferredLanguage) {
            setPreferredLanguage(preferredLanguage as TLanguageType);
        } else {
            setPreferredLanguage(null);
        }
    }, [preferredLanguage, setPreferredLanguage]);

    useEffect(() => {
        if (!derivAccountList?.length) return;
        if (previousDerivAccountListLenghtRef.current !== derivAccountList.length || !isSubscribed) {
            subscribeToAllBalance();
            previousDerivAccountListLenghtRef.current = derivAccountList.length;
        }
        return () => {
            if (isSubscribed) {
                unsubscribeFromAllBalance();
            }
        };
    }, [derivAccountList?.length, isSubscribed, subscribeToAllBalance, unsubscribeFromAllBalance]);

    useEffect(() => {
        defineViewportHeight();
    }, []);

    useEffect(() => {
        Analytics.trackEvent('ce_wallets_homepage_form', {
            action: 'open',
            form_name: 'ce_wallets_homepage_form',
        });
    }, []);

    return (
        <div className='wallets-app'>
            <div className='wallets-modal-show-header-root' id='wallets_modal_show_header_root' />
            <Router />
        </div>
    );
};

export default AppContent;
