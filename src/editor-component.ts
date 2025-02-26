import { StyleConfiguration } from './style-configuration'
import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

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

  update(json: StyleConfiguration) {
    const text = `new ShapeNodeStyle(${JSON.stringify(json, null, 2)})`
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
