import {
  ArrowNodeStyle,
  ArrowStyleShape,
  ArrowStyleShapeStringValues,
  Color,
  CssFill,
  FillConvertible,
  GraphComponent,
  INode,
  ShapeNodeShape,
  ShapeNodeShapeStringValues,
  ShapeNodeStyle,
} from '@yfiles/yfiles'
import {
  ArrowNodeStyleConfiguration,
  ShapeNodeStyleConfiguration,
  StyleConfiguration,
} from './style-configuration'

type NodeStyle = 'ShapeNodeStyle' | 'ArrowNodeStyle'

let currentStyle: NodeStyle = 'ShapeNodeStyle'
const defaultShapeNodeStyle = {
  shape: ShapeNodeShape.RECTANGLE,
  fill: '#FFFFFF',
}
const defaultArrowNodeStyle = {
  shape: ArrowStyleShape.ARROW,
  fill: '#FFFFFF',
}
let propertyState: NonNullable<StyleConfiguration> = defaultShapeNodeStyle

let shapeDropdownElement: HTMLSelectElement
let colorPickerElement: HTMLInputElement

let styleDropdownElement = document.querySelector(
  '#style-select',
) as HTMLSelectElement
const container = document.querySelector('.input-container') as HTMLElement

export default function setupPropertyPanel(graphComponent: GraphComponent) {
  createPanelForShapeNodeStyle(container, graphComponent)

  graphComponent.selection.addEventListener('item-added', (evt) => {
    const nodeStyle = (evt.item as INode).style

    if (nodeStyle instanceof ShapeNodeStyle) {
      currentStyle = 'ShapeNodeStyle'
      propertyState.shape = ShapeNodeShape.getName(
        nodeStyle.shape,
      ) as ShapeNodeShapeStringValues
    } else if (nodeStyle instanceof ArrowNodeStyle) {
      currentStyle = 'ArrowNodeStyle'
      propertyState.shape = ArrowStyleShape.getName(
        nodeStyle.shape,
      ) as ArrowStyleShapeStringValues
    }

    let fillColor = '#ffffff'
    const fill = (nodeStyle as ArrowNodeStyle | ShapeNodeStyle).fill
    if (fill instanceof Color) {
      fillColor = `#${toHex(fill.r)}${toHex(fill.g)}${toHex(fill.b)}`
    } else if (fill instanceof CssFill) {
      fillColor = fill.value
    }
    propertyState.fill = fillColor

    styleDropdownElement.value = currentStyle
    updateUI(currentStyle, graphComponent)
  })

  styleDropdownElement.addEventListener('change', () => {
    const firstElement = graphComponent.selection.first()
    if (firstElement) {
      const nodeStyle = styleDropdownElement.value as NodeStyle
      propertyState =
        nodeStyle === 'ShapeNodeStyle'
          ? defaultShapeNodeStyle
          : defaultArrowNodeStyle
      updateUI(nodeStyle, graphComponent)
      updateSelectedNodeStyle(graphComponent)
    }
  })
}

function updateUI(nodeStyle: NodeStyle, graphComponent: GraphComponent) {
  currentStyle = nodeStyle

  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }

  if (currentStyle === 'ShapeNodeStyle') {
    createPanelForShapeNodeStyle(container, graphComponent)
  } else {
    createPanelForArrowNodeStyle(container, graphComponent)
  }
}

function createPanelForShapeNodeStyle(
  parent: HTMLElement,
  graphComponent: GraphComponent,
) {
  shapeDropdownElement = document.createElement('select')
  shapeDropdownElement.setAttribute('id', 'shape-dropdown')
  const labelShapeSelect = document.createElement('label')
  labelShapeSelect.setAttribute('for', 'shape-dropdown')
  labelShapeSelect.textContent = 'Choose your favorite shape'

  colorPickerElement = document.createElement('input')
  colorPickerElement.setAttribute('id', 'fill-input')
  colorPickerElement.setAttribute('type', 'color')
  const labelFillInput = document.createElement('label')
  labelFillInput.setAttribute('for', 'fill-input')
  labelFillInput.textContent = 'Choose your favorite fill color'

  parent.appendChild(labelShapeSelect)
  parent.appendChild(shapeDropdownElement)
  parent.appendChild(labelFillInput)
  parent.appendChild(colorPickerElement)

  const shapes = Object.keys(ShapeNodeShape)
  shapes.forEach((shape) => {
    const optionElement = document.createElement('option')
    shapeDropdownElement.appendChild(optionElement)
    optionElement.textContent = shape
    optionElement.value = shape
  })
  // @ts-ignore
  shapeDropdownElement.value = propertyState.shape

  shapeDropdownElement.addEventListener('change', () =>
    onShapeDropdownChange(shapeDropdownElement, graphComponent),
  )

  colorPickerElement.addEventListener('input', () =>
    onColorInputChange(colorPickerElement, graphComponent),
  )

  // @ts-ignore
  colorPickerElement.value = propertyState.fill
}

function createPanelForArrowNodeStyle(
  parent: HTMLElement,
  graphComponent: GraphComponent,
) {
  shapeDropdownElement = document.createElement('select')
  shapeDropdownElement.setAttribute('id', 'shape-dropdown')
  const labelShapeSelect = document.createElement('label')
  labelShapeSelect.setAttribute('for', 'shape-dropdown')
  labelShapeSelect.textContent = 'Choose your favorite shape'

  colorPickerElement = document.createElement('input')
  colorPickerElement.setAttribute('id', 'fill-input')
  colorPickerElement.setAttribute('type', 'color')
  const labelFillInput = document.createElement('label')
  labelFillInput.setAttribute('for', 'fill-input')
  labelFillInput.textContent = 'Choose your favorite fill color'

  parent.appendChild(labelShapeSelect)
  parent.appendChild(shapeDropdownElement)
  parent.appendChild(labelFillInput)
  parent.appendChild(colorPickerElement)

  const shapes = Object.keys(ArrowStyleShape)
  shapes.forEach((shape) => {
    const optionElement = document.createElement('option')
    shapeDropdownElement.appendChild(optionElement)
    optionElement.textContent = shape
    optionElement.value = shape
  })

  shapeDropdownElement.addEventListener('change', () =>
    onShapeDropdownChange(shapeDropdownElement, graphComponent),
  )

  colorPickerElement.addEventListener('input', () =>
    onColorInputChange(colorPickerElement, graphComponent),
  )
}

function onShapeDropdownChange(
  shapeDropdownElement: HTMLSelectElement,
  graphComponent: GraphComponent,
) {
  // @ts-ignore
  propertyState.shape = shapeDropdownElement.value
  updateSelectedNodeStyle(graphComponent)
}

function onColorInputChange(
  colorPickerElement: HTMLInputElement,
  graphComponent: GraphComponent,
) {
  // @ts-ignore
  propertyState.fill = colorPickerElement.value as FillConvertible
  updateSelectedNodeStyle(graphComponent)
}

function updateSelectedNodeStyle(graphComponent: GraphComponent) {
  graphComponent.selection.nodes.forEach((node) => {
    const nodeStyle =
      currentStyle === 'ShapeNodeStyle'
        ? new ShapeNodeStyle(propertyState as ShapeNodeStyleConfiguration)
        : new ArrowNodeStyle(propertyState as ArrowNodeStyleConfiguration)
    graphComponent.graph.setStyle(node, nodeStyle)
  })
}

function toHex(c: number) {
  const hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}
