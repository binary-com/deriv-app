import React from 'react';
import { Button, ThemedScrollbars, ButtonToggle, Dropdown } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { clickAndKeyEventHandler, TRADE_TYPES } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import TradeCategories from 'Assets/Trading/Categories/trade-categories';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif';
import { getContractTypes } from '../../../../Helpers/contract-type';
import ContractTypeGlossary from './contract-type-glossary';
import classNames from 'classnames';
import { useTraderStore } from 'Stores/useTraderStores';
import { TContractType, TList } from '../types';

type TInfo = {
    handleSelect: (
        type: TContractType,
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLInputElement>
    ) => void;
    item: TContractType;
    list: TList[];
    info_banner?: React.ReactNode;
    selected_value: string;
};

const TABS = {
    DESCRIPTION: 'description' as const,
    GLOSSARY: 'glossary' as const,
};

type TSelectedTab = 'description' | 'glossary';

const Info = observer(({ handleSelect, item, selected_value, list, info_banner }: TInfo) => {
    const { cached_multiplier_cancellation_list } = useTraderStore();
    const {
        ui: { is_mobile },
        modules: {
            trade: { is_vanilla_fx },
        },
    } = useStore();
    const { RISE_FALL, RISE_FALL_EQUAL, TURBOS, VANILLA } = TRADE_TYPES;
    const CONTRACT_TYPE_SUBSTITUTE = {
        [RISE_FALL_EQUAL]: RISE_FALL,
        [TURBOS.SHORT]: TURBOS.LONG,
        [VANILLA.PUT]: VANILLA.CALL,
    };
    const [selected_tab, setSelectedTab] = React.useState<TSelectedTab>(TABS.DESCRIPTION);
    const [selected_contract_type, setSelectedContractType] = React.useState(
        CONTRACT_TYPE_SUBSTITUTE[selected_value] ?? selected_value
    );
    const contract_types: TContractType[] | undefined = getContractTypes(list, item)?.filter(
        (i: { value: TContractType['value'] }) =>
            i.value !== RISE_FALL_EQUAL && i.value !== TURBOS.SHORT && i.value !== VANILLA.PUT
    );
    const has_toggle_buttons = /accumulator|turbos|vanilla|multiplier/i.test(selected_contract_type);
    const should_show_video =
        /accumulator|vanilla|multiplier|high_low|match_diff|even_odd|over_under|rise_fall|touch/i.test(
            selected_contract_type
        );
    const is_description_tab_selected = selected_tab === TABS.DESCRIPTION || !has_toggle_buttons;
    const is_glossary_tab_selected = selected_tab === TABS.GLOSSARY && has_toggle_buttons;
    const width = is_mobile ? '328' : '528';
    const scroll_bar_height = has_toggle_buttons ? '464px' : '560px';
    const button_name = contract_types?.find(item => item.value === selected_contract_type)?.text;

    const onClickGlossary = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(() => setSelectedTab(TABS.GLOSSARY), e);
    };

    const is_unavailable = !!list[0].contract_categories?.find(
        item => item.is_unavailable && item.contract_types.find(type => type.value === selected_contract_type)
    );

    const should_show_dropdown = Number(contract_types?.length) > 1;

    React.useEffect(() => {
        return () => {
            Analytics.trackEvent('ce_trade_types_form', {
                action: 'info_close',
            });
        };
    }, []);

    React.useEffect(() => {
        if (has_toggle_buttons) {
            Analytics.trackEvent('ce_trade_types_form', {
                action: 'info_switcher',
                info_switcher_mode: selected_tab,
                trade_type_name: contract_types?.find(item => item.value === selected_contract_type)?.text,
            });
        }
    }, [selected_tab]);

    const cards = contract_types?.map((type: TContractType) => {
        if (type.value !== selected_contract_type) return null;
        return (
            <div key={type.value} className='contract-type-info__card'>
                <ThemedScrollbars
                    className={classNames('contract-type-info__scrollbars', {
                        'contract-type-info__scrollbars-description--active': is_description_tab_selected,
                        'contract-type-info__scrollbars-glossary contract-type-info__scrollbars-glossary--active ':
                            is_glossary_tab_selected,
                    })}
                    style={{
                        left: `${is_description_tab_selected ? '-' : ''}${width}px`,
                        transform: `translate3d(${is_description_tab_selected ? '' : '-'}${width}px, 0, 0)`,
                    }}
                    height={is_mobile ? '' : scroll_bar_height}
                    autohide={false}
                >
                    <div
                        className={classNames('contract-type-info__content', {
                            'contract-type-info__gif': is_description_tab_selected,
                            'contract-type-info__gif--has-toggle-buttons': has_toggle_buttons,
                            'contract-type-info__gif--has-video': should_show_video && is_description_tab_selected,
                        })}
                    >
                        {is_description_tab_selected ? (
                            <React.Fragment>
                                <TradeCategoriesGIF
                                    category={type.value}
                                    selected_contract_type={selected_contract_type}
                                />
                                <TradeCategories
                                    category={type.value}
                                    onClick={onClickGlossary}
                                    is_vanilla_fx={is_vanilla_fx}
                                    is_multiplier_fx={!cached_multiplier_cancellation_list?.length}
                                />
                            </React.Fragment>
                        ) : (
                            <ContractTypeGlossary
                                category={type.value}
                                is_vanilla_fx={is_vanilla_fx}
                                is_multiplier_fx={!cached_multiplier_cancellation_list?.length}
                            />
                        )}
                    </div>
                </ThemedScrollbars>
            </div>
        );
    });

    return (
        <React.Fragment>
            {should_show_dropdown && (
                <Dropdown
                    id='dt_contract_type_dropdown'
                    className='contract-type-info__dropdown'
                    list={contract_types as React.ComponentProps<typeof Dropdown>['list']}
                    name='contract_type_dropdown'
                    value={selected_contract_type}
                    should_autohide={false}
                    should_scroll_to_selected
                    onChange={e => setSelectedContractType(e.target.value)}
                />
            )}
            {is_unavailable && <div className='contract-type-info__banner-wrapper'>{info_banner}</div>}
            {has_toggle_buttons && (
                <div className='contract-type-info__button-wrapper'>
                    <ButtonToggle
                        buttons_arr={[
                            { text: localize('Description'), value: TABS.DESCRIPTION },
                            { text: localize('Glossary'), value: TABS.GLOSSARY },
                        ]}
                        name='description_glossary_filter'
                        is_animated
                        has_rounded_button
                        onChange={e => {
                            setSelectedTab(e.target.value as TSelectedTab);
                        }}
                        value={selected_tab}
                    />
                </div>
            )}
            <div
                className={classNames('contract-type-info', {
                    'contract-type-info--has-only-toggle-buttons':
                        has_toggle_buttons && !is_unavailable && !should_show_dropdown,
                    'contract-type-info--has-only-dropdown':
                        !has_toggle_buttons && !is_unavailable && should_show_dropdown,
                    'contract-type-info--has-dropdown-and-toggle-buttons':
                        has_toggle_buttons && !is_unavailable && should_show_dropdown,
                    'contract-type-info--has-dropdown-and-info':
                        !has_toggle_buttons && is_unavailable && should_show_dropdown,
                    'contract-type-info--has-all-containers':
                        has_toggle_buttons && is_unavailable && should_show_dropdown,
                })}
                style={{
                    width: is_mobile ? '328px' : '528px',
                }}
            >
                {cards}
            </div>
            <div className='contract-type-info__trade-type-btn-wrapper'>
                <Button
                    id={`dt_contract_info_${selected_contract_type}_btn`}
                    className='contract-type-info__button'
                    onClick={e =>
                        handleSelect(
                            {
                                value:
                                    selected_contract_type === CONTRACT_TYPE_SUBSTITUTE[selected_value]
                                        ? selected_value
                                        : selected_contract_type,
                            },
                            e
                        )
                    }
                    text={localize('Choose {{contract_type}}', {
                        contract_type: button_name ?? '',
                        interpolation: { escapeValue: false },
                    })}
                    secondary
                    is_disabled={is_unavailable}
                />
            </div>
        </React.Fragment>
    );
});

export default Info;
