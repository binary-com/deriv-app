// @deriv/bot: Set the minimum width of a statement block to be wider than default.
Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 100 * Blockly.BlockSvg.GRID_UNIT;

// @deriv/bot: Root block hat replaces with standard rounded corner
Blockly.BlockSvg.START_HAT_PATH = `m 0,${Blockly.BlockSvg.CORNER_RADIUS} A ${Blockly.BlockSvg.CORNER_RADIUS}, ${Blockly.BlockSvg.CORNER_RADIUS} 0 0,1 ${Blockly.BlockSvg.CORNER_RADIUS},0`;

// @deriv/bot: Changed the height of a row in a statement block to be 10.
Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y = 10 * Blockly.BlockSvg.GRID_UNIT;

// @deriv/bot: visual improvement: changed editable field padding from 8 to 16
Blockly.BlockSvg.EDITABLE_FIELD_PADDING = 16;

/**
 * Change the colour of a block.
 */
Blockly.BlockSvg.prototype.updateColour = function () {
    let strokeColour = this.getColourTertiary();
    const renderShadowed = this.isShadow() && !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this);

    if (renderShadowed && this.parentBlock_) {
        // Pull shadow block stroke colour from parent block's tertiary if possible.
        strokeColour = this.parentBlock_.getColourTertiary();
        // Special case: if we contain a colour field, set to a special stroke colour.
        if (
            this.inputList[0] &&
            this.inputList[0].fieldRow[0] &&
            (this.inputList[0].fieldRow[0] instanceof Blockly.FieldColour ||
                this.inputList[0].fieldRow[0] instanceof Blockly.FieldColourSlider)
        ) {
            strokeColour = Blockly.Colours.colourPickerStroke;
        }
    }

    // Render block stroke
    this.svgPath_.setAttribute('stroke', strokeColour);
    let fillColour = this.getColour();

    // Render block fill
    if (this.isGlowingBlock_ || renderShadowed) {
        // Use the block's shadow colour if possible.
        if (this.getShadowColour()) {
            fillColour = this.getShadowColour();
        } else {
            fillColour = this.getColourSecondary();
        }
    }
    this.svgPath_.setAttribute('fill', fillColour);

    // Render opacity
    this.svgPath_.setAttribute('fill-opacity', this.getOpacity());

    // Update colours of input shapes.
    // eslint-disable-next-line no-cond-assign
    for (let i = 0, input; (input = this.inputList[i]); i++) {
        if (input.outlinePath) {
            input.outlinePath.setAttribute('fill', this.getColourTertiary());
        }
    }

    // Render icon(s) if applicable
    const icons = this.getIcons();
    for (let i = 0; i < icons.length; i++) {
        icons[i].updateColour();
    }

    // Bump every dropdown to change its colour.
    // eslint-disable-next-line no-cond-assign
    for (let x = 0, input; (input = this.inputList[x]); x++) {
        // eslint-disable-next-line no-cond-assign
        for (let y = 0, field; (field = input.fieldRow[y]); y++) {
            field.setText(null);
        }
    }
    // deriv-bot: Update colours of input shapes to a fixed value of #FFF.
    this.inputList.forEach(input => {
        if (input.outlinePath) {
            input.outlinePath.setAttribute('fill', 'var(--state-normal)');
            input.outlinePath.setAttribute('stroke', '#6d7278');
            input.outlinePath.setAttribute('stroke-width', '0.3px');
        }
    });
};

/**
 * For a block with output,
 * determine start and end padding, based on connected inputs.
 * Padding will depend on the shape of the output, the shape of the input,
 * and possibly the size of the input.
 * @param {!Array.<!Array.<!Object>>} input_rows Partially calculated rows.
 */
