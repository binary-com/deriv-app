import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { mobileOSDetect, getPosition } from '@deriv/shared';
import { TList, findNextFocusableNode, findPreviousFocusableNode, TListItem } from './utility';
import Items from './items';
import DisplayText from './display-text';
import Text from '../text/text';
import { useBlockScroll, useOnClickOutside } from '../../hooks';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars';
import Icon from '../icon/icon';

type TDropdown = {
    className?: string;
    classNameDisplay?: string;
    classNameHint?: string;
    classNameItems?: string;
    classNameLabel?: string;
    disabled?: boolean;
    error?: string;
    handleBlur?: {
        (e: React.FocusEvent<HTMLElement>): void;
        <T = string | Event>(fieldOrEvent: T): T extends string ? (e: Event) => void : void;
    };
    has_symbol?: boolean;
    hint?: string;
    id?: string;
    initial_offset?: number;
    initial_height_offset?: number;
    is_align_text_left?: boolean;
    is_alignment_left?: boolean;
    is_alignment_top?: boolean;
    is_large?: boolean;
    is_nativepicker_visible?: boolean;
    is_nativepicker?: boolean;
    label?: string;
    list_height?: string;
    list_portal_id?: string;
    list: TList;
    name?: string;
    no_border?: boolean;
    onChange?: (e: { target: { name: string; value: string } }) => void;
    onClick?: () => void;
    placeholder?: string;
    should_animate_suffix_icon?: boolean;
    suffix_icon?: string;
    suffix_icon_size?: number;
    should_open_on_hover?: boolean;
    should_scroll_to_selected?: boolean;
    should_autohide?: boolean;
    test_id?: string;
    value?: string | number;
    classNameIcon?: string;
};

type TDropdownList = {
    classNameItems?: string;
    classNameLabel?: string;
    handleSelect: (item: TListItem) => void;
    has_symbol?: boolean;
    initial_offset?: number;
    initial_height_offset?: number;
    is_align_text_left?: boolean;
    is_alignment_left?: boolean;
    is_alignment_top?: boolean;
    is_large?: boolean;
    is_list_visible: boolean;
    list: TList;
    nodes: React.RefObject<Map<string, HTMLDivElement | null>>;
    onKeyPressed: (event: KeyboardEvent, item: TListItem) => void;
    parent_ref: React.RefObject<HTMLElement>;
    portal_id?: string;
    suffix_icon?: string;
    suffix_icon_size?: number;
    should_scroll_to_selected?: boolean;
    should_autohide?: boolean;
    value?: string | number;
};

