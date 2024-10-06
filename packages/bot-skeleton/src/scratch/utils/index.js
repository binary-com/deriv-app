import { localize } from '@deriv/translations';
import { saveAs } from '../shared';
import BlockConversion from '../backward-compatibility';
import { config } from '../../constants/config';
import { observer as globalObserver } from '../../utils/observer';
import { removeLimitedBlocks } from '../../utils/workspace';
import { saveWorkspaceToRecent } from '../../utils/local-storage';
import DBotStore from '../dbot-store';
import { LogTypes } from '../../constants/messages';
import { error_message_map } from '../../utils/error-config';
import { botNotification } from '../../../../bot-web-ui/src/components/bot-notification/bot-notification';
import { notification_message } from '../../../../bot-web-ui/src/components/bot-notification/bot-notification-utils';

export const inject_workspace_options = {
    media: `${__webpack_public_path__}media/`,
    zoom: {
        wheel: true,
        startScale: config.workspaces.previewWorkspaceStartScale,
    },
    readOnly: true,
    scrollbars: true,
    renderer: 'zelos',
};

export const updateXmlValues = blockly_options => {
    if (!window.Blockly) return;
    const { strategy_id, convertedDom, file_name, from, block_string } = blockly_options;
    window.Blockly.xmlValues = {
        ...window.Blockly.xmlValues,
        strategy_id,
        convertedDom,
        file_name,
        from,
        block_string,
    };
};

export const getSelectedTradeType = (workspace = Blockly.derivWorkspace) => {
    const trade_type_block = workspace.getAllBlocks(true).find(block => block.type === 'trade_definition_tradetype');
    const selected_trade_type = trade_type_block?.getFieldValue('TRADETYPE_LIST');
    let mandatory_tradeoptions_block = 'trade_definition_tradeoptions';
    if (selected_trade_type === 'multiplier') mandatory_tradeoptions_block = 'trade_definition_multiplier';
    if (selected_trade_type === 'accumulator') mandatory_tradeoptions_block = 'trade_definition_accumulator';
    return mandatory_tradeoptions_block;
};

export const matchTranslateAttribute = translateString => {
    const match = translateString.match(/translate\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)/);
    if (match && match.length > 2) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        return { x, y };
    }
    return null; // Invalid or no match
};

export const extractTranslateValues = () => {
    const transform_value = Blockly?.derivWorkspace?.trashcan?.svgGroup.getAttribute('transform');
    const translate_xy = matchTranslateAttribute(transform_value);

    if (!translate_xy) {
        globalObserver.emit('Error', 'Invalid String');
    }

    return {
        translate_X: translate_xy.x,
        translate_Y: translate_xy.y,
    };
};

export const validateErrorOnBlockDelete = () => {
    // Get the bounding rectangle of the selected block
    const { translate_X, translate_Y } = extractTranslateValues();
    const blockRect = Blockly.getSelected()?.getSvgRoot().getBoundingClientRect();
    const translate_offset = 200;
    // Extract coordinates from the bounding rectangles
    const blockX = blockRect?.left || 0;
    const blockY = blockRect?.top || 0;
    const mandatory_trade_option_block = getSelectedTradeType();
    const required_block_types = [mandatory_trade_option_block, 'trade_definition', 'purchase', 'before_purchase'];
    if (required_block_types?.includes(Blockly?.getSelected()?.type)) {
        if (
            blockY >= translate_Y - translate_offset &&
            blockY <= translate_Y + translate_offset &&
            blockX >= translate_X - translate_offset &&
            blockX <= translate_X + translate_offset
        ) {
            globalObserver.emit('ui.log.error', error_message_map[Blockly?.getSelected()?.type]?.default);
        }
    }
};

export const updateWorkspaceName = () => {
    if (!DBotStore?.instance) return;
    const { load_modal } = DBotStore.instance;
    const file_name = load_modal?.dashboard_strategies?.[0]?.name ?? config.default_file_name;
    if (document.title.indexOf('-') > -1) {
        const string_to_replace = document.title.substr(document.title.indexOf('-'));
        const new_document_title = document.title.replace(string_to_replace, `- ${file_name}`);

        document.title = new_document_title;
    } else {
        document.title += ` - ${file_name}`;
    }
};

