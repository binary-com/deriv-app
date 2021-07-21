import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'Stores/connect';
import { routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Text, MobileWrapper, DesktopWrapper } from '@deriv/components';
import CFDs from 'Assets/SvgComponents/onboarding/cfds.svg';
import CFDsMobile from 'Assets/SvgComponents/onboarding/cfds-mobile.svg';
import DigitalOptions from 'Assets/SvgComponents/onboarding/digital-options.svg';
import DigitalOptionsMobile from 'Assets/SvgComponents/onboarding/digital-options-mobile.svg';
import Multipliers from 'Assets/SvgComponents/onboarding/multipliers.svg';
import MultipliersMobile from 'Assets/SvgComponents/onboarding/multipliers-mobile.svg';
import NotSure from 'Assets/SvgComponents/onboarding/not-sure.svg';
import NotSureMobile from 'Assets/SvgComponents/onboarding/not-sure-mobile.svg';
import WelcomeItem from './welcome-item.jsx';

const Welcome = props => {
    const { history, setOnboardingContractType, onNext } = props;
    const switchPlatform = React.useCallback(
        ({ route, contract_type } = {}) => {
            if (route) history.push(route);
            setOnboardingContractType(contract_type);
        },
        [history, setOnboardingContractType]
    );

    return (
        <div className='welcome-cr'>
            <DesktopWrapper>
                <Text as='h2' weight='bold' align='center' color='prominent' className='welcome__header' size='m'>
                    {localize('Where would you like to start?')}
                </Text>
            </DesktopWrapper>
            <MobileWrapper>
                <Text as='h2' weight='bold' align='center' color='prominent' className='welcome__header' size='xsm'>
                    {localize('Where would you like to start?')}
                </Text>
            </MobileWrapper>
            <div className='welcome__main'>
                <WelcomeItem
                    title={localize('CFDs')}
                    description={
                        <Localize
                            i18n_default_text='<0>Maximise returns </0> by <0>risking more</0> than you put in.'
                            components={[<Text key={0} weight='bold' as='strong' color='prominent' />]}
                        />
                    }
                    onClick={onNext}
                    icon={<CFDs />}
                    mobileIcon={<CFDsMobile />}
                    options={['Forex', 'Synthetics', 'Stocks and indices', 'Cryptocurrencies', 'Commodities']}
                />
                <WelcomeItem
                    description={
                        <Localize
                            i18n_default_text='<0>Multiply returns </0> by <0>risking only</0> what you put in.'
                            components={[<Text key={0} weight='bold' as='strong' color='prominent' />]}
                        />
                    }
                    onClick={() => switchPlatform({ route: routes.trade, contract_type: 'multiplier' })}
                    title={localize('Multipliers')}
                    icon={<Multipliers />}
                    mobileIcon={<MultipliersMobile />}
                    options={['Forex', 'Synthetics']}
                />
                <WelcomeItem
                    description={
                        <Localize
                            i18n_default_text='Earn <0>fixed returns </0> by <0>risking only</0> what you put in.'
                            components={[<Text key={0} weight='bold' as='strong' color='prominent' />]}
                        />
                    }
                    onClick={() => switchPlatform({ route: routes.trade, contract_type: 'rise_fall' })}
                    title={localize('Digital Options')}
                    icon={<DigitalOptions />}
                    mobileIcon={<DigitalOptionsMobile />}
                    options={['Forex', 'Synthetics', 'Stocks and indices', 'Commodities']}
                />
                <WelcomeItem
                    description={
                        <Localize
                            i18n_default_text='Let us introduce you to trading on Deriv.'
                            components={[<Text key={0} weight='bold' as='strong' color='prominent' />]}
                        />
                    }
                    onClick={() => switchPlatform({ route: routes.trade })}
                    title={localize('Not sure?')}
                    icon={<NotSure />}
                    mobileIcon={<NotSureMobile />}
                    small
                />
            </div>
        </div>
    );
};

Welcome.propTypes = {
    onNext: PropTypes.func.isRequired,
};

export default withRouter(
    connect(({ ui }) => ({
        setOnboardingContractType: ui.setOnboardingContractType,
    }))(Welcome)
);
