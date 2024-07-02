import DBotStore from '../dbot-store';
import PendingPromise from '../../utils/pending-promise';

Blockly.Workspace.prototype.wait_events = [];
/**
 * Clear the undo/redo stacks.
 * deriv-bot: Sync undo/redo stack with our toolbar store.
 */
Blockly.Workspace.prototype.clearUndo = function () {
    this.undoStack_.length = 0;
    this.redoStack_.length = 0;

    const { toolbar } = DBotStore.instance;

    toolbar.setHasRedoStack();
    toolbar.setHasUndoStack();

    // Stop any events already in the firing queue from being undoable.
    Blockly.Events.clearPendingUndo();
};

/**
 * Fire a change event.
 * deriv-bot: Sync undo/redo stack with our toolbar store.
 * @param {!Blockly.Events.Abstract} event Event to fire.
 */
Blockly.Workspace.prototype.fireChangeListener = function (event) {
    if (event.recordUndo) {
        this.undoStack_.push(event);
        this.redoStack_.length = 0;

        if (this.undoStack_.length > this.MAX_UNDO) {
            this.undoStack_.unshift();
        }

        const { toolbar } = DBotStore.instance;

        toolbar.setHasRedoStack();
        toolbar.setHasUndoStack();
    }

    // Copy listeners in case a listener attaches/detaches itself.
    const current_listeners = this.listeners.slice();

    current_listeners.forEach(listener => {
        listener(event);
    });
    /**
     * Gets a trade definition block instance and returns it.
     * @returns {Blockly.Block|null} The trade definition or null.
     */
};

Blockly.Workspace.prototype.getTradeDefinitionBlock = function () {
    return this.getAllBlocks(true).find(b => b.type === 'trade_definition');
};

Blockly.Workspace.prototype.waitForBlockEvent = function (block_id, opt_event_type = null) {
    const event_promise = new PendingPromise();

    if (!this.wait_events.some(event => event.blockId === block_id && event.type === opt_event_type)) {
        this.wait_events.push({
            blockId: block_id,
            promise: event_promise,
            type: opt_event_type,
        });
    }

    return event_promise;
};

Blockly.Workspace.prototype.waitForBlockEvent = function (options) {
    const { block_type, event_type, timeout } = options;
    const promise = new PendingPromise();

    this.wait_events.push({ block_type, event_type, promise });

    if (timeout) {
        setTimeout(() => {
            if (promise.isPending) {
                promise.reject();
            }
        }, timeout);
    }

    return promise;
};

Blockly.Workspace.prototype.dispatchBlockEventEffects = function (event) {
    this.wait_events.forEach((wait_event, idx) => {
        if (!event.blockId) {
            return;
        }

        const block = this.getBlockById(event.blockId);

        if (block) {
            const is_same_block_type = wait_event.block_type === block.type;
            const is_same_event_type = wait_event.event_type === null || wait_event.event_type === event.type;

            if (is_same_block_type && is_same_event_type) {
                setTimeout(() => {
                    wait_event.promise.resolve();
                    this.wait_events.splice(idx, 1);
                }, 500);
            }
        }
    });
};

Blockly.Workspace.prototype.getAllFields = function (is_ordered) {
    return this.getAllBlocks(is_ordered).reduce((fields, block) => {
        block.inputList.forEach(input => fields.push(...input.fieldRow));
        return fields;
    }, []);
};

/* eslint-disble */
/**
 * Create a main workspace and add it to the SVG.
 * @param {!Element} svg SVG element with pattern defined.
 * @param {!Blockly.Options} options Dictionary of options.
 * @param {!Blockly.BlockDragSurfaceSvg} blockDragSurface Drag surface SVG
 *     for the blocks.
 * @param {!Blockly.WorkspaceDragSurfaceSvg} workspaceDragSurface Drag surface
 *     SVG for the workspace.
 * @return {!Blockly.Workspace} Newly created main workspace.
 * @private
 */

Blockly.createVirtualWorkspace_ = function (fragment, options, blockDragSurface, workspaceDragSurface) {
    options.parentWorkspace = null;
    const mainWorkspace = new Blockly.WorkspaceSvg(options, blockDragSurface, workspaceDragSurface);
    mainWorkspace.scale = options.zoomOptions.startScale;
    fragment.appendChild(mainWorkspace.createDom('blocklyMainBackground'));

    return mainWorkspace;
};
