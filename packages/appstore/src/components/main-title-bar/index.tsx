import React from 'react';
import { Text, DesktopWrapper, MobileWrapper, Tabs, Icon } from '@deriv/components';
import { ContentFlag } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import AccountTypeDropdown from './account-type-dropdown';
import AssetSummary from './asset-summary';
import RegulatorSwitcher from './regulators-switcher';
import { localize } from '@deriv/translations';
import './main-title-bar.scss';

const MainTitleBar = observer(() => {
    const { traders_hub, client } = useStore();
    const { selected_region, handleTabItemClick, toggleRegulatorsCompareModal, content_flag } = traders_hub;
    const { is_landing_company_loaded } = client;
    const is_low_risk_cr_real_account =
        content_flag === ContentFlag.LOW_RISK_CR_NON_EU || content_flag === ContentFlag.LOW_RISK_CR_EU;

    const [active_index, setActiveIndex] = React.useState(selected_region === 'Non-EU' ? 0 : 1);

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='main-title-bar'>
                    <div className='main-title-bar__right'>
                        <Text size='m' weight='bold'>
                            {localize("Trader's hub")}
                        </Text>
                        <AccountTypeDropdown />
                    </div>
                    {is_low_risk_cr_real_account && is_landing_company_loaded && <RegulatorSwitcher />}
                    <AssetSummary />
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <Text weight='bold' className='main-title-bar__text'>
                    {localize("Trader's hub")}
                </Text>
                <div className='main-title-bar-mobile'>
                    <div className='main-title-bar-mobile--account-type-dropdown'>
                        <AccountTypeDropdown />
                    </div>
                    {is_low_risk_cr_real_account && is_landing_company_loaded ? (
                        <div className='main-title-bar-mobile--regulator'>
                            <div
                                className='main-title-bar-mobile--regulator--compare-modal'
                                onClick={() => toggleRegulatorsCompareModal()}
                            >
                                <Icon icon='IcInfoOutline' />
                            </div>
                            <Tabs
                                active_index={active_index}
                                onTabItemClick={(index: number) => {
                                    setActiveIndex(index);
                                    handleTabItemClick(index);
                                }}
                                top
                                is_scrollable
                                is_overflow_hidden
                            >
                                <div label={localize('Non-EU')} />
                                <div label={localize('EU')} />
                            </Tabs>
                        </div>
                    ) : null}
                </div>
                <AssetSummary />
            </MobileWrapper>
        </React.Fragment>
    );
});

export default MainTitleBar;
