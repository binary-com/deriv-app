import fileSaver from 'filesaverjs'
import { observer } from 'binary-common-utils/lib/observer'
import config from '../../../common/const'
import { translator } from '../../../common/translator'

let purchaseChoices = [[translator.translateText('Click to select'), '']]

export const isMainBlock = (blockType) => config.mainBlocks.indexOf(blockType) >= 0

const backwardCompatibility = (block) => {
  if (block.getAttribute('type') === 'on_strategy') {
    block.setAttribute('type', 'before_purchase')
  } else if (block.getAttribute('type') === 'on_finish') {
    block.setAttribute('type', 'after_purchase')
  }
  for (const statement of Array.prototype.slice.call(block.getElementsByTagName('statement'))) {
    if (statement.getAttribute('name') === 'STRATEGY_STACK') {
      statement.setAttribute('name', 'BEFOREPURCHASE_STACK')
    } else if (statement.getAttribute('name') === 'FINISH_STACK') {
      statement.setAttribute('name', 'AFTERPURCHASE_STACK')
    }
  }
  if (isMainBlock(block.getAttribute('type'))) {
    block.removeAttribute('deletable')
  }
}

const fixCollapsedBlocks = () => {
  for (const block of getCollapsedProcedures()) {
    block.setCollapsed(false)
    block.setCollapsed(true)
  }
}

const cleanUpOnLoad = (blocksToClean, dropEvent) => {
  const { clientX = 0, clientY = 0 } = dropEvent || {}
  const blocklyMetrics = Blockly.mainWorkspace.getMetrics()
  const scaleCancellation = (1 / Blockly.mainWorkspace.scale)
  const blocklyLeft = blocklyMetrics.absoluteLeft - blocklyMetrics.viewLeft
  const blocklyTop = (document.body.offsetHeight - blocklyMetrics.viewHeight) - blocklyMetrics.viewTop
  const cursorX = (clientX) ? (clientX - blocklyLeft) * scaleCancellation : 0
  let cursorY = (clientY) ? (clientY - blocklyTop) * scaleCancellation : 0
  for (const block of blocksToClean) {
    block.moveBy(cursorX, cursorY)
    block.snapToGrid()
    cursorY += block.getHeightWidth().height + Blockly.BlockSvg.MIN_BLOCK_Y
  }
  // Fire an event to allow scrollbars to resize.
  Blockly.mainWorkspace.resizeContents()
}

const getCollapsedProcedures = () => Blockly.mainWorkspace.getTopBlocks().filter(
  (block) => (!isMainBlock(block.type)
      && block.collapsed_ && block.type.indexOf('procedures_def') === 0))

export const deleteBlockIfExists = (block) => {
  Blockly.Events.recordUndo = false
  for (const mainBlock of Blockly.mainWorkspace.getTopBlocks()) {
    if (!block.isInFlyout && mainBlock.id !== block.id && mainBlock.type === block.type) {
      block.dispose()
      return true
    }
  }
  Blockly.Events.recordUndo = true
  return false
}

export const setBlockTextColor = (block) => {
  Blockly.Events.recordUndo = false
  const field = block.getField()
  if (field) {
    const svgElement = field.getSvgRoot()
    if (svgElement) {
      svgElement.style.setProperty('fill', 'white', 'important')
    }
  }
  Blockly.Events.recordUndo = true
}

export const configMainBlock = (ev, type) => {
  if (ev.type === 'create') {
    for (const blockId of ev.ids) {
      const block = Blockly.mainWorkspace.getBlockById(blockId)
      if (block) {
        if (block.type === type) {
          deleteBlockIfExists(block)
        }
      }
    }
  }
}

export const getBlockByType = (type) => {
  for (const block of Blockly.mainWorkspace.getAllBlocks()) {
    if (type === block.type) {
      return block
    }
  }
  return null
}

export const getMainBlocks = () => {
  const result = []
  for (const blockType of config.mainBlocks) {
    const block = getBlockByType(blockType)
    if (block) {
      result.push(block)
    }
  }
  return result
}

export const getBlocksByType = (type) => {
  const result = []
  for (const block of Blockly.mainWorkspace.getAllBlocks()) {
    if (type === block.type) {
      result.push(block)
    }
  }
  return result
}

export const getTopBlocksByType = (type) => {
  const result = []
  for (const block of Blockly.mainWorkspace.getTopBlocks()) {
    if (type === block.type) {
      result.push(block)
    }
  }
  return result
}

export const getPurchaseChoices = () => purchaseChoices

export const findTopParentBlock = (b) => {
  let block = b
  let pblock = block.parentBlock_
  if (pblock === null) {
    return null
  }
  while (pblock !== null) {
    if (pblock.type === 'trade') {
      return pblock
    }
    block = pblock
    pblock = block.parentBlock_
  }
  return block
}

export const insideMainBlocks = (block) => {
  const parent = findTopParentBlock(block)
  if (!parent) {
    return false
  }
  return parent.type && isMainBlock(parent.type)
}

