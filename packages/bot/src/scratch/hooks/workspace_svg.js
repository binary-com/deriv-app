import config from '../../constants';

/**
 * Handle a mouse-down on SVG drawing surface.
 * @param {!Event} e Mouse down event.
 * @private
 */
Blockly.WorkspaceSvg.prototype.onMouseDown_ = function(e) {
    // Bubble mousedown event up for some Core elements to react correctly.
    Blockly.derivWorkspace.cachedParentSvg_.dispatchEvent(new e.constructor(e.type, e));

    const gesture = this.getGesture(e);
    if (gesture) {
        gesture.handleWsStart(e, this);
    }
};

/**
 * Scroll the workspace to center on the given block.
 * @param {?string} id ID of block center on.
 * @public
 */
Blockly.WorkspaceSvg.prototype.centerOnBlock = function(id, hideChaff = true) {
    if (!this.scrollbar) {
        // eslint-disable-next-line no-console
        console.warn('Tried to scroll a non-scrollable workspace.');
        return;
    }

    const block = this.getBlockById(id);
    if (!block) {
        return;
    }

    // XY is in workspace coordinates.
    const xy = block.getRelativeToSurfaceXY();

    // Height/width is in workspace units.
    const heightWidth = block.getHeightWidth();

    // Find the enter of the block in workspace units.
    const blockCenterY = xy.y + heightWidth.height / 2;

    // In RTL the block's position is the top right of the block, not top left.
    const multiplier = this.RTL ? -1 : 1;
    const blockCenterX = xy.x + (multiplier * heightWidth.width / 2);

    // Workspace scale, used to convert from workspace coordinates to pixels.
    const scale = this.scale;

    // Center in pixels.  0, 0 is at the workspace origin.  These numbers may
    // be negative.
    const pixelX = blockCenterX * scale;
    const pixelY = blockCenterY * scale;

    const metrics = this.getMetrics();

    // Scrolling to here would put the block in the top-left corner of the
    // visible workspace.
    const scrollToBlockX = pixelX - metrics.contentLeft;
    const scrollToBlockY = pixelY - metrics.contentTop;

    // viewHeight and viewWidth are in pixels.
    const halfViewWidth = metrics.viewWidth / 2;
    const halfViewHeight = metrics.viewHeight / 2;

    // Put the block in the center of the visible workspace instead.
    const scrollToCenterX = scrollToBlockX - halfViewWidth;
    const scrollToCenterY = scrollToBlockY - halfViewHeight;

    if (hideChaff) {
        Blockly.hideChaff();
    }

    this.scrollbar.set(scrollToCenterX, scrollToCenterY);
};

/**
 * Creates a copy of passed block_node on main workspace and positions it
 * below the lowest block on the canvas.
 * @static
 * @param {Element} block_node
 * @public
 */
Blockly.WorkspaceSvg.prototype.addBlockNode = function (block_node) {
    const block = Blockly.Xml.domToBlock(block_node, this);
    const top_blocks = this.getTopBlocks(true);

    if (top_blocks.length) {
        const last_block = top_blocks[top_blocks.length - 1];
        const last_block_xy = last_block.getRelativeToSurfaceXY();
        const extra_spacing = (last_block.startHat_ ? Blockly.BlockSvg.START_HAT_HEIGHT : 0);
        const y = last_block_xy.y + last_block.getHeightWidth().height + extra_spacing + 30;

        block.moveBy(last_block_xy.x, y);
    }

    if (/^procedures_/.test(block_node.getAttribute('type'))) {
        const toolbox = this.toolbox_;
        toolbox.refreshCategory();
    }

    // Trigger a create event.
    Blockly.Events.fire(new Blockly.Events.Create(block));

    block.select();
    this.centerOnBlock(block.id, false);
};

/**
 * Clean up the workspace by ordering all the blocks in a column. For deriv-bot
 * root-blocks are sorted in columns first, then all other blocks are positioned below
 * the lowest hanging root-block.
 */
