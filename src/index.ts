import { GraphComponent, GraphEditorInputMode, License } from '@yfiles/yfiles'
import license from './license.json'

License.value = license

let graphComponent = new GraphComponent('.graph-component')

graphComponent.graph.createNode()

graphComponent.inputMode = new GraphEditorInputMode()

void graphComponent.fitGraphBounds()
