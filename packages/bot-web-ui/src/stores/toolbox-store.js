import { action, makeObservable, observable, reaction } from 'mobx';
import { scrollWorkspace } from '@deriv/bot-skeleton';
import { localize } from '@deriv/translations';

export default class ToolboxStore {
    constructor(root_store, core) {
        makeObservable(this, {
            is_toolbox_open: observable,
            is_search_loading: observable,
            is_search_focus: observable,
            sub_category_index: observable,
            toolbox_dom: observable,
            toolbox_examples: observable,
            onMount: action.bound,
            onUnmount: action.bound,
            setWorkspaceOptions: action.bound,
            adjustWorkspace: action.bound,
            toggleDrawer: action.bound,
            onToolboxItemClick: action.bound,
            onToolboxItemExpand: action.bound,
            getCategoryContents: action.bound,
            getAllCategories: action.bound,
            hasSubCategory: action.bound,
            onSearch: action.bound,
            onSearchBlur: action.bound,
            onSearchClear: action.bound,
            onSearchKeyUp: action.bound,
            showSearch: action.bound,
        });

        this.root_store = root_store;
        this.core = core;
    }

    is_toolbox_open = true;
    is_search_loading = false;
    is_search_focus = false;
    sub_category_index = [];
    toolbox_dom = null;
    toolbox_examples = null;

    onMount(toolbox_ref) {
        this.adjustWorkspace();

        this.toolbox_dom = Blockly.Xml.textToDom(toolbox_ref?.current);
        this.toolbox_examples = [...this.toolbox_dom.childNodes].find(el => el.tagName === 'examples');
        this.setWorkspaceOptions();
        this.disposeToolboxToggleReaction = reaction(
            () => this.is_toolbox_open,
            is_toolbox_open => {
                if (is_toolbox_open) {
                    this.adjustWorkspace();
                    // Emit event to GTM
                    const { gtm } = this.core;
                    gtm.pushDataLayer({ event: 'dbot_toolbox_visible', value: true });
                }
            }
        );
    }

    onUnmount() {
        if (typeof this.disposeToolboxToggleReaction === 'function') {
            this.disposeToolboxToggleReaction();
        }
    }

    setWorkspaceOptions() {
        const workspace = Blockly.derivWorkspace;
        const readOnly = !!workspace.options.readOnly;
        let languageTree, hasCategories, hasCollapse, hasComments, hasDisable;

        if (readOnly) {
            languageTree = null;
            hasCategories = false;
            hasCollapse = false;
            hasComments = false;
            hasDisable = false;
        } else {
            languageTree = this.toolbox_dom;
            hasCategories = Boolean(languageTree && languageTree.getElementsByTagName('category').length);
            hasCollapse = hasCategories;
            hasComments = hasCategories;
            hasDisable = hasCategories;
        }

        workspace.options.collapse = hasCollapse;
        workspace.options.comments = hasComments;
        workspace.options.disable = hasDisable;
        workspace.options.hasCategories = hasCategories;
        workspace.options.languageTree = languageTree;
    }
    // eslint-disable-next-line class-methods-use-this
    adjustWorkspace() {
        setTimeout(() => {
            const workspace = Blockly.derivWorkspace;
            const toolbox_width = document.getElementById('gtm-toolbox')?.getBoundingClientRect().width || 0;
            const block_canvas_rect = workspace.svgBlockCanvas_?.getBoundingClientRect(); // eslint-disable-line

            if (Math.round(block_canvas_rect?.left) <= toolbox_width) {
                const scroll_distance = this.core.ui.is_mobile
                    ? toolbox_width - block_canvas_rect.left + 20
                    : toolbox_width - block_canvas_rect.left + 36;
                scrollWorkspace(workspace, scroll_distance, true, false);
            }
        }, 100);
    }

    toggleDrawer() {
        this.is_toolbox_open = !this.is_toolbox_open;
    }

    onToolboxItemClick(category) {
        const { flyout } = this.root_store;
        const category_id = category.getAttribute('id');
        const flyout_content = this.getCategoryContents(category);

        flyout.setIsSearchFlyout(false);

        if (flyout.selected_category?.getAttribute('id') === category_id) {
            flyout.setVisibility(false);
        } else {
            flyout.setSelectedCategory(category);
            flyout.setContents(flyout_content);
        }
    }

