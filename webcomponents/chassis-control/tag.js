class ChassisFormControl extends ChassisWebComponent {
  constructor () {
    super(`{{TEMPLATE}}`)

    this.ref = {
      title: this.shadowRoot.querySelector('.toolbar .title')
    }
  }

  static get observedAttributes () {
    return ['type', 'label', 'placeholder']
  }

  connectedCallback () {
    
  }

  attributeChangedCallback (name, oldValue, newValue) {
    
  }
}

customElements.define('chassis-control', ChassisFormControl)
