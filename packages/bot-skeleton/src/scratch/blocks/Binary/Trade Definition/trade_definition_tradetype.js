import { localize } from '@deriv/translations';
import { config } from '../../../../constants/config';
import ApiHelpers from '../../../../services/api/api-helpers';
import DBotStore from '../../../dbot-store';

Blockly.Blocks.trade_definition_tradetype = {
    init() {
        this.jsonInit({
            message0: localize('Trade Type: {{ trade_type_category }} > {{ trade_type }}', {
                trade_type_category: '%1',
                trade_type: '%2',
            }),
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'TRADETYPECAT_LIST',
                    options: [['', '']],
                },
                {
                    type: 'field_dropdown',
                    name: 'TRADETYPE_LIST',
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
        if (!this.workspace || this.isInFlyout || this.workspace.isDragging()) {
            return;
        }

        this.enforceLimitations();

        if (event.type === Blockly.Events.BLOCK_CHANGE) {
            if (event.name === 'SYMBOL_LIST' || event.name === 'TRADETYPECAT_LIST') {
                const { currency, landing_company_shortcode } = DBotStore.instance.client;
                const { contracts_for } = ApiHelpers.instance;
                const top_parent_block = this.getTopParent();
                const market_block = top_parent_block.getChildByType('trade_definition_market');
                const market = market_block.getFieldValue('MARKET_LIST');
                const submarket = market_block.getFieldValue('SUBMARKET_LIST');
                const symbol = market_block.getFieldValue('SYMBOL_LIST');
                const trade_type_cat = this.getFieldValue('TRADETYPECAT_LIST');
                const trade_type = this.getFieldValue('TRADETYPE_LIST');
                const contracts_for_symbol_options = {
                    symbol,
                    landing_company: landing_company_shortcode,
                    currency,
                };

                if (event.name === 'SYMBOL_LIST') {
                    contracts_for
                        .getTradeTypeCategories(market, submarket, contracts_for_symbol_options)
                        .then(categories => {
                            const trade_type_cat_field = this.getField('TRADETYPECAT_LIST');

                            if (trade_type_cat_field) {
                                trade_type_cat_field.updateOptions(categories, {
                                    default_value: trade_type_cat,
                                    should_pretend_empty: true,
                                    event_group: event.group,
                                });
                            }
                        });
                } else if (event.name === 'TRADETYPECAT_LIST' && event.blockId === this.id) {
                    contracts_for
                        .getTradeTypes(market, submarket, contracts_for_symbol_options, trade_type_cat)
                        .then(trade_types => {
                            const trade_type_field = this.getField('TRADETYPE_LIST');

                            trade_type_field.updateOptions(trade_types, {
                                default_value: trade_type,
                                should_pretend_empty: true,
                                event_group: event.group,
                            });
                        });
                }
            }
        }
    },
    enforceLimitations: Blockly.Blocks.trade_definition_market.enforceLimitations,
};

Blockly.JavaScript.trade_definition_tradetype = () => {};