export const isMainBlock = block_type => config.mainBlocks.indexOf(block_type) >= 0;

export const oppositesToDropdownOptions = opposite_name => {
    return opposite_name.map(contract_type => {
        // i.e. [['CALL', localize('Rise')]] becomes [[localize('Rise'), 'CALL']];
        return Object.entries(contract_type)[0].reverse();
    });
};

export const cleanUpOnLoad = (blocks_to_clean, drop_event, workspace) => {
    const { clientX = 0, clientY = 0 } = drop_event || {};
    const toolbar_height = 76;
    const blockly_metrics = workspace.getMetrics();
    const scale_cancellation = 1 / workspace.scale;
    const blockly_left = blockly_metrics.absoluteLeft - blockly_metrics.viewLeft;
    const blockly_top = document.body.offsetHeight - blockly_metrics.viewHeight - blockly_metrics.viewTop;
    const cursor_x = clientX ? (clientX - blockly_left) * scale_cancellation : 0;
    const cursor_y = clientY ? (clientY - blockly_top - toolbar_height) * scale_cancellation : 0;

    workspace.cleanUp(cursor_x, cursor_y, blocks_to_clean);
};

export const save = (filename = '@deriv/bot', collection = false, xmlDom) => {
    xmlDom.setAttribute('is_dbot', 'true');
    xmlDom.setAttribute('collection', collection ? 'true' : 'false');

    const data = Blockly.Xml.domToPrettyText(xmlDom);
    saveAs({ data, type: 'text/xml;charset=utf-8', filename: `${filename}.xml` });
};

const delayExecution = ms => new Promise(resolve => setTimeout(resolve, ms));

export const load = async ({
    block_string,
    drop_event,
    file_name,
    strategy_id,
    from,
    workspace,
    showIncompatibleStrategyDialog,
}) => {
    if (!DBotStore?.instance || !workspace) return;
    const { setLoading, load_modal } = DBotStore.instance;
    const { setOpenButtonDisabled, setLoadedLocalFile } = load_modal;

    setLoading(true);
    // Delay execution to allow fully previewing previous strategy if users quickly switch between strategies.
    await delayExecution(100);
    const showInvalidStrategyError = () => {
        setLoadedLocalFile(null);
        botNotification(notification_message.invalid_xml);
        setLoading(false);
        const error_message = localize('XML file contains unsupported elements. Please check or modify file.');
        globalObserver.emit('ui.log.error', error_message);
        return {
            error: error_message,
        };
    };

    // Check if XML can be parsed correctly.
    try {
        const xmlDoc = new DOMParser().parseFromString(block_string, 'application/xml');
        if (xmlDoc.getElementsByTagName('parsererror').length) {
            return showInvalidStrategyError();
        }
    } catch (e) {
        return showInvalidStrategyError();
    }

    let xml;
    // Check if XML can be parsed into a strategy.
    try {
        xml = Blockly.utils.xml.textToDom(block_string);
    } catch (e) {
        return showInvalidStrategyError();
    }

    const blockConversion = new BlockConversion();
    xml = blockConversion.convertStrategy(xml, showIncompatibleStrategyDialog);
    const blockly_xml = xml.querySelectorAll('block');

    // Check if there are any blocks in this strategy.
    if (!blockly_xml.length) {
        return showInvalidStrategyError();
    }

    // Check if all block types in XML are allowed.
    const has_invalid_blocks = Array.from(blockly_xml).some(block => {
        const block_type = block.getAttribute('type');
        return !Object.keys(Blockly.Blocks).includes(block_type);
    });

    if (has_invalid_blocks) {
        return showInvalidStrategyError();
    }

    try {
        const is_collection = xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true';
        const event_group = is_collection ? `load_collection${Date.now()}` : `dbot-load${Date.now()}`;

        Blockly.Events.setGroup(event_group);
        removeLimitedBlocks(
            workspace,
            Array.from(blockly_xml).map(xml_block => xml_block.getAttribute('type'))
        );
        updateXmlValues({ strategy_id, convertedDom: xml, file_name, from, block_string });
        if (is_collection) {
            loadBlocks(xml, drop_event, event_group, workspace);
        } else {
            await loadWorkspace(xml, event_group, workspace);

            const is_main_workspace = workspace === Blockly.derivWorkspace;
            if (is_main_workspace) {
                const { save_modal } = DBotStore.instance;

                save_modal.updateBotName(file_name);
                workspace.clearUndo();
                workspace.current_strategy_id = strategy_id || Blockly.utils.idGenerator.genUid();
                await saveWorkspaceToRecent(xml, from);
            }
        }

        // Set user disabled state on all disabled blocks. This ensures we don't change the disabled
        // state through code, which was implemented for user experience.
        workspace.getAllBlocks().forEach(block => {
            if (block.disabled) {
                block.is_user_disabled_state = true;
            }
        });

        if (workspace === Blockly.derivWorkspace) {
            globalObserver.emit('ui.log.success', { log_type: LogTypes.LOAD_BLOCK });
        }
    } catch (e) {
        console.error(e); // eslint-disable-line
        return showInvalidStrategyError();
    } finally {
        setLoading(false);
        setOpenButtonDisabled(false);
    }
};

