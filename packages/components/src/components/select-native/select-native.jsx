import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Field from '../field/field.jsx';
import Icon from '../icon/icon.jsx';
import Text from '../text/text.jsx';

const getDisplayText = (list_items, value) => {
    const dropdown_items = Array.isArray(list_items) ? list_items : [].concat(...Object.values(list_items));
    const list_obj = dropdown_items.find(item =>
        typeof item.value !== 'string' ? item.value === value : item.value.toLowerCase() === value.toLowerCase()
    );

    if (list_obj) return list_obj.text;
    return '';
};

const SelectNativeOptions = ({ list_items, should_hide_disabled_options, use_text }) => {
    const options = should_hide_disabled_options ? list_items.filter(opt => !opt.disabled) : list_items;
    const has_group = Array.isArray(list_items) && !!list_items[0]?.group;

    if (has_group) {
        const dropdown_items = options.reduce((dropdown_map, item) => {
            dropdown_map[item.group] = dropdown_map[item.group] || [];
            dropdown_map[item.group].push(item);

            return dropdown_map;
        }, {});
        const group_names = Object.keys(dropdown_items);
        return group_names.map(option => (
            <optgroup key={option} label={option}>
                {dropdown_items[option].map(value => (
                    <option key={value.value} value={use_text ? value.text : value.value}>
                        {value.nativepicker_text || value.text}
                    </option>
                ))}
            </optgroup>
        ));
    }
    return options.map(option => (
        <option key={option.id || option.value} value={use_text ? option.text : option.value}>
            {option.nativepicker_text || option.text}
        </option>
    ));
};

const SelectNative = ({
    className,
    classNameDisplay,
    classNameHint,
    disabled,
    error,
    hide_selected_value,
    hint,
    label,
    list_items,
    onItemSelection,
    placeholder,
    should_hide_disabled_options,
    should_show_empty_option = true,
    suffix_icon,
    use_text,
    value,
    ...props
}) => (
    <div
        className={classNames(className, 'dc-select-native', {
            'dc-select-native--disabled': disabled,
            'dc-select-native--error': error,
            'dc-select-native--hide-selected-value': hide_selected_value,
        })}
    >
        <div className='dc-select-native__wrapper'>
            <div
                className={classNames('dc-input', {
                    'dc-input--disabled': disabled,
                    'dc-input--error': error,
                })}
            >
                <div className='dc-select-native__display'>
                    {list_items && value && (
                        <div className={classNames('dc-select-native__display-text', classNameDisplay)}>
                            {!hide_selected_value && (use_text ? value : getDisplayText(list_items, value))}
                        </div>
                    )}
                </div>
                <div
                    className={classNames('dc-select-native__placeholder', {
                        'dc-select-native__placeholder--has-value': value,
                        'dc-select-native__placeholder--disabled': disabled,
                    })}
                >
                    {label}
                </div>
                {!suffix_icon ? (
                    <Icon icon='IcChevronDown' className='dc-select-native__arrow' />
                ) : (
                    <Icon className='dc-select-native__suffix-icon' icon={suffix_icon} size={16} fill />
                )}
                <select
                    id='dt_components_select-native_select-tag'
                    className='dc-select-native__picker'
                    value={value}
                    disabled={disabled}
                    {...props}
                >
                    {Array.isArray(list_items) ? (
                        <React.Fragment>
                            {/*
                             * In native select, first option is selected by default.
                             * Added an empty option to avoid it from selecting first item
                             * from list_items provided
                             */}
                            {should_show_empty_option && <option value=''>{placeholder}</option>}
                            {/*
                             * Safari on ios allows to select a disabled option. So, we should avoid showing it
                             */}
                            <SelectNativeOptions
                                list_items={list_items}
                                should_hide_disabled_options={should_hide_disabled_options}
                                use_text={use_text}
                            />
                        </React.Fragment>
                    ) : (
                        Object.keys(list_items).map(key => {
                            const items = should_hide_disabled_options
                                ? list_items[key].filter(opt => !opt.disabled)
                                : list_items[key];

                            if (items.length > 0) {
                                return (
                                    <optgroup key={key} label={key}>
                                        {/*
                                         * Safari on ios allows to select a disabled option. So, we should avoid showing it
                                         */}
                                        <SelectNativeOptions
                                            list_items={list_items[key]}
                                            should_hide_disabled_options={should_hide_disabled_options}
                                            use_text={use_text}
                                        />
                                    </optgroup>
                                );
                            }

                            return null;
                        })
                    )}
                </select>
                {error && <Field message={error} type='error' />}
            </div>
        </div>
        {!error && hint && (
            <Text
                as='p'
                color='less-prominent'
                size='xxs'
                line_height='l'
                className={classNames('dc-select-native__hint', classNameHint)}
            >
                {hint}
            </Text>
        )}
    </div>
);

const list_items_shape = PropTypes.oneOfType([
    PropTypes.arrayOf(
        PropTypes.shape({
            disabled: PropTypes.bool,
            nativepicker_text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ),
    PropTypes.object,
    PropTypes.array,
]);

SelectNative.propTypes = {
    className: PropTypes.string,
    classNameDisplay: PropTypes.string,
    classNameHint: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    hint: PropTypes.string,
    label: PropTypes.string,
    list_items: list_items_shape,
    placeholder: PropTypes.string,
    should_show_empty_option: PropTypes.bool,
    suffix_icon: PropTypes.string,
    use_text: PropTypes.bool,
    value: PropTypes.string,
    should_hide_disabled_options: PropTypes.bool,
};

SelectNative.defaultProps = {
    should_hide_disabled_options: true,
};

export default SelectNative;
