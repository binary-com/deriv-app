import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import DBotStore from '../../../dbot-store';
import { modifyContextMenu, runGroupedEvents, runIrreversibleEvents } from '../../../utils';
import { config } from '../../../../constants/config';
import ApiHelpers from '../../../../services/api/api-helpers';
import { handleProposalRequestForAccumulators } from '../../../accumulators-proposal-handler';

Blockly.Blocks.trade_definition_accumulator = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition() {
        return {
            message0: localize('Growth Rate: {{ accumulator }}', {
                accumulator: '%1',
            }),
            message1: `${localize('Stake')}: %1 %2`,
            message2: '%1',
            message3: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'GROWTHRATE_LIST',
                    options: [['', '']],
                },
            ],
            args1: [
                {
                    type: 'field_label',
                    name: 'CURRENCY_LIST',
                    text: getCurrencyDisplayCode(config.lists.CURRENCY[0]),
                },
                {
                    type: 'input_value',
                    name: 'AMOUNT',
                    check: 'Number',
                },
            ],
            args2: [
                {
                    type: 'input_dummy',
                },
            ],
            args3: [
                {
                    type: 'input_statement',
                    name: 'ACCUMULATOR_PARAMS',
                },
            ],
            colour: Blockly.Colours.Special1.colour,
            colourSecondary: Blockly.Colours.Special1.colourSecondary,
            colourTertiary: Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Define your trade options, such as accumulator and stake.'),
            category: Blockly.Categories.Trade_Definition,
        };
    },
    meta() {
        return {
            display_name: localize('Accumulator trade options'),
            description: localize(
                'Define your trade options such as accumulator and stake. This block can only be used with the accumulator trade type. If you select another trade type, this block will be replaced with the Trade options block.'
            ),
        };
    },
    validateBlocksInStatement() {
        // Enforce only accumulator_<type> blocks in ACCUMULATOR_PARAMS statement.
        const blocks_in_accumulator = this.getBlocksInStatement('ACCUMULATOR_PARAMS');

        if (blocks_in_accumulator.length > 0) {
            const block_types_in_accumulator = [];
            blocks_in_accumulator.forEach(block => {
                block_types_in_accumulator.push(block.type);

                const block_accumulator_take_profit = block.childValueToCode('accumulator_take_profit', 'AMOUNT');

                if (block_accumulator_take_profit <= 0) {
                    block.setDisabled(true);
                }

                if (block.type === 'accumulator_take_profit' && block_accumulator_take_profit > 0) {
                    block.setDisabled(false);
                }

                if (
                    !/^accumulator_.+$/.test(block.type) ||
                    new Set(block_types_in_accumulator).size !== block_types_in_accumulator.length
                ) {
                    runIrreversibleEvents(() => {
                        block.unplug(true);
                    });
                }
            });
        }
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyoutVisible || this.workspace.isDragging()) {
            return;
        }
        handleProposalRequestForAccumulators(this);
        const trade_definition_block = this.workspace
            .getAllBlocks(true)
            .find(block => block.type === 'trade_definition');
        if (!trade_definition_block) {
            return;
        }

        const market_block = trade_definition_block.getChildByType('trade_definition_market');
        const trade_type_block = trade_definition_block.getChildByType('trade_definition_tradetype');

        if (!market_block || !trade_type_block) {
            return;
        }

        this.selected_symbol = market_block.getFieldValue('SYMBOL_LIST');
        this.selected_market = market_block.getFieldValue('MARKET_LIST');
        this.selected_trade_type_category = trade_type_block.getFieldValue('TRADETYPECAT_LIST');
        this.selected_trade_type = trade_type_block.getFieldValue('TRADETYPE_LIST');
        this.selected_growth_rate = this.getFieldValue('GROWTHRATE_LIST');

        const is_load_event = /^dbot-load/.test(event.group);

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            this.setCurrency();
            if (is_load_event) {
                // Do NOT touch any values when a strategy is being loaded.
                this.updateAccumulatorInput(false);
            } else {
                this.updateAccumulatorInput(true);
            }
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CHANGE) {
            this.validateBlocksInStatement();
            if (is_load_event) {
                if (event.name === 'TRADETYPE_LIST') {
                    this.updateAccumulatorInput(false);
                }
            } else if (event.blockId === this.id) {
                switch (event.name) {
                    case 'GROWTHRATE_LIST': {
                        this.updateAccumulatorInput(false);
                        break;
                    }
                    default:
                        break;
                }
            } else if (event.name === 'SYMBOL_LIST' || event.name === 'TRADETYPE_LIST') {
                this.updateAccumulatorInput(true);
            }
            return;
        }

        if (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) {
            this.setCurrency();
            this.validateBlocksInStatement();
            if (event.blockId === this.id) {
                // Ensure this block is populated after initial drag from flyout.
                if (!this.selected_growth_rate) {
                    const fake_creation_event = new Blockly.Events.Create(this);
                    fake_creation_event.recordUndo = false;
                    Blockly.Events.fire(fake_creation_event);
                } else if (this.selected_trade_type !== 'accumulator') {
                    this.updateAccumulatorInput(true);
                }
            }
        }
    },
    updateAmountLimits: Blockly.Blocks.trade_definition_tradeoptions.updateAmountLimits,
    updateAccumulatorInput(should_use_default_value) {
        const { contracts_for } = ApiHelpers.instance;

        if (this.selected_trade_type === 'accumulator') {
            contracts_for.getAccumulationRange().then(accumulator_range => {
                if (accumulator_range.length > 0) {
                    const accumulator_list_dropdown = this.getField('GROWTHRATE_LIST');
                    const accumulator_options = accumulator_range.map(value => {
                        const option = value.toString();
                        return [`${option * 100}%`, option];
                    });

                    accumulator_list_dropdown?.updateOptions(accumulator_options, {
                        default_value: should_use_default_value ? undefined : accumulator_list_dropdown.getValue(),
                    });
                }
            });
            return;
        }

        if (this.isDescendantOf('trade_definition')) {
            runIrreversibleEvents(() => {
                runGroupedEvents(false, () => {
                    const {
                        workspaces: {
                            indentWorkspace: { x, y },
                        },
                    } = config;

                    const duration_block = this.workspace.newBlock('trade_definition_tradeoptions');
                    duration_block.initSvg();
                    duration_block.render();

                    const trade_definition_block = this.workspace.getTradeDefinitionBlock();
                    const parent_connection = trade_definition_block.getInput('SUBMARKET').connection;
                    const child_connection = duration_block.previousConnection;
                    parent_connection.connect(child_connection);

                    const duration_input = duration_block.getInput('DURATION');

                    const duration_shadow_block = this.workspace.newBlock('math_number_positive');
                    duration_shadow_block.setShadow(true);
                    duration_shadow_block.outputConnection.connect(duration_input.connection);
                    duration_shadow_block.initSvg();
                    duration_shadow_block.render(true);

                    const stake_input = duration_block.getInput('AMOUNT');

                    const stake_shadow_block = this.workspace.newBlock('math_number_positive');
                    stake_shadow_block.setShadow(true);
                    stake_shadow_block.setFieldValue(1, 'NUM');
                    stake_shadow_block.outputConnection.connect(stake_input.connection);
                    stake_shadow_block.initSvg();
                    stake_shadow_block.render(true);

                    this.dispose();
                    Blockly.derivWorkspace.cleanUp(x, y);
                });
            });
        }
    },
    customContextMenu(menu) {
        modifyContextMenu(menu);
    },
    setCurrency: Blockly.Blocks.trade_definition_tradeoptions.setCurrency,
    restricted_parents: ['trade_definition'],
    getRequiredValueInputs() {
        return {
            AMOUNT: input => {
                const input_number = Number(input);
                const max_payout = this.amount_limits?.max_payout;
                const min_stake = this.amount_limits?.min_stake;
                if (min_stake && input_number < min_stake) {
                    this.error_message = localize("Please enter a stake amount that's at least {{min_stake}}.", {
                        min_stake,
                    });
                    return input_number < min_stake;
                }
                if (max_payout && input_number > max_payout) {
                    this.error_message = localize("Please enter a payout amount that's lower than {{max_payout}}.", {
                        max_payout,
                    });
                    return input_number > max_payout;
                }
                this.error_message = localize('Amount must be a positive number.');
                return !isNaN(input_number) && input_number <= 0;
            },
        };
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_accumulator = block => {
    const amount =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'AMOUNT',
            Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '0';
    const { currency } = DBotStore.instance.client;
    const { setContractUpdateConfig } = DBotStore.instance;
    const growth_rate = block.getFieldValue('GROWTHRATE_LIST') || '1';
    const take_profit =
        !block.getChildByType('accumulator_take_profit')?.disabled &&
        block.childValueToCode('accumulator_take_profit', 'AMOUNT');

    const limit_order = {
        take_profit: take_profit ? `+(Number(${take_profit}).toFixed(2))` : undefined,
    };

    setContractUpdateConfig(undefined, take_profit);
    // Determine decimal places for rounding the stake, this is done so Martingale accumulators
    // are not affected by fractional values e.g. USD 12.232323 will become 12.23.
    const decimal_places = getDecimalPlaces(currency);
    const stake_amount = `+(Number(${amount}).toFixed(${decimal_places}))`;

    const code = `
        Bot.start({
            limitations        : BinaryBotPrivateLimitations,
            growth_rate        : ${growth_rate},
            currency           : '${currency}',
            amount             : ${stake_amount},
            limit_order        : ${JSON.stringify(limit_order)},
            basis              : 'stake',
            take_profit          : ${limit_order.take_profit},
        });
        BinaryBotPrivateHasCalledTradeOptions = true;
    `;

    return code;
};