export const loadBlocks = (xml, drop_event, event_group, workspace) => {
    Blockly.Events.setGroup(event_group);

    const block_ids = Blockly.Xml.domToWorkspace(xml, workspace);
    const added_blocks = block_ids.map(block_id => workspace.getBlockById(block_id));

    if (drop_event && Object.keys(drop_event).length !== 0) {
        cleanUpOnLoad(added_blocks, drop_event, workspace);
    } else {
        workspace.cleanUp();
    }
};

export const loadWorkspace = async (xml, event_group, workspace) => {
    Blockly.Events.setGroup(event_group);
    await workspace.asyncClear();
    Blockly.Xml.domToWorkspace(xml, workspace);
    workspace.cleanUp();
};

const loadBlocksFromHeader = (xml_string, block) => {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
        let xml;

        try {
            xml = Blockly.utils.xml.textToDom(xml_string);
        } catch (error) {
            return reject(localize('Unrecognized file format'));
        }

        try {
            const is_collection = xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true';

            if (!is_collection) {
                reject(localize('Remote blocks to load must be a collection.'));
            }

            addLoaderBlocksFirst(xml)
                .then(() => {
                    Array.from(xml.children).forEach(el_block => addDomAsBlock(el_block, block));
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        } catch (e) {
            reject(localize('Unable to load the block file.'));
        }
    });
};

export const loadBlocksFromRemote = block => {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
        let url = block.getFieldValue('URL');

        if (url.indexOf('http') === -1) {
            url = `http://${url}`;
        }

        const url_pattern = /[^/]*\.[a-zA-Z]{3}$/;
        const has_possible_missing_index_xml = url.slice(-1)[0] === '/';

        if (!url.match(url_pattern) && !has_possible_missing_index_xml) {
            return reject(localize('Target must be an XML file'));
        }

        if (has_possible_missing_index_xml) {
            url += 'index.xml';
        }

        if (block.isKnownUrl(url)) {
            block.setDisabled(true);
            return reject(localize('This URL is already loaded'));
        }

        const onFetchError = () => reject(localize('An error occured while trying to load the URL'));

        fetch(url)
            .then(response => {
                if (response.ok) {
                    response.text().then(xml_string => {
                        loadBlocksFromHeader(xml_string, block)
                            .then(() => resolve(block))
                            .catch(onFetchError);
                    });
                } else {
                    onFetchError();
                }
            })
            .catch(onFetchError);
    });
};

export const addLoaderBlocksFirst = xml => {
    return new Promise((resolve, reject) => {
        const promises = [];

        Array.from(xml.children).forEach(el_block => {
            const block_type = el_block.getAttribute('type');

            if (block_type === 'loader') {
                el_block.remove();
                const loader = Blockly.Xml.domToBlock(el_block, Blockly.derivWorkspace);
                promises.push(loadBlocksFromRemote(loader)); // eslint-disable-line no-use-before-define
            }
        });

        if (promises.length) {
            Promise.all(promises).then(resolve, reject);
        } else {
            resolve([]);
        }
    });
};

