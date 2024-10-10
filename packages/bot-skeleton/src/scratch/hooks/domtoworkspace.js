Blockly.Xml.domToWorkspace = async function (xml, workspace) {
    console.time('test domToWorkspace')
    console.log('1')
    let width = 0; // Not used in LTR.
    if (workspace.RTL) {
        width = workspace.getWidth();
    }
    const newBlockIds = []; // A list of block IDs added by this call.
    Blockly.utils.dom.startTextWidthCache();
    const eventUtils = Blockly.Events;
    console.log('2')
    const existingGroup = eventUtils.getGroup();
    if (!existingGroup) {
        eventUtils.setGroup(true);
    }

    // Disable workspace resizes as an optimization.
    // Assume it is rendered so we can check.
    if ((workspace).setResizesEnabled) {
        (workspace).setResizesEnabled(false);
    }
    console.log('3')
    let variablesFirst = true;
    try {
        for (let i = 0, xmlChild; (xmlChild = xml.childNodes[i]); i++) {


            console.log('test 4-0', i)
            const name = xmlChild.nodeName.toLowerCase();
            const xmlChildElement = xmlChild;


            if (
                name === 'block' ||
                (name === 'shadow' && !eventUtils.getRecordUndo())
            ) {

                console.log('test 4-1', i)
                // Allow top-level shadow blocks if recordUndo is disabled since
                // that means an undo is in progress.  Such a block is expected
                // to be moved to a nested destination in the next operation.
                const block = await Blockly.Xml.domToBlockInternal(xmlChildElement, workspace);


                console.log('4.1.1')
                newBlockIds.push(block.id);

                console.log('4.1.2')
                const blockX = parseInt(xmlChildElement.getAttribute('x') ?? '10', 10);


                console.log('4.1.3')
                const blockY = parseInt(xmlChildElement.getAttribute('y') ?? '10', 10);


                console.log('4.1.4')
                if (!isNaN(blockX) && !isNaN(blockY)) {
                    block.moveBy(workspace.RTL ? width - blockX : blockX, blockY, [
                        'create',
                    ]);
                }


                console.log('4.1.5')
                variablesFirst = false;

                console.log('4.1.6')
            } else if (name === 'shadow') {
                console.log('4.2')
                throw TypeError('Shadow block cannot be a top-level block.');
            } else if (name === 'comment') {
                console.log('4.3')
                if (workspace.rendered) {
                    Blockly.WorkspaceCommentSvg.fromXmlRendered(
                        xmlChildElement,
                        workspace,
                        width,
                    );
                } else {
                    Blockly.WorkspaceComment.fromXml(xmlChildElement, workspace);
                }
            } else if (name === 'variables') {
                console.log('4.4')
                if (variablesFirst) {
                    Blockly.Xml.domToVariables(xmlChildElement, workspace);
                } else {
                    throw Error(
                        "'variables' tag must exist once before block and " +
                        'shadow tag elements in the workspace XML, but it was found in ' +
                        'another location.',
                    );
                }
                variablesFirst = false;
            }
        }
        console.log('test 5')
    } finally {
        console.log('test 6')
        eventUtils.setGroup(existingGroup);
        if ((workspace).setResizesEnabled) {
            (workspace).setResizesEnabled(true);
        }
        if (workspace.rendered) Blockly.renderManagement.triggerQueuedRenders();
        Blockly.utils.dom.stopTextWidthCache();
    }
    // Re-enable workspace resizing.
    eventUtils.fire(new (eventUtils.get(eventUtils.FINISHED_LOADING))(workspace));
    console.log('test newBlockIds', newBlockIds)
    console.timeEnd('test domToWorkspace')
    return newBlockIds;
}

