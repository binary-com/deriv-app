import { localize } from '@deriv/translations';
import { loadBlocksFromRemote, runIrreversibleEvents , modifyContextMenu } from '../../../../utils';
import { observer as globalObserver } from '../../../../../utils/observer';
import { LogTypes } from '../../../../../constants/messages';

Blockly.Blocks.loader = {
    init() {
        this.blocks_added_by_me = [];
        this.current_url = '';
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Load block from URL: {{ input_url }}', { input_url: '%1' }),
            args0: [
                {
                    type: 'field_input',
                    name: 'URL',
                    text: 'http://www.example.com/block.xml',
                },
            ],
            colour: Blockly.Colours.Base.colour,
            colourSecondary: Blockly.Colours.Base.colourSecondary,
            colourTertiary: Blockly.Colours.Base.colourTertiary,
            tooltip: localize('Loads blocks from URL'),
            category: Blockly.Categories.Miscellaneous,
        };
    },
    customContextMenu(menu) {
        const exclude_item = [];
        const include_items = ['Download Block'];
        modifyContextMenu(menu, exclude_item, include_items);
    },
    meta() {
        return {
            display_name: localize('Loads from URL'),
            description: localize(
                'This block allows you to load blocks from a URL if you have them stored on a remote server, and they will be loaded only when your bot runs.'
            ),
        };
    },
    onchange(event) {
        if (!this.workspace || Blockly.derivWorkspace.isFlyout_) {
            return;
        }

        if (event.type === Blockly.Events.BLOCK_CREATE && event.ids.includes(this.id)) {
            this.current_url = this.getFieldValue('URL');
            const loader_blocks = this.workspace.getAllBlocks().filter(block => block.type === 'loader');

            loader_blocks.forEach(loader_block => {
                if (loader_block.id !== this.id && loader_block.current_url === this.current_url) {
                    this.setDisabled(true);
                }
            });

            if (!this.disabled) {
                this.loadBlocksFromCurrentUrl();
            }
        } else if (event.type === Blockly.Events.BLOCK_CHANGE && event.blockId === this.id) {
            if (event.newValue && event.oldValue !== event.newValue) {
                if (event.newValue === this.current_url) {
                    this.setDisabled(false);
                } else if (this.isValidUrl(event.newValue) && !this.isKnownUrl(event.newValue)) {
                    this.setDisabled(false);
                    this.loadBlocksFromCurrentUrl();
                } else {
                    this.setDisabled(true);
                }
            }
        }
    },
    loadBlocksFromCurrentUrl() {
        this.current_url = this.getFieldValue('URL');

        runIrreversibleEvents(() => {
            // Remove blocks previously loaded by this block.
            this.blocks_added_by_me.forEach(block => block.dispose());
        });

        loadBlocksFromRemote(this)
            .then(() => {
                globalObserver.emit('ui.log.success', { log_type: LogTypes.LOAD_BLOCK });
            })
            .catch(error_msg => {
                globalObserver.emit('ui.log.error', error_msg);
                this.setDisabled(true);
            });
    },
    isKnownUrl(url) {
        const loader_blocks = this.workspace.getAllBlocks().filter(block => block.type === 'loader');
        return loader_blocks.some(block => block.id !== this.id && block.current_url === url);
    },
    isValidUrl(url) {
        const url_pattern = /[^/]*\.[a-zA-Z]{3}$/;
        return String(url).match(url_pattern);
    },
};

Blockly.JavaScript.javascriptGenerator.forBlock.loader = () => {};