export const addDomAsBlock = (el_block, parent_block = null) => {
    if (el_block.tagName.toLowerCase() === 'variables') {
        return Blockly.Xml.domToVariables(el_block, Blockly.derivWorkspace);
    }

    const block_type = el_block.getAttribute('type');
    const block_conversion = new BlockConversion();
    const block_xml = Blockly.Xml.blockToDom(block_conversion.convertBlockNode(el_block));

    // Fix legacy Blockly `varid` attribute.
    Array.from(block_xml.getElementsByTagName('arg')).forEach(el => {
        if (el.hasAttribute('varid')) {
            el.setAttribute('varId', el.getAttribute('varid'));
        }
    });

    removeLimitedBlocks(Blockly.derivWorkspace, block_type);

    const block = Blockly.Xml.domToBlock(block_xml, Blockly.derivWorkspace);

    if (parent_block) {
        parent_block.blocks_added_by_me.push(block);
    }

    return block;
};

const getAllRequiredBlocks = (workspace, required_block_types) => {
    return workspace.getAllBlocks().filter(block => {
        if (required_block_types.includes(block.type)) {
            return (
                (block.childBlocks_.length === 0 && required_block_types.includes(block.category_)) ||
                block.parentBlock_ === null
            );
        }
    });
};

const getMissingBlocks = (workspace, required_block_types) => {
    return required_block_types.filter(blockType => {
        return !workspace.getAllBlocks().some(block => block.type === blockType);
    });
};

const getDisabledBlocks = required_blocks_check => {
    return required_blocks_check.filter(block => {
        const hasDisabledChild =
            block.childBlocks_ && block.childBlocks_.some(childBlock => childBlock.disabled === true);
        return block.disabled === true || hasDisabledChild;
    });
};

const throwNewErrorMessage = (error_blocks, key) => {
    return error_blocks.forEach(block => {
        if (key === 'misplaced' && block) globalObserver.emit('ui.log.error', error_message_map[block?.type]?.[key]);
        else if (key === 'missing' && block) globalObserver.emit('ui.log.error', error_message_map[block]?.[key]);
        else if (key === 'disabled' && block) {
            let parent_block_error = false;
            const parent_error_message = error_message_map[block.type]?.[key];
            if (block.disabled && parent_error_message) {
                globalObserver.emit('ui.log.error', parent_error_message);
                parent_block_error = true;
            } else if (!parent_block_error && block.childBlocks_) {
                block.childBlocks_.forEach(childBlock => {
                    const child_error_message = error_message_map[childBlock.type]?.[key];
                    if (child_error_message) globalObserver.emit('ui.log.error', child_error_message);
                });
            }
        }
    });
};

export const isAllRequiredBlocksEnabled = workspace => {
    if (!workspace) return false;

    const mandatory_trade_option_block = getSelectedTradeType(workspace);
    const { mandatoryMainBlocks } = config;
    const required_block_types = [mandatory_trade_option_block, ...mandatoryMainBlocks];

    const required_blocks_check = getAllRequiredBlocks(workspace, required_block_types);

    const missing_blocks = getMissingBlocks(workspace, required_block_types);
    const disabled_blocks = getDisabledBlocks(required_blocks_check);

    if (missing_blocks) throwNewErrorMessage(missing_blocks, 'missing');
    if (disabled_blocks) throwNewErrorMessage(disabled_blocks, 'disabled');

    const error_blocks = [...missing_blocks, ...disabled_blocks];
    const blocks_required = error_blocks.length === 0;

    return blocks_required;
};

