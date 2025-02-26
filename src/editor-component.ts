import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { INodeStyle, ShapeNodeStyle } from '@yfiles/yfiles'
import { parseNodeStyle } from './parseNodeStyle'

export class EditorComponent {
  private copyButton: HTMLButtonElement
  private view: EditorView

  constructor(parent: Element | DocumentFragment) {
    this.copyButton = document.querySelector('.copy-code') as HTMLButtonElement

    this.copyButton.addEventListener('click', () => {
      void navigator.clipboard.writeText(this.getText())
    })

    this.view = new EditorView({
      doc: '',
      parent,
      extensions: [basicSetup, EditorState.readOnly.of(true)],
    })
  }

  update(nodeStyle: INodeStyle) {
    const json = parseNodeStyle(nodeStyle)
    const type =
      nodeStyle instanceof ShapeNodeStyle ? 'ShapeNodeStyle' : 'ArrowNodeStyle'
    const text = `new ${type}(${JSON.stringify(json, null, 2)})`
    this.setText(text)
  }

  private getText() {
    return this.view.state.doc.toString()
  }

  private setText(text: string) {
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: text,
      },
    })
  }
}
