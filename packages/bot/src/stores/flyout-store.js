/* eslint-disable no-underscore-dangle */
import React                  from 'react';
import { observable, action } from 'mobx';
import FlyoutBlock            from '../components/flyout-block.jsx';

export default class FlyoutStore {
    @observable flyout_content = [];
    @observable flyout_width   = this.flyout_min_width;
    @observable is_visible     = false;
    
    block_workspaces           = [];
    flyout_min_width           = 400;
    listeners                  = [];

    /**
     * Parses XML contents passed by Blockly.Toolbox. Supports all default
     * Blockly.Flyout elements i.e. <block>, <label>, <button> in their
     * original format, e.g. <label text="Hello World" />
     * @param {*} xmlList
     * @memberof FlyoutStore
     */
    @action.bound setContents(xmlList) {
        this.block_workspaces.forEach(workspace => workspace.dispose());
        this.listeners.forEach(listener => Blockly.unbindEvent_(listener));
        this.block_workspaces = [];
        this.listeners = [];

        const flyout_components = [];

        xmlList.forEach((node, index) => {
            const tagName = node.tagName.toUpperCase();

            if (tagName === 'BLOCK') {
                const key = node.getAttribute('type') + index;

                flyout_components.push(
                    <FlyoutBlock
                        key={key}
                        id={`flyout__item-workspace--${index}`}
                        block_node={node}
                    />
                );
            } else if (tagName === 'LABEL') {
                const key = node.getAttribute('text') + index;

                flyout_components.push(
                    <div key={key} className='flyout__item-label'>
                        { node.getAttribute('text') }
                    </div>
                );
            } else if (tagName === 'BUTTON') {
                const callbackKey = node.getAttribute('callbackKey');
                const callback = Blockly.derivWorkspace.getButtonCallback(callbackKey) || (() => {});
                const key = callbackKey + index;

                flyout_components.push(
                    <button
                        key={key}
                        className='flyout__button'
                        onClick={(button) => {
                            const b = button;
                            // Workaround for not having a flyout workspace.
                            b.targetWorkspace_ = Blockly.derivWorkspace;
                            b.getTargetWorkspace = () => b.targetWorkspace_;
                            callback(b);
                        }}
                    >
                        { node.getAttribute('text') }
                    </button>
                );
            }
        });

        this.flyout_width = Math.max(this.flyout_min_width, this.constructor.getLongestBlockWidth(xmlList) + 60);
        this.flyout_content = flyout_components;
        this.setVisibility(true);
    }

    /**
     * Sets whether the flyout is visible or not.
     * @param {*} is_visible
     * @memberof FlyoutStore
     */
    @action.bound setVisibility(is_visible) {
        this.is_visible = is_visible;

        if (!is_visible) {
            this.flyout_content = [];
        }
    }

    /**
     * Intialises a workspace unique to the passed block_node
     * @param {*} el_block_workspace Containing element for the Blockly.Workspace
     * @param {*} block_node XML DOM of a Blockly.Block
     * @memberof FlyoutStore
     */
    @action.bound initBlockWorkspace(el_block_workspace, block_node) {
        const workspace = Blockly.inject(el_block_workspace, {
            media: 'dist/media/',
            css  : false,
            move : { scrollbars: false, drag: true, wheel: false },
        });

        workspace.isFlyout = true;
        workspace.targetWorkspace = Blockly.derivWorkspace;

        const block = Blockly.Xml.domToBlock(block_node, workspace);

        block.isInFlyout = true;

        // Some blocks have hats, consider their height.
        const extra_spacing = (block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
        const block_workspace_height = Number.parseInt(block_node.getAttribute('height')) + extra_spacing + 10;

        // Update flyout and block-workspaces width to accommodate block widths.
        el_block_workspace.style.height = `${block_workspace_height}px`;
        el_block_workspace.style.width = `${this.flyout_width - 55}px`;

        // Move block away from side so it's displayed completely.
        const dx = 1;
        const dy = 5 + extra_spacing;
        block.moveBy(dx, dy);

        // Use original Blockly flyout functionality to create block on drag.
        const blockly_flyout = Blockly.derivWorkspace.toolbox_.flyout_;

        this.listeners.push(
            Blockly.bindEventWithChecks_(block.getSvgRoot(), 'mousedown', null,  (event) => {
                blockly_flyout.blockMouseDown_(block)(event);
            })
        );

        this.block_workspaces.push(workspace);
        this.block_workspaces.forEach(Blockly.svgResize);
    }

    /**
     * Creates a copy of the block on the main workspace and positions it
     * below the lowest block.
     * @param {*} block_node
     * @memberof FlyoutStore
     */
    static onAddClick(block_node) {
        const block = Blockly.Xml.domToBlock(block_node, Blockly.derivWorkspace);
        const top_blocks = Blockly.derivWorkspace.getTopBlocks(true);

        if (top_blocks.length) {
            const last_block = top_blocks[top_blocks.length - 1];
            const last_block_xy = last_block.getRelativeToSurfaceXY();
            const extra_spacing = (last_block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
            const y = last_block_xy.y + last_block.getHeightWidth().height + extra_spacing + 30;
            
            block.moveBy(last_block_xy.x, y);
        }

        Blockly.derivWorkspace.centerOnBlock(block.id, false);
    }

    /**
     * Walks through xmlList and finds width of the longest block while setting
     * height and width attributes on each of the block nodes.
     * @static
     * @param {*} xmlList
     * @returns
     * @memberof FlyoutStore
     */
    static getLongestBlockWidth(xmlList) {
        const options = new Blockly.Options({ media: '/dist/media/' });
        const fragment = document.createDocumentFragment();
        const el_injection_div = document.createElement('div');

        fragment.appendChild(el_injection_div);

        const svg = Blockly.createDom_(el_injection_div, options);
        const block_drag_surface = new Blockly.BlockDragSurfaceSvg(el_injection_div);
        const workspace_drag_surface = new Blockly.WorkspaceDragSurfaceSvg(el_injection_div);
        const workspace = Blockly.createMainWorkspace_(svg, options, block_drag_surface, workspace_drag_surface);

        Blockly.init_(workspace);

        let longest_block_width = 0;

        xmlList.forEach((node) => {
            const tagName = node.tagName.toUpperCase();
            
            if (tagName === 'BLOCK') {
                const block = Blockly.Xml.domToBlock(node, workspace);
                const block_hw = block.getHeightWidth();

                node.setAttribute('width', block_hw.width);
                node.setAttribute('height', block_hw.height);

                longest_block_width = Math.max(longest_block_width, block_hw.width);
            }
        });

        workspace.dispose();

        return longest_block_width;
    }
}