export const scrollWorkspace = (workspace, scroll_amount, is_horizontal, is_chronological) => {
    const ws_metrics = workspace.getMetrics();
    let scroll_x = ws_metrics.viewLeft - ws_metrics.scrollLeft;
    const delta_y = ws_metrics.viewTop - ws_metrics.scrollTop;
    let scroll_y = delta_y;
    if (is_horizontal) {
        scroll_x += is_chronological ? scroll_amount : -scroll_amount;
        if (!DBotStore.instance.is_mobile) {
            scroll_y += -20;
        }
    } else {
        scroll_x += -20;
        scroll_y += is_chronological ? scroll_amount : -scroll_amount;
    }
    const is_RTL = workspace.RTL;
    if (is_RTL) {
        // For RTL scroll we need to adjust the scroll amount
        scroll_x = scroll_amount;
        // Adjust scroll_y to prevent scrolling vertically on every render
        const toolbox_top = document.getElementById('gtm-toolbox')?.getBoundingClientRect()?.top;
        const block_canvas_rect_top = workspace.svgBlockCanvas_?.getBoundingClientRect()?.top;
        if (block_canvas_rect_top > toolbox_top) {
            scroll_y = delta_y;
        }

        /* NOTE: This was done for mobile view since 
        when we try to calculate the scroll amount for RTL,
        we need to realign the scroll to(0, 0) for the workspace.
        Then, from the width of the canvas, we need to subtract the width of the block. 
        To Make the block visible in the view width
        */

        if (window.innerWidth < 768) {
            workspace?.scrollbar?.set(0, scroll_y);
            const calc_scroll =
                workspace.svgBlockCanvas_?.getBoundingClientRect().width -
                workspace.svgBlockCanvas_?.getBoundingClientRect().left +
                60;
            workspace?.scrollbar?.set(calc_scroll, scroll_y);
            return;
        }
    }
    workspace?.scrollbar?.set(scroll_x, scroll_y);
};

/**
 * Sets the Blockly.Events.group_ and executes the passed callBackFn. Mainly
 * used to ensure undo/redo actions are executed correctly.
 * @param {Boolean} use_existing_group Uses the existing event group if true.
 * @param {Function} callbackFn Logic to execute as part of this event group.
 */
export const runGroupedEvents = (use_existing_group, callbackFn, opt_group_name) => {
    const group = (use_existing_group && Blockly.Events.getGroup()) || opt_group_name || true;

    Blockly.Events.setGroup(group);
    callbackFn();

    if (!use_existing_group) {
        Blockly.Events.setGroup(false);
    }
};

/**
 * Sets the recordUndo flag to "false" globally, this will ensure any events
 * happening as part of the callbackFn logic cannot be undone.
 * @param {*} callbackFn Logic to execute as part of this event group.
 */
export const runIrreversibleEvents = callbackFn => {
    const { recordUndo } = Blockly.Events;
    Blockly.Events.setRecordUndo(false);

    callbackFn();

    Blockly.Events.setRecordUndo(recordUndo ?? true);
};

/**
 * Disables Blockly Events globally and runs the passed callbackFn.
 * (Preference should be given to runIrreversibleEvents).
 * @param {*} callbackFn Logic to completely hide from Blockly
 */
export const runInvisibleEvents = callbackFn => {
    Blockly.Events.disable();
    callbackFn();
    Blockly.Events.enable();
};

export const updateDisabledBlocks = (workspace, event) => {
    if (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) {
        workspace.getAllBlocks().forEach(block => {
            if (!block.getParent() || block.is_user_disabled_state) {
                return;
            }

            const restricted_parents = block.restricted_parents || [];
            if (restricted_parents.length === 0) {
                return;
            }

            const should_disable = !restricted_parents.some(restricted_parent =>
                block.isDescendantOf(restricted_parent)
            );

            runGroupedEvents(
                true,
                () => {
                    block.setDisabled(should_disable);
                },
                event.group
            );

            Blockly.Events.setGroup(false);
        });
    }
};

export const emptyTextValidator = input => {
    return !input || input === "''";
};

/* eslint-disable no-bitwise */
export const isDarkRgbColour = string_rgb => {
    const values = string_rgb.substring(1);
    const rgb = parseInt(values, 16);
    const red = (rgb >> 16) & 0xff;
    const green = (rgb >> 8) & 0xff;
    const blue = (rgb >> 0) & 0xff;
    const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    return luma < 160;
};
/* eslint-enable */

