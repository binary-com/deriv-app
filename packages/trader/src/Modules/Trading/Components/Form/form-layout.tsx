import React from 'react';
import Loadable from 'react-loadable';
import { isTabletDrawer } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores.js';

type TFormLayout = {
    is_market_closed: ReturnType<typeof useTraderStore>['is_market_closed'];
    is_trade_enabled: boolean;
};

const Screen = Loadable({
    loader: () =>
        isTabletDrawer()
            ? import(/* webpackChunkName: "screen-small" */ './screen-small')
            : import(/* webpackChunkName: "screen-large" */ './screen-large'),
    loading: () => null,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

const FormLayout = observer(({ is_market_closed, is_trade_enabled }: TFormLayout) => {
    const { common } = useStore();
    const { current_language } = common;
    return (
        <React.Fragment key={current_language}>
            <Screen
                is_trade_enabled={is_trade_enabled}
                is_market_closed={isTabletDrawer() ? undefined : is_market_closed}
            />
        </React.Fragment>
    );
});

export default React.memo(FormLayout);
