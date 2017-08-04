class ChassisSelect extends ChassisWebComponent {
  constructor () {
    super(`<template>
      
  <style>
    @charset "UTF-8";
    
    :host {
      display: flex;
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
    
  </style>
  
  <select>
    
  </select>
  
</template>
`)
  }
  
  // :host select {
  //   display: none;
  // }

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
  
  constructSelectMenu () {
    let select = this.shadowRoot.querySelector('select')
    
    for (let child of this.children) {
      if (child.nodeName !== 'OPTION') {
        child.remove()
      } else {
        setTimeout(() => {
          select.appendChild(child)
        }, 0)
      }
    }
  }
}

customElements.define('chassis-select', ChassisSelect)
