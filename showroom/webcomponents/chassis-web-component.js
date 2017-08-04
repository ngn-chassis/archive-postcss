class ChassisWebComponent extends HTMLElement {
  constructor (templateString) {
    super()

    this.attachShadow({mode: 'open'})

    this.templateString = templateString

    let template = document.createElement('template')
    template.insertAdjacentHTML('afterbegin', this.templateString)

    this.shadowRoot.appendChild(template.children[0].content.cloneNode(true))

    template = null
  }
}
