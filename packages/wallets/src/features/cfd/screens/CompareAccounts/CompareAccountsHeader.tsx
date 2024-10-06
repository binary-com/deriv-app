import React from 'react';
import { useHistory } from 'react-router-dom';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import './CompareAccountsHeader.scss';

type TCompareAccountsHeader = {
    isDemo: boolean;
    isEuRegion: boolean;
};

const CompareAccountsHeader = ({ isDemo, isEuRegion }: TCompareAccountsHeader) => {
    const history = useHistory();
    const { localize } = useTranslations();

    let headerText;
    if (isEuRegion) {
        headerText = (
            <Localize
                i18n_default_text='Deriv MT5 CFDs {{demoTitle}} account'
                values={{ demoTitle: isDemo ? localize('Demo') : localize('real') }}
            />
        );
    } else if (isDemo) {
        headerText = <Localize i18n_default_text='Compare CFDs demo accounts' />;
    } else {
        headerText = <Localize i18n_default_text='Compare CFDs accounts' />;
    }

    return (
        <div className='wallets-compare-accounts-header'>
            <div className='wallets-compare-accounts-header__title'>
                <Text size='xl' weight='bold'>
                    {headerText}
                </Text>
            </div>
            <LegacyClose2pxIcon
                className='wallets-compare-accounts-header__close-icon'
                data-testid='dt_wallets_compare_accounts_header_close_icon'
                iconSize='xs'
                onClick={() => {
                    history.push('/');
                }}
            />
        </div>
    );
};

export default CompareAccountsHeader;