Blockly.WorkspaceSvg.prototype.cleanUp = function(x = 0, y = 0, blocks_to_clean = []) {
    this.setResizesEnabled(false);
    Blockly.Events.setGroup(true);

    const is_import = blocks_to_clean.length !== 0;
    const top_blocks = is_import ? blocks_to_clean : this.getTopBlocks(true);
    const root_blocks = top_blocks.filter(block => block.isMainBlock()).sort((a, b) => {
        const blockIndex = (block) => config.mainBlocks.findIndex(main_block_type => main_block_type === block.type);
        return blockIndex(a) - blockIndex(b);
    });
    const column_count = 2;
    const blocks_per_column = Math.ceil(root_blocks.length / column_count);

    let original_cursor_y = y;

    if (root_blocks.length) {
        let column_index = 0;

        root_blocks.forEach((block, index) => {
            if (index === (column_index + 1) * blocks_per_column) {
                original_cursor_y = y;
                column_index++;
            }

            const xy = block.getRelativeToSurfaceXY();
            const cursor_x = is_import ? x : -xy.x;
            const cursor_y = original_cursor_y - (is_import ? 0 : xy.y);

            if (column_index === 0) {
                block.moveBy(cursor_x, cursor_y);
            } else {
                const start = (column_index - 1) * blocks_per_column;
                const fat_neighbour_block = root_blocks
                    .slice(start, start + blocks_per_column)
                    .reduce((a, b) => a.getHeightWidth().width > b.getHeightWidth().width ? a : b);
        
                let position_x = cursor_x +
                            fat_neighbour_block.getHeightWidth().width +
                            Blockly.BlockSvg.MIN_BLOCK_X;
                if (!is_import) {
                    position_x += fat_neighbour_block.getRelativeToSurfaceXY().x;
                }

                block.moveBy(position_x, cursor_y);
            }

            block.snapToGrid();
            
            original_cursor_y =
              block.getRelativeToSurfaceXY().y +
              block.getHeightWidth().height +
              Blockly.BlockSvg.MIN_BLOCK_Y;
        });

        const lowest_root_block = root_blocks.reduce((a, b) => {
            const a_metrics = a.getRelativeToSurfaceXY().y + a.getHeightWidth().height;
            const b_metrics = b.getRelativeToSurfaceXY().y + b.getHeightWidth().height;
            return a_metrics > b_metrics ? a : b;
        });

        original_cursor_y =
          lowest_root_block.getRelativeToSurfaceXY().y +
          lowest_root_block.getHeightWidth().height +
          Blockly.BlockSvg.MIN_BLOCK_Y;
    }

    const filtered_top_blocks = top_blocks.filter(block => !block.isMainBlock());

    filtered_top_blocks.forEach(block => {
        const xy = block.getRelativeToSurfaceXY();
        const cursor_x = is_import ? x : -xy.x;
        const cursor_y = original_cursor_y - (is_import ? 0 : xy.y);

        block.moveBy(cursor_x, cursor_y);
        block.snapToGrid();

        original_cursor_y =
          block.getRelativeToSurfaceXY().y +
          block.getHeightWidth().height +
          Blockly.BlockSvg.MIN_BLOCK_Y;
    });

    Blockly.Events.setGroup(false);
    this.setResizesEnabled(true);
};

/**
 * Return an object with all the metrics required to size scrollbars for a
 * top level workspace.  The following properties are computed:
 * Coordinate system: pixel coordinates.
 * .viewHeight: Height of the visible rectangle,
 * .viewWidth: Width of the visible rectangle,
 * .contentHeight: Height of the contents,
 * .contentWidth: Width of the content,
 * .viewTop: Offset of top edge of visible rectangle from parent,
 * .viewLeft: Offset of left edge of visible rectangle from parent,
 * .contentTop: Offset of the top-most content from the y=0 coordinate,
 * .contentLeft: Offset of the left-most content from the x=0 coordinate.
 * .absolute_top: Top-edge of view.
 * .absolute_left: Left-edge of view.
 * .toolboxWidth: Width of toolbox, if it exists.  Otherwise zero.
 * .toolboxHeight: Height of toolbox, if it exists.  Otherwise zero.
 * .flyoutWidth: Width of the flyout if it is always open.  Otherwise zero.
 * .flyoutHeight: Height of flyout if it is always open.  Otherwise zero.
 * .toolboxPosition: Top, bottom, left or right.
 * @return {!Object} Contains size and position metrics of a top level
 *   workspace.
 * @private
 * @this Blockly.WorkspaceSvg
 */
Blockly.WorkspaceSvg.getTopLevelWorkspaceMetrics_ = function() {
    const toolbox_dimensions = Blockly.WorkspaceSvg.getDimensionsPx_(this.toolbox_);
    const flyout_dimensions = Blockly.WorkspaceSvg.getDimensionsPx_(this.flyout_);

    // Contains height and width in CSS pixels.
    // svg_size is equivalent to the size of the injectionDiv at this point.
    const svg_size = Blockly.svgSize(this.getParentSvg());

    if (this.toolbox_) {
        if (
            this.toolboxPosition === Blockly.TOOLBOX_AT_TOP ||
          this.toolboxPosition === Blockly.TOOLBOX_AT_BOTTOM
        ) {
            svg_size.height -= toolbox_dimensions.height;
        } else if (
            this.toolboxPosition === Blockly.TOOLBOX_AT_LEFT ||
            this.toolboxPosition === Blockly.TOOLBOX_AT_RIGHT
        ) {
            svg_size.width -= toolbox_dimensions.width;
        }
    }

    // svg_size is now the space taken up by the Blockly workspace, not including the toolbox.
    const content_dimensions = Blockly.WorkspaceSvg.getContentDimensions_(this, svg_size);

    let absolute_left = 0;
    let absolute_top = 0;

    if (this.toolbox_ && this.toolboxPosition === Blockly.TOOLBOX_AT_LEFT) {
        absolute_top = 50; // deriv-bot: Add some spacing for Core header.
        absolute_left = toolbox_dimensions.width;
    }

    if (this.toolbox_ && this.toolboxPosition === Blockly.TOOLBOX_AT_TOP) {
        absolute_top = toolbox_dimensions.height + 50;
    }

    const metrics = {
        contentHeight  : content_dimensions.height,
        contentWidth   : content_dimensions.width,
        contentTop     : content_dimensions.top,
        contentLeft    : content_dimensions.left,
        viewHeight     : svg_size.height,
        viewWidth      : svg_size.width,
        viewTop        : -this.scrollY,   // Must be in pixels, somehow.
        viewLeft       : -this.scrollX,  // Must be in pixels, somehow.
        absoluteTop    : absolute_top,
        absoluteLeft   : absolute_left,
        toolboxWidth   : toolbox_dimensions.width,
        toolboxHeight  : toolbox_dimensions.height,
        flyoutWidth    : flyout_dimensions.width,
        flyoutHeight   : flyout_dimensions.height,
        toolboxPosition: this.toolboxPosition,
    };

    return metrics;
};
