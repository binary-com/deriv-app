import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import OnboardTourHandler from '../tutorials/dbot-tours/onboarding-tour';
import Cards from './cards';
import InfoPanel from './info-panel';
import UserGuide from './user-guide';

type TMobileIconGuide = {
    handleTabChange: (active_number: number) => void;
};

const DashboardComponent = observer(({ handleTabChange }: TMobileIconGuide) => {
    const { ui } = useStore();
    const { load_modal, dashboard } = useDBotStore();
    const { dashboard_strategies } = load_modal;
    const { setActiveTabTutorial, active_tab, active_tour } = dashboard;
    const has_dashboard_strategies = !!dashboard_strategies?.length;
    const { is_desktop } = ui;

    return (
        <React.Fragment>
            <div
                className={classNames('tab__dashboard', {
                    'tab__dashboard--tour-active': active_tour,
                })}
            >
                <div className='tab__dashboard__content'>
                    <UserGuide
                        is_mobile={!is_desktop}
                        handleTabChange={handleTabChange}
                        setActiveTabTutorial={setActiveTabTutorial}
                    />
                    <div className='quick-panel'>
                        <div
                            className={classNames('tab__dashboard__header', {
                                'tab__dashboard__header--listed': is_desktop && has_dashboard_strategies,
                            })}
                        >
                            {!has_dashboard_strategies && (
                                <Text
                                    className='title'
                                    as='h2'
                                    color='prominent'
                                    size={is_desktop ? 'sm' : 's'}
                                    line_height='xxl'
                                    weight='bold'
                                >
                                    {localize('Load or build your bot')}
                                </Text>
                            )}
                            <Text
                                as='p'
                                color='prominent'
                                line_height='s'
                                size={is_desktop ? 's' : 'xxs'}
                                className={classNames('subtitle', { 'subtitle__has-list': has_dashboard_strategies })}
                            >
                                {localize(
                                    'Import a bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.'
                                )}
                            </Text>
                        </div>
                        <Cards has_dashboard_strategies={has_dashboard_strategies} is_mobile={!is_desktop} />
                    </div>
                </div>
            </div>
            <InfoPanel />
            {active_tab === 0 && <OnboardTourHandler is_mobile={!is_desktop} />}
        </React.Fragment>
    );
});

export default DashboardComponent;