const DropdownList = React.forwardRef<HTMLDivElement, TDropdownList>((props, list_ref) => {
    const {
        classNameItems,
        classNameLabel,
        handleSelect,
        has_symbol,
        initial_offset,
        initial_height_offset,
        is_align_text_left,
        is_alignment_left,
        is_alignment_top,
        is_large,
        is_list_visible,
        list,
        nodes,
        onKeyPressed,
        parent_ref,
        portal_id,
        suffix_icon,
        suffix_icon_size = 16,
        should_scroll_to_selected,
        should_autohide,
        value,
    } = props;

    const [list_dimensions, setListDimensions] = React.useState([initial_offset, 0]);
    const [style, setStyle] = React.useState({});
    const [scroll_height, setScrollHeight] = React.useState<number>();

    const is_portal = !!portal_id;

    React.useEffect(() => {
        if (parent_ref.current && portal_id && is_list_visible) {
            const position_style = getPosition({
                preferred_alignment: is_alignment_top ? 'top' : 'bottom',
                parent_el: parent_ref.current,
                child_el: (list_ref as React.MutableRefObject<HTMLElement>).current,
                should_consider_parent_height: true,
            });
            setStyle(position_style.style);
        }
    }, [is_list_visible, is_alignment_top, portal_id, list.length, parent_ref, list_ref]);

    /**
     * Calculate the offset for the dropdown list based on its width
     *
     * @return {{transform: string}}
     */
    const computed_offset_left = () => {
        return {
            transform: `translate3d(calc(-${list_dimensions[0]}px - 12px), 0, 0px)`,
        };
    };

    /**
     * Calculate the offset for the dropdown list based on its height
     *
     * @return {{transform: string}}
     */
    const computed_offset_top = () => {
        return {
            transform: `translate3d(0, calc(-${list_dimensions[1]}px - 16px), 0px)`,
        };
    };

    const dropdownListClassName = () => {
        return classNames('dc-dropdown__list', {
            'dc-dropdown__list--left': is_alignment_left && !is_portal,
            'dc-dropdown__list--top': is_alignment_top && !is_portal,
            'dc-dropdown__list--portal': is_portal,
        });
    };

    const listClassNames = () => {
        return classNames('dc-list', {
            'dc-list--left': is_alignment_left,
            'dc-list--large': is_large,
            'dc-list--has-suffix-icon': suffix_icon,
        });
    };

    const transitionClassName = () => {
        return {
            enter: `dc-dropdown__list--enter${is_alignment_left ? ' dc-dropdown__list--left--enter' : ''}`,
            enterDone: `dc-dropdown__list--enter-done${
                is_alignment_left ? ' dc-dropdown__list--left--enter-done' : ''
            }`,
            exit: `dc-dropdown__list--exit${is_alignment_left ? ' dc-dropdown__list--left--exit' : ''}`,
        };
    };

    // Upon render via css transition group, we use this as a callback to set the width/height of the dropdown list in the state
    const setListDimension = () =>
        setListDimensions([
            initial_offset || (list_ref as React.MutableRefObject<HTMLElement>).current.offsetWidth,
            initial_height_offset || (list_ref as React.MutableRefObject<HTMLElement>).current.offsetHeight,
        ]);

    const getDropDownAlignment = () => {
        if (is_portal) return undefined;

        if (is_alignment_left) return computed_offset_left();
        else if (is_alignment_top) return computed_offset_top();

        return undefined;
    };

    const el_dropdown_list = (
        <CSSTransition
            in={is_list_visible}
            timeout={100}
            classNames={transitionClassName()}
            onEntered={setListDimension}
            unmountOnExit
        >
            <div style={style} className={dropdownListClassName()}>
                <div
                    className={listClassNames()}
                    style={getDropDownAlignment()}
                    aria-expanded={is_list_visible}
                    role='list'
                    ref={list_ref}
                >
                    <ThemedScrollbars
                        height={list_dimensions[1] && list_dimensions[1] > 200 ? list_dimensions[1] : '200px'}
                        scroll_height={scroll_height}
                        should_scroll_to_selected={should_scroll_to_selected}
                        autohide={should_autohide}
                    >
                        {Array.isArray(list) ? (
                            <Items
                                onKeyPressed={onKeyPressed}
                                className={classNameItems}
                                handleSelect={handleSelect}
                                has_symbol={has_symbol}
                                items={list}
                                is_align_text_left={is_align_text_left}
                                value={value}
                                nodes={nodes.current}
                                setScrollHeight={setScrollHeight}
                            />
                        ) : (
                            Object.keys(list).map((key, idx) => (
                                <React.Fragment key={key}>
                                    <div className={classNames('dc-list__label', classNameLabel)}>{key}</div>
                                    <Items
                                        onKeyPressed={onKeyPressed}
                                        className={classNameItems}
                                        handleSelect={handleSelect}
                                        has_symbol={has_symbol}
                                        items={list[key]}
                                        is_align_text_left={is_align_text_left}
                                        value={value}
                                        nodes={nodes.current}
                                    />
                                    {idx !== Object.keys(list).length - 1 && <span className='dc-list__separator' />}
                                </React.Fragment>
                            ))
                        )}
                    </ThemedScrollbars>
                </div>
            </div>
        </CSSTransition>
    );

    if (portal_id) {
        return ReactDOM.createPortal(el_dropdown_list, document.getElementById(portal_id) as HTMLElement);
    }

    return el_dropdown_list;
});

DropdownList.displayName = 'DropdownList';

