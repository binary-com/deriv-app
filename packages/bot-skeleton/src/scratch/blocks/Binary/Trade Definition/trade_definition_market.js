import { localize } from '@deriv/translations';
import { runIrreversibleEvents } from '../../../utils';
import ApiHelpers from '../../../../services/api/api-helpers';

/* eslint-disable */
Blockly.Blocks.trade_definition_market = {
    init() {
        this.jsonInit({
            message0: localize('Market: {{ input_market }} > {{ input_submarket }} > {{ input_symbol }}', {
                input_market: '%1',
                input_submarket: '%2',
                input_symbol: '%3',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'MARKET_LIST',
                    options: [['', '']],
                },
                {
                    type: 'field_dropdown',
                    name: 'SUBMARKET_LIST',
                    options: [['', '']],
                },
                {
                    type: 'field_dropdown',
                    name: 'SYMBOL_LIST',
                    options: [['', '']],
                },
            ],
            colour: Blockly.Colours.Special1.colour,
            colourSecondary: Blockly.Colours.Special1.colourSecondary,
            colourTertiary: Blockly.Colours.Special1.colourTertiary,
            previousStatement: null,
            nextStatement: null,
        });

        this.setMovable(false);
        this.setDeletable(false);
    },
    onchange(event) {
        const allowed_events = ['BLOCK_CREATE', 'BLOCK_CHANGE', 'END_DRAG'];
        const is_allowed_event =
            allowed_events.findIndex(event_name => event.type === Blockly.Events[event_name]) !== -1;

        if (!this.workspace || this.isInFlyout || this.workspace.isDragging() || !is_allowed_event) {
            return;
        }

        this.enforceLimitations();

        const { active_symbols } = ApiHelpers.instance;
        const market_dropdown = this.getField('MARKET_LIST');
        const submarket_dropdown = this.getField('SUBMARKET_LIST');
        const symbol_dropdown = this.getField('SYMBOL_LIST');
        const market = market_dropdown.getValue();
        const submarket = submarket_dropdown.getValue();
        const symbol = symbol_dropdown.getValue();

        // Temporary solution to remove Crytocurrencies from
        // market options until multipliers are available for DBot
        const market_options = active_symbols
            .getMarketDropdownOptions()
            .filter(option => option[1] !== 'cryptocurrency');

        const populateMarketDropdown = () => {
            market_dropdown.updateOptions(market_options, {
                default_value: market,
                should_pretend_empty: true,
                event_group: event.group,
            });
        };

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            populateMarketDropdown();
        } else if (event.type === Blockly.Events.BLOCK_CHANGE && event.blockId === this.id) {
            if (event.name === 'MARKET_LIST') {
                submarket_dropdown.updateOptions(active_symbols.getSubmarketDropdownOptions(market), {
                    default_value: submarket,
                    should_pretend_empty: true,
                    event_group: event.group,
                });
            } else if (event.name === 'SUBMARKET_LIST') {
                symbol_dropdown.updateOptions(active_symbols.getSymbolDropdownOptions(submarket), {
                    default_value: symbol,
                    should_pretend_empty: true,
                    event_group: event.group,
                });
            }
        } else if (event.type === Blockly.Events.END_DRAG && event.blockId === this.getRootBlock().id) {
            if (market_dropdown.isEmpty() || submarket_dropdown.isEmpty() || symbol_dropdown.isEmpty()) {
                populateMarketDropdown();
            }
        }
    },
    enforceLimitations() {
        runIrreversibleEvents(() => {
            if (!this.isDescendantOf('trade_definition')) {
                this.unplug(false); // Unplug without reconnecting siblings

                const top_blocks = this.workspace.getTopBlocks();
                const trade_definition_block = top_blocks.find(block => block.type === 'trade_definition');

                // Reconnect self to trade definition block.
                if (trade_definition_block) {
                    const connection = trade_definition_block.getLastConnectionInStatement('TRADE_OPTIONS');
                    connection.connect(this.previousConnection);
                } else {
                    this.dispose();
                }
            }
            // These blocks cannot be disabled.
            else if (this.disabled) {
                this.setDisabled(false);
            }
        });
    },
};

Blockly.JavaScript.trade_definition_market = () => {};
