import { localize } from '@deriv/translations';
import { config } from '../constants/config';
import ApiHelpers from '../services/api/api-helpers';

/* eslint-disable no-underscore-dangle */
export default class BlockConversion {
    constructor() {
        this.blocks_pending_reconnect = {};
        this.workspace = this.createWorkspace();
        this.workspace_variables = {};
        this.has_market_block = false;
        this.exception_blocks = ['r_100'];
    }

    getConversions() {
        const generateGrowingListBlock = (block_node, block_type, variable_name, child_value_input_name) => {
            const block = this.workspace.newBlock(block_type);
            const block_child_nodes = Array.from(block_node.children);
            const mutation_dom = block_child_nodes.find(child_node => child_node.tagName.toLowerCase() === 'mutation');

            if (mutation_dom) {
                const items_amount = parseInt(mutation_dom.getAttribute('items')) || 0;

                if (items_amount > 0) {
                    // In DBot we have a statement block for each value part of the list, so we need to
                    // generate blocks for these and connect them to the parent's statement.
                    for (let i = 0; i < items_amount; i++) {
                        block.onIconClick();
                    }

                    // Note that value_input_nodes.length can be different than the items_amount
                    // user can have empty entries in their list!
                    block_child_nodes
                        .filter(child_node => child_node.tagName.toLowerCase() === 'value')
                        .forEach(child_node => {
                            const value_input_name = child_node.getAttribute('name');
                            const value_input_index = parseInt(value_input_name.replace(/[^0-9]+/g, ''));

                            Array.from(child_node.children).forEach(value_block_node => {
                                const value_block = this.convertBlockNode(value_block_node, block);

                                // Now connect this converted block to the new text_statement.
                                const statement_block = block
                                    .getBlocksInStatement('STACK')
                                    .find((b, i) => value_input_index === i);
                                const value_input = statement_block.getInput(child_value_input_name);

                                value_input.connection.connect(value_block.outputConnection);
                            });

                            child_node.parentNode.removeChild(child_node);
                        });
                }
            }

            // Return variable block instead of statement.
            const variable = this.generateUniqueVariable(variable_name);
            const variable_block = this.workspace.newBlock('variables_get');

            variable_block.setFieldValue(variable.getId(), 'VAR');
            block.setFieldValue(variable.getId(), 'VARIABLE');

            return {
                block_to_attach: variable_block,
                statement_blocks: [block],
            };
        };
        const generateIndicatorBlock = (block_node, block_type, variable_name) => {
            const block = this.workspace.newBlock(block_type);
            const value_input_name_mappings = {
                input_list: [{ old: 'INPUT', new: 'INPUT_LIST' }],
                period: [{ old: 'PERIOD', new: 'PERIOD' }],
                fast_ema_period: [{ old: 'FAST_EMA_PERIOD', new: 'FAST_EMA_PERIOD' }],
                signal_ema_period: [
                    // https://github.com/binary-com/binary-bot/pull/1123
                    { old: 'SMA_PERIOD', new: 'SIGNAL_EMA_PERIOD' },
                    { old: 'SIGNAL_EMA_PERIOD', new: 'SIGNAL_EMA_PERIOD' },
                ],
                slow_ema_period: [{ old: 'SLOW_EMA_PERIOD', new: 'SLOW_EMA_PERIOD' }],
                std_dev_multiplier_up: [{ old: 'UPMULTIPLIER', new: 'UPMULTIPLIER' }],
                std_dev_multiplier_down: [{ old: 'DOWNMULTIPLIER', new: 'DOWNMULTIPLIER' }],
            };

            // Bollinger Bands + MACDA have some fields we need to carry over.
            switch (block_type) {
                case 'bb_statement':
                case 'bba_statement': {
                    const bb_result_list = block.getField('BBRESULT_LIST');
                    if (bb_result_list) {
                        bb_result_list.setValue(this.getFieldValue(block_node, 'BBRESULT_LIST'));
                    }
                    break;
                }
                case 'macda_statement': {
                    const macd_fields_list = block.getField('MACDFIELDS_LIST');
                    if (macd_fields_list) {
                        macd_fields_list.setValue(this.getFieldValue(block_node, 'MACDFIELDS_LIST'));
                    }
                    break;
                }
                default:
                    break;
            }

            // Attach required child blocks (these are defined on each indicator block).
            const required_child_blocks = block.required_child_blocks || [];

            required_child_blocks.forEach(required_child_block_name => {
                const child_block = this.workspace.newBlock(required_child_block_name);
                const last_connection = block.getLastConnectionInStatement('STATEMENT');

                last_connection.connect(child_block.previousConnection);
            });

            const blocks_in_statement = block.getBlocksInStatement('STATEMENT');

            blocks_in_statement.forEach(block_in_statement => {
                const value_name_mappings = value_input_name_mappings[block_in_statement.type];

                if (value_name_mappings) {
                    value_name_mappings.forEach(value_name_mapping => {
                        const el_value = block_node.querySelector(`value[name="${value_name_mapping.old}"]`);

                        if (el_value) {
                            const value_input = block_in_statement.getInput(value_name_mapping.new);

                            Array.from(el_value.children).forEach(el_value_child => {
                                const converted_block = this.convertBlockNode(el_value_child, block);
                                const input_child_type = el_value_child.tagName.toLowerCase();

                                if (input_child_type === 'shadow') {
                                    converted_block.setShadow(true);
                                }

                                value_input.connection.connect(converted_block.outputConnection);
                            });

                            el_value.parentNode.removeChild(el_value);
                        }
                    });
                }
            });

            // Return variable block instead of statement.
            const variable = this.generateUniqueVariable(variable_name);
            const variable_block = this.workspace.newBlock('variables_get');

            variable_block.setFieldValue(variable.getId(), 'VAR');
            block.setFieldValue(variable.getId(), 'VARIABLE');

            return {
                block_to_attach: variable_block,
                statement_blocks: [block],
            };
        };
        const tradeOptions = (block_node, is_symbol_type = false) => {
            const block = this.workspace.newBlock('trade_definition_tradeoptions');
            const block_node_to_use = block_node;

            // Legacy symbol blocks used a statement "CONDITION" populated with a trade type block.
            // This trade type block has the same structure as tradeOptions, hence we can use it here.
            if (is_symbol_type) {
                return false;
            }

            const fields = [
                'DURATIONTYPE_LIST',
                'CURRENCY_LIST',
                'BARRIEROFFSETTYPE_LIST',
                'SECONDBARRIEROFFSETTYPE_LIST',
            ];
            const block_child_nodes = Array.from(block_node_to_use.children);

            let barrier_inputs = 0;
            let has_prediction = false;

            block_child_nodes
                .filter(block_child_node => block_child_node.tagName.toLowerCase() === 'value')
                .forEach(block_child_node => {
                    const value_input_name = block_child_node.getAttribute('name');

                    if (value_input_name === 'BARRIEROFFSET' || value_input_name === 'SECONDBARRIEROFFSET') {
                        barrier_inputs++;
                    } else if (value_input_name === 'PREDICTION') {
                        has_prediction = true;
                    }
                });

            if (barrier_inputs > 0) {
                block.createBarrierInputs({
                    allow_both_types: true,
                    values: [1, -1],
                });
            }

            if (has_prediction) {
                block.createPredictionInput([0]);
            }

            fields.forEach(field_name => {
                const field = block.getField(field_name);
                if (field) {
                    field.setValue(this.getFieldValue(block_node_to_use, field_name));
                }
            });

            return { block_to_attach: block };
        };
        const conversions = {
            bb: block_node => generateIndicatorBlock(block_node, 'bb_statement', 'bb'),
            bba: block_node => generateIndicatorBlock(block_node, 'bba_statement', 'bba'),
            ema: block_node => generateIndicatorBlock(block_node, 'ema_statement', 'ema'),
            emaa: block_node => generateIndicatorBlock(block_node, 'emaa_statement', 'emaa'),
            lists_create_with: block_node =>
                generateGrowingListBlock(block_node, 'lists_create_with', localize('list'), 'VALUE'),
            macda: block_node => generateIndicatorBlock(block_node, 'macda_statement', 'macda'),
            market: block_node => {
                this.has_market_block = true;
                return tradeOptions(block_node);
            },
            rsi: block_node => generateIndicatorBlock(block_node, 'rsi_statement', 'rsi'),
            rsia: block_node => generateIndicatorBlock(block_node, 'rsia_statement', 'rsia'),
            sma: block_node => generateIndicatorBlock(block_node, 'sma_statement', 'sma'),
            smaa: block_node => generateIndicatorBlock(block_node, 'smaa_statement', 'smaa'),
            text_join: block_node => generateGrowingListBlock(block_node, 'text_join', localize('text'), 'TEXT'),
            trade: block_node => {
                const block = this.workspace.newBlock('trade_definition');
                const block_fields = {
                    trade_definition_market: ['MARKET_LIST', 'SUBMARKET_LIST', 'SYMBOL_LIST'],
                    trade_definition_tradetype: ['TRADETYPECAT_LIST', 'TRADETYPE_LIST'],
                    trade_definition_contracttype: ['TYPE_LIST'],
                    trade_definition_candleinterval: ['CANDLEINTERVAL_LIST'],
                    trade_definition_restartbuysell: ['TIME_MACHINE_ENABLED'],
                    trade_definition_restartonerror: ['RESTARTONERROR'],
                };

                const blocks_to_connect = {};

                Object.keys(block_fields).forEach(child_block_name => {
                    const child_block = this.workspace.newBlock(child_block_name);

                    block_fields[child_block_name].forEach(field_name => {
                        child_block.setFieldValue(this.getFieldValue(block_node, field_name), field_name);
                    });

                    blocks_to_connect[child_block_name] = child_block;
                });

                Object.values(blocks_to_connect).forEach(child_block => {
                    const last_connection = block.getLastConnectionInStatement('TRADE_OPTIONS');
                    last_connection.connect(child_block.previousConnection);
                });

                return { block_to_attach: block };
            },
            tradeOptions,
        };

        return conversions;
    }

