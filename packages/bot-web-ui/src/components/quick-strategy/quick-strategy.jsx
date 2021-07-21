import React from 'react';
import PropTypes from 'prop-types';
import {
    Autocomplete,
    SelectNative,
    Button,
    Icon,
    Input,
    Modal,
    Popover,
    Tabs,
    IconTradeTypes,
    ThemedScrollbars,
    MobileFullPageModal,
    Text,
} from '@deriv/components';
import classNames from 'classnames';

import { localize } from '@deriv/translations';
import { isSafari } from '@deriv/shared';
import { Formik, Form, Field } from 'formik';
import { config } from '@deriv/bot-skeleton';
import { popover_zindex } from 'Constants/z-indexes';
import { connect } from 'Stores/connect';

const QuickStrategyForm = ({
    active_index,
    createStrategy,
    duration_unit_dropdown,
    getSizeDesc,
    getSizeText,
    initial_errors,
    initial_values,
    is_onscreen_keyboard_active,
    is_stop_button_visible,
    onChangeDropdownItem,
    onChangeInputValue,
    onHideDropdownList,
    onScrollStopDropdownList,
    symbol_dropdown,
    trade_type_dropdown,
    validateQuickStrategy,
    is_mobile,
    selected_symbol,
    selected_trade_type,
    selected_duration_unit,
    description,
    setCurrentFocus,
}) => (
    <Formik
        initialValues={initial_values}
        validate={validateQuickStrategy}
        onSubmit={createStrategy}
        enableReinitialize={true}
    >
        {({ errors, handleChange, values, isSubmitting, setFieldValue, touched, submitForm }) => {
            // Check values in favour of isValid, this is a hack to persist validation through tab switching.
            const validation_errors = validateQuickStrategy(values);
            const is_valid = Object.keys(validation_errors).length === 0;
            const is_submit_enabled = !isSubmitting && is_valid;

            return (
                <Form
                    className={classNames('quick-strategy__form', {
                        'quick-strategy__form--active-keyboard': is_onscreen_keyboard_active,
                    })}
                >
                    <ThemedScrollbars height='430px' autohide is_bypassed={is_mobile}>
                        <div
                            className={classNames('quick-strategy__form-content', {
                                'quick-strategy__form-content--active-keyboard': is_onscreen_keyboard_active,
                                'quick-strategy__form-content--safari-fix': isSafari(),
                            })}
                        >
                            <div className='quick-strategy__description'>{description}</div>
                            <div className='quick-strategy__form-row'>
                                <Field name='quick-strategy__symbol'>
                                    {({ field }) => (
                                        <>
                                            {is_mobile ? (
                                                <SelectNative
                                                    list_items={symbol_dropdown}
                                                    value={selected_symbol.value}
                                                    label={localize('Asset')}
                                                    should_show_empty_option={false}
                                                    onChange={e => {
                                                        onChangeDropdownItem('symbol', e.target.value, setFieldValue);
                                                    }}
                                                />
                                            ) : (
                                                <Autocomplete
                                                    {...field}
                                                    autoComplete='off'
                                                    className='quick-strategy__dropdown quick-strategy__leading'
                                                    type='text'
                                                    label={localize('Asset')}
                                                    list_items={symbol_dropdown}
                                                    onHideDropdownList={() => {
                                                        onHideDropdownList('symbol', values[field.name], setFieldValue);
                                                    }}
                                                    onItemSelection={({ value }) => {
                                                        onChangeDropdownItem('symbol', value, setFieldValue);
                                                    }}
                                                    onScrollStop={() => onScrollStopDropdownList('symbol')}
                                                    leading_icon={
                                                        selected_symbol.value && (
                                                            <Icon
                                                                icon={`IcUnderlying${selected_symbol.value}`}
                                                                size={24}
                                                            />
                                                        )
                                                    }
                                                />
                                            )}
                                        </>
                                    )}
                                </Field>
                            </div>
                            <div className='quick-strategy__form-row'>
                                <Field name='quick-strategy__trade-type'>
                                    {({ field }) => (
                                        <>
                                            {is_mobile ? (
                                                <SelectNative
                                                    list_items={trade_type_dropdown}
                                                    value={selected_trade_type.value}
                                                    label={localize('Trade type')}
                                                    should_show_empty_option={false}
                                                    onChange={e => {
                                                        onChangeDropdownItem(
                                                            'trade-type',
                                                            e.target.value,
                                                            setFieldValue
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <Autocomplete
                                                    {...field}
                                                    autoComplete='off'
                                                    className='quick-strategy__dropdown quick-strategy__leading'
                                                    type='text'
                                                    label={localize('Trade type')}
                                                    list_items={trade_type_dropdown}
                                                    onHideDropdownList={() => {
                                                        onHideDropdownList(
                                                            'trade-type',
                                                            values[field.name],
                                                            setFieldValue
                                                        );
                                                    }}
                                                    onItemSelection={({ value }) => {
                                                        onChangeDropdownItem('trade-type', value, setFieldValue);
                                                    }}
                                                    onScrollStop={() => onScrollStopDropdownList('trade-type')}
                                                    leading_icon={
                                                        selected_trade_type.icon && (
                                                            <Text>
                                                                <IconTradeTypes type={selected_trade_type.icon[0]} />
                                                                <IconTradeTypes type={selected_trade_type.icon[1]} />
                                                            </Text>
                                                        )
                                                    }
                                                />
                                            )}
                                        </>
                                    )}
                                </Field>
                            </div>
                            <div
                                className={classNames('quick-strategy__form-row', {
                                    'quick-strategy__form-row--multiple': !is_mobile,
                                })}
                            >
                                <Field name='quick-strategy__duration-unit'>
                                    {({ field }) => (
                                        <>
                                            {is_mobile ? (
                                                <SelectNative
                                                    list_items={duration_unit_dropdown}
                                                    value={selected_duration_unit.value}
                                                    label={localize('Duration unit')}
                                                    should_show_empty_option={false}
                                                    onChange={e => {
                                                        onChangeDropdownItem(
                                                            'duration-unit',
                                                            e.target.value,
                                                            setFieldValue
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <Autocomplete
                                                    {...field}
                                                    autoComplete='off'
                                                    type='text'
                                                    label={localize('Duration unit')}
                                                    list_items={duration_unit_dropdown}
                                                    disabled={duration_unit_dropdown.length === 1}
                                                    onHideDropdownList={() => {
                                                        onHideDropdownList(
                                                            'duration-unit',
                                                            values[field.name],
                                                            setFieldValue
                                                        );
                                                    }}
                                                    onItemSelection={({ value }) => {
                                                        onChangeDropdownItem('duration-unit', value, setFieldValue);
                                                    }}
                                                    onScrollStop={() => onScrollStopDropdownList('duration-unit')}
                                                />
                                            )}
                                        </>
                                    )}
                                </Field>
                                <Field name='quick-strategy__duration-value'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            className='quick-strategy__input'
                                            label_className='quick-strategy__input-label'
                                            field_className='quick-strategy__input-field'
                                            type='text'
                                            error={
                                                initial_errors[field.name] ||
                                                (touched[field.name] && errors[field.name])
                                            }
                                            label={localize('Duration value')}
                                            onChange={e => {
                                                handleChange(e);
                                                onChangeInputValue('input_duration_value', e);
                                            }}
                                            onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                            onBlur={() => setCurrentFocus(null)}
                                            placeholder='5'
                                            trailing_icon={
                                                <Popover
                                                    alignment={is_mobile ? 'top' : 'bottom'}
                                                    message={localize('The trade length of your purchased contract.')}
                                                    zIndex={popover_zindex.QUICK_STRATEGY}
                                                >
                                                    <Icon icon='IcInfoOutline' />
                                                </Popover>
                                            }
                                        />
                                    )}
                                </Field>
                            </div>
                            <div
                                className={classNames('quick-strategy__form-row', {
                                    'quick-strategy__form-row--multiple': !is_mobile,
                                })}
                            >
                                <Field name='quick-strategy__stake'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            className='quick-strategy__input'
                                            label_className='quick-strategy__input-label'
                                            field_className='quick-strategy__input-field'
                                            type='text'
                                            error={
                                                initial_errors[field.name] ||
                                                (touched[field.name] && errors[field.name])
                                            }
                                            label={localize('Initial stake')}
                                            onChange={e => {
                                                handleChange(e);
                                                onChangeInputValue('input_stake', e);
                                            }}
                                            onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                            onBlur={() => setCurrentFocus(null)}
                                            placeholder='10'
                                            trailing_icon={
                                                <Popover
                                                    alignment={is_mobile ? 'top' : 'bottom'}
                                                    message={localize('The amount that you pay to enter a trade.')}
                                                    zIndex={popover_zindex.QUICK_STRATEGY}
                                                >
                                                    <Icon icon='IcInfoOutline' />
                                                </Popover>
                                            }
                                        />
                                    )}
                                </Field>
                                <Field name='quick-strategy__loss'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            className='quick-strategy__input'
                                            label_className='quick-strategy__input-label'
                                            field_className='quick-strategy__input-field'
                                            type='text'
                                            error={
                                                initial_errors[field.name] ||
                                                (touched[field.name] && errors[field.name])
                                            }
                                            label={localize('Loss threshold')}
                                            onChange={e => {
                                                handleChange(e);
                                                onChangeInputValue('input_loss', e);
                                            }}
                                            onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                            onBlur={() => setCurrentFocus(null)}
                                            placeholder='5000'
                                            trailing_icon={
                                                <Popover
                                                    alignment={is_mobile ? 'top' : 'bottom'}
                                                    message={localize(
                                                        'The bot will stop trading if your total loss exceeds this amount.'
                                                    )}
                                                    zIndex={popover_zindex.QUICK_STRATEGY}
                                                >
                                                    <Icon icon='IcInfoOutline' />
                                                </Popover>
                                            }
                                        />
                                    )}
                                </Field>
                            </div>
                            <div
                                className={classNames('quick-strategy__form-row', {
                                    'quick-strategy__form-row--multiple': !is_mobile,
                                })}
                            >
                                <Field name='quick-strategy__size'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            className='quick-strategy__input'
                                            label_className='quick-strategy__input-label'
                                            field_className='quick-strategy__input-field'
                                            type='text'
                                            error={
                                                initial_errors[field.name] ||
                                                (touched[field.name] && errors[field.name])
                                            }
                                            label={getSizeText(active_index)}
                                            onChange={e => {
                                                handleChange(e);
                                                onChangeInputValue('input_size', e);
                                            }}
                                            onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                            onBlur={() => setCurrentFocus(null)}
                                            placeholder='2'
                                            trailing_icon={
                                                <Popover
                                                    alignment={is_mobile ? 'top' : 'bottom'}
                                                    message={getSizeDesc(active_index)}
                                                    zIndex={popover_zindex.QUICK_STRATEGY}
                                                >
                                                    <Icon icon='IcInfoOutline' />
                                                </Popover>
                                            }
                                        />
                                    )}
                                </Field>
                                <Field name='quick-strategy__profit'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            className='quick-strategy__input'
                                            label_className='quick-strategy__input-label'
                                            field_className='quick-strategy__input-field'
                                            type='text'
                                            error={
                                                initial_errors[field.name] ||
                                                (touched[field.name] && errors[field.name])
                                            }
                                            label={localize('Profit threshold')}
                                            onChange={e => {
                                                handleChange(e);
                                                onChangeInputValue('input_profit', e);
                                            }}
                                            onFocus={e => setCurrentFocus(e.currentTarget.name)}
                                            onBlur={() => setCurrentFocus(null)}
                                            placeholder='5000'
                                            trailing_icon={
                                                <Popover
                                                    alignment={is_mobile ? 'top' : 'bottom'}
                                                    message={localize(
                                                        'The bot will stop trading if your total profit exceeds this amount.'
                                                    )}
                                                    zIndex={popover_zindex.QUICK_STRATEGY}
                                                >
                                                    <Icon icon='IcInfoOutline' />
                                                </Popover>
                                            }
                                        />
                                    )}
                                </Field>
                            </div>
                        </div>
                    </ThemedScrollbars>
                    <div
                        className={classNames('quick-strategy__form-footer', {
                            'quick-strategy__form-footer--active-keyboard': is_onscreen_keyboard_active,
                        })}
                    >
                        <Button.Group>
                            {!is_mobile && (
                                <Button
                                    type='button'
                                    id='db-quick-strategy__button-edit'
                                    text={localize('Create and edit')}
                                    is_disabled={!is_submit_enabled}
                                    secondary
                                    large
                                    onClick={() => {
                                        setFieldValue('button', 'edit');
                                        submitForm();
                                    }}
                                />
                            )}
                            <Button
                                type='button'
                                id='db-quick-strategy__button-run'
                                text={localize('Run')}
                                is_disabled={!is_submit_enabled || is_stop_button_visible}
                                primary
                                large
                                onClick={() => {
                                    setFieldValue('button', 'run');
                                    submitForm();
                                }}
                            />
                        </Button.Group>
                    </div>
                </Form>
            );
        }}
    </Formik>
);

