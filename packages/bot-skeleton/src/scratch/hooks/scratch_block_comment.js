/**
 * Change the colour of the associated bubble to match its block.
 * deriv-bot: Use primary colour instead of tertiary. At time of writing
 * we use colour too similar to workspace background colour for tertiary (borders).
 * @package
 */
Blockly.WorkspaceComment.prototype.updateColour = function () {
    if (this.isVisible()) {
        this.bubble_.setColour(this.block_.getColour());
    }
};