    // eslint-disable-next-line class-methods-use-this
    getIllegalBlocks() {
        const illegal_blocks = [];

        // Legacy symbol + trade_type blocks are special cases, they are turned into multiple blocks.
        // We don't convert these atm, as a workaround users can import to BBot, then export and load
        // into DBot.
        const { active_symbols } = ApiHelpers.instance.active_symbols;
        const { opposites } = config;

        active_symbols.forEach(active_symbol => {
            const symbol_name = active_symbol.symbol.toLowerCase();
            if (!illegal_blocks.includes(symbol_name)) {
                illegal_blocks.push(symbol_name);
            }
        });

        // All trade types blocks cannot be converted at this time.
        Object.keys(opposites).forEach(opposites_name => illegal_blocks.push(opposites_name));

        return illegal_blocks;
    }

    // eslint-disable-next-line class-methods-use-this
    createWorkspace() {
        const options = new Blockly.Options({ media: `${__webpack_public_path__}media/` });
        const el_injection_div = new DocumentFragment();
        const workspace = Blockly.createVirtualWorkspace_(el_injection_div, options, false, false);

        return workspace;
    }

    // eslint-disable-next-line class-methods-use-this
    getFieldValue(el_block, field_name) {
        const el_field = el_block.querySelector(`field[name="${field_name}"]`);
        return el_field ? el_field.textContent : '';
    }

