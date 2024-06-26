import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import NoSearchResult from './common/no-search-result-found';
import QuickStrategyGuides from './quick-strategy-content/quick-strategy-guides';
import FAQContent from './faq-content';
import GuideContent from './guide-content';
import TutorialsTabDesktop from './tutorials-tab-desktop';
import TutorialsTabMobile from './tutorials-tab-mobile';

type TTutorialsTab = {
    handleTabChange: (active_number: number) => void;
};

export type TTutorialsTabItem = {
    label: string;
    content?: JSX.Element;
};

const TutorialsTab = observer(({ handleTabChange }: TTutorialsTab) => {
    const { ui } = useStore();
    const { is_desktop } = ui;
    const { dashboard } = useDBotStore();
    const [prev_active_tutorials, setPrevActiveTutorialsTab] = React.useState<number | null>(0);

    const {
        active_tab_tutorials,
        video_tab_content,
        guide_tab_content,
        faq_tab_content,
        is_dialog_open,
        quick_strategy_tab_content,
    } = dashboard;

    React.useEffect(() => {
        if ([0, 1, 2].includes(active_tab_tutorials)) {
            setPrevActiveTutorialsTab(active_tab_tutorials);
        }
    }, [active_tab_tutorials]);

    const has_content_guide_tab =
        guide_tab_content.length > 0 ||
        video_tab_content.length > 0 ||
        faq_tab_content.length > 0 ||
        quick_strategy_tab_content.length > 0;

    const tutorial_tabs: TTutorialsTabItem[] = [
        {
            label: localize('Guide'),
            content: (
                <GuideContent
                    is_dialog_open={is_dialog_open}
                    guide_tab_content={guide_tab_content}
                    video_tab_content={video_tab_content}
                />
            ),
        },
        {
            label: localize('FAQ'),
            content: <FAQContent faq_list={faq_tab_content} handleTabChange={handleTabChange} />,
        },
        {
            label: localize('Quick strategy guides'),
            content: <QuickStrategyGuides quick_strategy_tab_content={quick_strategy_tab_content} />,
        },
        {
            label: localize('Search'),
            content: has_content_guide_tab ? (
                <>
                    <GuideContent
                        is_dialog_open={is_dialog_open}
                        guide_tab_content={guide_tab_content}
                        video_tab_content={video_tab_content}
                    />
                    <FAQContent faq_list={faq_tab_content} />
                    <QuickStrategyGuides quick_strategy_tab_content={quick_strategy_tab_content} />
                </>
            ) : (
                <NoSearchResult />
            ),
        },
    ];

    return is_desktop ? (
        <TutorialsTabDesktop tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
    ) : (
        <TutorialsTabMobile tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
    );
});

export default TutorialsTab;