export const updatePurchaseChoices = (contractType, oppositesName) => {
  purchaseChoices = config.opposites[oppositesName]
    .filter((k) => (contractType === 'both' ? true : contractType === Object.keys(k)[0]))
    .map((k) => [k[Object.keys(k)[0]], Object.keys(k)[0]])
  const purchases = Blockly.mainWorkspace.getAllBlocks()
    .filter((r) => (['purchase', 'payout', 'ask_price'].indexOf(r.type) >= 0))
  Blockly.Events.recordUndo = false
  for (const purchase of purchases) {
    const value = purchase.getField('PURCHASE_LIST')
      .getValue()
    Blockly.WidgetDiv.hideIfOwner(purchase.getField('PURCHASE_LIST'))
    if (value === purchaseChoices[0][1]) {
      purchase.getField('PURCHASE_LIST')
        .setText(purchaseChoices[0][0])
    } else if (purchaseChoices.length === 2 && value === purchaseChoices[1][1]) {
      purchase.getField('PURCHASE_LIST')
        .setText(purchaseChoices[1][0])
    } else {
      purchase.getField('PURCHASE_LIST')
        .setValue(purchaseChoices[0][1])
      purchase.getField('PURCHASE_LIST')
        .setText(purchaseChoices[0][0])
    }
  }
  Blockly.Events.recordUndo = true
}

export const save = (filename = 'binary-bot.xml', collection = false, xmlDom) => {
  xmlDom.setAttribute('collection', collection ? 'true' : 'false')
  const xmlText = Blockly.Xml.domToPrettyText(xmlDom)
  const blob = new Blob([xmlText], {
    type: 'text/xml;charset=utf-8',
  })
  fileSaver.saveAs(blob, `${filename}.xml`)
}

export const disable = (blockObj, message) => {
  if (!blockObj.disabled) {
    if (message) {
      observer.emit('ui.log.warn', message)
    }
  }
  Blockly.Events.recordUndo = false
  blockObj.setDisabled(true)
  Blockly.Events.recordUndo = true
}

export const enable = (blockObj) => {
  Blockly.Events.recordUndo = false
  blockObj.setDisabled(false)
  Blockly.Events.recordUndo = true
}

export const expandDuration = (duration) => `${duration.replace(/t/g, ' tick')
    .replace(/s/g, ' second')
    .replace(/m/g, ' minute')
    .replace(/h/g, ' hour')
    .replace(/d/g, ' day')}(s)`

export const durationToSecond = (duration) => {
  const parsedDuration = duration.match(/^([0-9]+)([stmhd])$/)
  if (!parsedDuration) {
    return null
  }
  const durationValue = parseFloat(parsedDuration[1])
  const durationType = parsedDuration[2]
  if (durationType === 's') {
    return durationValue
  }
  if (durationType === 't') {
    return durationValue * 2
  }
  if (durationType === 'm') {
    return durationValue * 60
  }
  if (durationType === 'h') {
    return durationValue * 60 * 60
  }
  if (durationType === 'd') {
    return durationValue * 60 * 60 * 24
  }
  return null
}

const isProcedure = (blockType) => ['procedures_defreturn', 'procedures_defnoreturn'].indexOf(blockType) >= 0

export const deleteBlocksLoadedBy = (id) => {
  Blockly.Events.recordUndo = false
  Blockly.Events.setGroup(true)
  for (const block of Blockly.mainWorkspace.getTopBlocks()) {
    if (block.loaderId === id) {
      if (isProcedure(block.type)) {
        if (block.getFieldValue('NAME').indexOf('deleted') < 0) {
          block.setFieldValue(`${block.getFieldValue('NAME')} (deleted)`, 'NAME')
          block.setDisabled(true)
        }
      } else {
        block.dispose()
      }
    }
  }
  Blockly.Events.setGroup(false)
  Blockly.Events.recordUndo = true
}

const addDomAsBlock = (blockXml) => {
  backwardCompatibility(blockXml)
  const blockType = blockXml.getAttribute('type')
  if (isMainBlock(blockType)) {
    for (const b of Blockly.mainWorkspace.getTopBlocks()) {
      if (b.type === blockType) {
        b.dispose()
      }
    }
  }
  return Blockly.Xml.domToBlock(blockXml, Blockly.mainWorkspace)
}

const addDomAsBlockFromHeader = (blockXml, header = null) => {
  Blockly.Events.recordUndo = false
  const oldVars = [...Blockly.mainWorkspace.variableList]
  const block = Blockly.Xml.domToBlock(blockXml, Blockly.mainWorkspace)
  Blockly.mainWorkspace.variableList = Blockly.mainWorkspace.variableList.filter((v) => {
    if (oldVars.indexOf(v) >= 0) {
      return true
    }
    header.loadedVariables.push(v)
    return false
  })
  if (isProcedure(block.type)) {
    const procedureName = block.getFieldValue('NAME')
    const oldProcedure = Blockly.Procedures.getDefinition(
      `${procedureName} (deleted)`, Blockly.mainWorkspace)
    if (oldProcedure) {
      const f = block.getField('NAME')
      f.text_ = `${procedureName} (deleted)`
      oldProcedure.dispose()
      block.setFieldValue(`${procedureName}`, 'NAME')
    }
  }
  block.getSvgRoot().style.display = 'none'
  block.loaderId = header.id
  header.loadedByMe.push(block.id)
  Blockly.Events.recordUndo = true
  return block
}