export const appendCollapsedMainBlocksFields = block_instance => {
    try {
        // Return if the block is not collapsed
        if (!block_instance?.collapsed_) return;
        const type_of_block = block_instance?.getField(block_instance.type);
        if (type_of_block) return;

        const [block_image, block_name] = block_instance?.inputList[0]?.fieldRow.map(field => field.value_);
        const collapsed_field = block_instance?.getField(Blockly.constants.COLLAPSED_FIELD_NAME);
        const collapsed_input = block_instance?.getInput(Blockly.constants.COLLAPSED_INPUT_NAME);

        // Initialize the icon_added property if not already done
        if (collapsed_input && collapsed_field) {
            // Add the image and label fields
            collapsed_input.appendField(new Blockly.FieldImage(block_image, 25, 25, '', ''));
            collapsed_input.appendField(new Blockly.FieldLabel(block_name, 'blocklyTextRootBlockHeaderCollapsed'));

            // Add the dropdown icon
            const dropdown_path = `${block_instance?.workspace.options.pathToMedia}dropdown-arrow.svg`;
            const field_expand_icon = new Blockly.FieldImage(dropdown_path, 16, 16, localize('Collapsed'), () =>
                block_instance?.setCollapsed(false)
            );
            collapsed_input.appendField(field_expand_icon, block_instance.type);
            collapsed_input.sourceBlock.width = 300;
            // hide the default collapsed field generated by Blockly
            collapsed_field.setVisible(false);
        }
    } catch (e) {
        globalObserver.emit('ui.log.error', e);
    }
};

export const appendCollapsedProcedureBlocksFields = instance => {
    const collapsed_input = instance.getInput('_TEMP_COLLAPSED_INPUT');
    if (collapsed_input && instance.collapsed_ && !collapsed_input.icon_added) {
        collapsed_input.icon_added = true;
        const dropdown_path = `${instance.workspace.options.pathToMedia}dropdown-arrow.svg`;
        const field_expand_icon = new Blockly.FieldImage(dropdown_path, 16, 16, localize('Collapsed'), () =>
            instance.setCollapsed(false)
        );
        const function_name = instance.getFieldValue('NAME');
        const args = ` (${instance?.arguments?.join(', ')})`;

        collapsed_input
            .appendField(new Blockly.FieldLabel(localize('function'), ''))
            .appendField(new Blockly.FieldLabel(function_name + args, 'header__title'))
            .appendField(field_expand_icon);

        const remove_last_input = dummy_input => {
            const tmp_array = dummy_input.fieldRow;
            tmp_array[0]?.setVisible(false);
            tmp_array[0]?.forceRerender();
        };
        remove_last_input(collapsed_input);
    }
};

const downloadBlock = () => {
    const xml_block = Blockly?.getSelected()?.svgGroup_;
    const xml_text = Blockly.Xml.domToPrettyText(xml_block);
    saveAs({ data: xml_text, type: 'text/xml;charset=utf-8', filename: 'block.xml' });
};

const download_option = {
    text: localize('Download Block'),
    enabled: true,
    callback: downloadBlock,
};

export const excludeOptionFromContextMenu = (menu, exclude_items) => {
    for (let i = 0; i <= menu.length - 1; i++) {
        const menu_text = localize(menu[i].text);
        if (exclude_items.includes(menu_text)) {
            menu.splice(i, 1);
        } else {
            menu[i].text = menu_text;
        }
    }
};

const common_included_items = [download_option];

const all_context_menu_options = [
    localize('Duplicate'),
    localize('Add Comment'),
    localize('Remove Comment'),
    localize('Collapse Block'),
    localize('Expand Block'),
    localize('Disable Block'),
    localize('Enable Block'),
    localize('Download Block'),
];

// Need for later
// const deleteLocaleText = localize("Delete");
// const blocksLocaleText = localize("Blocks");
// const deleteBlocksLocaleText = localize("Delete Blocks");
// const deleteBlocksLocalePattern = new RegExp(`^${deleteLocaleText} \\d+ ${blocksLocaleText}$`);

export const modifyContextMenu = (menu, add_new_items = []) => {
    const include_items = [...common_included_items, ...add_new_items];
    include_items.forEach(item => {
        menu.push({
            text: item.text,
            enabled: item.enabled,
            callback: item.callback,
        });
    });

    for (let i = 0; i < menu.length; i++) {
        const localized_text = localize(menu[i].text);
        if (all_context_menu_options.includes(localized_text)) {
            menu[i].text = localized_text;
        }
    }
};

export const evaluateExpression = value => {
    if (!value) return 'invalid_input';
    try {
        // eslint-disable-next-line no-new-func
        const result = new Function(`return ${value.trim()}`)();
        return isNaN(result) ? 'invalid_input' : result;
    } catch (e) {
        return 'invalid_input';
    }
};