    // eslint-disable-next-line class-methods-use-this
    getFirstBlockInStack(block) {
        let current_previous_connection = block.previousConnection;
        let previous_block = block.getPreviousBlock();

        if (!current_previous_connection) {
            return block;
        }

        while (previous_block) {
            if (previous_block === block.getSurroundParent()) {
                break;
            }

            current_previous_connection = previous_block.previousConnection;
            previous_block = previous_block.getPreviousBlock();
        }

        return current_previous_connection.sourceBlock_;
    }

    // eslint-disable-next-line class-methods-use-this
    updateRenamedFields(xml) {
        const renamed_fields = {
            MARKET_LIST: {
                volidx: 'synthetic_index',
            },
            TRADETYPECAT_LIST: {
                endsinout: 'inout',
                staysinout: 'inout',
                callputequal: 'callput',
            },
            TRADETYPE_LIST: {
                risefall: 'callput',
                risefallequals: 'callputequal',
            },
        };

        Object.keys(renamed_fields).forEach(field_name => {
            const el_field = xml.querySelector(`field[name="${field_name}"]`);

            if (el_field) {
                const value = el_field.innerText;

                Object.keys(renamed_fields[field_name]).forEach(old_name => {
                    if (value === old_name) {
                        el_field.innerText = renamed_fields[field_name][old_name];
                    }
                });
            }
        });

        return xml;
    }

