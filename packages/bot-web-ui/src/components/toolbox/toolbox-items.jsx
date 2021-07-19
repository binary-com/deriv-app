import React from 'react';
import ReactDomServer from 'react-dom/server';
import { localize } from '@deriv/translations';

const Block = ({ ...props }) => {
    return React.createElement('block', props);
};

const Category = ({ ...props }) => {
    return React.createElement('category', props);
};

const Field = ({ ...props }) => {
    return React.createElement('field', props);
};

const Mutation = ({ ...props }) => {
    return React.createElement('mutation', props);
};

const Next = ({ ...props }) => {
    return React.createElement('next', props);
};

const Shadow = ({ ...props }) => {
    return React.createElement('shadow', props);
};

const Statement = ({ ...props }) => {
    return React.createElement('statement', props);
};

const Value = ({ ...props }) => {
    return React.createElement('value', props);
};

const Xml = ({ ...props }) => {
    return React.createElement('xml', props);
};

export const ToolboxItems = ReactDomServer.renderToStaticMarkup(
    <Xml xmlns='http://www.w3.org/1999/xhtml' id='toolbox'>
        <Category id='trade_parameters' name={localize('Set up your trade')}>
            <Block type='trade_definition'>
                <Statement name='TRADE_OPTIONS'>
                    <Block type='trade_definition_market' deletable='false' movable='false'>
                        <Field name='MARKET_LIST' />
                        <Field name='SUBMARKET_LIST' />
                        <Field name='SYMBOL_LIST' />
                        <Next>
                            <Block type='trade_definition_tradetype' deletable='false' movable='false'>
                                <Field name='TRADETYPECAT_LIST' />
                                <Field name='TRADETYPE_LIST' />
                                <Next>
                                    <Block type='trade_definition_contracttype' deletable='false' movable='false'>
                                        <Field name='TYPE_LIST' />
                                        <Next>
                                            <Block
                                                type='trade_definition_candleinterval'
                                                deletable='false'
                                                movable='false'
                                            >
                                                <Field name='CANDLEINTERVAL_LIST'>60</Field>
                                                <Next>
                                                    <Block
                                                        type='trade_definition_restartbuysell'
                                                        deletable='false'
                                                        movable='false'
                                                    >
                                                        <Field name='TIME_MACHINE_ENABLED'>FALSE</Field>
                                                        <Next>
                                                            <Block
                                                                type='trade_definition_restartonerror'
                                                                deletable='false'
                                                                movable='false'
                                                            >
                                                                <Field name='RESTARTONERROR'>TRUE</Field>
                                                            </Block>
                                                        </Next>
                                                    </Block>
                                                </Next>
                                            </Block>
                                        </Next>
                                    </Block>
                                </Next>
                            </Block>
                        </Next>
                    </Block>
                </Statement>
            </Block>
            <Block type='trade_definition_tradeoptions'>
                <Mutation has_first_barrier='false' has_second_barrier='false' has_prediction='false' />
                <Field name='DURATIONTYPE_LIST' />
                <Field name='CURRENCY_LIST'>USD</Field>
                <Value name='DURATION'>
                    <Shadow type='math_number'>
                        <Field name='NUM'>1</Field>
                    </Shadow>
                </Value>
                <Value name='AMOUNT'>
                    <Shadow type='math_number'>
                        <Field name='NUM'>1</Field>
                    </Shadow>
                </Value>
                <Field name='AMOUNT_LIMITS' />
            </Block>
            <Block type='trade_definition_multiplier'>
                <Field name='MULTIPLIERTYPE_LIST' />
                <Field name='CURRENCY_LIST'>USD</Field>
                <Value name='AMOUNT'>
                    <Shadow type='math_number'>
                        <Field name='NUM'>1</Field>
                    </Shadow>
                </Value>
                <Field name='AMOUNT_LIMITS' />
            </Block>
            <Block type='multiplier_take_profit'>
                <Value name='AMOUNT'>
                    <Shadow type='math_number'>
                        <Field name='NUM'>0</Field>
                    </Shadow>
                </Value>
            </Block>
            <Block type='multiplier_stop_loss'>
                <Value name='AMOUNT'>
                    <Shadow type='math_number'>
                        <Field name='NUM'>0</Field>
                    </Shadow>
                </Value>
            </Block>
        </Category>
        <Category id='purchase_conditions' name={localize('Purchase contract')}>
            <Block type='before_purchase' />
            <Block type='purchase' />
        </Category>
        <Category id='sell_conditions' name={localize('Sell contract (optional)')}>
            <Block type='during_purchase' />
            <Block type='sell_at_market' />
        </Category>
        <Category id='trade_results' name={localize('Trade again')}>
            <Block type='after_purchase' />
            <Block type='trade_again' />
        </Category>

        <Category id='analysis' name={localize('Analysis')}>
            <Category id='indicators' name={localize('Indicators')}>
                <Block type='sma_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST' />
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='smaa_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST' />
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='bb_statement'>
                    <Field name='BBRESULT_LIST'>0</Field>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST' />
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                    <Next>
                                        <Block type='std_dev_multiplier_up' deletable='false' movable='false'>
                                            <Value name='UPMULTIPLIER'>
                                                <Shadow type='math_number'>
                                                    <Field name='NUM'>5</Field>
                                                </Shadow>
                                            </Value>
                                            <Next>
                                                <Block type='std_dev_multiplier_down'>
                                                    <Value name='DOWNMULTIPLIER'>
                                                        <Shadow type='math_number'>
                                                            <Field name='NUM'>5</Field>
                                                        </Shadow>
                                                    </Value>
                                                </Block>
                                            </Next>
                                        </Block>
                                    </Next>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='bba_statement'>
                    <Field name='BBRESULT_LIST'>0</Field>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST' />
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                    <Next>
                                        <Block type='std_dev_multiplier_up' deletable='false' movable='false'>
                                            <Value name='UPMULTIPLIER'>
                                                <Shadow type='math_number'>
                                                    <Field name='NUM'>5</Field>
                                                </Shadow>
                                            </Value>
                                            <Next>
                                                <Block type='std_dev_multiplier_down'>
                                                    <Value name='DOWNMULTIPLIER'>
                                                        <Shadow type='math_number'>
                                                            <Field name='NUM'>5</Field>
                                                        </Shadow>
                                                    </Value>
                                                </Block>
                                            </Next>
                                        </Block>
                                    </Next>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='ema_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST' />
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='emaa_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST' />
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='rsi_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='rsia_statement'>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST' />
                            <Next>
                                <Block type='period' deletable='false' movable='false'>
                                    <Value name='PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>10</Field>
                                        </Shadow>
                                    </Value>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='macda_statement'>
                    <Field name='MACDFIELDS_LIST'>1</Field>
                    <Statement name='STATEMENT'>
                        <Block type='input_list' deletable='false' movable='false'>
                            <Value name='INPUT_LIST' />
                            <Next>
                                <Block type='fast_ema_period' deletable='false' movable='false'>
                                    <Value name='FAST_EMA_PERIOD'>
                                        <Shadow type='math_number'>
                                            <Field name='NUM'>12</Field>
                                        </Shadow>
                                    </Value>
                                    <Next>
                                        <Block type='slow_ema_period' deletable='false' movable='false'>
                                            <Value name='SLOW_EMA_PERIOD'>
                                                <Shadow type='math_number'>
                                                    <Field name='NUM'>26</Field>
                                                </Shadow>
                                            </Value>
                                            <Next>
                                                <Block type='signal_ema_period' deletable='false' movable='false'>
                                                    <Value name='SIGNAL_EMA_PERIOD'>
                                                        <Shadow type='math_number'>
                                                            <Field name='NUM'>9</Field>
                                                        </Shadow>
                                                    </Value>
                                                </Block>
                                            </Next>
                                        </Block>
                                    </Next>
                                </Block>
                            </Next>
                        </Block>
                    </Statement>
                </Block>
            </Category>

            <Category name={localize('Tick and candle analysis')} id='tick_analysis'>
                <Block type='tick_analysis' />
                <Block type='tick' />
                <Block type='last_digit' />
                <Block type='ticks' />
                <Block type='lastDigitList' />
                <Block type='check_direction' />
                <Block type='is_candle_black' />
                <Block type='read_ohlc'>
                    <Field name='OHLCFIELD_LIST'>open</Field>
                    <Field name='CANDLEINTERVAL_LIST'>default</Field>
                    <Value name='CANDLEINDEX'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='read_ohlc_obj' />
                <Block type='ohlc_values' />
                <Block type='ohlc_values_in_list' />
                <Block type='get_ohlc'>
                    <Field name='CANDLEINTERVAL_LIST'>default</Field>
                    <Value name='CANDLEINDEX'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='ohlc' />
            </Category>

            <Category name={localize('Contract')} id='contract_details'>
                <Block type='contract_check_result' />
                <Block type='read_details' />
                <Block type='sell_price' />
                <Block type='check_sell' />
                <Block type='payout' />
                <Block type='ask_price' />
            </Category>

            <Category name={localize('Stats')} id='stats'>
                <Block type='balance' />
                <Block type='total_profit' />
                <Block type='total_runs' />
            </Category>
        </Category>

        <Category id='utility' name={localize('Utility')}>
            <Category name={localize('Custom functions')} id='custom_functions' dynamic='PROCEDURE' />

            <Category name={localize('Variables')} id='variables' dynamic='VARIABLE' />

            <Category name={localize('Notifications')} id='notifications'>
                <Block type='text_print'>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_prompt_ext'>
                    <Field name='TYPE'>TEXT</Field>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='notify'>
                    <Field name='NOTIFICATION_TYPE'>success</Field>
                    <Value name='MESSAGE'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='notify_telegram'>
                    <Value name='TELEGRAM_ACCESS_TOKEN'>
                        <Shadow type='text'>
                            <Field name='TEXT' />
                        </Shadow>
                    </Value>
                    <Value name='TELEGRAM_CHAT_ID'>
                        <Shadow type='text'>
                            <Field name='TEXT' />
                        </Shadow>
                    </Value>
                    <Value name='TELEGRAM_MESSAGE'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
            </Category>

            <Category name={localize('Time')} id='time'>
                <Block type='epoch' />
                <Block type='timeout' />
                <Block type='totimestamp'>
                    <Value name='DATETIME'>
                        <Shadow type='text'>
                            <Field name='TEXT'>yyyy-mm-dd hh:mm:ss</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='todatetime'>
                    <Value name='TIMESTAMP'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>0</Field>
                        </Shadow>
                    </Value>
                </Block>
            </Category>

            <Category name={localize('Math')} id='math'>
                <Block type='math_number' />
                <Block type='math_arithmetic'>
                    <Field name='OP'>ADD</Field>
                    <Value name='A'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                    <Value name='B'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_single'>
                    <Field name='OP'>ROOT</Field>
                    <Value name='NUM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>9</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_trig'>
                    <Field name='OP'>SIN</Field>
                    <Value name='NUM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>45</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_constant' />
                <Block type='math_number_property'>
                    <Mutation divisor_input='false' />
                    <Field name='PROPERTY'>EVEN</Field>
                    <Value name='NUMBER_TO_CHECK'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>0</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_change'>
                    <Field name='VAR' variabletype=''>
                        item
                    </Field>
                    <Value name='DELTA'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_on_list' />
                <Block type='math_round'>
                    <Field name='OP'>ROUND</Field>
                    <Value name='NUM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>3.1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_modulo'>
                    <Value name='DIVIDEND'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>64</Field>
                        </Shadow>
                    </Value>
                    <Value name='DIVISOR'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>10</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_constrain'>
                    <Value name='Value'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>50</Field>
                        </Shadow>
                    </Value>
                    <Value name='LOW'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                    <Value name='HIGH'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>100</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_random_int'>
                    <Value name='FROM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                    <Value name='TO'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>100</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='math_random_float' />
            </Category>

            <Category name={localize('Text')} id='text'>
                <Block type='text'>
                    <Field name='TEXT'>abc</Field>
                </Block>
                <Block type='text_join'>
                    <Field name='VARIABLE' variabletype=''>
                        text
                    </Field>
                    <Statement name='STACK'>
                        <Block type='text_statement' movable='false'>
                            <Value name='TEXT'>
                                <Shadow type='text'>
                                    <Field name='TEXT'>abc</Field>
                                </Shadow>
                            </Value>
                        </Block>
                    </Statement>
                </Block>
                <Block type='text_append'>
                    <Field name='VAR' variabletype=''>
                        text
                    </Field>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_length'>
                    <Value name='Value'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_isEmpty'>
                    <Value name='Value'>
                        <Shadow type='text'>
                            <Field name='TEXT' />
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_indexOf'>
                    <Field name='END'>FIRST</Field>
                    <Value name='Value'>
                        <Block type='variables_get'>
                            <Field name='VAR' variabletype=''>
                                text
                            </Field>
                        </Block>
                    </Value>
                    <Value name='FIND'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_charAt'>
                    <Mutation at='true' />
                    <Field name='WHERE'>FROM_START</Field>
                    <Value name='Value'>
                        <Block type='variables_get'>
                            <Field name='VAR' variabletype=''>
                                item
                            </Field>
                        </Block>
                    </Value>
                    <Value name='AT'>
                        <Shadow type='math_number_positive'>
                            <Field name='NUM'>1</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_getSubstring'>
                    <Mutation at1='true' at2='true' />
                    <Field name='WHERE1'>FROM_START</Field>
                    <Field name='WHERE2'>FROM_START</Field>
                    <Value name='STRING'>
                        <Block type='variables_get'>
                            <Field name='VAR' variabletype=''>
                                text
                            </Field>
                        </Block>
                    </Value>
                    <Value name='AT1'>
                        <Shadow type='math_number_positive'>
                            <Field name='NUM'>0</Field>
                        </Shadow>
                    </Value>
                    <Value name='AT2'>
                        <Shadow type='math_number_positive'>
                            <Field name='NUM'>2</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_changeCase'>
                    <Field name='CASE'>UPPERCASE</Field>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='text_trim'>
                    <Field name='MODE'>BOTH</Field>
                    <Value name='TEXT'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
            </Category>

            <Category name={localize('Logic')} id='logic'>
                <Block type='controls_if' />
                <Block type='logic_compare' />
                <Block type='logic_operation' />
                <Block type='logic_negate' />
                <Block type='logic_boolean' />
                <Block type='logic_null' />
                <Block type='logic_ternary' />
            </Category>

            <Category name={localize('Lists')} id='lists'>
                <Block type='lists_create_with'>
                    <Field name='VARIABLE' variabletype=''>
                        list
                    </Field>
                    <Statement name='STACK'>
                        <Block type='lists_statement' movable='false'>
                            <Next>
                                <Block type='lists_statement' movable='false' />
                            </Next>
                        </Block>
                    </Statement>
                </Block>
                <Block type='lists_repeat'>
                    <Value name='NUM'>
                        <Shadow type='math_number'>
                            <Field name='NUM'>5</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='lists_length' />
                <Block type='lists_isEmpty' />
                <Block type='lists_indexOf' />
                <Block type='lists_getIndex' />
                <Block type='lists_setIndex' />
                <Block type='lists_getSublist' />
                <Block type='lists_split'>
                    <Mutation mode='SPLIT' />
                    <Field name='MODE'>SPLIT</Field>
                    <Value name='DELIM'>
                        <Shadow type='text'>
                            <Field name='TEXT'>,</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type='lists_sort' />
            </Category>

            <Category name={localize('Loops')} id='loops'>
                <Block type='controls_repeat' />
                <Block type='controls_repeat_ext' />
                <Block type='controls_whileUntil' />
                <Block type='controls_for' />
                <Block type='controls_forEach' />
                <Block type='controls_flow_statements' />
            </Category>

            <Category name={localize('Miscellaneous')} id='misc'>
                <Block type='loader' />
                <Block type='block_holder' />
                <Block type='console'>
                    <Value name='MESSAGE'>
                        <Shadow type='text'>
                            <Field name='TEXT'>abc</Field>
                        </Shadow>
                    </Value>
                </Block>
            </Category>
        </Category>
    </Xml>
);
