import React from 'react';
import PropTypes from 'prop-types';
import { MobileFullPageModal } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize } from 'Components/i18next';
import CurrencySelector from './currency-selector.jsx';

const CurrencySelectorModal = ({ is_modal_open }) => {
    const {
        modules: { p2p_store },
    } = useStore();
    const { buy_sell_store } = p2p_store;
    const { local_currencies, onLocalCurrencySelect, selected_local_currency, setShouldShowCurrencySelectorModal } =
        buy_sell_store;

    return (
        <MobileFullPageModal
            is_flex
            is_modal_open={is_modal_open}
            page_header_text={localize('Preferred currency')}
            pageHeaderReturnFn={() => {
                setShouldShowCurrencySelectorModal(false);
            }}
        >
            <CurrencySelector
                default_value={selected_local_currency}
                list={local_currencies}
                onSelect={value => {
                    onLocalCurrencySelect(value);
                    setShouldShowCurrencySelectorModal(false);
                }}
            />
        </MobileFullPageModal>
    );
};

CurrencySelectorModal.propTypes = {
    is_modal_open: PropTypes.bool,
};

export default CurrencySelectorModal;
