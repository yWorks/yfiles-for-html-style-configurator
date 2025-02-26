import { GraphComponent, ShapeNodeShape, ShapeNodeStyle } from '@yfiles/yfiles'

export default function setupPropertyPanel(graphComponent: GraphComponent) {
  const shapeDropdownElement =
    document.querySelector<HTMLSelectElement>('#shape-dropdown')
  if (!shapeDropdownElement) {
    return
  }
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

  graphComponent.selection.addEventListener('item-added', () =>
    onSelectionChange(shapeDropdownElement, graphComponent),
  )
}

function onShapeDropdownChange(
  shapeDropdownElement: HTMLSelectElement,
  graphComponent: GraphComponent,
) {
  console.log('dropdown change listener')
  const shapeValue = shapeDropdownElement.value
  const graph = graphComponent.graph
  graphComponent.selection.nodes.forEach((node) => {
    graph.setStyle(
      node,
      // @ts-ignore
      new ShapeNodeStyle({ shape: shapeValue }),
    )
  })
}

function onSelectionChange(
  shapeDropdownElement: HTMLSelectElement,
  graphComponent: GraphComponent,
) {
  console.log('selection change listener')
  if (graphComponent.selection.nodes.size > 0) {
    const firstSelectedNodeStyle = graphComponent.selection.nodes.first()
      ?.style as ShapeNodeStyle
    const shape = firstSelectedNodeStyle.shape
    shapeDropdownElement.value = ShapeNodeShape.getName(shape)
  }
}
