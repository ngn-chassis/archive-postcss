class ChassisFormControl extends ChassisWebComponent {
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
    
    :host([type="field"]) {
      flex-direction: column;
    }
    
    :host([type="toggle"]) {
      align-items: center;
    }
    
    :host([type="toggle"]) .label-wrapper {
      flex: 1 1 auto;
			display: flex;
    }
    
    :host([type="toggle"]) .label-wrapper {
      flex: 1 1 auto;
			display: flex;
    }
    
    :host([type="toggle"]) .input-wrapper {
      order: -1;
			display: flex;
			justify-content: center;
			align-items: center;
    }
  </style>
  
  <slot name="afterbegin"></slot>
  <div class="label-wrapper">
    <slot name="beforelabel"></slot>
    <slot name="label"></slot>
    <slot name="afterlabel"></slot>
  </div>
  <slot name="between"></slot>
  <div class="input-wrapper">
    <slot name="beforeinput"></slot>
    <slot name="input"></slot>
    <slot name="afterinput"></slot>
  </div>
  <slot name="beforeend"></slot>
  
</template>
`)
  }

  static get observedAttributes () {
    return ['type']
  }

  connectedCallback () {
    if (!this.hasAttribute('type')) {
      this.setAttribute('type', 'none')
    }
    
    this.type = this.getAttribute('type')
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name.toLowerCase()) {
      

      default:
        return
    }
  }
}

customElements.define('chassis-control', ChassisFormControl)