    naivelyFixLegacyStrategyAfterConversion() {
        // For old "market" blocks, move everything in "Trade options" except "DURATION"
        // to "Run once at start". Legacy "market" blocks had no such thing as "Run once at start"
        // not moving everything would kill Martingale strategies as they'd be reinitialised each run.
        const trade_definition_block = this.workspace.getTradeDefinitionBlock();
        const has_initialization_block = trade_definition_block.getBlocksInStatement('INITIALIZATION').length > 0;
        if (trade_definition_block) {
            trade_definition_block.getBlocksInStatement('SUBMARKET').forEach(block => {
                if (
                    block.type !== 'trade_definition_tradeoptions' &&
                    this.has_market_block &&
                    !has_initialization_block
                ) {
                    const last_connection = trade_definition_block.getLastConnectionInStatement('INITIALIZATION');
                    block.unplug(true);
                    last_connection.connect(block.previousConnection);
                }
            });
        }
    }

    generateUniqueVariable(variable_name) {
        let current_name = variable_name;
        let counter = 0;

        while (Object.values(this.workspace_variables).includes(current_name)) {
            counter++;
            current_name = variable_name + counter;
        }

        const ws_variable = Blockly.Variables.getOrCreateVariablePackage(this.workspace, '', current_name, '');
        this.workspace_variables[ws_variable.id_] = current_name; // eslint-disable-line

        return ws_variable;
    }