const MarketOption = ({ symbol }) => (
    <div key={symbol.value} className='quick-strategy__option'>
        <Icon icon={`IcUnderlying${symbol.value}`} size={32} />
        <Text className='quick-strategy__symbol' size='xs' color='prominent'>
            {symbol.text}
        </Text>
    </div>
);

const TradeTypeOption = ({ trade_type }) => (
    <div key={trade_type.value} className='quick-strategy__option'>
        <IconTradeTypes type={trade_type.icon[0]} className='quick-strategy__icon' />
        <IconTradeTypes type={trade_type.icon[1]} className='quick-strategy__icon' />
        <Text className='quick-strategy__symbol' size='xs' color='prominent'>
            {trade_type.text}
        </Text>
    </div>
);
const ContentRenderer = props => {
    const { strategies } = config;
    const {
        setActiveTabIndex,
        symbol_dropdown,
        trade_type_dropdown,
        active_index,
        createStrategy,
        duration_unit_dropdown,
        getSizeDesc,
        getSizeText,
        initial_errors,
        initial_values,
        is_onscreen_keyboard_active,
        is_mobile,
        is_stop_button_visible,
        onChangeDropdownItem,
        onChangeInputValue,
        onHideDropdownList,
        onScrollStopDropdownList,
        validateQuickStrategy,
        selected_symbol,
        selected_trade_type,
        setCurrentFocus,
        selected_duration_unit,
    } = props;
    const symbol_dropdown_options = symbol_dropdown
        .map(symbol => ({
            component: <MarketOption symbol={symbol} />,
            ...symbol,
        }))
        .filter(option => option.group !== 'Cryptocurrencies'); // Until Crypto enabled for Dbot
    const trade_type_dropdown_options = trade_type_dropdown.map(trade_type => ({
        component: <TradeTypeOption trade_type={trade_type} />,
        ...trade_type,
    }));

    return (
        <Tabs active_index={active_index} onTabItemClick={setActiveTabIndex} top>
            {Object.keys(strategies).map(key => {
                const { index, label, description } = strategies[key];
                return (
                    <div key={index} label={label}>
                        <QuickStrategyForm
                            active_index={active_index}
                            createStrategy={createStrategy}
                            duration_unit_dropdown={duration_unit_dropdown}
                            getSizeDesc={getSizeDesc}
                            getSizeText={getSizeText}
                            initial_errors={initial_errors}
                            initial_values={initial_values}
                            is_onscreen_keyboard_active={is_onscreen_keyboard_active}
                            is_stop_button_visible={is_stop_button_visible}
                            onChangeDropdownItem={onChangeDropdownItem}
                            onChangeInputValue={onChangeInputValue}
                            onHideDropdownList={onHideDropdownList}
                            onScrollStopDropdownList={onScrollStopDropdownList}
                            validateQuickStrategy={validateQuickStrategy}
                            symbol_dropdown={symbol_dropdown_options}
                            trade_type_dropdown={trade_type_dropdown_options}
                            is_mobile={is_mobile}
                            selected_symbol={selected_symbol}
                            selected_trade_type={selected_trade_type}
                            selected_duration_unit={selected_duration_unit}
                            description={description}
                            setCurrentFocus={setCurrentFocus}
                        />
                    </div>
                );
            })}
        </Tabs>
    );
};