const processLoaders = (xml, header = null) => {
  const promises = []
  for (const block of Array.prototype.slice.call(xml.children)) {
    if (block.getAttribute('type') === 'loader') {
      block.remove()
      const loader = header ? addDomAsBlockFromHeader(block, header)
        : Blockly.Xml.domToBlock(block, Blockly.mainWorkspace)
      promises.push(loadRemote(loader)) // eslint-disable-line no-use-before-define
    }
  }
  return promises
}

const addLoadersFirst = (xml, header = null) => new Promise((resolve, reject) => {
  const promises = processLoaders(xml, header)
  if (promises.length) {
    Promise.all(promises).then(resolve, reject)
  } else {
    resolve([])
  }
})

const loadWorkspace = (xml) => {
  Blockly.mainWorkspace.clear()
  addLoadersFirst(xml).then(() => {
    for (const block of Array.prototype.slice.call(xml.children)) {
      backwardCompatibility(block)
    }
    Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace)
    observer.emit('ui.log.success',
      translator.translateText('Blocks are loaded successfully'))
    fixCollapsedBlocks()
  }, (e) => observer.emit('ui.log.error', e))
}

const loadBlocks = (xml, dropEvent = {}) => {
  addLoadersFirst(xml).then((loaders) => {
    const addedBlocks = [...loaders]
    for (const block of Array.prototype.slice.call(xml.children)) {
      const newBlock = addDomAsBlock(block)
      if (newBlock) {
        addedBlocks.push(newBlock)
      }
    }
    cleanUpOnLoad(addedBlocks, dropEvent)
    observer.emit('ui.log.success',
      translator.translateText('Blocks are loaded successfully'))
    fixCollapsedBlocks()
  }, (e) => observer.emit('ui.log.error', e))
}

export const load = (blockStr = '', dropEvent = {}) => {
  if (blockStr.indexOf('<xml') !== 0) {
    observer.emit('ui.log.error',
      translator.translateText('Unrecognized file format.'))
  } else {
    Blockly.Events.setGroup('load')
    try {
      const xml = Blockly.Xml.textToDom(blockStr)
      if (xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true') {
        loadBlocks(xml, dropEvent)
      } else {
        loadWorkspace(xml)
      }
    } catch (e) {
      if (e.name === 'BlocklyError') {
        // pass
      } else {
        observer.emit('ui.log.error',
          translator.translateText('Unrecognized file format.'))
      }
    }
    Blockly.Events.setGroup(false)
  }
}

const loadBlocksFromHeader = (blockStr = '', header) => new Promise((resolve, reject) => {
  Blockly.Events.setGroup('load')
  try {
    const xml = Blockly.Xml.textToDom(blockStr)
    if (xml.hasAttribute('collection') && xml.getAttribute('collection') === 'true') {
      addLoadersFirst(xml, header).then(() => {
        for (const block of Array.prototype.slice.call(xml.children)) {
          if (['tick_analysis',
            'timeout',
            'interval'].indexOf(block.getAttribute('type')) >= 0 ||
            isProcedure(block.getAttribute('type'))) {
              addDomAsBlockFromHeader(block, header)
            }
        }
        resolve()
      }, reject)
    } else {
      reject(translator.translateText('Remote blocks to load must be a collection.'))
    }
  } catch (e) {
    if (e.name === 'BlocklyError') {
      // pass
    } else {
      reject(translator.translateText('Unrecognized file format.'))
    }
  }
  Blockly.Events.setGroup(false)
})

export const loadRemote = (blockObj) => new Promise((resolve, reject) => {
  let url = blockObj.getFieldValue('URL');
  if (url.indexOf('http') !== 0) {
    url = `http://${url}`
  }
  if (!url.match(/[^/]*\.[a-zA-Z]{3}$/) && url.slice(-1)[0] !== '/') {
    reject(translator.translateText('Target must be an xml file'))
  } else {
    if (url.slice(-1)[0] === '/') {
      url += 'index.xml'
    }
    let isNew = true
    for (const block of getTopBlocksByType('loader')) {
      if (block.id !== blockObj.id && block.url === url) {
        isNew = false
      }
    }
    if (!isNew) {
      disable(blockObj)
      reject(translator.translateText('This url is already loaded'))
    } else {
      $.ajax({
        type: 'GET',
        url,
      }).error((e) => {
        if (e.status) {
          reject(`${translator.translateText('An error occurred while trying to load the url')}: ${e.status} ${e.statusText}`)
        } else {
          reject(translator.translateText('Make sure \'Access-Control-Allow-Origin\' exists in the response from the server'))
        }
        deleteBlocksLoadedBy(blockObj.id)
      }).done((xml) => {
        loadBlocksFromHeader(xml, blockObj).then(() => {
          enable(blockObj)
          blockObj.url = url // eslint-disable-line no-param-reassign
          resolve(blockObj)
        }, (e) => {
          reject(e)
        })
      })
    }
  }
})
