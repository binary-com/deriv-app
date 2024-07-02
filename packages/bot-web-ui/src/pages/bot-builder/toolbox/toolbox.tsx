import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { rudderStackSendOpenEvent } from '../../../analytics/rudderstack-common-events';
import { useDBotStore } from '../../../stores/useDBotStore';
import ToolbarButton from '../toolbar/toolbar-button';
import SearchBox from './search-box';
import { ToolboxItems } from './toolbox-items';

const Toolbox = observer(() => {
    const { ui } = useStore();
    const { is_desktop } = ui;
    const { toolbox, flyout, quick_strategy } = useDBotStore();
    const {
        hasSubCategory,
        is_search_loading,
        onMount,
        onSearch,
        onSearchBlur,
        onSearchClear,
        onSearchKeyUp,
        onToolboxItemClick,
        onToolboxItemExpand,
        onUnmount,
        sub_category_index,
        toolbox_dom,
    } = toolbox;

    const { setFormVisibility } = quick_strategy;
    const { setVisibility, selected_category } = flyout;

    const toolbox_ref = React.useRef(ToolboxItems);
    const [is_open, setOpen] = React.useState(true);

    React.useEffect(() => {
        onMount(toolbox_ref);
        return () => onUnmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleQuickStrategyOpen = () => {
        setFormVisibility(true);
        // send to rs if quick strategy is opened from bot builder (desktop)
        rudderStackSendOpenEvent({ subform_source: 'bot_builder', subform_name: 'quick_strategy' });
    };

    if (is_desktop) {
        return (
            <div className='db-toolbox' data-testid='dashboard__toolbox'>
                <ToolbarButton
                    popover_message={localize('Click here to start building your Deriv Bot.')}
                    button_id='db-toolbar__get-started-button'
                    button_classname='toolbar__btn toolbar__btn--icon toolbar__btn--start'
                    buttonOnClick={handleQuickStrategyOpen}
                    button_text={localize('Quick strategy')}
                />
                <div id='gtm-toolbox' className='db-toolbox__content'>
                    <div className='db-toolbox__header'>
                        <div
                            className='db-toolbox__title'
                            data-testid='db-toolbox__title'
                            onClick={() => {
                                setOpen(!is_open);
                                setVisibility(false);
                            }}
                        >
                            {localize('Blocks menu')}
                            <span
                                className={classNames('db-toolbox__title__chevron', {
                                    'db-toolbox__title__chevron--active': is_open,
                                })}
                            >
                                <Icon icon='IcChevronDownBold' />
                            </span>
                        </div>
                    </div>
                    <div
                        className={classNames('db-toolbox__content-wrapper', { active: is_open })}
                        data-testid='db-toolbox__content-wrapper'
                    >
                        <SearchBox
                            is_search_loading={is_search_loading}
                            onSearch={onSearch}
                            onSearchBlur={onSearchBlur}
                            onSearchClear={onSearchClear}
                            onSearchKeyUp={onSearchKeyUp}
                        />
                        <div className='db-toolbox__category-menu'>
                            {toolbox_dom &&
                                Array.from(toolbox_dom.childNodes as HTMLElement[]).map((category, index) => {
                                    if (category.tagName.toUpperCase() === 'CATEGORY') {
                                        const has_sub_category = hasSubCategory(category.children);
                                        const is_sub_category_open = sub_category_index.includes(index);
                                        return (
                                            <div
                                                key={`db-toolbox__row--${category.getAttribute('id')}`}
                                                className={classNames('db-toolbox__row', {
                                                    'db-toolbox__row--active':
                                                        selected_category?.getAttribute('id') === category?.id,
                                                })}
                                            >
                                                <div
                                                    className='db-toolbox__item'
                                                    onClick={() => {
                                                        // eslint-disable-next-line no-unused-expressions
                                                        has_sub_category
                                                            ? onToolboxItemExpand(index)
                                                            : onToolboxItemClick(category);
                                                    }}
                                                >
                                                    <div className='db-toolbox__category-text'>
                                                        <div className='db-toolbox__label'>
                                                            {localize(category.getAttribute('name') as string)}
                                                        </div>
                                                        {has_sub_category && (
                                                            <div
                                                                className={classNames('db-toolbox__category-arrow', {
                                                                    'db-toolbox__category-arrow--active':
                                                                        is_sub_category_open,
                                                                })}
                                                            >
                                                                <Icon icon='IcChevronDownBold' />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {has_sub_category &&
                                                    is_sub_category_open &&
                                                    (Array.from(category.childNodes) as HTMLElement[]).map(
                                                        subCategory => {
                                                            return (
                                                                <div
                                                                    key={`db-toolbox__sub-category-row--${subCategory.getAttribute(
                                                                        'id'
                                                                    )}`}
                                                                    className={classNames(
                                                                        'db-toolbox__sub-category-row',
                                                                        {
                                                                            'db-toolbox__sub-category-row--active':
                                                                                selected_category?.getAttribute(
                                                                                    'id'
                                                                                ) === subCategory?.id,
                                                                        }
                                                                    )}
                                                                    onClick={() => {
                                                                        onToolboxItemClick(subCategory);
                                                                    }}
                                                                >
                                                                    <Text size='xxs'>
                                                                        {localize(
                                                                            subCategory.getAttribute('name') as string
                                                                        )}
                                                                    </Text>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
});

export default Toolbox;
