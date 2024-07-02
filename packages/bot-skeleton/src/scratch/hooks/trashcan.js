/**
 * Inspect the contents of the trash.
 * @deriv/bot: Noop for us, restore original functionality when trashcan can be inspected.
 */
Blockly.Trashcan.prototype.click = function () {};

Blockly.Trashcan.prototype.setTrashcanPosition = (position_right, position_top) => {
    const trashcan_instance = Blockly.derivWorkspace?.trashcan?.svgGroup;
    trashcan_instance?.setAttribute('transform', `translate(${position_right}, ${position_top})`);
};
