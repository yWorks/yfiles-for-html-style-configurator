import {
  GraphComponent,
  GraphEditorInputMode,
  INode,
  License,
  ShapeNodeStyle,
} from '@yfiles/yfiles'
import license from './license.json'
import { EditorComponent } from './editor-component'
import setupPropertyPanel from './properties-panel'
import { parseNodeStyle } from './parseNodeStyle'

License.value = license

let graphComponent = new GraphComponent('.graph-component')

graphComponent.inputMode = new GraphEditorInputMode()

void graphComponent.fitGraphBounds()

setupPropertyPanel(graphComponent)

const editor = new EditorComponent(document.querySelector('.editor-container')!)

graphComponent.graph.addEventListener('node-style-changed', (evt) => {
  const item = graphComponent.selection.first()
  if (item instanceof INode && item === evt.item) {
    editor.update(parseNodeStyle(item.style))
  }
})

graphComponent.selection.addEventListener('item-added', (evt) => {
  const item = evt.item
  if (item instanceof INode) {
    editor.update(parseNodeStyle(item.style))
  }
})

graphComponent.selection.add(graphComponent.graph.createNode())

graphComponent.graph.createNode(
  [0, 100, 50, 50],
  new ShapeNodeStyle({ fill: '#242265', stroke: '3px dashed red' }),
)