    onToolboxItemExpand(index) {
        if (this.sub_category_index.includes(index)) {
            const open_ids = this.sub_category_index.filter(open_id => open_id !== index);
            this.sub_category_index = open_ids;
        } else {
            this.sub_category_index = [...this.sub_category_index, index];
        }
    }

    // eslint-disable-next-line class-methods-use-this
    getCategoryContents(category) {
        const workspace = Blockly.derivWorkspace;
        const dynamic = category.getAttribute('dynamic');
        let xml_list = Array.from(category.childNodes);

        // Dynamic categories
        if (typeof dynamic === 'string') {
            const fnToApply = workspace.getToolboxCategoryCallback(dynamic);
            xml_list = fnToApply(workspace);
        }

        return xml_list;
    }

    getAllCategories() {
        const categories = [];
        Array.from(this.toolbox_dom.childNodes).forEach(category => {
            categories.push(category);
            if (this.hasSubCategory(category.children)) {
                Array.from(category.children).forEach(subCategory => {
                    categories.push(subCategory);
                });
            }
        });
        return categories;
    }

    // eslint-disable-next-line class-methods-use-this
    hasSubCategory(category) {
        // eslint-disable-next-line consistent-return
        const subCategory = Object.keys(category).filter(key => {
            if (category[key].tagName.toUpperCase() === 'CATEGORY') {
                return category[key];
            }
        });
        if (subCategory.length) {
            return true;
        }
        return false;
    }

    onSearch({ search }) {
        this.is_search_focus = true;
        this.showSearch(search);
    }

    onSearchBlur() {
        this.is_search_focus = false;
    }

    onSearchClear(setFieldValue) {
        setFieldValue('search', '');
        this.showSearch('');
    }

    onSearchKeyUp(submitForm) {
        this.is_search_loading = true;

        clearTimeout(this.typing_timer);
        this.typing_timer = setTimeout(
            action(() => {
                submitForm();
                this.is_search_loading = false;
            }),
            1000
        );
    }