Blockly.BlockSvg.prototype.computeOutputPadding_ = function (input_rows) {
    // Only apply to blocks with outputs and not single fields (shadows).
    if (
        !this.getOutputShape() ||
        !this.outputConnection ||
        (this.isShadow() && !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this))
    ) {
        return;
    }

    // Blocks with outputs must have single row to be padded.
    if (input_rows.length > 1) {
        return;
    }

    const row = input_rows[0];
    const shape = this.getOutputShape();

    // Reset any padding: it's about to be set.
    row.paddingStart = 0;
    row.paddingEnd = 0;

    // Start row padding: based on first input or first field.
    const firstInput = row[0];
    const firstField = firstInput.fieldRow[0];
    let otherShape;

    // In checking the left/start side, a field takes precedence over any input.
    // That's because a field will be rendered before any value input.
    if (firstField) {
        otherShape = 0; // Field comes first in the row.
    } else {
        // Value input comes first in the row.
        const inputConnection = firstInput.connection;

        if (!inputConnection) {
            // @deriv/bot: Don't collapse if there's no connection.
            return;
        } else if (!inputConnection.targetConnection) {
            // Not connected: use the drawn shape.
            otherShape = inputConnection.getOutputShape();
        } else {
            // Connected: use the connected block's output shape.
            otherShape = inputConnection.targetConnection.getSourceBlock().getOutputShape();
        }

        // Special case for hexagonal output: if the connection is larger height
        // than a standard reporter, add some start padding.
        // https://github.com/LLK/scratch-blocks/issues/376
        if (shape === Blockly.OUTPUT_SHAPE_HEXAGONAL && otherShape !== Blockly.OUTPUT_SHAPE_HEXAGONAL) {
            const deltaHeight = firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;

            // One grid unit per level of nesting.
            row.paddingStart += deltaHeight / 2;
        }
    }

    row.paddingStart += Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape][otherShape];

    // End row padding: based on last input or last field.
    const lastInput = row[row.length - 1];

    // In checking the right/end side, any value input takes precedence over any field.
    // That's because fields are rendered before inputs...the last item
    // in the row will be an input, if one exists.
    if (lastInput.connection) {
        // Value input last in the row.
        const inputConnection = lastInput.connection;

        if (!inputConnection.targetConnection) {
            // Not connected: use the drawn shape.
            otherShape = inputConnection.getOutputShape();
        } else {
            // Connected: use the connected block's output shape.
            otherShape = inputConnection.targetConnection.getSourceBlock().getOutputShape();
        }
        // Special case for hexagonal output: if the connection is larger height
        // than a standard reporter, add some end padding.
        // https://github.com/LLK/scratch-blocks/issues/376
        if (shape === Blockly.OUTPUT_SHAPE_HEXAGONAL && otherShape !== Blockly.OUTPUT_SHAPE_HEXAGONAL) {
            const deltaHeight = lastInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;

            // One grid unit per level of nesting.
            row.paddingEnd += deltaHeight / 2;
        }
    } else {
        // No input in this row - mark as field.
        otherShape = 0;
    }

    row.paddingEnd += Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape][otherShape];
};

/**
 * Render a list of fields starting at the specified location.
 * @param {!Array.<!Blockly.Field>} fieldList List of fields.
 * @param {number} cursorX X-coordinate to start the fields.
 * @param {number} cursorY Y-coordinate to start the fields.
 * @return {number} X-coordinate of the end of the field row (plus a gap).
 * @private
 */
Blockly.BlockSvg.prototype.renderFields_ = function (fieldList, cursorX, cursorY) {
    let updatedCursorX = cursorX;
    let px = 0;
    this.RTL && (updatedCursorX = -updatedCursorX);
    for (let i = 0, field; fieldList[i]; i++) {
        field = fieldList[i];
        const root = field.getSvgRoot();
        if (root) {
            !this.previousConnection ||
                field instanceof Blockly.FieldLabel ||
                field instanceof Blockly.FieldImage ||
                (updatedCursorX = this.RTL
                    ? Math.min(updatedCursorX, -Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X)
                    : Math.max(updatedCursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X));
            let py = -field.getSize().height / 2;
            this.isScratchExtension &&
                field === this.inputList[0].fieldRow[0] &&
                field instanceof Blockly.FieldImage &&
                this.previousConnection &&
                (py += Blockly.BlockSvg.GRID_UNIT);
            this.isScratchExtension &&
                !this.previousConnection &&
                this.nextConnection &&
                field instanceof Blockly.FieldVerticalSeparator &&
                field.setLineHeight(Blockly.BlockSvg.ICON_SEPARATOR_HEIGHT - Blockly.BlockSvg.GRID_UNIT);
            let scale = '';
            if (this.RTL) {
                px = updatedCursorX -= field.renderSep + field.renderWidth;
                py = cursorY + py;
                field.renderWidth && (updatedCursorX -= Blockly.BlockSvg.SEP_SPACE_X);
            } else {
                px = updatedCursorX + field.renderSep;
                py = cursorY + py;
                field.renderWidth &&
                    (updatedCursorX += field.renderSep + field.renderWidth + Blockly.BlockSvg.SEP_SPACE_X);
            }
            this.RTL && field instanceof Blockly.FieldImage && ((scale = 'scale(-1 1)'), (px += field.renderWidth));
            root.setAttribute('transform', `translate(${px}, ${py}) ${scale}`);
            this.isInsertionMarker() && root.setAttribute('display', 'none');
        }
    }
    return this.RTL ? -updatedCursorX : updatedCursorX;
};
