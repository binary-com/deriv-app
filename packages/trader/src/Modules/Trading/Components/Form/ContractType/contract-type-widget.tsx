import React from 'react';
import { InlineMessage, Text, Icon } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import ContractType from './contract-type';
import {
    findContractCategory,
    getContractTypeCategoryIcons,
    getCategoriesSortedByKey,
    getContractTypes,
} from '../../../Helpers/contract-type';
import { TContractCategory, TContractType, TList } from './types';
import { useTraderStore } from 'Stores/useTraderStores';

type TContractTypeWidget = {
    name: string;
    value: TContractType['value'];
    list: TContractCategory[];
    onChange: (e: {
        target: {
            name: string;
            value: unknown;
        };
    }) => Promise<void>;
    languageChanged?: boolean;
    unavailable_trade_types_list?: TContractCategory[];
};

const ContractTypeWidget = observer(
    ({ name, value, list, onChange, languageChanged, unavailable_trade_types_list = [] }: TContractTypeWidget) => {
        const {
            active_symbols: { active_symbols },
            ui: { is_mobile },
        } = useStore();
        const { symbol } = useTraderStore();
        const wrapper_ref = React.useRef<HTMLDivElement | null>(null);
        const [is_dialog_open, setDialogVisibility] = React.useState<boolean | null>();
        const [is_info_dialog_open, setInfoDialogVisibility] = React.useState(false);
        const [hide_back_button, setHideBackButton] = React.useState(false);
        const [selected_category, setSelectedCategory] = React.useState<TList['key']>('All');
        const [search_query, setSearchQuery] = React.useState('');
        const [item, setItem] = React.useState<TContractType | null>(null);
        const animation_timeout = React.useRef<ReturnType<typeof setTimeout>>();

        const handleClickOutside = React.useCallback(
            (event: MouseEvent) => {
                if (is_mobile) return;
                if (wrapper_ref && !wrapper_ref.current?.contains(event.target as Node) && is_dialog_open) {
                    setDialogVisibility(false);
                    setItem({ ...item, value });
                }
            },
            [item, value, is_dialog_open, is_mobile]
        );

        const getCategoryName = (clicked_item: TContractType) =>
            getContractTypes(list_with_category(), clicked_item)?.find(item => item.value === clicked_item.value)?.text;

        React.useEffect(() => {
            return () => {
                clearTimeout(animation_timeout.current);
            };
        }, []);

        React.useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [handleClickOutside]);

        React.useEffect(() => {
            if (typeof is_dialog_open === 'boolean') {
                Analytics.trackEvent('ce_trade_types_form', {
                    action: is_dialog_open ? 'open' : 'close',
                    form_source: 'contract_set_up_form',
                    form_name: 'default',
                });
            }
        }, [is_dialog_open]);

        const handleCategoryClick: React.ComponentProps<typeof ContractType.Dialog>['onCategoryClick'] = ({ key }) => {
            if (key) setSelectedCategory(key);
        };

        const handleSelect = (
            clicked_item: TContractType,
            e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLInputElement>
        ) => {
            const categories = list_with_category();
            const { key } = findContractCategory(categories, clicked_item);
            if ('id' in e.target && e.target.id !== 'info-icon' && clicked_item) {
                const is_from_info_dialog = /_btn$/.test(e.target.id as string);
                const subform_name = is_from_info_dialog ? 'info_new' : 'trade_type';

                setDialogVisibility(false);
                setInfoDialogVisibility(false);
                setItem(clicked_item);
                setSelectedCategory(key);

                onChange({ target: { name, value: clicked_item.value } });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((window as any).hj) (window as any).hj('event', `selected_${clicked_item.value}_contract_type`);
                if (subform_name === 'trade_type') {
                    Analytics.trackEvent('ce_trade_types_form', {
                        action: 'choose_trade_type',
                        subform_name,
                        tab_name: selected_category,
                        trade_type_name: getCategoryName(clicked_item),
                        form_name: 'default',
                    });
                } else {
                    Analytics.trackEvent('ce_trade_types_form', {
                        action: 'choose_trade_type',
                        subform_name,
                        trade_type_name: getCategoryName(clicked_item),
                        form_name: 'default',
                    });
                }
            }
        };

        const handleInfoClick = (clicked_item: TContractType) => {
            setInfoDialogVisibility(!is_info_dialog_open);
            setItem(clicked_item);

            Analytics.trackEvent('ce_trade_types_form', {
                action: 'info_open',
                tab_name: selected_category,
                trade_type_name: getCategoryName(clicked_item),
            });
        };

        const onSearchBlur = () => {
            if (search_query) {
                Analytics.trackEvent('ce_trade_types_form', {
                    action: 'search',
                    search_string: search_query,
                });
            }
        };

        const onWidgetClick = () => {
            setDialogVisibility(!is_dialog_open);
            animation_timeout.current = setTimeout(() => {
                setHideBackButton(false);
                setInfoDialogVisibility(false);
            }, 200);
            setItem({ ...item, value });
        };

        const onBackButtonClick = () => {
            setInfoDialogVisibility(false);
            setItem({ ...item, value });
        };

        const onChangeInput = (searchQueryItem: string) => setSearchQuery(searchQueryItem);

        const handleLearnMore = () => {
            setDialogVisibility(true);
            setInfoDialogVisibility(true);
            setItem(item || { value });
            Analytics.trackEvent('ce_trade_types_form', {
                action: 'info_open',
                tab_name: selected_category,
                trade_type_name: getCategoryName(item || { value }),
            });
            setHideBackButton(true);
        };

        const onClose = () => {
            onWidgetClick();
        };

        const list_with_category = () => {
            const ordered_list = list && getCategoriesSortedByKey(list);
            const ordered_unavailable_types_list = getCategoriesSortedByKey(unavailable_trade_types_list);
            const all_trade_types_list = ordered_list?.concat(ordered_unavailable_types_list);
            const accumulators_category = all_trade_types_list?.filter(
                ({ label }) => label === localize('Accumulators')
            );
            const multipliers_category = all_trade_types_list?.filter(({ label }) => label === localize('Multipliers'));
            const options_category = all_trade_types_list?.filter(
                ({ label }) => label !== localize('Multipliers') && label !== localize('Accumulators')
            );
            const categories: TList[] = [];
            const contract_type_category_icon: { [key: string]: string } = getContractTypeCategoryIcons();

            if (list && list.length > 0) {
                categories.push({
                    label: localize('All'),
                    contract_categories: all_trade_types_list,
                    key: 'All',
                    icon: '',
                });
            }

            if (multipliers_category && multipliers_category.length > 0) {
                categories.push({
                    label: localize('Multipliers'),
                    contract_categories: multipliers_category,
                    key: 'Multipliers',
                    icon: '',
                });
            }

            if (options_category && options_category.length > 0) {
                categories.push({
                    label: localize('Options'),
                    contract_categories: options_category,
                    component: options_category.some(category => /Vanillas|Turbos/i.test(category.key)) ? (
                        <span className='dc-vertical-tab__header--new'>{localize('NEW')}!</span>
                    ) : null,
                    key: 'Options',
                    icon: '',
                });
            }

            if (accumulators_category && accumulators_category.length > 0) {
                categories.push({
                    label: localize('Accumulators'),
                    contract_categories: accumulators_category,
                    component: <span className='dc-vertical-tab__header--new'>{localize('NEW')}!</span>,
                    key: 'Accumulators',
                    icon: '',
                });
            }

            return categories.map(contract_category => {
                const contract_types = contract_category?.contract_categories?.reduce<TContractType[]>(
                    (prev, current) => [...prev, ...current.contract_types],
                    []
                );

                const icon = contract_category.key
                    ? contract_type_category_icon[contract_category.key]
                    : contract_category.icon;

                let contract_categories = contract_category.contract_categories;

                if (search_query) {
                    contract_categories = contract_category?.contract_categories
                        ?.filter(category =>
                            category.contract_types.find(type =>
                                type.text?.toLowerCase().includes(search_query.toLowerCase())
                            )
                        )
                        .map(category => ({
                            ...category,
                            contract_types: category.contract_types.filter(type =>
                                type.text?.toLowerCase().includes(search_query.toLowerCase())
                            ),
                        }));
                }

                return {
                    ...contract_category,
                    contract_types,
                    icon,
                    contract_categories,
                };
            });
        };

        const selected_category_contracts = () => {
            const selected_list_category = list_with_category()?.find(
                categoryItem => categoryItem.key === selected_category
            );
            return (selected_list_category || list_with_category()[0]).contract_categories;
        };
        const should_show_info_banner = !!selected_category_contracts()?.some(i => i.is_unavailable);

        const title =
            Number(list_with_category()[0]?.contract_categories?.length) > 1
                ? localize('Tutorial')
                : getCategoryName(item || { value });

        const info_banner = (
            <InlineMessage
                size={is_mobile ? 'sm' : 'xs'}
                type='information'
                message={
                    <Localize
                        i18n_default_text='Some trade types are unavailable for {{symbol}}.'
                        values={{
                            symbol: active_symbols.find(s => s.symbol === symbol)?.display_name,
                        }}
                        shouldUnescape
                    />
                }
            />
        );

        return (
            <React.Fragment>
                <Text as='button' line_height='s' size='xxxs' className='learn-more_title' onClick={handleLearnMore}>
                    <Localize i18n_default_text='Learn about this trade type' />
                </Text>
                <div
                    data-testid='dt_contract_widget'
                    id='dt_contract_dropdown'
                    className={`contract-type-widget contract-type-widget--${value} dropdown--left`}
                    ref={wrapper_ref}
                    tabIndex={0}
                >
                    <ContractType.Display
                        is_open={is_dialog_open || is_info_dialog_open}
                        list={list}
                        name={name ?? ''}
                        onClick={onWidgetClick}
                        value={value}
                    />
                    <ContractType.Dialog
                        is_info_dialog_open={is_info_dialog_open}
                        is_open={!!is_dialog_open}
                        item={item || { value }}
                        categories={list_with_category()}
                        selected={selected_category || list_with_category()[0]?.key}
                        onBackButtonClick={onBackButtonClick}
                        onSearchBlur={onSearchBlur}
                        onClose={onClose}
                        onChangeInput={onChangeInput}
                        onCategoryClick={handleCategoryClick}
                        show_loading={languageChanged}
                        title={title}
                        hide_back_button={hide_back_button}
                        info_banner={should_show_info_banner && info_banner}
                        learn_more_banner={
                            <button onClick={() => handleInfoClick(item || { value })} className='learn-more'>
                                <Text size={is_mobile ? 'xxs' : 'xs'} line_height={is_mobile ? 'l' : 'xl'}>
                                    <Localize i18n_default_text='Learn more about trade types' />
                                </Text>
                                <Icon icon='IcChevronRight' size={16} />
                            </button>
                        }
                    >
                        {is_info_dialog_open ? (
                            <ContractType.Info
                                handleSelect={handleSelect}
                                item={item || { value }}
                                selected_value={value}
                                list={list_with_category()}
                                info_banner={info_banner}
                            />
                        ) : (
                            <ContractType.List
                                handleSelect={handleSelect}
                                list={selected_category_contracts() as TContractCategory[]}
                                should_show_info_banner={should_show_info_banner}
                                value={value}
                            />
                        )}
                    </ContractType.Dialog>
                </div>
            </React.Fragment>
        );
    }
);

export default ContractTypeWidget;
