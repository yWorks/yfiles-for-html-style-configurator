import { StyleConfiguration } from './style-configuration'

export class EditorComponent {
  private textArea: HTMLTextAreaElement
  private copyButton: HTMLButtonElement

  constructor() {
    this.textArea = document.querySelector('.editor') as HTMLTextAreaElement
    this.copyButton = document.querySelector('.copy-code') as HTMLButtonElement

    this.copyButton.addEventListener('click', () => {
      void navigator.clipboard.writeText(this.textArea.value)
    })
  }

  update(json: StyleConfiguration) {
    this.textArea.value = `new ShapeNodeStyle(${JSON.stringify(json, null, 2)})`
  }
}
