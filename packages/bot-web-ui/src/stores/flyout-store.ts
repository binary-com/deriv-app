/* eslint-disable no-underscore-dangle */
import { action, computed, makeObservable, observable } from 'mobx';
import { config } from '@deriv/bot-skeleton';
import GTM from 'Utils/gtm';
import RootStore from './root-store';

export interface IFlyoutStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    block_listeners: any[];
    block_workspaces: Element[];
    flyout_min_width: number;
    options: {
        media: string;
        move: { scrollbars: boolean; drag: boolean; wheel: boolean };
        zoom: { startScale: number };
        sounds: boolean;
    };
    is_help_content: boolean;
    flyout_content: Element[];
    flyout_width: number;
    is_visible: boolean;
    is_search_flyout: boolean;
    is_loading: boolean;
    search_term: string;
    selected_category: Element | null;
    onMount: () => void;
    onUnmount: () => void;
    initFlyout: () => void;
    initBlockWorkspace: (el_block_workspace: HTMLElement, block_node: Node) => void;
    getFlyout: () => Element;
    setContents: (xml_list: Element[], search_term: string) => void;
    setFlyoutWidth: (xmlList: Element[]) => void;
    setVisibility: (is_visible: boolean) => void;
    setIsSearchFlyout: (is_search: boolean) => void;
    setSelectedCategory: (selected_category: Element | null) => void;
    getSelectedCategory: () => Element | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClickOutsideFlyout: (event: any) => void;
    refreshCategory: () => void;
    variables_blocks_count: number;
    first_get_variable_block_index: number;
}

export default class FlyoutStore implements IFlyoutStore {
    root_store: RootStore;
    flyout = null;
    block_listeners = [];
    block_workspaces = [];
    flyout_min_width = 440;
    options = {
        renderer: 'zelos',
        media: `${__webpack_public_path__}media/`,
        move: { scrollbars: false, drag: true, wheel: false },
        zoom: { startScale: config.workspaces.flyoutWorkspacesStartScale },
        sounds: false,
        theme: window?.Blockly?.Themes?.zelos_renderer,
    };

    is_help_content = false;
    flyout_content: Element[] = [];
    flyout_width = this.flyout_min_width;
    is_visible = false;
    is_search_flyout = false;
    is_loading = false;
    search_term = '';
    selected_category: Element | null = null;

    constructor(root_store: RootStore) {
        makeObservable(this, {
            is_help_content: observable,
            flyout_content: observable,
            flyout_width: observable,
            is_visible: observable,
            is_search_flyout: observable,
            is_loading: observable,
            search_term: observable,
            selected_category: observable,
            onMount: action.bound,
            onUnmount: action.bound,
            initFlyout: action.bound,
            initBlockWorkspace: action.bound,
            getFlyout: action.bound,
            setContents: action.bound,
            setFlyoutWidth: action.bound,
            setVisibility: action.bound,
            setIsSearchFlyout: action.bound,
            setSelectedCategory: action.bound,
            getSelectedCategory: action.bound,
            onClickOutsideFlyout: action.bound,
            refreshCategory: action.bound,
            variables_blocks_count: computed,
            first_get_variable_block_index: computed,
        });

        this.root_store = root_store;
    }

    onMount() {
        this.initFlyout();
        window.addEventListener('click', this.onClickOutsideFlyout);
    }

    onUnmount() {
        window.removeEventListener('click', this.onClickOutsideFlyout);
    }

    initFlyout() {
        const workspace = window.Blockly.derivWorkspace;

        const flyoutWorkspaceOptions = new Blockly.Options({
            parentWorkspace: workspace,
            rtl: workspace.RTL,
            horizontalLayout: true,
            theme: window?.Blockly?.Themes?.zelos_renderer,
        });

        if (workspace.horizontalLayout) {
            this.flyout = new window.Blockly.HorizontalFlyout(flyoutWorkspaceOptions);
        } else {
            this.flyout = new window.Blockly.VerticalFlyout(flyoutWorkspaceOptions);
        }

        this.flyout.targetWorkspace = workspace;
        this.flyout.workspace_.targetWorkspace = workspace;

        // A flyout connected to a workspace doesn't have its own current gesture.
        this.flyout.workspace_.getGesture = this.flyout.targetWorkspace.getGesture.bind(this.flyout.targetWorkspace_);

        // Get variables from the main workspace rather than the target workspace.
        workspace.VariableMap = this.flyout.targetWorkspace.getVariableMap();

        this.flyout.workspace_.createPotentialVariableMap();
    }

