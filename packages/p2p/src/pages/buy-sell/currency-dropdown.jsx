import React from 'react';
import classNames from 'classnames';
import { Dropdown, useOnClickOutside } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { isMobileOrTablet } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { CurrencySelector } from 'Pages/buy-sell/currency-selector';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import './currency-dropdown.scss';

const CurrencyDropdown = () => {
    const [is_list_visible, setIsListVisible] = React.useState(false);
    const currency_selector_ref = React.useRef(null);
    const { buy_sell_store } = useStores();
    const { onLocalCurrencySelect } = buy_sell_store;
    const { showModal } = useModalManagerContext();
    const {
        p2p_settings: { currency_list },
    } = useP2PSettings();

    const local_currencies_list = currency_list.map(currency => ({
        ...currency,
        component: (
            <div className='currency-dropdown__list-item'>
                <div className='currency-dropdown__list-item-symbol'>{currency.value}</div>
                <div className='currency-dropdown__list-item-name'>{currency.display_name}</div>
            </div>
        ),
    }));

    useOnClickOutside(
        currency_selector_ref,
        () => {
            setIsListVisible(false);
        },
        () => is_list_visible
    );

    return (
        <div className='currency-dropdown' ref={currency_selector_ref}>
            <Dropdown
                className={classNames('currency-dropdown__list', {
                    'currency-dropdown__list--visible': is_list_visible,
                })}
                is_align_text_left
                list={local_currencies_list}
                onClick={() => {
                    if (isMobileOrTablet()) showModal({ key: 'CurrencySelectorModal' });
                    else setIsListVisible(!is_list_visible);
                }}
                placeholder={localize('Currency')}
                value={buy_sell_store.selected_local_currency}
            />
            {is_list_visible && (
                <CurrencySelector
                    default_value={buy_sell_store.selected_local_currency}
                    list={local_currencies_list}
                    onSelect={value => {
                        setIsListVisible(false);
                        onLocalCurrencySelect(value);
                    }}
                />
            )}
        </div>
    );
};

export default observer(CurrencyDropdown);