    convertStrategy(strategy_node, showIncompatibleStrategyDialog) {
        // Disable events (globally) to suppress block onchange listeners from firing.
        Blockly.Events.disable();

        // We only want to update renamed fields for modern strategies.
        const xml = this.updateRenamedFields(strategy_node);

        // Don't convert already compatible strategies.
        if (strategy_node.hasAttribute('is_dbot') && strategy_node.getAttribute('is_dbot') === 'true') {
            Blockly.Events.enable();
            return xml;
        }

        const has_illegal_block = this.getIllegalBlocks().some(illegal_block_type => {
            if (!this.exception_blocks.includes(illegal_block_type)) {
                return !!xml.querySelector(`block[type="${illegal_block_type}"]`);
            }
        });

        if (has_illegal_block) {
            if (showIncompatibleStrategyDialog) {
                showIncompatibleStrategyDialog();
            }
            Blockly.Events.enable();
            return Blockly.utils.xml.textToDom('<xml />');
        }

        const variable_nodes = [];
        const block_nodes = [];

        Array.from(xml.children).forEach(strategy_child_node => {
            const tag_name = strategy_child_node.nodeName.toLowerCase();

            switch (tag_name) {
                case 'block':
                case 'shadow': {
                    block_nodes.push(strategy_child_node);
                    break;
                }
                case 'variables': {
                    variable_nodes.push(...strategy_child_node.children);
                    break;
                }
                default:
                    break;
            }
        });

        const registerVariables = el_variables => {
            el_variables.forEach(el_variable => {
                const variable_id = el_variable.getAttribute('id');
                const variable_name = el_variable.textContent;

                if (!this.workspace_variables[variable_id]) {
                    const variable = Blockly.Variables.getOrCreateVariablePackage(
                        this.workspace,
                        variable_id,
                        variable_name,
                        ''
                    );
                    this.workspace_variables[variable.id_] = variable.name;
                }
            });
        };

        // Register pre-existing variables taken from XML file. Users may register variables
        // but not use them, we should not delete them nor create only the ones used in the strategy.
        registerVariables(variable_nodes);

        // Collection strategies don't pre-register variables, find these and register
        // variable instances for them if they don't exist yet.
        registerVariables(xml.querySelectorAll('field[name="VAR"]'));

        block_nodes.forEach(block_node => this.convertBlockNode(block_node));

        // Re-connect blocks that have been transformed into multiples. i.e. in the case
        // of old multiline blocks converted to statement blocks.
        Object.keys(this.blocks_pending_reconnect).forEach(previous_sibling_id => {
            const previous_sibling_block = this.workspace.getBlockById(previous_sibling_id);
            const child_blocks = this.blocks_pending_reconnect[previous_sibling_id];
            const sibling_previous_connection = previous_sibling_block.previousConnection;

            if (sibling_previous_connection) {
                const sibling_previous_target_connection = sibling_previous_connection.targetConnection;
                let highest_previous_connection = sibling_previous_connection;

                // Connect all the blocks to be connected in reverse, we do this to maintain
                // the original order of statement blocks, although the order mostly doesn't
                // matter. (This may change, it may matter for other statement blocks.)
                child_blocks.reverse().forEach(child_block => {
                    highest_previous_connection.connect(child_block.nextConnection);
                    highest_previous_connection = child_block.previousConnection;
                });

                if (sibling_previous_target_connection) {
                    // Reconnect the first block in this statement to the original parent connection.
                    let current_previous_connection = previous_sibling_block.previousConnection;
                    let previous_block = previous_sibling_block.getPreviousBlock();

                    while (previous_block) {
                        if (previous_block === previous_block.getSurroundParent()) {
                            break;
                        }

                        current_previous_connection = previous_block.previousConnection;
                        previous_block = previous_block.getPreviousBlock();
                    }

                    sibling_previous_target_connection.connect(current_previous_connection);
                }
            }
        });

        this.naivelyFixLegacyStrategyAfterConversion();

        this.workspace.getAllBlocks(true).forEach(block => {
            block.initSvg();
            // block.render();
        });

        this.workspace.cleanUp();

        const converted_xml = Blockly.Xml.workspaceToDom(this.workspace);

        if (strategy_node.hasAttribute('collection') && strategy_node.getAttribute('collection') === 'true') {
            converted_xml.setAttribute('collection', 'true');
        }

        converted_xml.setAttribute('is_dbot', 'true');

        this.workspace = null;

        Blockly.Events.enable();

        return converted_xml;
    }

