import { localize } from '@deriv/translations';
import { runIrreversibleEvents } from '../../../../utils';

Blockly.Blocks.input_list = {
    init() {
        this.jsonInit({
            message0: localize('Input List %1'),
            args0: [
                {
                    type: 'input_value',
                    name: 'INPUT_LIST',
                    check: 'Array',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
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

        const setParentId = () => {
            const surround_parent = this.getSurroundParent();
            if (surround_parent && !this.required_parent_id && this.allowed_parents.includes(surround_parent.type)) {
                this.required_parent_id = surround_parent.id;
            }
        };

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            setParentId();
        } else if (event.type === Blockly.Events.END_DRAG) {
            setParentId();

            const surround_parent = this.getSurroundParent();
            const has_parent = !!surround_parent;
            const is_illegal_parent = !has_parent || surround_parent.id !== this.required_parent_id;

            if (!has_parent || is_illegal_parent) {
                runIrreversibleEvents(() => {
                    this.unplug(true);

                    // Attempt to re-connect this child to its original parent.
                    const all_blocks = this.workspace.getAllBlocks();
                    const parent_block = all_blocks.find(block => block.id === this.required_parent_id);

                    if (parent_block) {
                        const parent_connection = parent_block.getLastConnectionInStatement('STATEMENT');
                        parent_connection.connect(this.previousConnection);
                    } else {
                        this.dispose();
                    }
                });
            }
        }
    },
    allowed_parents: [
        'atr_statement',
        'atra_statement',
        'bb_statement',
        'bba_statement',
        'ema_statement',
        'emaa_statement',
        'macda_statement',
        'pc_statement',
        'pca_statement',
        'psar_statement',
        'psara_statement',
        'fr_statement',
        'fra_statement',
        'rsi_statement',
        'rsia_statement',
        'sma_statement',
        'smaa_statement',
        'so_statement',
        'soa_statement',
    ],
    getRequiredValueInputs() {
        return {
            INPUT_LIST: null,
        };
    },
};

Blockly.JavaScript.input_list = () => {};
