import { localize } from '@deriv/translations';
import { getCurrencyDisplayCode, getDecimalPlaces } from '@deriv/shared';
import DBotStore from '../../../dbot-store';
import { runGroupedEvents, runIrreversibleEvents, modifyContextMenu } from '../../../utils';
import { config } from '../../../../constants/config';
import ApiHelpers from '../../../../services/api/api-helpers';

Blockly.Blocks.trade_definition_multiplier = {
    init() {
        this.jsonInit(this.definition());

        // Ensure one of this type per statement-stack
        this.setNextStatement(false);
    },
    definition() {
        return {
            message0: localize('Multiplier: {{ multiplier }}', {
                multiplier: '%1',
            }),
            message1: `${localize('Stake')}: %1 %2 %3`,
            message2: '%1',
            message3: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'MULTIPLIERTYPE_LIST',
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
                {
                    type: 'field_label',
                    name: 'AMOUNT_LIMITS',
                    text: '',
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
                    name: 'MULTIPLIER_PARAMS',
                },
            ],
            inputsInline: true,
            colour: Blockly.Colours.Special1.colour,
            colourSecondary: Blockly.Colours.Special1.colourSecondary,
            colourTertiary: Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            nextStatement: null,
            tooltip: localize('Define your trade options such as multiplier and stake.'),
            category: Blockly.Categories.Trade_Definition,
        };
    },
    meta() {
        return {
            display_name: localize('Multiplier trade options'),
            description: localize(
                'Define your trade options such as multiplier and stake. This block can only be used with the multipliers trade type. If you select another trade type, this block will be replaced with the Trade options block.'
            ),
        };
    },
    validateBlocksInStatement() {
        // Enforce only multiplier_<type> blocks in MULTIPLIER_PARAMS statement.
        const blocks_in_multiplier = this.getBlocksInStatement('MULTIPLIER_PARAMS');

        if (blocks_in_multiplier.length > 0) {
            const block_types_in_multiplier = [];
            blocks_in_multiplier.forEach(block => {
                block_types_in_multiplier.push(block.type);
                const block_multiplier_take_profit = block.childValueToCode('multiplier_take_profit', 'AMOUNT');
                const block_multiplier_stop_loss = block.childValueToCode('multiplier_stop_loss', 'AMOUNT');
                if (block_multiplier_take_profit <= 0 || block_multiplier_stop_loss <= 0) {
                    block.setDisabled(true);
                }

                if (block.type === 'multiplier_stop_loss' && block_multiplier_stop_loss > 0) {
                    block.setDisabled(false);
                }

                if (block.type === 'multiplier_take_profit' && block_multiplier_take_profit > 0) {
                    block.setDisabled(false);
                }

                if (
                    !/^multiplier_.+$/.test(block.type) ||
                    new Set(block_types_in_multiplier).size !== block_types_in_multiplier.length
                ) {
                    runIrreversibleEvents(() => {
                        block.unplug(true);
                    });
                }
            });
        }
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyout_ || this.workspace.isDragging()) {
            return;
        }

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
        this.selected_multiplier = this.getFieldValue('MULTIPLIERTYPE_LIST');

        const is_load_event = /^dbot-load/.test(event.group);

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            this.setCurrency();
            this.updateAmountLimits();
            if (is_load_event) {
                // Do NOT touch any values when a strategy is being loaded.
                this.updateMultiplierInput(false);
            } else {
                this.updateMultiplierInput(true);
            }
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CHANGE) {
            this.validateBlocksInStatement();
            if (is_load_event) {
                if (event.name === 'TRADETYPE_LIST') {
                    this.updateMultiplierInput(false);
                }
            } else if (event.blockId === this.id) {
                switch (event.name) {
                    case 'MULTIPLIERTYPE_LIST': {
                        this.updateMultiplierInput(false);
                        break;
                    }
                    default:
                        break;
                }
            } else if (event.name === 'SYMBOL_LIST' || event.name === 'TRADETYPE_LIST') {
                this.updateMultiplierInput(true);
                this.updateAmountLimits();
            }
            return;
        }

        if (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) {
            this.setCurrency();
            this.updateAmountLimits();
            this.validateBlocksInStatement();
            if (event.blockId === this.id) {
                // Ensure this block is populated after initial drag from flyout.
                if (!this.selected_multiplier) {
                    const fake_creation_event = new Blockly.Events.BlockCreate(this);
                    fake_creation_event.recordUndo = false;
                    Blockly.Events.fire(fake_creation_event);
                } else if (this.selected_trade_type !== 'multiplier') {
                    this.updateMultiplierInput(true);
                }
            }
        }
    },
    updateAmountLimits: Blockly.Blocks.trade_definition_tradeoptions.updateAmountLimits,
    updateMultiplierInput(should_use_default_value) {
        const { contracts_for } = ApiHelpers.instance;

        if (this.selected_trade_type === 'multiplier') {
            contracts_for.getMultiplierRange(this.selected_symbol, this.selected_trade_type).then(multiplier_range => {
                if (multiplier_range.length > 0) {
                    const multiplier_list_dropdown = this.getField('MULTIPLIERTYPE_LIST');
                    const multiplier_options = multiplier_range.map(value => {
                        const option = value.toString();
                        return [option, option];
                    });

                    multiplier_list_dropdown?.updateOptions(multiplier_options, {
                        default_value: should_use_default_value ? undefined : multiplier_list_dropdown.getValue(),
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
                    // kept this commented to fix backward compatibility issue
                    // need to fix this for mutliplier block
                    duration_block.renderEfficiently();

                    const trade_definition_block = this.workspace.getTradeDefinitionBlock();
                    const parent_connection = trade_definition_block.getInput('SUBMARKET').connection;
                    const child_connection = duration_block.previousConnection;
                    parent_connection.connect(child_connection);

                    const duration_input = duration_block.getInput('DURATION');

                    const duration_shadow_block = this.workspace.newBlock('math_number_positive');
                    duration_shadow_block.setShadow(true);
                    duration_shadow_block.outputConnection.connect(duration_input.connection);
                    duration_shadow_block.initSvg();
                    // kept this commented to fix backward compatibility issue
                    // need to fix this for mutliplier block
                    duration_shadow_block.renderEfficiently();

                    const stake_input = duration_block.getInput('AMOUNT');

                    const stake_shadow_block = this.workspace.newBlock('math_number_positive');
                    stake_shadow_block.setShadow(true);
                    stake_shadow_block.setFieldValue(1, 'NUM');
                    stake_shadow_block.outputConnection.connect(stake_input.connection);
                    stake_shadow_block.initSvg();
                    // kept this commented to fix backward compatibility issue
                    // need to fix this for mutliplier block
                    stake_shadow_block.renderEfficiently();

                    this.dispose();
                    window.Blockly.getMainWorkspace().cleanUp(x, y);
                });
            });
        }
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
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

Blockly.JavaScript.javascriptGenerator.forBlock.trade_definition_multiplier = block => {
    const amount =
        Blockly.JavaScript.javascriptGenerator.valueToCode(
            block,
            'AMOUNT',
            Blockly.JavaScript.javascriptGenerator.ORDER_ATOMIC
        ) || '0';
    const { currency } = DBotStore.instance.client;
    const { setContractUpdateConfig } = DBotStore.instance;
    const multiplier_value = block.getFieldValue('MULTIPLIERTYPE_LIST') || '1';
    const stop_loss =
        !block.getChildByType('multiplier_stop_loss')?.disabled &&
        block.childValueToCode('multiplier_stop_loss', 'AMOUNT');
    const take_profit =
        !block.getChildByType('multiplier_take_profit')?.disabled &&
        block.childValueToCode('multiplier_take_profit', 'AMOUNT');
    const limit_order = {
        stop_loss: stop_loss ? `+(Number(${stop_loss}).toFixed(2))` : undefined,
        take_profit: take_profit ? `+(Number(${take_profit}).toFixed(2))` : undefined,
    };

    setContractUpdateConfig(take_profit, stop_loss);
    // Determine decimal places for rounding the stake, this is done so Martingale multipliers
    // are not affected by fractional values e.g. USD 12.232323 will become 12.23.
    const decimal_places = getDecimalPlaces(currency);
    const stake_amount = `+(Number(${amount}).toFixed(${decimal_places}))`;

    const code = `
        Bot.start({
            limitations        : BinaryBotPrivateLimitations,
            multiplier         : ${multiplier_value},
            currency           : '${currency}',
            amount             : ${stake_amount},
            limit_order        : ${JSON.stringify(limit_order)},
            basis              : 'stake',
            stop_loss          : ${limit_order.stop_loss},
            take_profit        : ${limit_order.take_profit},
        });
        BinaryBotPrivateHasCalledTradeOptions = true;
    `;

    return code;
};
