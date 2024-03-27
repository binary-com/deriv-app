import React from 'react';
import classNames from 'classnames';
import BarriersList from './barriers-list';
import { InputField, Dropdown, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { clickAndKeyEventHandler, toMoment, TRADE_TYPES } from '@deriv/shared';
import Fieldset from 'App/Components/Form/fieldset';
import StrikeParamModal from 'Modules/Trading/Containers/strike-param-modal';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { useDevice } from '@deriv/hooks';

const Strike = observer(() => {
    const { ui, common } = useStore();
    const {
        barrier_1,
        contract_type,
        barrier_choices: strike_price_choices,
        duration_unit,
        onChange,
        validation_errors,
        expiry_type,
        expiry_date,
    } = useTraderStore();
    const { current_focus, setCurrentFocus, advanced_duration_unit } = ui;
    const { server_time } = common;

    const [is_open, setIsOpen] = React.useState(false);
    const [should_open_dropdown, setShouldOpenDropdown] = React.useState(false);
    const [selected_value, setSelectedValue] = React.useState(barrier_1);
    const { isMobile } = useDevice();

    React.useEffect(() => {
        setSelectedValue(barrier_1);
    }, [barrier_1]);

    const toggleWidget = (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        clickAndKeyEventHandler(() => setIsOpen(!is_open), e);
    };

    const is_24_hours_contract = expiry_date ? toMoment(expiry_date).isSame(toMoment(server_time), 'day') : false;

    const is_relative_strike_applicable =
        expiry_type === 'endtime' ? is_24_hours_contract : advanced_duration_unit !== 'd';

    const strike_price_list = strike_price_choices.map((strike_price: string) => ({
        text: strike_price,
        value: strike_price,
    }));

    const should_show_spot = duration_unit !== 'd';

    if (isMobile) {
        return (
            <div className='mobile-widget__wrapper'>
                <div className='strike-widget' onClick={toggleWidget} onKeyDown={toggleWidget}>
                    {should_show_spot && (
                        <div className='mobile-widget__spot'>
                            <Text size='xs'>
                                <Localize i18n_default_text='Spot' />
                            </Text>
                        </div>
                    )}
                    <div className='mobile-widget__amount'>{barrier_1}</div>
                    <div className='mobile-widget__type'>
                        <Localize i18n_default_text='Strike price' />
                    </div>
                </div>
                <StrikeParamModal
                    contract_type={contract_type}
                    is_open={is_open}
                    toggleModal={toggleWidget}
                    strike={barrier_1}
                    onChange={onChange}
                    name='barrier_1'
                    strike_price_list={strike_price_list}
                />
            </div>
        );
    }

    return (
        <React.Fragment>
            <Fieldset
                className='trade-container__fieldset trade-container__barriers'
                header={<Localize i18n_default_text='Strike price' />}
                header_tooltip={
                    <Localize
                        i18n_default_text='If you buy a "<0>{{trade_type}}</0>" option, you receive a payout at expiry if the final price is {{payout_status}} the strike price. Otherwise, your “<0>{{trade_type}}</0>” option will expire worthless.'
                        components={[<strong key={0} />]}
                        values={{
                            trade_type: contract_type === TRADE_TYPES.VANILLA.CALL ? localize('Call') : localize('Put'),
                            payout_status:
                                contract_type === TRADE_TYPES.VANILLA.CALL ? localize('above') : localize('below'),
                        }}
                    />
                }
            >
                {!is_relative_strike_applicable ? (
                    <InputField
                        type='number'
                        name='barrier_1'
                        data_testid='dt_strike_input'
                        value={selected_value}
                        className='trade-container__barriers-single'
                        classNameInput={classNames(
                            'trade-container__input',
                            'trade-container__barriers-input',
                            'trade-container__barriers-single-input'
                        )}
                        current_focus={current_focus}
                        error_messages={validation_errors?.barrier_1 || []}
                        is_float
                        is_signed
                        is_read_only
                        setCurrentFocus={setCurrentFocus}
                        onClick={() => setShouldOpenDropdown(true)}
                    />
                ) : (
                    <div className='trade-container__strike-field'>
                        <Text size='s' className='strike-field--text'>
                            <Localize i18n_default_text='Spot' />
                        </Text>
                        <Dropdown
                            classNameDisplay='dc-dropdown__display--duration'
                            disabled={false}
                            id='strike'
                            is_alignment_left
                            is_nativepicker={false}
                            list={strike_price_list}
                            name='barrier_1'
                            no_border={true}
                            onChange={onChange}
                            value={barrier_1}
                        />
                    </div>
                )}
            </Fieldset>
            {should_open_dropdown && (
                <BarriersList
                    className='trade-container__barriers-table'
                    header={<Localize i18n_default_text='Strike Prices' />}
                    barriers_list={strike_price_choices}
                    selected_item={selected_value}
                    show_table={should_open_dropdown}
                    onClick={(strike: string) => {
                        setSelectedValue(strike);
                        setShouldOpenDropdown(false);
                        onChange({ target: { name: 'barrier_1', value: strike } });
                    }}
                    onClickCross={() => setShouldOpenDropdown(false)}
                />
            )}
        </React.Fragment>
    );
});

export default Strike;