const Dropdown = ({
    className,
    classNameDisplay,
    classNameHint,
    classNameItems,
    classNameLabel,
    disabled,
    error,
    handleBlur,
    has_symbol,
    hint,
    initial_offset = 0,
    initial_height_offset = 0,
    is_align_text_left,
    is_alignment_left,
    is_alignment_top,
    is_large,
    is_nativepicker_visible,
    is_nativepicker,
    label,
    list_portal_id,
    list,
    name,
    no_border,
    onChange,
    onClick,
    placeholder,
    suffix_icon,
    should_animate_suffix_icon = false,
    suffix_icon_size = 16,
    should_open_on_hover = false,
    should_scroll_to_selected,
    should_autohide,
    test_id,
    value,
    classNameIcon,
}: TDropdown) => {
    const dropdown_ref = React.useRef<HTMLDivElement>(null);
    const native_select_ref = React.useRef<HTMLDivElement>(null);
    const wrapper_ref = React.useRef<HTMLDivElement>(null);
    const nodes = React.useRef(new Map());
    const list_ref = React.useRef<HTMLDivElement>(null);
    const is_portal = !!list_portal_id;

    const [is_list_visible, setIsListVisible] = React.useState(!!is_nativepicker_visible);
    const initial_render = React.useRef(true);

    useBlockScroll(list_portal_id && is_list_visible ? dropdown_ref : undefined);

    const onClickOutSide = (event: MouseEvent) => {
        if (is_portal && list_ref.current?.contains(event.target as Node)) return;

        if (typeof handleBlur === 'function') handleBlur({ target: { name } });
        setIsListVisible(false);
    };

    useOnClickOutside(wrapper_ref, onClickOutSide, () => is_list_visible);

    const isSingleOption = () => list.length < 2;

    const containerClassName = () => {
        return classNames('dc-dropdown-container', className, {
            'dc-dropdown--has-placeholder': placeholder,
            'dc-dropdown--left': is_alignment_left,
            'dc-dropdown--show': is_list_visible,
            'dc-dropdown--disabled': isSingleOption() || disabled,
            'dc-dropdown--error': error,
            'dc-dropdown--has-suffix-icon': suffix_icon,
        });
    };

    const dropdownDisplayClassName = () => {
        return classNames('dc-dropdown__display', classNameDisplay, {
            'dc-dropdown__display--clicked': is_list_visible,
            'dc-dropdown__display--has-symbol': has_symbol,
            'dc-dropdown__display--no-border': no_border,
            'dc-dropdown__display--is-left-text': is_align_text_left,
        });
    };

    React.useEffect(() => {
        if (is_nativepicker && !is_nativepicker_visible && is_list_visible) {
            setIsListVisible(false);
        }
    }, [is_nativepicker, is_nativepicker_visible, is_list_visible]);

    React.useEffect(() => {
        if (!initial_render.current && !is_list_visible && value) dropdown_ref?.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_list_visible]);

    const handleSelect = (item: TListItem) => {
        if (item.value !== value) onChange?.({ target: { name: name || '', value: item.value } });

        handleVisibility();
    };

    const handleVisibility = (e?: React.MouseEvent<HTMLDivElement>) => {
        if (e && ['mouseover', 'mouseleave'].includes(e.type)) {
            if (!should_open_on_hover) return;
            if (e.type === 'mouseover') setIsListVisible(true);
            else setIsListVisible(false);
            return;
        }

        if (typeof onClick === 'function') {
            onClick();

            return;
        }

        if (is_nativepicker && !is_list_visible) {
            if (mobileOSDetect() === 'iOS') {
                /* .focus() doesn't trigger open <select /> in Android :(
                 * so we use a CSS hack - refer to L237 in dropdown.scss
                 * [TODO]: find alternative solution to trigger open <select /> with JS
                 */
                native_select_ref?.current?.focus();
            }
            setIsListVisible(true);
        } else {
            setIsListVisible(!is_list_visible);
        }
    };

    const onKeyPressed = (event: KeyboardEvent, item: TListItem) => {
        if (isSingleOption()) return;

        // Tab -> before preventDefault() to be able to go to the next tabIndex
        if (event.keyCode === 9 && !is_list_visible) return;

        event.preventDefault();
        event.stopPropagation();

        switch (event.keyCode) {
            case 27: // esc
                if (is_list_visible) handleVisibility();
                break;
            case 9: // Tab
            case 13: // Enter
            case 32: // Space
                if (!item) return;
                handleSelect(item);
                break;
            case 38: // Up Arrow
            case 40: // Down Arrow
                if (is_list_visible) {
                    focusNextListItem(event.keyCode);
                } else if (!is_alignment_left) {
                    handleVisibility();
                }
                break;
            case 37: // Left arrow
            case 39: // Right Arrow
                if (is_alignment_left) handleVisibility();
                break;
            default:
        }

        // For char presses, we do a search for the item:
        if (event.key.length === 1 && list.length) {
            const char = event.key.toLowerCase();
            const item_starting_with_char = list.find(li => li.value && li.value[0].toLowerCase() === char);
            if (!item_starting_with_char) return;

            const item_ref = nodes.current.get(item_starting_with_char.value);
            if (item_ref) item_ref.focus();
        }
    };

    const focusNextListItem = (direction: number) => {
        const { activeElement } = document;

        if (activeElement?.id === 'dropdown-display') {
            const el = Array.from(nodes.current.values())[0];
            if (el && el.focus instanceof Function) {
                el.focus();
            }
        } else {
            const active_node = nodes.current.get(activeElement?.id);
            if (active_node) {
                if (direction === 40) {
                    const next_node = findNextFocusableNode(active_node.nextSibling);
                    if (next_node) next_node.focus();
                }
                if (direction === 38) {
                    const prev_node = findPreviousFocusableNode(active_node.previousSibling);
                    if (prev_node) prev_node.focus();
                }
            }
        }
    };

    React.useEffect(() => {
        if (initial_render.current) {
            initial_render.current = false;
        }
    }, []);

    return (
        <React.Fragment>
            <input
                className='dc-dropdown__inner'
                autoComplete='off'
                name={name}
                readOnly
                type='hidden'
                data-testid={test_id}
                value={value || 0}
            />
            <div
                ref={wrapper_ref}
                className={containerClassName()}
                onMouseOver={handleVisibility}
                onFocus={() => null}
                onMouseLeave={handleVisibility}
            >
                <div
                    className={classNames('dc-dropdown__container', {
                        'dc-dropdown__container--suffix-icon': suffix_icon,
                    })}
                    data-testid='dt_dropdown_container'
                >
                    {label && (
                        <span
                            className={classNames('dc-dropdown__label', {
                                'dc-dropdown__label--clicked': is_list_visible,
                            })}
                        >
                            {label}
                        </span>
                    )}
                    <div
                        className={dropdownDisplayClassName()}
                        data-testid='dt_dropdown_display'
                        tabIndex={isSingleOption() ? -1 : 0}
                        onClick={handleVisibility}
                        onKeyDown={onKeyPressed as unknown as React.KeyboardEventHandler}
                        id='dropdown-display'
                        ref={dropdown_ref}
                    >
                        {!!suffix_icon && (
                            <Icon
                                className={classNames('suffix-icon', {
                                    'suffix-icon--flip': is_list_visible && should_animate_suffix_icon,
                                })}
                                icon={suffix_icon}
                                size={suffix_icon_size}
                            />
                        )}
                        <DisplayText
                            className={classNames({
                                'dc-dropdown__display--has-suffix-icon-text': suffix_icon,
                            })}
                            has_symbol={has_symbol}
                            name={name}
                            is_align_text_left={is_align_text_left}
                            placeholder={placeholder}
                            value={value ?? 0}
                            list={list}
                        />
                    </div>
                    {!(isSingleOption() || !!suffix_icon) && (
                        <Icon
                            icon={is_alignment_left ? 'IcChevronLeft' : 'IcChevronDown'}
                            className={classNames('dc-dropdown__select-arrow', classNameIcon, {
                                'dc-dropdown__select-arrow--left': is_alignment_left,
                                'dc-dropdown__select-arrow--up': is_list_visible,
                                'dc-dropdown__select-arrow--error': error || hint,
                            })}
                        />
                    )}
                    {error && (
                        <Text as='p' size='xxs' color='loss-danger' className='dc-field--error'>
                            {error}
                        </Text>
                    )}
                    <DropdownList
                        classNameItems={classNameItems}
                        classNameLabel={classNameLabel}
                        handleSelect={handleSelect}
                        has_symbol={has_symbol}
                        initial_offset={initial_offset}
                        initial_height_offset={initial_height_offset}
                        is_align_text_left={is_align_text_left}
                        is_alignment_left={is_alignment_left}
                        is_alignment_top={is_alignment_top}
                        is_large={is_large}
                        is_list_visible={is_list_visible}
                        list={list}
                        nodes={nodes}
                        onKeyPressed={onKeyPressed}
                        parent_ref={dropdown_ref}
                        portal_id={list_portal_id}
                        ref={list_ref}
                        suffix_icon={suffix_icon}
                        suffix_icon_size={suffix_icon_size}
                        should_scroll_to_selected={should_scroll_to_selected}
                        should_autohide={should_autohide}
                        value={value}
                    />
                </div>
                {!error && hint && (
                    <Text
                        as='p'
                        color='less-prominent'
                        size='xxs'
                        className={classNames('dc-dropdown__hint', classNameHint)}
                    >
                        {hint}
                    </Text>
                )}
            </div>
        </React.Fragment>
    );
};

export default Dropdown;