Blockly.Xml.mapSupportedXmlTags = function (xmlBlock) {
    const childNodeMap = {
        mutation: new Array(),
        comment: new Array(),
        data: new Array(),
        field: new Array(),
        input: new Array(),
        next: new Array(),
    };
    for (let i = 0; i < xmlBlock.children.length; i++) {
        const xmlChild = xmlBlock.children[i];
        if (xmlChild.nodeType === Blockly.utils.dom.NodeType.TEXT_NODE) {
            // Ignore any text at the <block> level.  It's all whitespace anyway.
            continue;
        }
        switch (xmlChild.nodeName.toLowerCase()) {
            case 'mutation':
                childNodeMap.mutation.push(xmlChild);
                break;
            case 'comment':
                childNodeMap.comment.push(xmlChild);
                break;
            case 'data':
                childNodeMap.data.push(xmlChild);
                break;
            case 'title':
            // Titles were renamed to field in December 2013.
            // Fall through.
            case 'field':
                childNodeMap.field.push(xmlChild);
                break;
            case 'value':
            case 'statement':
                childNodeMap.input.push(xmlChild);
                break;
            case 'next':
                childNodeMap.next.push(xmlChild);
                break;
            default:
                // Unknown tag; ignore.  Same principle as HTML parsers.
                console.warn('Ignoring unknown tag: ' + xmlChild.nodeName);
        }
    }
    return childNodeMap;
}

Blockly.Xml.applyMutationTagNodes = function (xmlChildren, block) {
    let shouldCallInitSvg = false;
    for (let i = 0; i < xmlChildren.length; i++) {
        const xmlChild = xmlChildren[i];
        // Custom data for an advanced block.
        if (block.domToMutation) {
            block.domToMutation(xmlChild);
            if ((block).initSvg) {
                // Mutation may have added some elements that need initializing.
                shouldCallInitSvg = true;
            }
        }
    }
    return shouldCallInitSvg;
}

Blockly.Xml.applyCommentTagNodes = function (xmlChildren, block) {
    console.log('1 applyCommentTagNodes')
    for (let i = 0; i < xmlChildren.length; i++) {
        const xmlChild = xmlChildren[i];
        const text = xmlChild.textContent;
        const pinned = xmlChild.getAttribute('pinned') === 'true';
        const width = parseInt(xmlChild.getAttribute('w') ?? '50', 10);
        const height = parseInt(xmlChild.getAttribute('h') ?? '50', 10);

        block.setCommentText(text);
        const comment = block.getIcon('comment');
        if (!isNaN(width) && !isNaN(height)) {
            comment.setBubbleSize(new Blockly.utils.Size(width, height));
        }
        // Set the pinned state of the bubble.
        comment.setBubbleVisible(pinned);
        // Actually show the bubble after the block has been rendered.
        setTimeout(() => comment.setBubbleVisible(pinned), 1);
    }
    console.log('2 applyCommentTagNodes')
}

Blockly.Xml.applyCommentTagNodes = function (xmlChildren, block) {
    for (let i = 0; i < xmlChildren.length; i++) {
        const xmlChild = xmlChildren[i];
        const text = xmlChild.textContent;
        const pinned = xmlChild.getAttribute('pinned') === 'true';
        const width = parseInt(xmlChild.getAttribute('w') ?? '50', 10);
        const height = parseInt(xmlChild.getAttribute('h') ?? '50', 10);

        block.setCommentText(text);
        const comment = block.getIcon('comment');
        if (!comment) return;
        if (!isNaN(width) && !isNaN(height)) {
            comment.setBubbleSize(new Blockly.utils.Size(width, height));
        }
        // Set the pinned state of the bubble.
        comment.setBubbleVisible(pinned);
        // Actually show the bubble after the block has been rendered.
        setTimeout(() => comment.setBubbleVisible(pinned), 1);
    }
}

Blockly.Xml.applyDataTagNodes = function (xmlChildren, block) {
    console.log('1 applyDataTagNodes')
    for (let i = 0; i < xmlChildren.length; i++) {
        const xmlChild = xmlChildren[i];
        block.data = xmlChild.textContent;
    }
    console.log('2 applyDataTagNodes')
}