    convertBlockNode(el_block, parent_block = null) {
        const conversions = this.getConversions();
        const block_type = el_block.getAttribute('type');
        const is_old_block = Object.keys(conversions).includes(block_type);
        let block = null;

        const is_collapsed =
            (el_block.getAttribute('collapsed') && el_block.getAttribute('collapsed') === 'true') || false;
        const is_immovable = el_block.getAttribute('movable') && el_block.getAttribute('movable') === 'false';
        const is_undeletable = el_block.getAttribute('deletable') && el_block.getAttribute('deletable') === 'false';
        const is_disabled = el_block.getAttribute('disabled') && el_block.getAttribute('disabled') === 'true';

        const setBlockAttributes = b => {
            b.setCollapsed(is_collapsed);
            b.setMovable(!is_immovable);
            b.setDeletable(!is_undeletable);
            b.setDisabled(is_disabled);
        };

        if (is_old_block) {
            const conversion_obj = conversions[block_type](el_block);

            // block is a value block that needs to be reattached. TODO?
            if (conversion_obj.block_to_attach) {
                block = conversion_obj.block_to_attach;
                setBlockAttributes(block);
            }

            // Statement blocks coming from the conversion_obj need to be attached to the block's previousConnection.
            if (parent_block && conversion_obj.statement_blocks) {
                conversion_obj.statement_blocks.forEach(statement_block => {
                    // Persist block attributes.
                    setBlockAttributes(statement_block);

                    const previous_connection = this.getClosestLegalPreviousConnection(parent_block);

                    if (previous_connection) {
                        const target_block = previous_connection.sourceBlock_;

                        if (!this.blocks_pending_reconnect[target_block.id]) {
                            this.blocks_pending_reconnect[target_block.id] = [];
                        }

                        this.blocks_pending_reconnect[target_block.id].push(statement_block);
                    }
                });
            }
        } else {
            const is_legal_block = Object.keys(Blockly.Blocks).includes(block_type);

            if (is_legal_block) {
                block = this.workspace.newBlock(block_type);
                setBlockAttributes(block);

                // Ensure mutations are correctly rendered. This logic happens here because
                // we should ignore mutations on blocks that are already converted i.e mutations
                // will be taken care of in conversion, not here.
                if (block) {
                    const mutation_dom = Array.from(el_block.children).find(
                        child_node => child_node.tagName.toLowerCase() === 'mutation'
                    );

                    if (mutation_dom && block.domToMutation) {
                        block.domToMutation(mutation_dom);
                    }
                }
            }
        }

        if (!block) {
            console.warn('Unrecognised block found.', block_type); // eslint-disable-line no-console
            return false;
        }

        // Keep track of parent_block, especially important for blocks
        // nested in <next> statements. This property is only set during conversion.
        if (parent_block) {
            block.conversion_parent = parent_block;
        }

        Array.from(el_block.children).forEach(el_block_child => {
            const tag_name = el_block_child.tagName.toLowerCase();

            switch (tag_name) {
                case 'field': {
                    const field_name = el_block_child.getAttribute('name');
                    const field = block.getField(field_name);

                    if (field) {
                        if (field instanceof Blockly.FieldVariable) {
                            const variable_id = el_block_child.getAttribute('id');
                            const variable_name = el_block_child.innerText.trim();
                            const variable = Blockly.Variables.getOrCreateVariablePackage(
                                this.workspace,
                                variable_id,
                                variable_name,
                                ''
                            );
                            this.workspace_variables[variable.id_] = variable_name;
                            field.setValue(variable.id_);
                        } else {
                            field.setValue(el_block_child.innerText);
                        }
                    }
                    break;
                }
                case 'value': {
                    this.processValueInputs(block, el_block_child);
                    break;
                }
                case 'statement': {
                    const statement_name = el_block_child.getAttribute('name');
                    this.processStatementInputs(block, statement_name, el_block_child);
                    break;
                }
                case 'next': {
                    const closest_statement = el_block_child.closest('statement');

                    if (closest_statement) {
                        const statement_name = closest_statement.getAttribute('name');
                        this.processStatementInputs(block, statement_name, el_block_child, block.conversion_parent);
                    } else if (block.nextConnection) {
                        Array.from(el_block_child.children).forEach(el_sibling_block => {
                            const sibling_block = this.convertBlockNode(el_sibling_block);
                            block.nextConnection.connect(sibling_block.previousConnection);
                        });
                    }
                    break;
                }
                default:
                    break;
            }
        });

        return block;
    }

