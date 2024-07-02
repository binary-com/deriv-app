import React from 'react';
import classNames from 'classnames';
import { Icon, SelectNative } from '@deriv/components';
import { TListItem } from '@deriv/components/src/components/dropdown/utility';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import SearchInput from './common/search-input';
import { TTutorialsTabItem } from './tutorials';

type TTutorialsTabMobile = {
    tutorial_tabs: TTutorialsTabItem[];
    prev_active_tutorials: number;
};

const TutorialsTabMobile = observer(({ tutorial_tabs, prev_active_tutorials }: TTutorialsTabMobile) => {
    const { dashboard } = useDBotStore();
    const { active_tab_tutorials, faq_search_value, setActiveTabTutorial, setFAQSearchValue, resetTutorialTabContent } =
        dashboard;

    const search = faq_search_value?.toLowerCase();
    const initialSelectedTab: TTutorialsTabItem = { label: '', content: undefined };
    const [selectedTab, setSelectedTab] = React.useState(initialSelectedTab);
    const [showSearchBar, setShowSearchBar] = React.useState(false);
    const scroll_ref = React.useRef<HTMLDivElement & SVGSVGElement>(null);

    React.useEffect(() => {
        if (search) setShowSearchBar(true);
        setSelectedTab(tutorial_tabs[active_tab_tutorials] || {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tutorial_tabs]);

    const onFocusSearch = () => setActiveTabTutorial(3);

    const scrollToTop = () => {
        if (scroll_ref.current) {
            scroll_ref.current.scrollTop = 0;
        }
    };

    const onChangeHandle = React.useCallback(
        ({ target }: React.ChangeEvent<HTMLSelectElement>) =>
            setActiveTabTutorial(tutorial_tabs.findIndex(i => i.label === target.value)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [active_tab_tutorials]
    );

    const onHandleChangeMobile = () => {
        setShowSearchBar(!showSearchBar);
    };

    const onClickBackButton = () => {
        setFAQSearchValue('');
        setShowSearchBar(!showSearchBar);
        resetTutorialTabContent();
        setActiveTabTutorial(prev_active_tutorials);
        setSelectedTab(tutorial_tabs[prev_active_tutorials] || {});
    };

    const onCloseHandleSearch = () => {
        onFocusSearch();
        setFAQSearchValue('');
        setActiveTabTutorial(prev_active_tutorials);
        resetTutorialTabContent();
    };

    React.useEffect(() => {
        const selectElement = document.getElementById('dt_components_select-native_select-tag') as HTMLSelectElement;

        if (selectElement) {
            selectElement.removeChild(selectElement?.options[3]);
        }
    }, []);

    return (
        <div className='tutorials-mobile' data-testid='test-tutorials-mobile'>
            <div
                className={classNames('tutorials-mobile__select', {
                    'tutorials-mobile__select--show-search': showSearchBar,
                    'tutorials-mobile__select--hide-search': !showSearchBar,
                })}
                data-testid={showSearchBar ? 'id-search-visible' : 'id-search-hidden'}
            >
                <Icon
                    onClick={onClickBackButton}
                    data_testid='id-arrow-left-bold'
                    className='arrow-left-bold'
                    icon='IcArrowLeftBold'
                />
                <SearchInput
                    faq_value={faq_search_value}
                    setFaqSearchContent={setFAQSearchValue}
                    prev_active_tutorials={prev_active_tutorials}
                />
                {search && (
                    <Icon
                        data_testid='id-close-icon'
                        className='close-icon'
                        data-testid='id-test-search'
                        width='1.6rem'
                        height='1.6rem'
                        icon='IcDbotClose'
                        onClick={onCloseHandleSearch}
                    />
                )}

                <SelectNative
                    data_testid='id-tutorials-select'
                    className='dc-tabs__wrapper__group__search-input--active'
                    list_items={
                        tutorial_tabs.map(({ label }, idx) => ({
                            id: idx,
                            value: label,
                            text: label,
                        })) as TListItem[]
                    }
                    value={selectedTab.label}
                    label=''
                    should_show_empty_option={false}
                    onChange={e => {
                        onChangeHandle(e);
                        scrollToTop();
                    }}
                />
                <Icon onClick={onHandleChangeMobile} className='search-icon' icon='IcSearch' />
            </div>
            <div
                className={classNames({
                    'tutorials-mobile__guide': active_tab_tutorials === 0,
                    'tutorials-mobile__faq': active_tab_tutorials === 1,
                    'tutorials-mobile__qs-guide': active_tab_tutorials === 2,
                    'tutorials-mobile__search': active_tab_tutorials === 3,
                })}
                ref={scroll_ref}
            >
                {selectedTab.content}
            </div>
        </div>
    );
});

export default TutorialsTabMobile;
