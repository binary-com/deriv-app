import React from 'react';
import { Localize } from '@deriv/translations';
import { getPositionsV2TabIndexFromURL } from '@deriv/shared';
import { useLocalStorageData } from '@deriv/hooks';
import { Tab } from '@deriv-com/quill-ui';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import { useModulesStore } from 'Stores/useModulesStores';
import { setPositionURLParams, TAB_NAME } from 'AppV2/Utils/positions-utils';
import BottomNav from 'AppV2/Components/BottomNav';
import PositionsContent from './positions-content';
import { useHistory } from 'react-router-dom';
import OnboardingGuide from 'AppV2/Components/OnboardingGuide/GuideForPages';

const Positions = observer(() => {
    const [hasButtonsDemo, setHasButtonsDemo] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(getPositionsV2TabIndexFromURL());
    const [guide_dtrader_v2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
    });
    const history = useHistory();

    const {
        client: { is_logged_in },
    } = useStore();
    const {
        positions: { onUnmount },
    } = useModulesStore();

    const tabs = [
        {
            id: TAB_NAME.OPEN.toLowerCase(),
            title: <Localize i18n_default_text='Open' />,
            content: <PositionsContent hasButtonsDemo={hasButtonsDemo} setHasButtonsDemo={setHasButtonsDemo} />,
        },
        {
            id: TAB_NAME.CLOSED.toLowerCase(),
            title: <Localize i18n_default_text='Closed' />,
            content: <PositionsContent isClosedTab />,
        },
    ];

    const onChangeTab = (new_active_tab: number) => {
        setActiveTab(new_active_tab);
        setPositionURLParams(tabs[new_active_tab].id);
    };

    React.useEffect(() => {
        setPositionURLParams(tabs[activeTab].id);

        if (guide_dtrader_v2?.positions_page) {
            setHasButtonsDemo(true);
        }

        return () => {
            const is_contract_details = history.location.pathname.startsWith('/contract/');
            if (!is_contract_details) onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BottomNav>
            <div className='positions-page'>
                <Tab.Container
                    contentStyle='fill'
                    className='positions-page__tabs'
                    size='md'
                    selectedTabIndex={activeTab}
                    onChangeTab={onChangeTab}
                >
                    <Tab.List>
                        {tabs.map(({ id, title }) => (
                            <Tab.Trigger key={id}>{title}</Tab.Trigger>
                        ))}
                    </Tab.List>
                    <Tab.Content className='positions-page__tabs-content'>
                        {tabs.map(({ id, content }) => (
                            <Tab.Panel key={id}>{content}</Tab.Panel>
                        ))}
                    </Tab.Content>
                </Tab.Container>
            </div>
            {!guide_dtrader_v2?.positions_page && is_logged_in && (
                <OnboardingGuide type='positions_page' callback={() => setHasButtonsDemo(true)} />
            )}
        </BottomNav>
    );
});

export default Positions;
