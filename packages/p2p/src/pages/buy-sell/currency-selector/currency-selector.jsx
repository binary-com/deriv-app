import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Field, Formik } from 'formik';
import { Autocomplete, Icon } from '@deriv/components';
import { isMobileOrTablet } from '@deriv/shared';
import { localize } from 'Components/i18next';

const CurrencySelector = ({ className, default_value, list, onSelect }) => {
    const local_currencies_list = list.map(currency => ({
        ...currency,
        component: (
            <div className='currency-dropdown__list-item'>
                <div className='currency-dropdown__list-item-symbol'>{currency.value}</div>
                <div className='currency-dropdown__list-item-name'>{currency.display_name}</div>
            </div>
        ),
    }));

    const getSortedList = list_items => {
        const sorted_list = list_items.filter(list_item => list_item.is_default || list_item.has_adverts);
        const index = sorted_list.findIndex(item => item.text === default_value);

        if (index) {
            const value = sorted_list.splice(index, 1);
            if (value) sorted_list.splice(0, 0, value[0]);
        }

        return sorted_list;
    };
    const [filtered_currency_list, setFilteredCurrencyList] = React.useState(getSortedList(local_currencies_list));

    return (
        <Formik enableReinitialize initialValues={{ currency: '' }}>
            {({ setFieldValue }) => (
                <Field name='currency'>
                    {({ field }) => (
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            className={classNames('buy-sell-currency-selector', className)}
                            data-lpignore='true'
                            historyValue={default_value}
                            is_list_visible
                            leading_icon={<Icon className='currency-selector__search-icon' icon='IcSearch' />}
                            list_height={isMobileOrTablet() ? '100%' : '288px'}
                            list_items={filtered_currency_list}
                            not_found_text={
                                list.filter(
                                    item => item.text.toLowerCase() === field.value.toLowerCase() && !item.has_adverts
                                ).length === 1
                                    ? localize('No ads for this currency.')
                                    : localize('No results for "{{value}}".', {
                                          value: field.value,
                                          interpolation: { escapeValue: false },
                                      })
                            }
                            onItemSelection={({ value }) => {
                                if (value) onSelect?.(value);
                            }}
                            onSearch={(value, list_items) => {
                                return list_items.filter(
                                    item =>
                                        item.display_name.toLowerCase().includes(value) ||
                                        item.text.toLowerCase().includes(value)
                                );
                            }}
                            placeholder={localize('Search')}
                            trailing_icon={
                                field.value ? (
                                    <Icon
                                        color='secondary'
                                        icon='IcCloseCircle'
                                        onClick={() => {
                                            setFieldValue('currency', '');
                                            setFilteredCurrencyList(getSortedList(local_currencies_list));
                                        }}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                            type='text'
                        />
                    )}
                </Field>
            )}
        </Formik>
    );
};

CurrencySelector.propTypes = {
    className: PropTypes.string,
    default_value: PropTypes.string,
    list: PropTypes.array,
    onSelect: PropTypes.func,
};

export default CurrencySelector;
