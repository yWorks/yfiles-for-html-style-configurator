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
}

function onShapeDropdownChange(
  shapeDropdownElement: HTMLSelectElement,
  graphComponent: GraphComponent,
) {
  const shapeValue = shapeDropdownElement.value
  const graph = graphComponent.graph
  const firstNode = graph.nodes.first()
  if (firstNode) {
    graph.setStyle(
      firstNode,
      // @ts-ignore
      new ShapeNodeStyle({ shape: shapeValue }),
    )
  }
}
