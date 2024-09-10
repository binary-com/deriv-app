import React, { useMemo } from 'react';
import { useTraderStore } from 'Stores/useTraderStores';
import { Chip, Text, ActionSheet } from '@deriv-com/quill-ui';
import { DraggableList } from 'AppV2/Components/DraggableList';
import { TradeTypeList } from 'AppV2/Components/TradeTypeList';
import { getTradeTypesList } from 'AppV2/Utils/trade-types-utils';
import { checkContractTypePrefix } from 'AppV2/Utils/contract-type';
import { Localize, localize } from '@deriv/translations';
import Guide from '../../Components/Guide';

type TTradeTypesProps = {
    onTradeTypeSelect: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    trade_types: ReturnType<typeof getTradeTypesList>;
    contract_type: string;
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

const TradeTypes = ({ contract_type, onTradeTypeSelect, trade_types }: TTradeTypesProps) => {
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
    const saved_other_trade_types: TResultItem[] = JSON.parse(localStorage.getItem('other_trade_types') ?? '[]');
    const saved_pinned_trade_types: TResultItem[] = JSON.parse(saved_pinned_trade_types_string);

    const [other_trade_types, setOtherTradeTypes] = React.useState<TResultItem[]>(saved_other_trade_types);
    const [pinned_trade_types, setPinnedTradeTypes] = React.useState<TResultItem[]>(saved_pinned_trade_types);

    const trade_types_array = useMemo(() => createArrayFromCategories(trade_types), [trade_types]);

    const handleCloseTradeTypes = () => {
        setIsOpen(false);
        setIsEditing(false);
    };

    const handleCustomizeTradeTypes = () => {
        setIsEditing(true);
    };

    const handleAddPinnedClick = (item: TItem) => {
        setOtherTradeTypes(prev_categories => modifyCategories(prev_categories, item, 'remove'));
        setPinnedTradeTypes(prev_pinned => modifyPinnedCategories(prev_pinned, item, 'add'));
    };

    const handleRemovePinnedClick = (item: TItem) => {
        setPinnedTradeTypes(prev_categories => modifyCategories(prev_categories, item, 'remove'));
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

    const modifyCategories = (categories: TResultItem[], item: TItem, action: 'remove' = 'remove') =>
        categories.map(category => ({
            ...category,
            items:
                action === 'remove'
                    ? category.items.filter(i => i.id !== item.id)
                    : category.items.filter(i => i.id !== item.id).sort((a, b) => a.title?.localeCompare(b.title)),
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

        return updated_categories.map(category => ({
            ...category,
            items: category.items.sort((a, b) => a.title?.localeCompare(b.title)),
        }));
    };

    const scrollToSelectedTradeType = () => {
        setTimeout(() => {
            let position_x = 0;
            if (trade_types_ref.current) {
                const selected_chip = trade_types_ref.current.querySelector(
                    'button[data-state="selected"]'
                ) as HTMLButtonElement;
                if (selected_chip) {
                    position_x = selected_chip.getBoundingClientRect().x - 8 || 0;
                }
                trade_types_ref.current.scrollBy({
                    left: position_x,
                    top: 0,
                });
            }
        }, 0);
    };

    React.useEffect(() => {
        const sorted_trade_types_array = trade_types_array.sort((a, b) => a.title?.localeCompare(b.title));

        const pinned_items = filterItems(getItems(saved_pinned_trade_types), sorted_trade_types_array);

        if (pinned_items.length === 0) {
            pinned_items.push(...sorted_trade_types_array.slice(0, 5));
        }

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
                items: sorted_trade_types_array.filter(
                    item => !pinned_items.some(pinned_item => pinned_item.id === item.id)
                ),
            },
        ];

        setPinnedTradeTypes(default_pinned_trade_types);
        setOtherTradeTypes(default_other_trade_types);
    }, [saved_pinned_trade_types_string, trade_types_array]);

    React.useEffect(() => {
        scrollToSelectedTradeType();
    }, []);

    const savePinnedToLocalStorage = () => {
        localStorage.setItem('pinned_trade_types', JSON.stringify(pinned_trade_types));
        localStorage.setItem('other_trade_types', JSON.stringify(other_trade_types));
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

    const isTradeTypeSelected = (value: string) =>
        checkContractTypePrefix([contract_type, value]) || contract_type === value;

    const getItems = (trade_types: TResultItem[]) => trade_types.flatMap(type => type.items);

    const filterItems = (items: TItem[], tradeTypes: TItem[]): TItem[] => {
        const trade_types_ids = tradeTypes.map(type => type.id);
        return items.filter(item => trade_types_ids.includes(item.id));
    };

    const getTradeTypeChips = () => {
        const pinned_items = pinned_trade_types[0]?.items ?? [];
        const is_contract_type_in_pinned = pinned_items.some(item => item.id === contract_type);

        const other_item = !is_contract_type_in_pinned
            ? getItems(other_trade_types).find(
                  item => item.id === contract_type || checkContractTypePrefix([item.id, contract_type])
              )
            : null;

        return [...pinned_items, other_item].filter(Boolean) as TItem[];
    };

    const trade_type_chips = getTradeTypeChips();
    const should_show_view_all = trade_type_chips.length >= 2;

    return (
        <div className='trade__trade-types' ref={trade_types_ref}>
            {trade_type_chips.map(({ title, id }: TItem) => (
                <Chip.Selectable key={id} onChipSelect={onTradeTypeSelect} selected={isTradeTypeSelected(id)}>
                    <Text size='sm'>{title}</Text>
                </Chip.Selectable>
            ))}
            {should_show_view_all && (
                <button key='trade-types-all' onClick={() => setIsOpen(true)} className='trade__trade-types-header'>
                    <Text size='sm' bold underlined>
                        {<Localize i18n_default_text='View all' />}
                    </Text>
                </button>
            )}
            <ActionSheet.Root isOpen={is_open} expandable={false} onClose={handleCloseTradeTypes}>
                <ActionSheet.Portal>
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
        </div>
    );
};

export default React.memo(TradeTypes);