    // eslint-disable-next-line consistent-return
    processValueInputs(block, el_input) {
        const input_name = el_input.getAttribute('name');
        const input = block.getInput(input_name);

        if (!input) {
            console.warn('Unrecognised value input', input_name); // eslint-disable-line no-console
            return false;
        }

        // Each of the children of a value node is a shadow or block node. Recursively
        // convert these block nodes to their new counterpart and re-connect them.
        // eslint-disable-next-line consistent-return
        Array.from(el_input.children).forEach(el_input_child_block => {
            const input_child_block = this.convertBlockNode(el_input_child_block, block);

            if (!input_child_block) {
                // eslint-disable-next-line no-console
                console.warn('Illegal child.', el_input_child_block.getAttribute('type'));
                return false;
            }

            // Set shadow property for shadow blocks.
            const input_child_type = el_input_child_block.tagName.toLowerCase();
            if (input_child_type === 'shadow') {
                input_child_block.setShadow(true);
            }

            // Re-connect the child block to the value input.
            input.connection.connect(input_child_block.outputConnection);
        });
    }

    // eslint-disable-next-line consistent-return
    processStatementInputs(block, statement_name, el_node_with_children, block_to_search = null) {
        const block_to_use = block_to_search || block;
        const input = block_to_use.getInput(statement_name);

        if (!input) {
            console.warn('Unrecognised statement input', statement_name); // eslint-disable-line no-console
            return false;
        }

        // Each of the children of a statement node is a block node. Recursively
        // convert these block nodes to their new counterpart and reconnect them.
        // eslint-disable-next-line consistent-return
        Array.from(el_node_with_children.children).forEach(el_input_child_block => {
            const input_child_block = this.convertBlockNode(el_input_child_block, block_to_use);
            if (!input_child_block) {
                // eslint-disable-next-line no-console
                console.warn('Unrecognised child in statement', el_input_child_block.getAttribute('type'));
                return false;
            }

            // Note that blocks are connected recursively so more deeply nested blocks
            // (i.e. nested in <next>) will be connected before less nested blocks.
            // Luckily Blockly API works in our favour and helps maintain the correct order.
            const statement_input = block_to_use.getInput(statement_name);

            if (statement_input && input_child_block.previousConnection) {
                statement_input.connection.connect(input_child_block.previousConnection);
            }
        });
    }

    getClosestLegalPreviousConnection(supposed_parent_block) {
        // Procedures are a bit special, it's hard to find the correct connection for them so we
        // generate a (completely useless) filler block and connect it to the procedure's statement
        // so we can return that useless block's previousConnection.
        if (config.procedureDefinitionBlocks.includes(supposed_parent_block.type)) {
            const blocks_in_statement = supposed_parent_block.getBlocksInStatement('STACK');

            if (blocks_in_statement.length === 0) {
                const input = supposed_parent_block.getInput('STACK');
                const useless_block = this.workspace.newBlock('useless_block');

                input.connection.connect(useless_block.previousConnection);

                return useless_block.previousConnection;
            }

            return supposed_parent_block.getInputTargetBlock('STACK').previousConnection;
        }

        let current_block = this.getFirstBlockInStack(supposed_parent_block);
        let is_protected_statement = this.isConnectedToProtectedStatementInput(current_block);

        while (is_protected_statement) {
            const new_parent = current_block.getParent();

            if (new_parent) {
                current_block = new_parent;
                is_protected_statement = this.isConnectedToProtectedStatementInput(current_block);
            }
        }

        if (current_block.previousConnection) {
            return current_block.previousConnection;
        }

        if (supposed_parent_block.conversion_parent) {
            return this.getClosestLegalPreviousConnection(supposed_parent_block.conversion_parent);
        }

        return false;
    }

    isConnectedToProtectedStatementInput(block) {
        const first_block = this.getFirstBlockInStack(block);
        const previous_connection = first_block.previousConnection;

        if (previous_connection) {
            const target_connection = previous_connection.targetConnection;

            if (target_connection) {
                const target_block = target_connection.sourceBlock_; // eslint-disable-line
                const input = target_block.getInputWithConnection(target_connection);
                const protected_statements = target_block.protected_statements || [];

                if (input && protected_statements.includes(input.name)) {
                    return true;
                }
            }
        }

        return false;
    }
}