    /**
     * Intialises a workspace unique to the passed block_node
     * @param {Element} el_block_workspace Element where Blockly.Workspace will be mounted on
     * @param {Element} block_node DOM of a Blockly.Block
     * @memberof FlyoutStore
     */
    initBlockWorkspace(el_block_workspace: HTMLElement, block_node: Node) {
        const workspace = window.Blockly.inject(el_block_workspace, this.options);

        workspace.targetWorkspace = window.Blockly.derivWorkspace;

        const block = window.Blockly.Xml.domToBlock(block_node, workspace);
        // Using block.getHeightWidth() here because getDimentions() also calls Blockly.Xml.domToBlock
        const block_hw = block.getHeightWidth();

        block.isInFlyout = true;

        // Update block workspace widths to accommodate block widths.
        // addind 1px to highet and then moving the block 1px down to make block top border visible
        el_block_workspace.style.height = `${Math.ceil(block_hw.height * this.options.zoom.startScale) + 1}px`;
        el_block_workspace.style.width = `${Math.ceil(block_hw.width * this.options.zoom.startScale) + 1}px`;
        block.moveBy(1, 1);

        // Use original Blockly flyout functionality to create block on drag.
        const block_svg_root = block.getSvgRoot();

        this.block_listeners.push(
            window?.Blockly?.browserEvents?.conditionalBind(block_svg_root, 'mousedown', null, event => {
                GTM.pushDataLayer({
                    event: 'dbot_drag_block',
                    block_type: block.type,
                });
                this.flyout.blockMouseDown(block)(event as Blockly.Events.UiBase);
            }),
            window?.Blockly?.browserEvents?.bind(block_svg_root, 'mouseout', block, block.removeSelect),
            window?.Blockly?.browserEvents?.bind(block_svg_root, 'mouseover', block, block.addSelect)
        );

        this.block_workspaces.push(workspace);
        window.Blockly.svgResize(workspace);
    }

    getFlyout() {
        return this.flyout;
    }

    /**
     * Parses XML contents passed by Blockly.Toolbox. Supports all default
     * Blockly.Flyout elements i.e. <block>, <label>, <button> in their
     * original format, e.g. <label text="Hello World" />
     * @param {Element[]} xml_list list of XML nodes
     * @memberof FlyoutStore
     */
    setContents(xml_list: Element[], search_term = '') {
        const text_limit = 20;
        const processed_xml = xml_list;

        this.block_listeners.forEach(listener => window.Blockly.browserEvents.unbind(listener));
        this.block_workspaces.forEach(workspace => workspace.dispose());
        this.block_listeners = [];
        this.block_workspaces = [];

        this.is_help_content = false;
        this.search_term = search_term.length > text_limit ? `${search_term.substring(0, text_limit)}...` : search_term;
        this.flyout_content = xml_list;

        this.setFlyoutWidth(processed_xml);
        this.setVisibility(true);

        // apparently setFlyoutWidth doesn't calculate blocks dimentions until they're visible
        // using setTimeout is a workaround to solve this issue
        setTimeout(() => this.setFlyoutWidth(processed_xml), 50);
    }

    /**
     * Walks through xmlList and finds width of the longest block while setting
     * height and width (in workspace pixels) attributes on each of the block nodes.
     * @param {Element[]} xmlList
     * @memberof FlyoutStore
     */
    setFlyoutWidth(xmlList: Element[]) {
        let longest_block_width = 0;

        xmlList.forEach((node: Element) => {
            const tag_name = node.tagName.toUpperCase();

            if (tag_name === Blockly.Xml.NODE_BLOCK) {
                const block_hw = Blockly.Block.getDimensions(node);

                node.setAttribute('width', String(Math.ceil(block_hw.width * this.options.zoom.startScale)));
                node.setAttribute('height', String(Math.ceil(block_hw.height * this.options.zoom.startScale)));
                longest_block_width = Math.max(
                    longest_block_width,
                    Math.ceil(block_hw.width * this.options.zoom.startScale)
                );
            }
        });

        this.flyout_width = Math.max(this.flyout_min_width, longest_block_width + 65);
    }

    /**
     * Sets whether the flyout is visible or not.
     * @param {boolean} is_visible
     * @memberof FlyoutStore
     */
    setVisibility(is_visible: boolean) {
        this.is_visible = is_visible;

        if (!is_visible) {
            this.setSelectedCategory(null);
            this.flyout_content = [];
        }

        window.Blockly.derivWorkspace.isFlyoutVisible = is_visible;
    }

    /**
     * Sets whether the flyout is search or not.
     * @param {boolean} is_search
     * @memberof FlyoutStore
     */
    setIsSearchFlyout(is_search: boolean) {
        this.is_search_flyout = is_search;
    }

    setSelectedCategory(selected_category: Element | null) {
        this.selected_category = selected_category;
    }

    getSelectedCategory() {
        return this.selected_category;
    }

    /**
     * Close the flyout on click outside itself or parent toolbox.
     */
    onClickOutsideFlyout(event: MouseEvent) {
        if (!this.is_visible || !window.Blockly.derivWorkspace) {
            return;
        }

        const toolbox = document.getElementById('gtm-toolbox');
        const path = event?.composedPath() || [];

        const is_flyout_click = path.some(
            el => (el as Element).classList && (el as Element).classList.contains('flyout')
        );
        const is_search_focus = this.root_store.toolbox.is_search_focus;
        const isToolboxClick = () => toolbox?.contains(event.target as Node);

        if (!is_flyout_click && !isToolboxClick() && !is_search_focus) {
            this.setVisibility(false);
            this.setSelectedCategory(null);
        }
    }

    refreshCategory() {
        const category = this.getSelectedCategory();
        const { toolbox } = this.root_store;
        const flyout_content = toolbox.getCategoryContents(category);
        this.setContents(flyout_content);
    }

    get variables_blocks_count() {
        return this.flyout_content.filter((block: Element) => block.getAttribute('type') === 'variables_get').length;
    }

    get first_get_variable_block_index() {
        return this.flyout_content.length - this.variables_blocks_count;
    }
}