Blockly.Xml.domToField = function (block, fieldName, xml) {
    const field = block.getField(fieldName);
    if (!field) {
        console.warn(
            'Ignoring non-existent field ' + fieldName + ' in block ' + block.type,
        );
        return;
    }
    field.fromXml(xml);
}

Blockly.Xml.applyFieldTagNodes = function (xmlChildren, block) {
    console.log('1 applyFieldTagNodes')
    for (let i = 0; i < xmlChildren.length; i++) {
        const xmlChild = xmlChildren[i];
        const nodeName = xmlChild.getAttribute('name');
        if (!nodeName) {
            console.warn(`Ignoring unnamed field in block ${block.type}`);
            continue;
        }
        Blockly.Xml.domToField(block, nodeName, xmlChild);
    }
    console.log('2 applyFieldTagNodes')
}

Blockly.Xml.isElement = function (node) {
    return node.nodeType === Blockly.utils.dom.NodeType.ELEMENT_NODE;
}

Blockly.Xml.findChildBlocks = function (xmlNode) {
    let childBlockElement = null;
    let childShadowElement = null;
    for (let i = 0; i < xmlNode.childNodes.length; i++) {
        const xmlChild = xmlNode.childNodes[i];
        if (Blockly.Xml.isElement(xmlChild)) {
            if (xmlChild.nodeName.toLowerCase() === 'block') {
                childBlockElement = xmlChild;
            } else if (xmlChild.nodeName.toLowerCase() === 'shadow') {
                childShadowElement = xmlChild;
            }
        }
    }
    return { childBlockElement, childShadowElement };
}

Blockly.Xml.applyInputTagNodes = function (
    xmlChildren,
    workspace,
    block,
    prototypeName,
) {
    console.log('first applyInputTagNodes')
    for (let i = 0; i < xmlChildren.length; i++) {
        const xmlChild = xmlChildren[i];
        const nodeName = xmlChild.getAttribute('name');
        const input = nodeName ? block.getInput(nodeName) : null;
        if (!input) {
            console.warn(
                'Ignoring non-existent input ' +
                nodeName +
                ' in block ' +
                prototypeName,
            );
            break;
        }
        const childBlockInfo = Blockly.Xml.findChildBlocks(xmlChild);
        if (childBlockInfo.childBlockElement) {
            if (!input.connection) {
                throw TypeError('Input connection does not exist.');
            }
            Blockly.Xml.domToBlockHeadless(
                childBlockInfo.childBlockElement,
                workspace,
                input.connection,
                false,
            );
        }
        // Set shadow after so we don't create a shadow we delete immediately.
        if (childBlockInfo.childShadowElement) {
            input.connection?.setShadowDom(childBlockInfo.childShadowElement);
        }
    }
    console.log('2 applyInputTagNodes')
}
Blockly.Xml.applyNextTagNodes = function (
    xmlChildren,
    workspace,
    block,
) {
    console.log('applyNextTagNodes 1')
    for (let i = 0; i < xmlChildren.length; i++) {
        const xmlChild = xmlChildren[i];
        const childBlockInfo = Blockly.Xml.findChildBlocks(xmlChild);
        if (childBlockInfo.childBlockElement) {
            if (!block.nextConnection) {
                throw TypeError('Next statement does not exist.');
            }
            // If there is more than one XML 'next' tag.
            if (block.nextConnection.isConnected()) {
                throw TypeError('Next statement is already connected.');
            }
            // Create child block.
            Blockly.Xml.domToBlockHeadless(
                childBlockInfo.childBlockElement,
                workspace,
                block.nextConnection,
                true,
            );
        }
        // Set shadow after so we don't create a shadow we delete immediately.
        if (childBlockInfo.childShadowElement && block.nextConnection) {
            block.nextConnection.setShadowDom(childBlockInfo.childShadowElement);
        }
    }
    console.log('applyNextTagNodes 2')
}

