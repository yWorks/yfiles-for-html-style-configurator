import {
  Color,
  CssFill,
  Fill,
  FillConvertible,
  GraphComponent,
  ShapeNodeShape,
  ShapeNodeStyle,
} from '@yfiles/yfiles'
import { StyleConfiguration } from './style-configuration'

let propertyState: StyleConfiguration = {
  shape: ShapeNodeShape.RECTANGLE,
  fill: '#FFFFFF',
}
const shapeDropdownElement =
  document.querySelector<HTMLSelectElement>('#shape-dropdown')
const colorPickerElement =
  document.querySelector<HTMLInputElement>('#fill-input')

export default function setupPropertyPanel(graphComponent: GraphComponent) {
  if (shapeDropdownElement) {
    const shapes = Object.keys(ShapeNodeShape)
    shapes.forEach((shape) => {
      const optionElement = document.createElement('option')
      shapeDropdownElement.appendChild(optionElement)
      optionElement.textContent = shape
      optionElement.value = shape
    })

    shapeDropdownElement.addEventListener('change', () =>
      onShapeDropdownChange(shapeDropdownElement, graphComponent),
    )
  }

  if (colorPickerElement) {
    colorPickerElement.addEventListener('input', () =>
      onColorInputChange(colorPickerElement, graphComponent),
    )
  }

  graphComponent.selection.addEventListener('item-added', () =>
    onSelectionChange(graphComponent),
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

function onSelectionChange(graphComponent: GraphComponent) {
  if (graphComponent.selection.nodes.size > 0) {
    const firstSelectedNodeStyle = graphComponent.selection.nodes.first()
      ?.style as ShapeNodeStyle
    if (shapeDropdownElement) {
      shapeDropdownElement.value = ShapeNodeShape.getName(
        firstSelectedNodeStyle.shape,
      )
    }
    if (colorPickerElement) {
      let fillColor = '#ffffff'

      if (firstSelectedNodeStyle.fill instanceof Color) {
        const fill = firstSelectedNodeStyle.fill as Color
        fillColor = `#${toHex(fill.r)}${toHex(fill.g)}${toHex(fill.b)}`
      } else if (firstSelectedNodeStyle.fill instanceof CssFill) {
        fillColor = firstSelectedNodeStyle.fill.value
      }
      colorPickerElement.value = fillColor
    }
  }
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
    graphComponent.graph.setStyle(node, new ShapeNodeStyle(propertyState))
  })
}

function toHex(c: number) {
  const hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}