const QuickStrategy = props => {
    const { is_strategy_modal_open, is_mobile, toggleStrategyModal } = props;

    return (
        <>
            {is_mobile ? (
                <MobileFullPageModal
                    is_modal_open={is_strategy_modal_open}
                    className='quick-strategy__wrapper'
                    header={localize('Quick Strategy')}
                    onClickClose={toggleStrategyModal}
                    height_offset='80px'
                    page_overlay
                >
                    <ContentRenderer {...props} />
                </MobileFullPageModal>
            ) : (
                <Modal
                    title={localize('Quick strategy')}
                    className='modal--strategy'
                    is_open={is_strategy_modal_open}
                    toggleModal={toggleStrategyModal}
                    width={'540px'}
                >
                    <div className='modal__content'>
                        <ContentRenderer {...props} />
                    </div>
                </Modal>
            )}
        </>
    );
};

QuickStrategy.propTypes = {
    active_index: PropTypes.number,
    createStrategy: PropTypes.func,
    duration_unit_dropdown: PropTypes.array,
    getSizeDesc: PropTypes.func,
    getSizeText: PropTypes.func,
    initial_errors: PropTypes.object,
    initial_values: PropTypes.object,
    is_mobile: PropTypes.bool,
    is_stop_button_visible: PropTypes.bool,
    is_strategy_modal_open: PropTypes.bool,
    onChangeDropdownItem: PropTypes.func,
    onChangeInputValue: PropTypes.func,
    onChangeSymbolInput: PropTypes.func,
    onHideDropdownList: PropTypes.func,
    onScrollStopDropdownList: PropTypes.func,
    setActiveTabIndex: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    selected_symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    selected_trade_type: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    selected_duration_unit: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    symbol_dropdown: PropTypes.array,
    toggleStrategyModal: PropTypes.func,
    trade_type_dropdown: PropTypes.array,
    validateQuickStrategy: PropTypes.func,
};