Blockly.Xml.domToBlockHeadless = function (
    xmlBlock,
    workspace,
    parentConnection,
    connectedToParentNext,
) {
    let block = null;
    const prototypeName = xmlBlock.getAttribute('type');
    if (!prototypeName) {
        throw TypeError('Block type unspecified: ' + xmlBlock.outerHTML);
    }
    const id = xmlBlock.getAttribute('id') ?? undefined;
    block = workspace.newBlock(prototypeName, id);

    // Preprocess childNodes so tags can be processed in a consistent order.
    const xmlChildNameMap = Blockly.Xml.mapSupportedXmlTags(xmlBlock);

    const shouldCallInitSvg = Blockly.Xml.applyMutationTagNodes(
        xmlChildNameMap.mutation,
        block,
    );
    Blockly.Xml.applyCommentTagNodes(xmlChildNameMap.comment, block);
    Blockly.Xml.applyDataTagNodes(xmlChildNameMap.data, block);

    // Connect parent after processing mutation and before setting fields.
    if (parentConnection) {
        if (connectedToParentNext) {
            if (block.previousConnection) {
                parentConnection.connect(block.previousConnection);
            } else {
                throw TypeError('Next block does not have previous statement.');
            }
        } else {
            if (block.outputConnection) {
                parentConnection.connect(block.outputConnection);
            } else if (block.previousConnection) {
                parentConnection.connect(block.previousConnection);
            } else {
                throw TypeError(
                    'Child block does not have output or previous statement.',
                );
            }
        }
    }

    Blockly.Xml.applyFieldTagNodes(xmlChildNameMap.field, block);
    Blockly.Xml.applyInputTagNodes(xmlChildNameMap.input, workspace, block, prototypeName);
    console.log('test applyNextTagNodes')
    Blockly.Xml.applyNextTagNodes(xmlChildNameMap.next, workspace, block);
    // setTimeout(() => {
    // }, 400)
    console.log('domtoHeadless 7')
    if (shouldCallInitSvg) {
        // This shouldn't even be called here
        // (ref: https://github.com/google/blockly/pull/4296#issuecomment-884226021
        // But the XML serializer/deserializer is iceboxed so I'm not going to fix
        // it.
        block.initSvg();
    }
    console.log('domtoHeadless 8')
    const inline = xmlBlock.getAttribute('inline');
    if (inline) {
        block.setInputsInline(inline === 'true');
    }
    console.log('domtoHeadless 9')
    const disabled = xmlBlock.getAttribute('disabled');
    if (disabled) {
        // Before May 2024 we just used 'disabled', with no reasons.
        // Contiune to support this syntax.
        block.setDisabledReason(
            disabled === 'true' || disabled === 'disabled',
            MANUALLY_DISABLED,
        );
    }
    const disabledReasons = xmlBlock.getAttribute('disabled-reasons');
    if (disabledReasons !== null) {
        for (const reason of disabledReasons.split(',')) {
            // Use decodeURIComponent to restore characters that were encoded in the
            // value, such as commas.
            block.setDisabledReason(true, decodeURIComponent(reason));
        }
    }
    const deletable = xmlBlock.getAttribute('deletable');
    if (deletable) {
        console.log('domtoHeadless 10')
        block.setDeletable(deletable === 'true');
    }
    const movable = xmlBlock.getAttribute('movable');
    if (movable) {
        console.log('domtoHeadless 11')
        block.setMovable(movable === 'true');
    }
    const editable = xmlBlock.getAttribute('editable');
    if (editable) {
        console.log('domtoHeadless 12')
        block.setEditable(editable === 'true');
    }
    const collapsed = xmlBlock.getAttribute('collapsed');
    if (collapsed) {
        console.log('domtoHeadless 14')
        block.setCollapsed(collapsed === 'true');
    }
    if (xmlBlock.nodeName.toLowerCase() === 'shadow') {
        // Ensure all children are also shadows.
        const children = block.getChildren(false);
        console.log('domtoHeadless 15')
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (!child.isShadow()) {
                throw TypeError('Shadow block not allowed non-shadow child.');
            }
        }
        console.log('domtoHeadless 16')
        block.setShadow(true);
    }
    return block;
}

