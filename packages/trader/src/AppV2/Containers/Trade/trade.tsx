import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import BottomNav from 'AppV2/Components/BottomNav';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Loading } from '@deriv/components';

const Trade = observer(() => {
    const { active_symbols, onMount, onUnmount } = useTraderStore();

    React.useEffect(() => {
        onMount();
        return onUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <BottomNav>{active_symbols.length ? <Text size='sm'>Trade</Text> : <Loading.DTraderV2 />}</BottomNav>;
});

export default Trade;
