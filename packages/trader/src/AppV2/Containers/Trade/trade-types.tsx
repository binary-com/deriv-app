import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Button, Chip, Text, ActionSheet } from '@deriv-com/quill-ui';
import { DraggableList } from 'AppV2/Components/DraggableList';
import { TradeTypeList } from 'AppV2/Components/TradeTypeList';
import { getTradeTypesList, sortCategoriesInTradeTypeOrder } from 'AppV2/Utils/trade-types-utils';
import { checkContractTypePrefix } from 'AppV2/Utils/contract-type';
import { Localize, localize } from '@deriv/translations';
import { safeParse } from '@deriv/utils';
import TradeTypesSelectionGuide from 'AppV2/Components/OnboardingGuide/TradeTypesSelectionGuide';
import Guide from '../../Components/Guide';

type TTradeTypesProps = {
    onTradeTypeSelect: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    trade_types: ReturnType<typeof getTradeTypesList>;
    contract_type: string;
    is_dark_mode_on: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'contract_type'>;

type TItem = {
    id: string;
    title: string;
    icon?: React.ReactNode;
};

type TResultItem = {
    id: string;
    title?: string;
    button_title?: string;
    onButtonClick?: () => void;
    items: TItem[];
};

const TradeTypes = ({ contract_type, onTradeTypeSelect, trade_types, is_dark_mode_on }: TTradeTypesProps) => {
    const [is_open, setIsOpen] = React.useState<boolean>(false);
    const [is_editing, setIsEditing] = React.useState<boolean>(false);
    const trade_types_ref = React.useRef<HTMLDivElement>(null);

    const createArrayFromCategories = (data: TTradeTypesProps['trade_types']): TItem[] => {
        const result: TItem[] = [];

        data.forEach(category => {
            result.push({
                id: category.value,
                title: category.text ?? '',
            });
        });

        return result;
    };

    const saved_pinned_trade_types_string: string = localStorage.getItem('pinned_trade_types') ?? '[]';
    const saved_pinned_trade_types: TResultItem[] = useMemo(
        () => safeParse(saved_pinned_trade_types_string) ?? [],
        [saved_pinned_trade_types_string]
    );

    const [other_trade_types, setOtherTradeTypes] = useState<TResultItem[]>([]);
    const [pinned_trade_types, setPinnedTradeTypes] = useState<TResultItem[]>(saved_pinned_trade_types);

    const trade_types_array = useMemo(() => {
        return createArrayFromCategories(trade_types);
    }, [trade_types]);

    const getPinnedItems = useCallback(() => {
        const pinned_items = filterItems(getItems(saved_pinned_trade_types), trade_types_array);

        if (pinned_items.length === 0) {
            pinned_items.push(...trade_types_array.slice(0, trade_types_array.length));
        }
        return pinned_items;
    }, [saved_pinned_trade_types, trade_types_array]);

    const setTradeTypes = useCallback(() => {
        const pinned_items = getPinnedItems();

        const default_pinned_trade_types = [
            {
                id: 'pinned',
                title: localize('Pinned'),
                items: pinned_items,
            },
        ];

        const default_other_trade_types = [
            {
                id: 'other',
                items: trade_types_array.filter(item => !pinned_items.some(pinned_item => pinned_item.id === item.id)),
            },
        ];

        setPinnedTradeTypes(default_pinned_trade_types);
        setOtherTradeTypes(default_other_trade_types);
    }, [getPinnedItems, trade_types_array]);

    useEffect(() => {
        setTradeTypes();
    }, [setTradeTypes]);

    useEffect(() => {
        scrollToSelectedTradeType();
    }, []);

    const handleCloseTradeTypes = () => {
        setIsOpen(false);
        setIsEditing(false);
    };

    const handleCustomizeTradeTypes = () => {
        setIsEditing(true);
    };

    const handleAddPinnedClick = (item: TItem) => {
        setOtherTradeTypes(prev_categories => modifyCategories(prev_categories, item));
        setPinnedTradeTypes(prev_pinned => modifyPinnedCategories(prev_pinned, item, 'add'));
    };

    const handleRemovePinnedClick = (item: TItem) => {
        setPinnedTradeTypes(prev_categories => modifyCategories(prev_categories, item));
        setOtherTradeTypes(prev_others => modifyOtherCategories(prev_others, item));
    };

    const modifyPinnedCategories = (categories: TResultItem[], item: TItem, action: 'add' | 'remove') => {
        const updated_categories = [...categories];
        const pinned_category = updated_categories.find(cat => cat.id === 'pinned');

        if (action === 'add') {
            if (pinned_category) {
                pinned_category.items.push(item);
            } else {
                updated_categories.push({
                    id: 'pinned',
                    title: localize('Pinned'),
                    items: [item],
                });
            }
        } else if (action === 'remove') {
            updated_categories.map(category => ({
                ...category,
                items: category.items.filter(i => i.id !== item.id),
            }));
        }

        return updated_categories;
    };

    const modifyCategories = (categories: TResultItem[], item: TItem) =>
        categories.map(category => ({
            ...category,
            items: category.items.filter(i => i.id !== item.id),
        }));

    const modifyOtherCategories = (categories: TResultItem[], item: TItem) => {
        const updated_categories = [...categories];
        const other_category = updated_categories.find(cat => cat.id === 'other');

        if (other_category) {
            other_category.items.unshift(item);
        } else {
            updated_categories.push({
                id: 'other',
                items: [item],
            });
        }

        return updated_categories.map(category => {
            return {
                ...category,
                items: sortCategoriesInTradeTypeOrder(trade_types, category.items),
            };
        });
    };

    const scrollToSelectedTradeType = () => {
        setTimeout(() => {
            let position_x = 0;
            if (trade_types_ref.current) {
                const selected_chip = trade_types_ref.current.querySelector(
                    'button[data-state="selected"]'
                ) as HTMLButtonElement;
                if (selected_chip) {
                    position_x =
                        selected_chip.getBoundingClientRect().x -
                            (window.innerWidth - selected_chip.getBoundingClientRect().width) / 2 || 0;
                }
                trade_types_ref.current.scrollBy({
                    left: position_x,
                    top: 0,
                });
            }
        }, 0);
    };

    const savePinnedToLocalStorage = () => {
        localStorage.setItem('pinned_trade_types', JSON.stringify(pinned_trade_types));
        setIsEditing(false);
    };

    const handleOnDrag = (categories: TResultItem[]) => {
        setPinnedTradeTypes(categories);
    };

    const handleOnTradeTypeSelect = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        onTradeTypeSelect(e);
        scrollToSelectedTradeType();
        setIsOpen(false);
    };

    const handleOpenActionSheet = () => {
        setTradeTypes();
        setIsOpen(true);
    };

    const isTradeTypeSelected = (value: string) =>
        checkContractTypePrefix([contract_type, value]) || contract_type === value;

    const getItems = (trade_types: TResultItem[]) => trade_types.flatMap(type => type.items);

    const filterItems = (items: TItem[], tradeTypes: TItem[]): TItem[] => {
        const trade_types_ids = tradeTypes.map(type => type.id);
        return items.filter(item => trade_types_ids.includes(item.id));
    };

    const getTradeTypeChips = () => {
        const pinned_items = getPinnedItems();
        const is_contract_type_in_pinned = pinned_items.some(item => item.id === contract_type);

        const other_item = !is_contract_type_in_pinned
            ? getItems(other_trade_types).find(
                  item => item && (item.id === contract_type || checkContractTypePrefix([item.id, contract_type]))
              )
            : null;

        return [...pinned_items, other_item].filter(Boolean) as TItem[];
    };

    const trade_type_chips = getTradeTypeChips();
    const should_show_view_all = trade_type_chips.length >= 2 || getItems(other_trade_types).length > 0;

    return (
        <div className='trade__trade-types' ref={trade_types_ref}>
            {trade_type_chips.map(({ title, id }: TItem) => (
                <Chip.Selectable key={id} onChipSelect={onTradeTypeSelect} selected={isTradeTypeSelected(id)}>
                    <Text size='sm'>{title}</Text>
                </Chip.Selectable>
            ))}
            {should_show_view_all && (
                <Button
                    key='trade-types-all'
                    onClick={handleOpenActionSheet}
                    variant='tertiary'
                    className='trade__trade-types-header'
                    color={is_dark_mode_on ? 'white' : 'black'}
                >
                    <Text size='sm' bold underlined color='var(--component-button-label-color-blackWhite-tertiary)'>
                        {<Localize i18n_default_text='View all' />}
                    </Text>
                </Button>
            )}
            <ActionSheet.Root isOpen={is_open} expandable={false} onClose={handleCloseTradeTypes}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header
                        title={<Localize i18n_default_text='Trade types' />}
                        icon={!is_editing && <Guide />}
                    />
                    <ActionSheet.Content className='mock-action-sheet--content'>
                        {is_editing ? (
                            <DraggableList
                                categories={pinned_trade_types}
                                onRightIconClick={handleRemovePinnedClick}
                                onAction={savePinnedToLocalStorage}
                                onDrag={handleOnDrag}
                            />
                        ) : (
                            <TradeTypeList
                                categories={pinned_trade_types}
                                onAction={handleCustomizeTradeTypes}
                                onTradeTypeClick={handleOnTradeTypeSelect}
                                isSelected={id => isTradeTypeSelected(id)}
                                should_show_title={false}
                                selectable
                            />
                        )}
                        <TradeTypeList
                            categories={other_trade_types}
                            onRightIconClick={is_editing ? handleAddPinnedClick : undefined}
                            onTradeTypeClick={!is_editing ? handleOnTradeTypeSelect : undefined}
                            isSelected={id => isTradeTypeSelected(id)}
                            selectable={!is_editing}
                        />
                    </ActionSheet.Content>
                </ActionSheet.Portal>
            </ActionSheet.Root>
            {is_open && <TradeTypesSelectionGuide />}
        </div>
    );
};

export default React.memo(TradeTypes);