/**
 * Decode an XML block tag and create a block (and possibly sub blocks) on the
 * workspace.
 *
 * This is defined internally so that it doesn't trigger an immediate render,
 * which we do want to happen for external calls.
 *
 * @param xmlBlock XML block element.
 * @param workspace The workspace.
 * @returns The root block created.
 * @internal
 */
Blockly.Xml.domToBlockInternal = async function (
    xmlBlock,
    workspace,
) {
    console.log('domToBlockInternal 1')
    return new Promise((resolve, reject) => {
        try {
            const eventUtils = Blockly.Events;
            // Create top-level block.
            eventUtils.disable();
            const variablesBeforeCreation = workspace.getAllVariables();
            let topBlock;
            console.log('domToBlockInternal 2')
            try {
                topBlock = Blockly.Xml.domToBlockHeadless(xmlBlock, workspace);
                console.log('domToBlockInternal 3')
                // Generate list of all blocks.
                if (workspace.rendered) {
                    const topBlockSvg = topBlock;
                    const blocks = topBlock.getDescendants(false);
                    topBlockSvg.setConnectionTracking(false);
                    console.log('domToBlockInternal 4')
                    // Render each block.
                    console.log('domToBlockInternal 5')
                    for (let i = blocks.length - 1; i >= 0; i--) {
                        (blocks[i]).initSvg();
                        (blocks[i]).queueRender();
                    }
                    // console.log('domToBlockInternal 6')
                    // for (let i = blocks.length - 1; i >= 0; i--) {
                    //     (blocks[i]).queueRender();
                    // }
                    // Populating the connection database may be deferred until after the
                    // blocks have rendered.
                    setTimeout(function () {
                        if (!topBlockSvg.disposed) {
                            console.log('domToBlockInternal 7')
                            topBlockSvg.setConnectionTracking(true);
                        }
                    }, 1);
                    // Allow the scrollbars to resize and move based on the new contents.
                    // TODO(@picklesrus): #387. Remove when domToBlock avoids resizing.
                    (workspace).resizeContents();
                    console.log('domToBlockInternal 8')
                } else {
                    const blocks = topBlock.getDescendants(false);
                    console.log('domToBlockInternal 9')
                    for (let i = blocks.length - 1; i >= 0; i--) {
                        console.log('domToBlockInternal 10')
                        blocks[i].initModel();
                    }
                }
            } finally {
                console.log('domToBlockInternal 11')
                eventUtils.enable();
            }
            if (eventUtils.isEnabled()) {
                console.log('domToBlockInternal 12')
                const newVariables = Blockly.Variables.getAddedVariables(
                    workspace,
                    variablesBeforeCreation,
                );
                // Fire a VarCreate event for each (if any) new variable created.
                for (let i = 0; i < newVariables.length; i++) {
                    console.log('domToBlockInternal 13')
                    const thisVariable = newVariables[i];
                    eventUtils.fire(
                        new (eventUtils.get(eventUtils.VAR_CREATE))(thisVariable),
                    );
                    console.log('domToBlockInternal 14')
                }
                // Block events come after var events, in case they refer to newly created
                // variables.
                console.log('domToBlockInternal 15')
                eventUtils.fire(new (eventUtils.get(eventUtils.CREATE))(topBlock));
                console.log('domToBlockInternal 16')
            }
            // setTimeout(() => {
            //     resolve(topBlock);
            // }, 0)
            resolve(topBlock);

        } catch (error) {
            reject(error);
        }
    });
}