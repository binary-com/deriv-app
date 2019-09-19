/* eslint-disable func-names, no-underscore-dangle */
Blockly.FieldDropdown.prototype.updateOptions = function(
    options,
    group_type,
    opt_default = null,
    should_trigger_event = true,
    should_pretend_empty = false,
) {
    Blockly.Events.disable();

    const previous_value    = !should_pretend_empty && this.getValue() || '';
    const has_default_value = opt_default && options.findIndex(item => item[1] === opt_default) !== -1;

    this.menuGenerator_ = options;

    if (has_default_value) {
        // Set default value if available in new options.
        this.setValue('');
        this.setValue(opt_default);
    } else if (options.length > 0) {
        // Default to first if option isn't available.
        this.setValue('');
        this.setValue(this.menuGenerator_[0][1]);
    }

    Blockly.Events.enable();

    if (Blockly.DropDownDiv.isVisible()) {
        Blockly.DropDownDiv.hideWithoutAnimation();
    }
    
    if (should_trigger_event) {
        const event = new Blockly.Events.BlockChange(this.sourceBlock_, 'field', this.name, previous_value, this.getValue());
        event.recordUndo = false;
        event.group = group_type;
        Blockly.Events.fire(event);
        
    }
};
