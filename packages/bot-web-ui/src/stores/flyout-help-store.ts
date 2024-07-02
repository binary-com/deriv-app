import { action, makeObservable, observable, runInAction } from 'mobx';
import { config } from '@deriv/bot-skeleton';
import { help_content_config } from 'Utils/help-content/help-content.config';
import * as help_strings from 'Utils/help-content/help-strings';
import RootStore from './root-store';

export default class FlyoutHelpStore {
    root_store: RootStore;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            block_node: observable,
            block_type: observable,
            examples: observable,
            help_string: observable,
            title: observable,
            should_next_disable: observable,
            should_previous_disable: observable,
            active_helper: observable,
            setHelpContent: action.bound,
            setActiveHelper: action.bound,
            onBackClick: action.bound,
            onSequenceClick: action.bound,
            initFlyoutHelp: action.bound,
            updateSequenceButtons: action.bound,
            setExamples: action.bound,
            getHelpContent: action.bound,
            getFilledBlocksIndex: action.bound,
            getNextHelpContentIndex: action.bound,
        });

        this.root_store = root_store;
    }

    options = {
        media: `${__webpack_public_path__}media/`,
        move: { scrollbars: false, drag: true, wheel: false },
        zoom: { startScale: config.workspaces.flyoutWorkspacesStartScale },
        sounds: false,
    };

    block_node = null;
    block_type = '';
    examples = [];
    help_string = {};
    title = '';
    should_next_disable = false;
    should_previous_disable = false;
    active_helper = '';

    setHelpContent = async block_node => {
        const block_type = block_node.getAttribute('type');
        const title = window.Blockly.Blocks[block_type].meta().display_name;
        if (block_type !== '') {
            this.active_helper = block_type;
        }

        const { flyout } = this.root_store;
        this.setExamples(block_type);
        const example_blocks = this.examples.map(example => example.childNodes[0]);
        setTimeout(() => flyout.setFlyoutWidth([block_node, ...example_blocks]), 50);

        runInAction(() => {
            flyout.is_help_content = true;
            this.block_node = block_node;
            this.block_type = block_type;
            this.title = title;
            this.help_string = help_strings[block_type];
        });

        if (!flyout.is_search_flyout) {
            this.updateSequenceButtons();
        }
    };

    getHelpContent = async block_node => {
        let block_content;

        if (block_node) {
            const target_blocks = this.xml_list_group[block_node];
            const block_type = target_blocks[0].getAttribute('type');
            block_content = help_strings[block_type];
        }
        return block_content;
    };

    getFilledBlocksIndex = async blocks_type => {
        const blocks_content = await Promise.all(blocks_type.map(block => this.getHelpContent(block)));
        return blocks_content.map((key, index) => (key ? index : null)).filter(value => value !== null);
    };

    getNextHelpContentIndex = async is_last => {
        const filled_blocks_index = await this.getFilledBlocksIndex(Object.keys(this.xml_list_group));
        return is_last ? filled_blocks_index[filled_blocks_index.length - 1] : filled_blocks_index[0];
    };

    setActiveHelper(active_helper) {
        this.active_helper = active_helper;
    }

    onBackClick() {
        const { toolbox, flyout } = this.root_store;

        if (flyout.is_search_flyout) {
            const search = document.getElementsByName('search')[0].value;
            toolbox.onSearch({ search });
        } else {
            flyout.refreshCategory();
        }
    }

    async onSequenceClick(should_go_next) {
        const current_block = Array.from(this.xml_list).find(xml => xml.getAttribute('type') === this.block_type);

        let current_block_index;

        Object.keys(this.xml_list_group).forEach((key, index) => {
            if (current_block.getAttribute('type') === key) {
                current_block_index = index;
            }
        });

        const getNextBlock = async (xml, current_index, is_next) => {
            const next_index = current_index + (is_next ? 1 : -1);
            const next_blocks_type = Object.keys(xml).filter((key, index) =>
                is_next ? next_index <= index : next_index >= index
            );
            const next_filled_block = await this.getFilledBlocksIndex(next_blocks_type);

            const next_filled_block_index = is_next
                ? next_filled_block[0]
                : next_filled_block[next_filled_block.length - 1];
            const next_block_type = next_blocks_type[next_filled_block_index];

            if (!next_block_type) {
                return false;
            }

            try {
                await import(/* webpackChunkName: `[request]` */ '@deriv/bot-skeleton');
                return next_block_type;
            } catch (e) {
                return getNextBlock(xml, next_index, is_next);
            }
        };

        const block_type = await getNextBlock(this.xml_list_group, current_block_index, should_go_next);
        if (block_type) {
            const target_blocks = this.xml_list_group[block_type];
            this.setHelpContent(target_blocks[0]);
        }
    }

    initFlyoutHelp(block_node) {
        const { flyout, toolbox } = this.root_store;
        this.xml_list = toolbox.getCategoryContents(flyout.selected_category);
        this.xml_list_group = this.groupBy(this.xml_list, true);

        this.setHelpContent(block_node);
    }

    async updateSequenceButtons() {
        const current_block = Array.from(this.xml_list).find(xml => xml.getAttribute('type') === this.block_type);
        const current_index = Object.keys(this.xml_list_group).findIndex(
            key => current_block.getAttribute('type') === key
        );

        const last_filled_content_index = await this.getNextHelpContentIndex(true);
        const first_filled_content_index = await this.getNextHelpContentIndex(false);

        runInAction(() => {
            this.should_previous_disable = current_index === 0 || current_index === first_filled_content_index;
            this.should_next_disable =
                current_index === Object.keys(this.xml_list_group).length - 1 ||
                current_index === last_filled_content_index;
        });
    }

    // eslint-disable-next-line
    groupBy(nodes, should_include_block_only = false) {
        return Array.from(nodes).reduce((block_group, node) => {
            const type = node.getAttribute('type');

            if (should_include_block_only && type === null) {
                return block_group;
            }

            if (!block_group[type]) {
                block_group[type] = [];
            }

            if (!should_include_block_only || (should_include_block_only && type !== null)) {
                block_group[type].push(node);
            }

            return block_group;
        }, {});
    }

    setExamples(block_type) {
        const { toolbox } = this.root_store;
        const all_examples = [...toolbox.toolbox_examples.childNodes];
        const help_content = help_content_config(__webpack_public_path__)[block_type];
        const examples_ids = help_content.filter(el => el.type === 'example').map(example => example.example_id);
        const examples = examples_ids.map(id => all_examples.find(example => example.id === id));

        this.examples = examples;
    }
}