export default connect(({ run_panel, quick_strategy, ui }) => ({
    active_index: quick_strategy.active_index,
    createStrategy: quick_strategy.createStrategy,
    duration_unit_dropdown: quick_strategy.duration_unit_dropdown,
    getSizeDesc: quick_strategy.getSizeDesc,
    getSizeText: quick_strategy.getSizeText,
    initial_errors: quick_strategy.initial_errors,
    initial_values: quick_strategy.initial_values,
    is_onscreen_keyboard_active: ui.is_onscreen_keyboard_active,
    is_mobile: ui.is_mobile,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    is_strategy_modal_open: quick_strategy.is_strategy_modal_open,
    onChangeDropdownItem: quick_strategy.onChangeDropdownItem,
    onChangeInputValue: quick_strategy.onChangeInputValue,
    onChangeSymbolInput: quick_strategy.onChangeSymbolInput,
    onHideDropdownList: quick_strategy.onHideDropdownList,
    onScrollStopDropdownList: quick_strategy.onScrollStopDropdownList,
    setActiveTabIndex: quick_strategy.setActiveTabIndex,
    selected_symbol: quick_strategy.selected_symbol,
    selected_trade_type: quick_strategy.selected_trade_type,
    selected_duration_unit: quick_strategy.selected_duration_unit,
    symbol_dropdown: quick_strategy.symbol_dropdown,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
    trade_type_dropdown: quick_strategy.trade_type_dropdown,
    validateQuickStrategy: quick_strategy.validateQuickStrategy,
    setCurrentFocus: ui.setCurrentFocus,
}))(QuickStrategy);
