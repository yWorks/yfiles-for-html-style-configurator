import { GraphComponent, GraphEditorInputMode, License } from '@yfiles/yfiles'
import license from './license.json'
import { EditorComponent } from './editor-component'

License.value = license

let graphComponent = new GraphComponent('.graph-component')

graphComponent.graph.createNode()

graphComponent.inputMode = new GraphEditorInputMode()

void graphComponent.fitGraphBounds()

const editor = new EditorComponent(document.querySelector(".editor-container")!)

editor.update({ shape: 'ellipse' })
