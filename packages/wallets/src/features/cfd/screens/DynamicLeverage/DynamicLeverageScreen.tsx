import React from 'react';
import classNames from 'classnames';
import { useDebounceValue } from 'usehooks-ts';
import { useDynamicLeverage } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { useDynamicLeverageModalState } from '../../components/DynamicLeverageContext';
import { PlatformDetails } from '../../constants';
import { DynamicLeverageMarketCard } from './DynamicLeverageMarketCard';
import './DynamicLeverageScreen.scss';

const DynamicLeverageScreen = () => {
    const { data: dynamicLeverages } = useDynamicLeverage(PlatformDetails.mt5.platform);
    const { isDynamicLeverageVisible } = useDynamicLeverageModalState();
    const [isDynamicLeverageHidden] = useDebounceValue(!isDynamicLeverageVisible, 600);

    if (!dynamicLeverages) return null;

    return (
        <div
            className={classNames('wallets-dynamic-leverage-screen__container', {
                'wallets-dynamic-leverage-screen__container--flip': isDynamicLeverageVisible,
                'wallets-dynamic-leverage-screen__container--hidden':
                    !isDynamicLeverageVisible && isDynamicLeverageHidden,
            })}
            data-testid='dt_dynamic_leverage_container'
        >
            <Text align='start'>
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text='Enjoy dynamic leverage of <0>up to 1:1500</0> when trading selected instruments in the forex, commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts automatically to your trading position, based on asset type and trading volume.'
                />
            </Text>
            <div className='wallets-dynamic-leverage-screen__content'>
                {(['forex', 'metals', 'cryptocurrencies', 'stock_indices'] as const).map(key => {
                    const {
                        display_name: displayName,
                        instruments,
                        max,
                        min,
                        volume: { data },
                    } = dynamicLeverages[key];
                    return (
                        <DynamicLeverageMarketCard
                            data={data}
                            displayName={displayName}
                            instruments={instruments}
                            key={`dynamic-leverage-screen__${key}`}
                            max={max}
                            min={min}
                        />
                    );
                })}
            </div>
        </div>
    );
};
export default DynamicLeverageScreen;