    showSearch(search) {
        const workspace = Blockly.derivWorkspace;
        const flyout_content = [];
        const search_term = search.replace(/\s+/g, ' ').trim().toUpperCase();
        const search_words = search_term.split(' ');
        const all_variables = workspace.getVariablesOfType('');
        const all_procedures = Blockly.Procedures.allProcedures(workspace);
        const { flyout } = this.root_store;

        flyout.setVisibility(false);

        // avoid general term which the result will return most of the blocks
        const general_term = [
            localize('THE'),
            localize('OF'),
            localize('YOU'),
            localize('IS'),
            localize('THIS'),
            localize('THEN'),
            localize('A'),
            localize('AN'),
        ];

        if (search_term.length === 0) {
            return;
        } else if (search_term.length <= 1 || search_words.every(term => general_term.includes(term))) {
            flyout.setIsSearchFlyout(true);
            flyout.setContents(flyout_content, search);
            return;
        }

        const all_categories = this.getAllCategories();

        const block_contents = all_categories
            .filter(category => !this.hasSubCategory(category.children))
            .map(category => {
                const contents = this.getCategoryContents(category);

                const only_block_contents = Array.from(contents).filter(
                    content => content.tagName.toUpperCase() === 'BLOCK'
                );
                return only_block_contents;
            })
            .flat();

        const pushIfNotExists = (array, element_to_push) => {
            if (!array.some(element => element === element_to_push)) {
                array.push(element_to_push);
            }
        };

        const pushBlockWithPriority = priority => {
            block_contents.forEach(block_content => {
                const block_type = block_content.getAttribute('type');
                const block = Blockly.Blocks[block_type];
                const block_meta = block.meta instanceof Function && block.meta();
                const block_definitions = block.definition instanceof Function && block.definition();
                const block_name = block_meta.display_name;
                const block_type_terms = block_type.toUpperCase().split('_');
                const block_name_terms = block_name.toUpperCase().split(' ');
                const definition_key_to_search = /^((message)|(tooltip)|(category))/;

                switch (priority) {
                    // when the search text match exactly the block's name
                    case 'exact_block_name': {
                        if (search_term === block_name.toUpperCase() || search_term === block_type.toUpperCase()) {
                            pushIfNotExists(flyout_content, block_content);
                        }
                        break;
                    }
                    // when there's multiple search text and all the search text match block's name or block type
                    case 'match_words': {
                        if (
                            search_words.every(word => block_name_terms.some(term => term.includes(word))) ||
                            search_words.every(word => block_type_terms.some(term => term.includes(word)))
                        ) {
                            pushIfNotExists(flyout_content, block_content);
                        }
                        break;
                    }
                    // when some of search word match block's name or block's type
                    case 'block_term': {
                        if (
                            block_type_terms.some(term => search_words.some(word => term.includes(word))) ||
                            block_name_terms.some(term => search_words.some(word => term.includes(word)))
                        ) {
                            pushIfNotExists(flyout_content, block_content);
                        }
                        break;
                    }
                    case 'block_definitions': {
                        // eslint-disable-next-line consistent-return
                        Object.keys(block_definitions).forEach(key => {
                            const definition = block_definitions[key];

                            if (
                                definition_key_to_search.test(key) &&
                                search_words.some(word => definition.includes(word))
                            ) {
                                pushIfNotExists(flyout_content, block_content);
                            }

                            if (definition instanceof Array) {
                                definition.forEach(def => {
                                    const definition_strings = JSON.stringify(def).toUpperCase();

                                    if (
                                        def.type === 'field_dropdown' &&
                                        search_term.length > 2 &&
                                        search_words.some(word => definition_strings.includes(word))
                                    ) {
                                        pushIfNotExists(flyout_content, block_content);
                                    }
                                });
                            }
                        });
                        break;
                    }
                    case 'block_meta': {
                        // block_meta matched
                        const matched_meta = Object.keys(block_meta)
                            .filter(key => key !== 'display_name')
                            .find(key => {
                                const block_meta_strings = block_meta[key]
                                    .toUpperCase()
                                    .replace(/[^\w\s]/gi, '')
                                    .split(' ');

                                return search_words.some(word => block_meta_strings.some(meta => meta.includes(word)));
                            });

                        if (matched_meta && matched_meta.length) {
                            pushIfNotExists(flyout_content, block_content);
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
        };

        const priority_order = ['exact_block_name', 'match_words', 'block_term', 'block_definitions', 'block_meta'];

        priority_order.forEach(priority => pushBlockWithPriority(priority));

        // block_variable_name matched
        const matched_variables = all_variables.filter(variable => variable.name.toUpperCase().includes(search_term));
        const variables_blocks = Blockly.DataCategory.search(matched_variables);
        // eslint-disable-next-line consistent-return
        const unique_var_blocks = variables_blocks.filter(variable_block => {
            return flyout_content.indexOf(variable_block) === -1;
        });
        if (unique_var_blocks && unique_var_blocks.length) {
            flyout_content.unshift(...unique_var_blocks);
        }

        // block_procedure_name matched
        const searched_procedures = { 0: [], 1: [] };
        const procedures_callnoreturn = all_procedures[0];
        const procedures_callreturn = all_procedures[1];
        Object.keys(procedures_callnoreturn).forEach(key => {
            const procedure = procedures_callnoreturn[key];

            if (procedure[0].toUpperCase().includes(search_term)) {
                searched_procedures['0'].unshift(procedure);
            }
        });

        Object.keys(procedures_callreturn).forEach(key => {
            const procedure = procedures_callreturn[key];

            if (procedure[0].toUpperCase().includes(search_term)) {
                searched_procedures['1'].unshift(procedure);
            }
        });

        const procedures_blocks = Blockly.Procedures.populateDynamicProcedures(searched_procedures);
        // eslint-disable-next-line consistent-return
        const unique_proce_blocks = procedures_blocks.filter(procedure_block => {
            return flyout_content.indexOf(procedure_block) === -1;
        });
        if (unique_proce_blocks.length) {
            flyout_content.unshift(...unique_proce_blocks);
        }

        flyout.setIsSearchFlyout(true);
        flyout.setContents(flyout_content, search);
    }
}
