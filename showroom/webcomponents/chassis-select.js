class ChassisSelect extends ChassisWebComponent {
  constructor () {
    super(`<template>

  <style>
    @charset "UTF-8";

    :host {
      display: inline-flex;
      contain: content;
      max-width: 100%;
    }

    :host * {
      box-sizing: border-box;
    }

    :host *:before {
      box-sizing: border-box;
    }

    :host *:after {
      box-sizing: border-box;
    }

    :host select {
      display: none;
    }

    :host ::slotted(chassis-option) {
      display: none;
    }

    :host ::slotted(chassis-option[selected]),
    :host ::slotted(chassis-option[selected="true"]) {
      display: flex;
    }

    :host ::slotted(chassis-option[selected="false"]) {
      display: none;
    }

  </style>

  <select>

  </select>

  <div class="chassis-select">
    <slot>

    </slot>
  </div>

</template>
`)

    this.select = this.shadowRoot.querySelector('select')
    this.options = []
    this.selectedOption = null
  }

  static get observedAttributes () {
    return ['multiple']
  }

  connectedCallback () {
    setTimeout(() => {
      this.constructSelectMenu()
    }, 0)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name.toLowerCase()) {


      default:
        return
    }
  }

  generateOption (chassisOption, isFirstOption = false) {
    let label = chassisOption.hasAttribute('label') ? chassisOption.getAttribute('label') : chassisOption.textContent
    let value = chassisOption.hasAttribute('value') ? chassisOption.getAttribute('value') : label
    let disabled = chassisOption.hasAttribute('disabled') ? chassisOption.getAttribute('disabled') === 'true' || chassisOption.getAttribute('disabled') === '' : false
    let selected = isFirstOption ? true : (chassisOption.hasAttribute('selected') ? chassisOption.getAttribute('disabled') === 'true' || chassisOption.getAttribute('selected') === '' : false)

    this.options.push({label, value, disabled, selected, textContent: chassisOption.textContent})

    if (selected) {
      this.selectedOption = chassisOption
      chassisOption.setAttribute('selected', 'true')
    }

    let option = document.createElement('option')
    option.setAttribute('label', label)
    option.setAttribute('value', value)
    option.setAttribute('disabled', disabled)
    option.setAttribute('selected', selected)
    option.textContent = chassisOption.textContent

    return option
  }

  constructSelectMenu () {
    for (let child of this.children) {
      if (child.nodeName === 'CHASSIS-OPTION') {
        setTimeout(() => this.select.appendChild(this.generateOption(child, child === this.children.item(0))), 0)
      } else {
        child.remove()
      }
    }
  }
}

customElements.define('chassis-select', ChassisSelect)
